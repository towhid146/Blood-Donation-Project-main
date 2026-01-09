const express = require("express");
const router = express.Router();
const userService = require("../services/userService");
const { isAuthenticated } = require("../middleware/auth");

/**
 * @route   GET /api/users
 * @desc    Get all users (donors)
 * @access  Public
 */
router.get("/", async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.json(users);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching users", error: error.message });
  }
});

/**
 * @route   GET /api/users/:id
 * @desc    Get user by ID
 * @access  Public
 */
router.get("/:id", async (req, res) => {
  try {
    const user = await userService.findById(req.params.id);
    res.json(user);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

/**
 * @route   GET /api/users/blood-type/:bloodType
 * @desc    Get donors by blood type
 * @access  Public
 */
router.get("/blood-type/:bloodType", async (req, res) => {
  try {
    const users = await userService.findByBloodType(req.params.bloodType);
    res.json(users);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching users", error: error.message });
  }
});

/**
 * @route   GET /api/users/location/:location
 * @desc    Get donors by location
 * @access  Public
 */
router.get("/location/:location", async (req, res) => {
  try {
    const users = await userService.findByLocation(req.params.location);
    res.json(users);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching users", error: error.message });
  }
});

/**
 * @route   PUT /api/users/:id
 * @desc    Update user profile
 * @access  Private
 */
router.put("/:id", isAuthenticated, async (req, res) => {
  try {
    // Ensure user can only update their own profile
    if (req.user._id.toString() !== req.params.id) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this profile" });
    }

    const updateData = { ...req.body, _id: req.params.id };
    // Don't allow password update through this route
    delete updateData.password;

    const user = await userService.saveUserProfile(updateData);
    res.json(user);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating user", error: error.message });
  }
});

/**
 * @route   PUT /api/users/:id/password
 * @desc    Update user password
 * @access  Private
 */
router.put("/:id/password", isAuthenticated, async (req, res) => {
  try {
    // Ensure user can only update their own password
    if (req.user._id.toString() !== req.params.id) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this password" });
    }

    const { currentPassword, newPassword } = req.body;

    // Verify current password
    const isMatch = await req.user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    await userService.updatePassword(req.user.username, newPassword);
    res.json({ message: "Password updated successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating password", error: error.message });
  }
});

/**
 * @route   DELETE /api/users/:id
 * @desc    Delete user account
 * @access  Private
 */
router.delete("/:id", isAuthenticated, async (req, res) => {
  try {
    // Ensure user can only delete their own account
    if (req.user._id.toString() !== req.params.id) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this account" });
    }

    await userService.deleteUser(req.user.username);

    req.logout((err) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Error logging out after deletion" });
      }
      res.json({ message: "Account deleted successfully" });
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting user", error: error.message });
  }
});

module.exports = router;
