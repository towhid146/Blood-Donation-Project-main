const express = require("express");
const router = express.Router();
const BloodRequest = require("../models/BloodRequest");
const DonorResponse = require("../models/DonorResponse");
const User = require("../models/User");

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Please login to continue" });
};

// ==================== BLOOD REQUEST ROUTES ====================

// Create a new blood request
router.post("/", async (req, res) => {
  try {
    const {
      patientName,
      bloodGroupNeeded,
      division,
      district,
      upazila,
      hospital,
      location,
      volumeNeeded,
      unitsNeeded,
      urgency,
      medicalPurpose,
      contactNumber,
      email,
      additionalNotes,
    } = req.body;

    // Validate required fields
    if (
      !patientName ||
      !bloodGroupNeeded ||
      !division ||
      !district ||
      !urgency ||
      !medicalPurpose ||
      !contactNumber
    ) {
      return res.status(400).json({
        message: "Please fill in all required fields",
      });
    }

    // Get requester info
    let requesterName = patientName;
    let requesterId = null;

    if (req.isAuthenticated() && req.user) {
      requesterId = req.user._id;
      requesterName =
        `${req.user.firstName} ${req.user.lastName}`.trim() ||
        req.user.username;
    }

    // Calculate expiry date based on urgency
    const expiresAt = BloodRequest.calculateExpiry(urgency);

    // Create blood request
    const bloodRequest = new BloodRequest({
      requester: requesterId,
      requesterName,
      requesterContact: contactNumber,
      requesterEmail: email || "",
      patientName,
      bloodType: bloodGroupNeeded,
      division,
      district,
      upazila: upazila || "",
      hospital: hospital || "",
      specificLocation: location || "",
      volumeNeeded: volumeNeeded || 450,
      unitsNeeded: unitsNeeded || 1,
      urgency,
      medicalPurpose,
      additionalNotes: additionalNotes || "",
      expiresAt,
    });

    await bloodRequest.save();

    // Find eligible donors in the same area
    // Eligible: same district/division, matching blood type (compatible),
    // last donated at least 3 months ago (90 days)
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setDate(threeMonthsAgo.getDate() - 90);

    // Blood type compatibility (who can donate to whom)
    const compatibleDonors = getCompatibleDonorTypes(bloodGroupNeeded);

    const eligibleDonors = await User.find({
      _id: { $ne: requesterId }, // Not the requester
      isEnabled: true,
      bloodType: { $in: compatibleDonors },
      $or: [
        { district: district },
        { division: division, district: "" }, // Same division if district not set
      ],
      $or: [
        { lastDonationDate: null },
        { lastDonationDate: { $lte: threeMonthsAgo } },
      ],
    }).select("_id");

    // Update notified donors count
    bloodRequest.notifiedDonors = eligibleDonors.length;
    await bloodRequest.save();

    res.status(201).json({
      message: "Blood request created successfully",
      request: bloodRequest,
      eligibleDonorsCount: eligibleDonors.length,
    });
  } catch (error) {
    console.error("Error creating blood request:", error);
    res.status(500).json({
      message: "Error creating blood request",
      error: error.message,
    });
  }
});

// Get blood requests for logged-in donor (matching their area and blood type)
router.get("/for-donor", isAuthenticated, async (req, res) => {
  try {
    const user = req.user;

    // Check if user can donate (last donation was 3+ months ago)
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setDate(threeMonthsAgo.getDate() - 90);

    const canDonate =
      !user.lastDonationDate || user.lastDonationDate <= threeMonthsAgo;

    // Get blood types that can receive from this donor
    const canDonateTo = getCompatibleRecipientTypes(user.bloodType);

    // Find active requests in user's area that match their blood type
    const requests = await BloodRequest.find({
      status: "active",
      expiresAt: { $gt: new Date() },
      bloodType: { $in: canDonateTo },
      $or: [{ district: user.district }, { division: user.division }],
      requester: { $ne: user._id }, // Not own requests
    })
      .sort({ urgency: 1, createdAt: -1 }) // Critical first, then recent
      .limit(50);

    // Check which requests the user has already responded to
    const responseIds = await DonorResponse.find({
      donor: user._id,
      bloodRequest: { $in: requests.map((r) => r._id) },
    }).select("bloodRequest status");

    const responseMap = {};
    responseIds.forEach((r) => {
      responseMap[r.bloodRequest.toString()] = r.status;
    });

    // Add response status to each request
    const requestsWithStatus = requests.map((r) => ({
      ...r.toObject(),
      userResponseStatus: responseMap[r._id.toString()] || null,
    }));

    res.json({
      requests: requestsWithStatus,
      canDonate,
      lastDonationDate: user.lastDonationDate,
      daysUntilEligible: canDonate
        ? 0
        : Math.ceil(
            (user.lastDonationDate - threeMonthsAgo) / (1000 * 60 * 60 * 24)
          ),
    });
  } catch (error) {
    console.error("Error fetching requests for donor:", error);
    res.status(500).json({
      message: "Error fetching blood requests",
      error: error.message,
    });
  }
});

