const express = require("express");
const router = express.Router();
const userService = require("../services/userService");
const reportService = require("../services/reportService");
const donationService = require("../services/donationService");
const { isAuthenticated } = require("../middleware/auth");

/**
 * @route   GET /api/profile
 * @desc    Get current user's profile
 * @access  Private
 */
router.get("/", isAuthenticated, async (req, res) => {
  try {
    const user = await userService.findById(req.user._id);

    // Get additional profile data
    const eligibility = await reportService.checkEligibility(req.user._id);
    const recentDonations = await donationService.findByUser(req.user._id);

    res.json({
      user,
      eligibility,
      donations: recentDonations.slice(0, 5), // Last 5 donations
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching profile", error: error.message });
  }
});

/**
 * @route   PUT /api/profile
 * @desc    Update current user's profile
 * @access  Private
 */
router.put("/", isAuthenticated, async (req, res) => {
  try {
    const allowedUpdates = [
      "firstName",
      "lastName",
      "number",
      "location",
      "bloodType",
      "age",
      "gender",
    ];

    const updateData = {};
    allowedUpdates.forEach((field) => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    updateData._id = req.user._id;

    const user = await userService.saveUserProfile(updateData);
    res.json({ message: "Profile updated successfully", user });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating profile", error: error.message });
  }
});

/**
 * @route   GET /api/profile/donations
 * @desc    Get current user's donation history
 * @access  Private
 */
router.get("/donations", isAuthenticated, async (req, res) => {
  try {
    const donations = await donationService.findByUser(req.user._id);
    res.json(donations);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching donations", error: error.message });
  }
});

/**
 * @route   GET /api/profile/reports
 * @desc    Get current user's health reports
 * @access  Private
 */
router.get("/reports", isAuthenticated, async (req, res) => {
  try {
    const reports = await reportService.findByUser(req.user._id);
    res.json(reports);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching reports", error: error.message });
  }
});

/**
 * @route   GET /api/profile/eligibility
 * @desc    Check if current user is eligible to donate
 * @access  Private
 */
router.get("/eligibility", isAuthenticated, async (req, res) => {
  try {
    const eligibility = await reportService.checkEligibility(req.user._id);
    res.json(eligibility);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error checking eligibility", error: error.message });
  }
});

/**
 * @route   GET /api/profile/stats
 * @desc    Get current user's statistics
 * @access  Private
 */
router.get("/stats", isAuthenticated, async (req, res) => {
  try {
    const user = await userService.findById(req.user._id);

    res.json({
      donationsCount: user.donationsCount,
      completedRequests: user.completedRequests,
      missedRequests: user.missedRequests,
      responseRatio: user.calculateResponseRatio(),
      lastDonationDate: user.lastDonationDate,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching stats", error: error.message });
  }
});

module.exports = router;
