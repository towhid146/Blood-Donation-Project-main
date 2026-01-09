const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/User");
const { body, validationResult } = require("express-validator");

// Validation rules for signup
const signupValidation = [
  body("username")
    .trim()
    .isLength({ min: 3, max: 20 })
    .withMessage("Username must be between 3 and 20 characters"),
  body("email")
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email address"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("firstName").trim().notEmpty().withMessage("First name is required"),
  body("lastName").trim().notEmpty().withMessage("Last name is required"),
  body("bloodType").notEmpty().withMessage("Blood type is required"),
  body("number")
    .matches(/^\+?[0-9]{10,15}$/)
    .withMessage("Mobile number must be valid"),
  body("gender").notEmpty().withMessage("Gender is required"),
];

/**
 * @route   POST /api/auth/signup
 * @desc    Register a new user
 * @access  Public
 */
router.post("/signup", signupValidation, async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      username,
      email,
      password,
      firstName,
      lastName,
      bloodType,
      number,
      location,
      division,
      district,
      upazila,
      gender,
      age,
    } = req.body;

    // Check if email already exists
    const existingEmail = await User.findOne({ email: email.toLowerCase() });
    if (existingEmail) {
      return res.status(400).json({ message: "Email is already registered" });
    }

    // Check if username already exists
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ message: "Username is already taken" });
    }

    // Generate location string from division/district/upazila if provided
    let finalLocation = location;
    if (!finalLocation && (division || district || upazila)) {
      finalLocation = [upazila, district, division].filter(Boolean).join(', ');
    }

    // Create new user
    const user = new User({
      username,
      email: email.toLowerCase(),
      password,
      firstName,
      lastName,
      bloodType,
      number,
      location: finalLocation || '',
      division: division || '',
      district: district || '',
      upazila: upazila || '',
      gender,
      age,
    });

    await user.save();

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      redirect: "/login",
    });
  } catch (error) {
    console.error("Signup error:", error);
    res
      .status(500)
      .json({ message: "Error registering user", error: error.message });
  }
});

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user and create session
 * @access  Public
 */
router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Authentication error", error: err.message });
    }

    if (!user) {
      return res
        .status(401)
        .json({ message: info.message || "Invalid credentials" });
    }

    req.logIn(user, (err) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Login error", error: err.message });
      }

      console.log(`Login successful for user: ${user.username}`);

      return res.json({
        success: true,
        message: "Login successful",
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
        },
        redirect: "/profile",
      });
    });
  })(req, res, next);
});

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user and destroy session
 * @access  Private
 */
router.post("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Logout error", error: err.message });
    }

    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Session destruction error" });
      }

      res.clearCookie("connect.sid");
      res.json({
        success: true,
        message: "Logged out successfully",
        redirect: "/homePage",
      });
    });
  });
});

/**
 * @route   GET /api/auth/logout
 * @desc    Logout user (GET method for browser redirects)
 * @access  Private
 */
router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.redirect("/homePage");
    }

    req.session.destroy();
    res.clearCookie("connect.sid");
    res.redirect("/homePage");
  });
});

/**
 * @route   GET /api/auth/check
 * @desc    Check if user is authenticated
 * @access  Public
 */
router.get("/check", (req, res) => {
  if (req.isAuthenticated()) {
    res.json({
      authenticated: true,
      user: {
        id: req.user._id,
        username: req.user.username,
        email: req.user.email,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
      },
    });
  } else {
    res.json({ authenticated: false });
  }
});

module.exports = router;
