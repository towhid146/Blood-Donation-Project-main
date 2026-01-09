const express = require("express");
const router = express.Router();
const donationService = require("../services/donationService");
const { isAuthenticated } = require("../middleware/auth");
const { body, validationResult } = require("express-validator");

// Validation rules for donation
const donationValidation = [
  body("bloodType").notEmpty().withMessage("Blood type is required"),
  body("hospital").optional().isMongoId().withMessage("Invalid hospital ID"),
];

/**
 * @route   POST /api/donations
 * @desc    Create a new donation record
 * @access  Private
 */
router.post("/", isAuthenticated, donationValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const donationData = {
      ...req.body,
      user: req.user._id,
      bloodType: req.body.bloodType || req.user.bloodType,
    };

    const donation = await donationService.createDonation(donationData);
    res.status(201).json(donation);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating donation", error: error.message });
  }
});

/**
 * @route   GET /api/donations
 * @desc    Get recent donations
 * @access  Public
 */
router.get("/", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const donations = await donationService.getRecentDonations(limit);
    res.json(donations);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching donations", error: error.message });
  }
});

/**
 * @route   GET /api/donations/stats
 * @desc    Get donation statistics
 * @access  Public
 */
router.get("/stats", async (req, res) => {
  try {
    const stats = await donationService.getStatistics();
    res.json(stats);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching statistics", error: error.message });
  }
});

/**
 * @route   GET /api/donations/:id
 * @desc    Get donation by ID
 * @access  Private
 */
router.get("/:id", isAuthenticated, async (req, res) => {
  try {
    const donation = await donationService.findById(req.params.id);
    res.json(donation);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

/**
 * @route   PUT /api/donations/:id/status
 * @desc    Update donation status
 * @access  Private
 */
router.put("/:id/status", isAuthenticated, async (req, res) => {
  try {
    const { status } = req.body;

    if (!["pending", "completed", "cancelled"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const donation = await donationService.updateStatus(req.params.id, status);
    res.json(donation);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating donation", error: error.message });
  }
});

/**
 * @route   GET /api/donations/user/:userId
 * @desc    Get donations by user
 * @access  Private
 */
router.get("/user/:userId", isAuthenticated, async (req, res) => {
  try {
    const donations = await donationService.findByUser(req.params.userId);
    res.json(donations);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching donations", error: error.message });
  }
});

/**
 * @route   GET /api/donations/hospital/:hospitalId
 * @desc    Get donations by hospital
 * @access  Public
 */
router.get("/hospital/:hospitalId", async (req, res) => {
  try {
    const donations = await donationService.findByHospital(
      req.params.hospitalId
    );
    res.json(donations);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching donations", error: error.message });
  }
});

module.exports = router;
