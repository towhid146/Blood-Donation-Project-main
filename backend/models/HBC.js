const mongoose = require("mongoose");

// HBC = Hospital/Blood Center Entity
const hbcSchema = new mongoose.Schema(
  {
    hbcName: {
      type: String,
      required: true,
      trim: true,
    },
    area: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    division: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    organizationType: {
      type: String,
      required: true,
      enum: ["hospital", "blood_bank", "clinic", "donation_center"],
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
    },
    address: {
      type: String,
    },
    operatingHours: {
      open: String,
      close: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    bloodInventory: {
      "A+": { type: Number, default: 0 },
      "A-": { type: Number, default: 0 },
      "B+": { type: Number, default: 0 },
      "B-": { type: Number, default: 0 },
      "AB+": { type: Number, default: 0 },
      "AB-": { type: Number, default: 0 },
      "O+": { type: Number, default: 0 },
      "O-": { type: Number, default: 0 },
    },
  },
  {
    timestamps: true,
  }
);

// Index for location-based searches
hbcSchema.index({ city: 1, division: 1 });
hbcSchema.index({ organizationType: 1 });

const HBC = mongoose.model("HBC", hbcSchema);

module.exports = HBC;
