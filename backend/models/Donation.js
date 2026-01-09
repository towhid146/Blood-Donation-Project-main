const mongoose = require("mongoose");

const donationSchema = new mongoose.Schema(
  {
    donDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Recipient",
    },
    hospital: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "HBC",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    bloodType: {
      type: String,
      required: true,
    },
    volume: {
      type: Number,
      default: 450, // Standard donation volume in ml
    },
    status: {
      type: String,
      enum: ["pending", "completed", "cancelled"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
donationSchema.index({ user: 1, donDate: -1 });
donationSchema.index({ hospital: 1 });

const Donation = mongoose.model("Donation", donationSchema);

module.exports = Donation;