// Get my blood requests (as requester)
router.get("/my-requests", isAuthenticated, async (req, res) => {
  try {
    const requests = await BloodRequest.find({
      requester: req.user._id,
    }).sort({ createdAt: -1 });

    // Get response counts for each request
    const requestsWithResponses = await Promise.all(
      requests.map(async (request) => {
        const willingDonors = await DonorResponse.countDocuments({
          bloodRequest: request._id,
          isWilling: true,
        });
        const totalResponses = await DonorResponse.countDocuments({
          bloodRequest: request._id,
        });
        const unseenResponses = await DonorResponse.countDocuments({
          bloodRequest: request._id,
          isWilling: true,
          seenByRequester: false,
        });

        return {
          ...request.toObject(),
          willingDonors,
          totalResponses,
          unseenResponses,
        };
      })
    );

    res.json({ requests: requestsWithResponses });
  } catch (error) {
    console.error("Error fetching my requests:", error);
    res.status(500).json({
      message: "Error fetching your requests",
      error: error.message,
    });
  }
});

// Get a single blood request with responses (for requester)
router.get("/:id", isAuthenticated, async (req, res) => {
  try {
    const request = await BloodRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: "Blood request not found" });
    }

    // Check if user is requester or a potential donor
    const isRequester =
      request.requester &&
      request.requester.toString() === req.user._id.toString();

    // Get willing donors with their info (only if requester)
    let willingDonors = [];
    if (isRequester) {
      willingDonors = await DonorResponse.find({
        bloodRequest: request._id,
        isWilling: true,
      })
        .populate(
          "donor",
          "firstName lastName bloodType number email district upazila profilePicture lastDonationDate donationsCount responseRatio"
        )
        .sort({ createdAt: -1 });

      // Mark as seen
      await DonorResponse.updateMany(
        { bloodRequest: request._id, isWilling: true },
        { seenByRequester: true }
      );
    }

    res.json({
      request,
      isRequester,
      willingDonors: isRequester ? willingDonors : [],
    });
  } catch (error) {
    console.error("Error fetching blood request:", error);
    res.status(500).json({
      message: "Error fetching blood request",
      error: error.message,
    });
  }
});

// Update blood request status
router.patch("/:id/status", isAuthenticated, async (req, res) => {
  try {
    const { status } = req.body;
    const request = await BloodRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: "Blood request not found" });
    }

    // Only requester can update status
    if (
      !request.requester ||
      request.requester.toString() !== req.user._id.toString()
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this request" });
    }

    request.status = status;
    await request.save();

    res.json({ message: "Status updated", request });
  } catch (error) {
    console.error("Error updating request status:", error);
    res.status(500).json({
      message: "Error updating status",
      error: error.message,
    });
  }
});

// ==================== DONOR RESPONSE ROUTES ====================

// Respond to a blood request (donor willing/not willing)
router.post("/:id/respond", isAuthenticated, async (req, res) => {
  try {
    const { isWilling, message, preferredContactTime, availableDate } =
      req.body;
    const requestId = req.params.id;
    const donorId = req.user._id;

    // Check if request exists and is active
    const bloodRequest = await BloodRequest.findById(requestId);
    if (!bloodRequest) {
      return res.status(404).json({ message: "Blood request not found" });
    }

    if (bloodRequest.status !== "active") {
      return res
        .status(400)
        .json({ message: "This request is no longer active" });
    }

    // Check if already responded
    const existingResponse = await DonorResponse.findOne({
      bloodRequest: requestId,
      donor: donorId,
    });

    if (existingResponse) {
      // Update existing response
      existingResponse.isWilling = isWilling;
      existingResponse.message = message || "";
      existingResponse.preferredContactTime = preferredContactTime || "anytime";
      existingResponse.availableDate = availableDate || null;
      existingResponse.status = isWilling ? "pending" : "rejected";
      await existingResponse.save();

      return res.json({
        message: "Response updated successfully",
        response: existingResponse,
      });
    }

    // Create new response
    const donorResponse = new DonorResponse({
      bloodRequest: requestId,
      donor: donorId,
      isWilling,
      message: message || "",
      preferredContactTime: preferredContactTime || "anytime",
      availableDate: availableDate || null,
      status: isWilling ? "pending" : "rejected",
    });

    await donorResponse.save();

    // Update request stats
    bloodRequest.respondedDonors += 1;
    await bloodRequest.save();

    res.status(201).json({
      message: isWilling
        ? "Thank you! Your willingness to donate has been recorded. The requester will contact you soon."
        : "Response recorded. Thank you for your time.",
      response: donorResponse,
    });
  } catch (error) {
    console.error("Error responding to request:", error);
    res.status(500).json({
      message: "Error submitting response",
      error: error.message,
    });
  }
});

