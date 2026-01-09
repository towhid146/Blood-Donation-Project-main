const express = require("express");
const router = express.Router();
const hbcService = require("../services/hbcService");
const { isAuthenticated } = require("../middleware/auth");
const { body, validationResult } = require("express-validator");

// Validation rules for HBC
const hbcValidation = [
  body("hbcName").notEmpty().withMessage("Name is required"),
  body("area").notEmpty().withMessage("Area is required"),
  body("city").notEmpty().withMessage("City is required"),
  body("division").notEmpty().withMessage("Division is required"),
  body("phone").notEmpty().withMessage("Phone is required"),
  body("organizationType")
    .notEmpty()
    .withMessage("Organization type is required"),
];

/**
 * @route   GET /api/hbc
 * @desc    Get all hospitals/blood centers
 * @access  Public
 */
router.get("/", async (req, res) => {
  try {
    const hbcs = await hbcService.getAll();
    res.json(hbcs);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching hospitals", error: error.message });
  }
});

/**
 * @route   GET /api/hbc/:id
 * @desc    Get HBC by ID
 * @access  Public
 */
router.get("/:id", async (req, res) => {
  try {
    const hbc = await hbcService.findById(req.params.id);
    res.json(hbc);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

/**
 * @route   GET /api/hbc/city/:city
 * @desc    Get HBCs by city
 * @access  Public
 */
router.get("/city/:city", async (req, res) => {
  try {
    const hbcs = await hbcService.findByCity(req.params.city);
    res.json(hbcs);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching hospitals", error: error.message });
  }
});

/**
 * @route   GET /api/hbc/division/:division
 * @desc    Get HBCs by division
 * @access  Public
 */
router.get("/division/:division", async (req, res) => {
  try {
    const hbcs = await hbcService.findByDivision(req.params.division);
    res.json(hbcs);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching hospitals", error: error.message });
  }
});

/**
 * @route   GET /api/hbc/type/:type
 * @desc    Get HBCs by organization type
 * @access  Public
 */
router.get("/type/:type", async (req, res) => {
  try {
    const hbcs = await hbcService.findByType(req.params.type);
    res.json(hbcs);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching hospitals", error: error.message });
  }
});

/**
 * @route   GET /api/hbc/blood/:bloodType
 * @desc    Get HBCs with available blood type
 * @access  Public
 */
router.get("/blood/:bloodType", async (req, res) => {
  try {
    const hbcs = await hbcService.findWithBloodAvailable(req.params.bloodType);
    res.json(hbcs);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching hospitals", error: error.message });
  }
});

/**
 * @route   POST /api/hbc
 * @desc    Create a new hospital/blood center
 * @access  Private (Admin only in production)
 */
router.post("/", isAuthenticated, hbcValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const hbc = await hbcService.create(req.body);
    res.status(201).json(hbc);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating hospital", error: error.message });
  }
});

/**
 * @route   PUT /api/hbc/:id
 * @desc    Update HBC information
 * @access  Private (Admin only in production)
 */
router.put("/:id", isAuthenticated, async (req, res) => {
  try {
    const hbc = await hbcService.update(req.params.id, req.body);
    res.json(hbc);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating hospital", error: error.message });
  }
});

/**
 * @route   PUT /api/hbc/:id/inventory
 * @desc    Update blood inventory
 * @access  Private (Admin only in production)
 */
router.put("/:id/inventory", isAuthenticated, async (req, res) => {
  try {
    const { bloodType, quantity } = req.body;
    const hbc = await hbcService.updateBloodInventory(
      req.params.id,
      bloodType,
      quantity
    );
    res.json(hbc);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating inventory", error: error.message });
  }
});

/**
 * @route   DELETE /api/hbc/:id
 * @desc    Deactivate HBC
 * @access  Private (Admin only in production)
 */
router.delete("/:id", isAuthenticated, async (req, res) => {
  try {
    await hbcService.deactivate(req.params.id);
    res.json({ message: "Hospital/Blood Center deactivated successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deactivating hospital", error: error.message });
  }
});

module.exports = router;
