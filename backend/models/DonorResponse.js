const mongoose = require("mongoose");

const donorResponseSchema = new mongoose.Schema(
  {
    // The blood request being responded to
    bloodRequest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BloodRequest",
      required: true,
    },

    // The donor responding
    donor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Response status
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "completed", "cancelled"],
      default: "pending",
    },

    // Donor's willingness
    isWilling: {
      type: Boolean,
      default: true,
    },

    // Message from donor
    message: {
      type: String,
      default: "",
      maxlength: 500,
    },

    // Contact permission - only show contact if willing
    contactPermission: {
      type: Boolean,
      default: true,
    },

    // Preferred contact time
    preferredContactTime: {
      type: String,
      default: "anytime",
      enum: ["morning", "afternoon", "evening", "anytime"],
    },

    // When donor can donate
    availableDate: {
      type: Date,
      default: null,
    },

    // Requester's response to donor
    requesterResponse: {
      type: String,
      default: "",
    },

    // Was the donation completed?
    donationCompleted: {
      type: Boolean,
      default: false,
    },

    // Completion date
    completedAt: {
      type: Date,
      default: null,
    },

    // Seen by requester
    seenByRequester: {
      type: Boolean,
      default: false,
    },

    // Seen by donor
    seenByDonor: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for fast queries
donorResponseSchema.index({ bloodRequest: 1, donor: 1 }, { unique: true });
donorResponseSchema.index({ donor: 1, status: 1 });
donorResponseSchema.index({ bloodRequest: 1, isWilling: 1 });

// Virtual for time since response
donorResponseSchema.virtual("timeSinceResponse").get(function () {
  const now = new Date();
  const diff = now - this.createdAt;
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  return "Just now";
});

const DonorResponse = mongoose.model("DonorResponse", donorResponseSchema);

module.exports = DonorResponse;
