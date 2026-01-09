const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");
const path = require("path");
require("dotenv").config();

// Import routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const profileRoutes = require("./routes/profileRoutes");
const donationRoutes = require("./routes/donationRoutes");
const recipientRoutes = require("./routes/recipientRoutes");
const hbcRoutes = require("./routes/hbcRoutes");
const reportRoutes = require("./routes/reportRoutes");

// Import passport config
require("./config/passport");

const app = express();

// Middleware
const allowedOrigins = [
  "http://localhost:8080",
  "http://localhost:3000",
  process.env.FRONTEND_URL,
  process.env.RENDER_EXTERNAL_URL,
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      if (
        allowedOrigins.indexOf(origin) !== -1 ||
        process.env.NODE_ENV === "development"
      ) {
        callback(null, true);
      } else {
        callback(null, true); // Allow all origins in production for now
      }
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-secret-key",
    resave: false,
    saveUninitialized: false,
    proxy: true, // Required for Render/Heroku
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);

// Trust proxy for production (needed for secure cookies behind Render's proxy)
if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Serve static files from frontend
app.use(
  "/static",
  express.static(path.join(__dirname, "../src/main/resources/static"))
);
app.use(
  "/js",
  express.static(path.join(__dirname, "../src/main/resources/static/js"))
);
app.use(
  "/images",
  express.static(path.join(__dirname, "../src/main/resources/static/images"))
);
app.use(
  "/css",
  express.static(path.join(__dirname, "../src/main/resources/static"))
);

// Serve CSS and JS files directly
app.use(express.static(path.join(__dirname, "../src/main/resources/static")));

// Set up template directory
const templatesDir = path.join(__dirname, "../src/main/resources/templates");

// HTML Page Routes
app.get("/", (req, res) => {
  res.sendFile(path.join(templatesDir, "homePage.html"));
});

app.get("/homePage", (req, res) => {
  res.sendFile(path.join(templatesDir, "homePage.html"));
});

app.get("/homePage_dark", (req, res) => {
  res.sendFile(path.join(templatesDir, "homePage_dark.html"));
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(templatesDir, "login.html"));
});

app.get("/signUp", (req, res) => {
  res.sendFile(path.join(templatesDir, "signUp.html"));
});

app.get("/profile", (req, res) => {
  res.sendFile(path.join(templatesDir, "profile.html"));
});

app.get("/aboutUsPage", (req, res) => {
  res.sendFile(path.join(templatesDir, "aboutUsPage.html"));
});

app.get("/donorListPage", (req, res) => {
  res.sendFile(path.join(templatesDir, "donorListPage.html"));
});

app.get("/donorTablePage", (req, res) => {
  res.sendFile(path.join(templatesDir, "donorTablePage.html"));
});

app.get("/homePage_best", (req, res) => {
  res.sendFile(path.join(templatesDir, "homePage_best.html"));
});

app.get("/formPage", (req, res) => {
  res.sendFile(path.join(templatesDir, "formPage.html"));
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/donations", donationRoutes);
app.use("/api/recipients", recipientRoutes);
app.use("/api/hbc", hbcRoutes);
app.use("/api/reports", reportRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Blood Donation API is running" });
});

// Get user status (for navbar)
app.get("/getUserStatus", (req, res) => {
  if (req.isAuthenticated()) {
    res.json({
      loggedIn: true,
      username: req.user.username,
    });
  } else {
    res.json({ loggedIn: false });
  }
});

// MongoDB Connection
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/blood_donation_db";

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Something went wrong!",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
