const express = require("express");
const router = express.Router();
const User = require("../models/User");
const BloodRequest = require("../models/BloodRequest");
const DonorResponse = require("../models/DonorResponse");
const Message = require("../models/Message");

// Middleware to check if user is admin
const isAdmin = async (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Please login to continue" });
  }

  if (!req.user.isAdmin) {
    return res.status(403).json({ message: "Admin access required" });
  }

  next();
};

// ==================== DASHBOARD STATS ====================

// Get dashboard statistics
router.get("/stats", isAdmin, async (req, res) => {
  try {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // User stats
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isEnabled: true });
    const verifiedUsers = await User.countDocuments({ isVerified: true });
    const newUsersThisMonth = await User.countDocuments({
      createdAt: { $gte: thirtyDaysAgo },
    });
    const newUsersThisWeek = await User.countDocuments({
      createdAt: { $gte: sevenDaysAgo },
    });

    // Blood type distribution
    const bloodTypeStats = await User.aggregate([
      { $group: { _id: "$bloodType", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // Location distribution
    const locationStats = await User.aggregate([
      { $match: { division: { $ne: "" } } },
      { $group: { _id: "$division", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // Blood request stats
    const totalRequests = await BloodRequest.countDocuments();
    const activeRequests = await BloodRequest.countDocuments({
      status: "active",
    });
    const fulfilledRequests = await BloodRequest.countDocuments({
      status: "fulfilled",
    });
    const criticalRequests = await BloodRequest.countDocuments({
      status: "active",
      urgency: "critical",
    });

    // Urgency distribution
    const urgencyStats = await BloodRequest.aggregate([
      { $match: { status: "active" } },
      { $group: { _id: "$urgency", count: { $sum: 1 } } },
    ]);

    // Response stats
    const totalResponses = await DonorResponse.countDocuments();
    const willingResponses = await DonorResponse.countDocuments({
      isWilling: true,
    });
    const completedDonations = await DonorResponse.countDocuments({
      donationCompleted: true,
    });

    // Total donations (sum of all users' donationsCount)
    const donationAgg = await User.aggregate([
      { $group: { _id: null, total: { $sum: "$donationsCount" } } },
    ]);
    const totalDonations = donationAgg[0]?.total || 0;

    // Recent activity (last 7 days)
    const recentUsers = await User.countDocuments({
      createdAt: { $gte: sevenDaysAgo },
    });
    const recentRequests = await BloodRequest.countDocuments({
      createdAt: { $gte: sevenDaysAgo },
    });
    const recentResponses = await DonorResponse.countDocuments({
      createdAt: { $gte: sevenDaysAgo },
    });

    res.json({
      users: {
        total: totalUsers,
        active: activeUsers,
        verified: verifiedUsers,
        newThisMonth: newUsersThisMonth,
        newThisWeek: newUsersThisWeek,
      },
      bloodTypes: bloodTypeStats,
      locations: locationStats,
      requests: {
        total: totalRequests,
        active: activeRequests,
        fulfilled: fulfilledRequests,
        critical: criticalRequests,
        urgencyBreakdown: urgencyStats,
      },
      responses: {
        total: totalResponses,
        willing: willingResponses,
        completed: completedDonations,
      },
      donations: {
        total: totalDonations,
      },
      recentActivity: {
        users: recentUsers,
        requests: recentRequests,
        responses: recentResponses,
      },
    });
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    res
      .status(500)
      .json({ message: "Error fetching statistics", error: error.message });
  }
});

// ==================== USER MANAGEMENT ====================

// Get all users with pagination and filtering
router.get("/users", isAdmin, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      search = "",
      bloodType = "",
      division = "",
      status = "",
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    const query = {};

    // Search by username, email, or name
    if (search) {
      query.$or = [
        { username: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
        { number: { $regex: search, $options: "i" } },
      ];
    }

    if (bloodType) query.bloodType = bloodType;
    if (division) query.division = division;
    if (status === "active") query.isEnabled = true;
    if (status === "disabled") query.isEnabled = false;
    if (status === "verified") query.isVerified = true;
    if (status === "unverified") query.isVerified = false;

    const sort = { [sortBy]: sortOrder === "asc" ? 1 : -1 };

    const users = await User.find(query)
      .select("-password")
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await User.countDocuments(query);

    res.json({
      users,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total,
        limit: parseInt(limit),
      },
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res
      .status(500)
      .json({ message: "Error fetching users", error: error.message });
  }
});

// Get single user details
router.get("/users/:id", isAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get user's blood requests
    const requests = await BloodRequest.find({ requester: user._id })
      .sort({ createdAt: -1 })
      .limit(10);

    // Get user's responses
    const responses = await DonorResponse.find({ donor: user._id })
      .populate("bloodRequest", "patientName bloodType hospital status")
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({ user, requests, responses });
  } catch (error) {
    console.error("Error fetching user:", error);
    res
      .status(500)
      .json({ message: "Error fetching user", error: error.message });
  }
});

// Update user
router.put("/users/:id", isAdmin, async (req, res) => {
  try {
    const { password, ...updateData } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User updated successfully", user });
  } catch (error) {
    console.error("Error updating user:", error);
    res
      .status(500)
      .json({ message: "Error updating user", error: error.message });
  }
});

// Toggle user status (enable/disable)
router.patch("/users/:id/toggle-status", isAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.isEnabled = !user.isEnabled;
    await user.save();

    res.json({
      message: `User ${user.isEnabled ? "enabled" : "disabled"} successfully`,
      user: { _id: user._id, isEnabled: user.isEnabled },
    });
  } catch (error) {
    console.error("Error toggling user status:", error);
    res
      .status(500)
      .json({ message: "Error updating user", error: error.message });
  }
});

// Toggle user verification
router.patch("/users/:id/toggle-verified", isAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.isVerified = !user.isVerified;
    await user.save();

    res.json({
      message: `User ${
        user.isVerified ? "verified" : "unverified"
      } successfully`,
      user: { _id: user._id, isVerified: user.isVerified },
    });
  } catch (error) {
    console.error("Error toggling verification:", error);
    res
      .status(500)
      .json({ message: "Error updating user", error: error.message });
  }
});

