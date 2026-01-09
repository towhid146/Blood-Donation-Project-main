const express = require("express");
const router = express.Router();
const recipientService = require("../services/recipientService");
const { isAuthenticated } = require("../middleware/auth");
const { body, validationResult } = require("express-validator");

// Validation rules for recipient request
const recipientValidation = [
  body("medicalPurpose").notEmpty().withMessage("Medical purpose is required"),
  body("volumeNeeded")
    .isNumeric()
    .withMessage("Volume needed must be a number"),
  body("bloodGroupNeeded")
    .notEmpty()
    .withMessage("Blood group needed is required"),
];

/**
 * @route   POST /api/recipients
 * @desc    Create a new blood request
 * @access  Private
 */
router.post("/", isAuthenticated, recipientValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const recipientData = {
      ...req.body,
      user: req.user._id,
    };

    const recipient = await recipientService.createRequest(recipientData);
    res.status(201).json(recipient);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating request", error: error.message });
  }
});

/**
 * @route   GET /api/recipients
 * @desc    Get all pending requests
 * @access  Public
 */
router.get("/", async (req, res) => {
  try {
    const recipients = await recipientService.getAllPending();
    res.json(recipients);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching requests", error: error.message });
  }
});

/**
 * @route   GET /api/recipients/urgent
 * @desc    Get urgent blood requests
 * @access  Public
 */
router.get("/urgent", async (req, res) => {
  try {
    const recipients = await recipientService.getUrgentRequests();
    res.json(recipients);
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error fetching urgent requests",
        error: error.message,
      });
  }
});

/**
 * @route   GET /api/recipients/blood-group/:bloodGroup
 * @desc    Get requests by blood group
 * @access  Public
 */
router.get("/blood-group/:bloodGroup", async (req, res) => {
  try {
    const recipients = await recipientService.findPendingByBloodGroup(
      req.params.bloodGroup
    );
    res.json(recipients);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching requests", error: error.message });
  }
});

/**
 * @route   GET /api/recipients/:id
 * @desc    Get request by ID
 * @access  Private
 */
router.get("/:id", isAuthenticated, async (req, res) => {
  try {
    const recipient = await recipientService.findById(req.params.id);
    res.json(recipient);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

/**
 * @route   PUT /api/recipients/:id/status
 * @desc    Update request status
 * @access  Private
 */
router.put("/:id/status", isAuthenticated, async (req, res) => {
  try {
    const { status } = req.body;

    if (!["pending", "fulfilled", "cancelled"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const recipient = await recipientService.updateStatus(
      req.params.id,
      status
    );
    res.json(recipient);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating request", error: error.message });
  }
});

/**
 * @route   GET /api/recipients/user/:userId
 * @desc    Get requests by user
 * @access  Private
 */
router.get("/user/:userId", isAuthenticated, async (req, res) => {
  try {
    const recipients = await recipientService.findByUser(req.params.userId);
    res.json(recipients);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching requests", error: error.message });
  }
});

module.exports = router;
