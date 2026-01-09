const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      minlength: [3, "Username must be between 3 and 20 characters"],
      maxlength: [20, "Username must be between 3 and 20 characters"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email address",
      ],
    },
    number: {
      type: String,
      required: [true, "Mobile number is required"],
      match: [/^\+?[0-9]{10,15}$/, "Mobile number must be valid"],
    },
    bloodType: {
      type: String,
      required: [true, "Blood type is required"],
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    },
    // Detailed location fields
    division: {
      type: String,
      default: "",
    },
    district: {
      type: String,
      default: "",
    },
    upazila: {
      type: String,
      default: "",
    },
    // Legacy location field (for backward compatibility)
    location: {
      type: String,
      default: "",
    },
    // Full address
    address: {
      type: String,
      default: "",
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
    },
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
    },
    age: {
      type: Number,
      min: [18, "Must be at least 18 years old"],
      max: [65, "Must be under 65 years old"],
    },
    gender: {
      type: String,
      required: [true, "Gender is required"],
      enum: ["Male", "Female", "Other"],
    },
    // Profile picture
    profilePicture: {
      type: String,
      default: "",
    },
    // Bio/About
    bio: {
      type: String,
      default: "",
      maxlength: [500, "Bio cannot exceed 500 characters"],
    },
    // Medical info
    weight: {
      type: Number,
      default: null,
    },
    hasMedicalConditions: {
      type: Boolean,
      default: false,
    },
    medicalConditions: {
      type: String,
      default: "",
    },
    donationsCount: {
      type: Number,
      default: 0,
    },
    completedRequests: {
      type: Number,
      default: 0,
    },
    missedRequests: {
      type: Number,
      default: 0,
    },
    responseRatio: {
      type: Number,
      default: 0,
    },
    lastDonationDate: {
      type: Date,
      default: null,
    },
    isEnabled: {
      type: Boolean,
      default: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Virtual for full location string
userSchema.virtual("fullLocation").get(function () {
  const parts = [this.upazila, this.district, this.division].filter(Boolean);
  return parts.join(", ") || this.location || "Not specified";
});

// Calculate profile completion percentage
userSchema.methods.calculateProfileCompletion = function () {
  const fields = [
    { name: "firstName", weight: 10 },
    { name: "lastName", weight: 10 },
    { name: "email", weight: 10 },
    { name: "number", weight: 10 },
    { name: "bloodType", weight: 15 },
    { name: "gender", weight: 5 },
    { name: "age", weight: 5 },
    { name: "division", weight: 5 },
    { name: "district", weight: 5 },
    { name: "upazila", weight: 5 },
    { name: "profilePicture", weight: 10 },
    { name: "bio", weight: 5 },
    { name: "weight", weight: 5 },
  ];

  let totalWeight = 0;
  let completedWeight = 0;

  fields.forEach((field) => {
    totalWeight += field.weight;
    const value = this[field.name];
    if (value !== null && value !== undefined && value !== "") {
      completedWeight += field.weight;
    }
  });

  return Math.round((completedWeight / totalWeight) * 100);
};

// Get missing profile fields
userSchema.methods.getMissingFields = function () {
  const fieldLabels = {
    firstName: "First Name",
    lastName: "Last Name",
    email: "Email",
    number: "Phone Number",
    bloodType: "Blood Type",
    gender: "Gender",
    age: "Age",
    division: "Division",
    district: "District",
    upazila: "Upazila/Thana",
    profilePicture: "Profile Picture",
    bio: "Bio",
    weight: "Weight",
  };

  const missing = [];
  Object.keys(fieldLabels).forEach((field) => {
    const value = this[field];
    if (value === null || value === undefined || value === "") {
      missing.push(fieldLabels[field]);
    }
  });

  return missing;
};

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Calculate response ratio
userSchema.methods.calculateResponseRatio = function () {
  const total = this.completedRequests + this.missedRequests;
  if (total === 0) return 0;
  return (this.completedRequests / total) * 100;
};

// Transform for JSON output (remove password)
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