// Toggle admin status
router.patch("/users/:id/toggle-admin", isAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Prevent removing own admin status
    if (user._id.toString() === req.user._id.toString()) {
      return res
        .status(400)
        .json({ message: "Cannot modify your own admin status" });
    }

    user.isAdmin = !user.isAdmin;
    await user.save();

    res.json({
      message: `User ${
        user.isAdmin ? "promoted to admin" : "demoted from admin"
      } successfully`,
      user: { _id: user._id, isAdmin: user.isAdmin },
    });
  } catch (error) {
    console.error("Error toggling admin status:", error);
    res
      .status(500)
      .json({ message: "Error updating user", error: error.message });
  }
});

// Delete user
router.delete("/users/:id", isAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Prevent self-deletion
    if (user._id.toString() === req.user._id.toString()) {
      return res
        .status(400)
        .json({ message: "Cannot delete your own account from admin panel" });
    }

    // Delete user's related data
    await BloodRequest.deleteMany({ requester: user._id });
    await DonorResponse.deleteMany({ donor: user._id });
    await Message.deleteMany({
      $or: [{ sender: user._id }, { receiver: user._id }],
    });

    await User.findByIdAndDelete(req.params.id);

    res.json({ message: "User and related data deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res
      .status(500)
      .json({ message: "Error deleting user", error: error.message });
  }
});

// ==================== BLOOD REQUEST MANAGEMENT ====================