// Get donor's responses (for donor to track their responses)
router.get("/donor/my-responses", isAuthenticated, async (req, res) => {
  try {
    const responses = await DonorResponse.find({
      donor: req.user._id,
    })
      .populate("bloodRequest")
      .sort({ createdAt: -1 });

    res.json({ responses });
  } catch (error) {
    console.error("Error fetching donor responses:", error);
    res.status(500).json({
      message: "Error fetching responses",
      error: error.message,
    });
  }
});

// Mark donation as completed (by requester)
router.patch(
  "/response/:responseId/complete",
  isAuthenticated,
  async (req, res) => {
    try {
      const response = await DonorResponse.findById(
        req.params.responseId
      ).populate("bloodRequest");

      if (!response) {
        return res.status(404).json({ message: "Response not found" });
      }

      // Only requester can mark as completed
      if (
        !response.bloodRequest.requester ||
        response.bloodRequest.requester.toString() !== req.user._id.toString()
      ) {
        return res.status(403).json({ message: "Not authorized" });
      }

      // Update response
      response.donationCompleted = true;
      response.completedAt = new Date();
      response.status = "completed";
      await response.save();

      // Update donor stats
      const donor = await User.findById(response.donor);
      if (donor) {
        donor.donationsCount += 1;
        donor.completedRequests += 1;
        donor.lastDonationDate = new Date();
        donor.responseRatio = donor.calculateResponseRatio();
        await donor.save();
      }

      // Update request status if all donors fulfilled
      const bloodRequest = await BloodRequest.findById(
        response.bloodRequest._id
      );
      bloodRequest.status = "fulfilled";
      await bloodRequest.save();

      res.json({
        message: "Donation marked as completed. Thank you!",
        response,
      });
    } catch (error) {
      console.error("Error marking donation complete:", error);
      res.status(500).json({
        message: "Error updating donation status",
        error: error.message,
      });
    }
  }
);

// ==================== NOTIFICATION COUNT ====================

// Get notification count for donor
router.get("/notifications/count", isAuthenticated, async (req, res) => {
  try {
    const user = req.user;
    const canDonateTo = getCompatibleRecipientTypes(user.bloodType);

    // Count active requests in user's area
    const newRequestsCount = await BloodRequest.countDocuments({
      status: "active",
      expiresAt: { $gt: new Date() },
      bloodType: { $in: canDonateTo },
      $or: [{ district: user.district }, { division: user.division }],
      requester: { $ne: user._id },
      createdAt: { $gt: new Date(Date.now() - 24 * 60 * 60 * 1000) }, // Last 24 hours
    });

    // Count unseen responses for requester's requests
    const unseenResponsesCount = await DonorResponse.countDocuments({
      bloodRequest: {
        $in: await BloodRequest.find({ requester: user._id }).select("_id"),
      },
      isWilling: true,
      seenByRequester: false,
    });

    res.json({
      newRequestsCount,
      unseenResponsesCount,
      totalNotifications: newRequestsCount + unseenResponsesCount,
    });
  } catch (error) {
    console.error("Error fetching notification count:", error);
    res.status(500).json({
      message: "Error fetching notifications",
      error: error.message,
    });
  }
});

// ==================== HELPER FUNCTIONS ====================

// Get blood types that can donate to a specific type
function getCompatibleDonorTypes(recipientType) {
  const compatibility = {
    "A+": ["A+", "A-", "O+", "O-"],
    "A-": ["A-", "O-"],
    "B+": ["B+", "B-", "O+", "O-"],
    "B-": ["B-", "O-"],
    "AB+": ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"], // Universal recipient
    "AB-": ["A-", "B-", "AB-", "O-"],
    "O+": ["O+", "O-"],
    "O-": ["O-"], // Universal donor
  };
  return compatibility[recipientType] || [recipientType];
}

// Get blood types that this donor can donate to
function getCompatibleRecipientTypes(donorType) {
  const compatibility = {
    "A+": ["A+", "AB+"],
    "A-": ["A+", "A-", "AB+", "AB-"],
    "B+": ["B+", "AB+"],
    "B-": ["B+", "B-", "AB+", "AB-"],
    "AB+": ["AB+"],
    "AB-": ["AB+", "AB-"],
    "O+": ["A+", "B+", "AB+", "O+"],
    "O-": ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"], // Universal donor
  };
  return compatibility[donorType] || [donorType];
}

module.exports = router;
