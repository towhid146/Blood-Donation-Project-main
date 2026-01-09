const mongoose = require("mongoose");

const bloodRequestSchema = new mongoose.Schema(
  {
    // Requester info
    requester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null, // Can be null for anonymous requests
    },
    requesterName: {
      type: String,
      required: true,
    },
    requesterContact: {
      type: String,
      required: true,
    },
    requesterEmail: {
      type: String,
      default: "",
    },

    // Patient info
    patientName: {
      type: String,
      required: true,
    },
    bloodType: {
      type: String,
      required: true,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    },

    // Location
    division: {
      type: String,
      required: true,
    },
    district: {
      type: String,
      required: true,
    },
    upazila: {
      type: String,
      default: "",
    },
    hospital: {
      type: String,
      default: "",
    },
    specificLocation: {
      type: String,
      default: "",
    },

    // Request details
    volumeNeeded: {
      type: Number,
      default: 450,
    },
    unitsNeeded: {
      type: Number,
      default: 1,
    },
    urgency: {
      type: String,
      enum: ["critical", "high", "normal", "low"],
      default: "normal",
    },
    medicalPurpose: {
      type: String,
      required: true,
    },
    additionalNotes: {
      type: String,
      default: "",
    },

    // Status
    status: {
      type: String,
      enum: ["active", "fulfilled", "cancelled", "expired"],
      default: "active",
    },

    // Expiry date (based on urgency)
    expiresAt: {
      type: Date,
      required: true,
    },

    // Stats
    notifiedDonors: {
      type: Number,
      default: 0,
    },
    respondedDonors: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Index for searching by location and blood type
bloodRequestSchema.index({ division: 1, district: 1, bloodType: 1, status: 1 });
bloodRequestSchema.index({ requester: 1 });
bloodRequestSchema.index({ expiresAt: 1 });

// Calculate expiry date based on urgency
bloodRequestSchema.statics.calculateExpiry = function (urgency) {
  const now = new Date();
  switch (urgency) {
    case "critical":
      return new Date(now.getTime() + 24 * 60 * 60 * 1000); // 1 day
    case "high":
      return new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000); // 3 days
    case "normal":
      return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days
    case "low":
      return new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000); // 14 days
    default:
      return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days
  }
};

// Get urgency label
bloodRequestSchema.methods.getUrgencyLabel = function () {
  const labels = {
    critical: "🔴 Critical - Immediate",
    high: "🟠 High - Within 24 hours",
    normal: "🟡 Normal - Within a week",
    low: "🟢 Low - Scheduled",
  };
  return labels[this.urgency] || this.urgency;
};

const BloodRequest = mongoose.model("BloodRequest", bloodRequestSchema);

module.exports = BloodRequest;
