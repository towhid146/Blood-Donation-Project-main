const mongoose = require("mongoose");

const recipientSchema = new mongoose.Schema(
  {
    medicalPurpose: {
      type: String,
      required: true,
    },
    registrationDate: {
      type: Date,
      default: Date.now,
    },
    volumeNeeded: {
      type: Number,
      required: true,
    },
    bloodGroupNeeded: {
      type: String,
      required: true,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "fulfilled", "cancelled"],
      default: "pending",
    },
    urgency: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      default: "medium",
    },
    hospital: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "HBC",
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
recipientSchema.index({ bloodGroupNeeded: 1, status: 1 });
recipientSchema.index({ user: 1 });

const Recipient = mongoose.model("Recipient", recipientSchema);

module.exports = Recipient;
