const express = require("express");
const router = express.Router();
const reportService = require("../services/reportService");
const { isAuthenticated } = require("../middleware/auth");
const { body, validationResult } = require("express-validator");

// Validation rules for report
const reportValidation = [
  body("lastBloodDonate").isISO8601().withMessage("Valid date is required"),
  body("bloodType").notEmpty().withMessage("Blood type is required"),
];

/**
 * @route   POST /api/reports
 * @desc    Create a new health report
 * @access  Private
 */
router.post("/", isAuthenticated, reportValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const reportData = {
      ...req.body,
      user: req.user._id,
    };

    const report = await reportService.create(reportData);
    res.status(201).json(report);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating report", error: error.message });
  }
});

/**
 * @route   GET /api/reports/:id
 * @desc    Get report by ID
 * @access  Private
 */
router.get("/:id", isAuthenticated, async (req, res) => {
  try {
    const report = await reportService.findById(req.params.id);
    res.json(report);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

/**
 * @route   GET /api/reports/user/:userId
 * @desc    Get reports by user
 * @access  Private
 */
router.get("/user/:userId", isAuthenticated, async (req, res) => {
  try {
    const reports = await reportService.findByUser(req.params.userId);
    res.json(reports);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching reports", error: error.message });
  }
});

/**
 * @route   GET /api/reports/user/:userId/latest
 * @desc    Get latest report for user
 * @access  Private
 */
router.get("/user/:userId/latest", isAuthenticated, async (req, res) => {
  try {
    const report = await reportService.getLatestByUser(req.params.userId);
    if (!report) {
      return res
        .status(404)
        .json({ message: "No reports found for this user" });
    }
    res.json(report);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching report", error: error.message });
  }
});

/**
 * @route   GET /api/reports/user/:userId/eligibility
 * @desc    Check donation eligibility for user
 * @access  Private
 */
router.get("/user/:userId/eligibility", isAuthenticated, async (req, res) => {
  try {
    const eligibility = await reportService.checkEligibility(req.params.userId);
    res.json(eligibility);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error checking eligibility", error: error.message });
  }
});

/**
 * @route   GET /api/reports/hospital/:hospitalId
 * @desc    Get reports by hospital
 * @access  Private (Admin/Hospital staff only in production)
 */
router.get("/hospital/:hospitalId", isAuthenticated, async (req, res) => {
  try {
    const reports = await reportService.findByHospital(req.params.hospitalId);
    res.json(reports);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching reports", error: error.message });
  }
});

/**
 * @route   PUT /api/reports/:id
 * @desc    Update a report
 * @access  Private
 */
router.put("/:id", isAuthenticated, async (req, res) => {
  try {
    const report = await reportService.update(req.params.id, req.body);
    res.json(report);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating report", error: error.message });
  }
});

/**
 * @route   DELETE /api/reports/:id
 * @desc    Delete a report
 * @access  Private
 */
router.delete("/:id", isAuthenticated, async (req, res) => {
  try {
    await reportService.delete(req.params.id);
    res.json({ message: "Report deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting report", error: error.message });
  }
});

module.exports = router;