// Get all blood requests
router.get("/requests", isAdmin, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      status = "",
      urgency = "",
      bloodType = "",
      division = "",
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    const query = {};

    if (status) query.status = status;
    if (urgency) query.urgency = urgency;
    if (bloodType) query.bloodType = bloodType;
    if (division) query.division = division;

    const sort = { [sortBy]: sortOrder === "asc" ? 1 : -1 };

    const requests = await BloodRequest.find(query)
      .populate("requester", "firstName lastName username email number")
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await BloodRequest.countDocuments(query);

    res.json({
      requests,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total,
        limit: parseInt(limit),
      },
    });
  } catch (error) {
    console.error("Error fetching requests:", error);
    res
      .status(500)
      .json({ message: "Error fetching requests", error: error.message });
  }
});

// Update blood request status
router.patch("/requests/:id/status", isAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const request = await BloodRequest.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    res.json({ message: "Request status updated", request });
  } catch (error) {
    console.error("Error updating request:", error);
    res
      .status(500)
      .json({ message: "Error updating request", error: error.message });
  }
});

// Delete blood request
router.delete("/requests/:id", isAdmin, async (req, res) => {
  try {
    const request = await BloodRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    // Delete related responses and messages
    await DonorResponse.deleteMany({ bloodRequest: request._id });
    await Message.deleteMany({ bloodRequest: request._id });
    await BloodRequest.findByIdAndDelete(req.params.id);

    res.json({ message: "Request and related data deleted successfully" });
  } catch (error) {
    console.error("Error deleting request:", error);
    res
      .status(500)
      .json({ message: "Error deleting request", error: error.message });
  }
});

// ==================== DONOR RESPONSES ====================

// Get all donor responses
router.get("/responses", isAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 20, status = "", willing = "" } = req.query;

    const query = {};
    if (status) query.status = status;
    if (willing === "true") query.isWilling = true;
    if (willing === "false") query.isWilling = false;

    const responses = await DonorResponse.find(query)
      .populate("donor", "firstName lastName username bloodType number")
      .populate("bloodRequest", "patientName bloodType hospital urgency")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await DonorResponse.countDocuments(query);

    res.json({
      responses,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total,
        limit: parseInt(limit),
      },
    });
  } catch (error) {
    console.error("Error fetching responses:", error);
    res
      .status(500)
      .json({ message: "Error fetching responses", error: error.message });
  }
});

// ==================== SYSTEM ACTIONS ====================

// Send notification to all users (placeholder)
router.post("/notify-all", isAdmin, async (req, res) => {
  try {
    const { title, message } = req.body;

    // In a real app, this would send push notifications or emails
    // For now, just return success
    const userCount = await User.countDocuments({ isEnabled: true });

    res.json({
      message: `Notification queued for ${userCount} active users`,
      notification: { title, message },
    });
  } catch (error) {
    console.error("Error sending notification:", error);
    res
      .status(500)
      .json({ message: "Error sending notification", error: error.message });
  }
});

// Export data
router.get("/export/:type", isAdmin, async (req, res) => {
  try {
    const { type } = req.params;
    let data;

    switch (type) {
      case "users":
        data = await User.find().select("-password").lean();
        break;
      case "requests":
        data = await BloodRequest.find()
          .populate("requester", "username email")
          .lean();
        break;
      case "responses":
        data = await DonorResponse.find()
          .populate("donor", "username email")
          .populate("bloodRequest", "patientName bloodType")
          .lean();
        break;
      default:
        return res.status(400).json({ message: "Invalid export type" });
    }

    res.json({ data, count: data.length, exportedAt: new Date() });
  } catch (error) {
    console.error("Error exporting data:", error);
    res
      .status(500)
      .json({ message: "Error exporting data", error: error.message });
  }
});

// Cleanup expired requests
router.post("/cleanup-expired", isAdmin, async (req, res) => {
  try {
    const result = await BloodRequest.updateMany(
      { status: "active", expiresAt: { $lt: new Date() } },
      { status: "expired" }
    );

    res.json({
      message: `Marked ${result.modifiedCount} expired requests`,
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error("Error cleaning up:", error);
    res
      .status(500)
      .json({ message: "Error cleaning up", error: error.message });
  }
});

module.exports = router;
