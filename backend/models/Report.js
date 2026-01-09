const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    lastBloodDonate: {
      type: Date,
      required: true,
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
    hemoglobinLevel: {
      type: Number,
    },
    bloodPressure: {
      systolic: Number,
      diastolic: Number,
    },
    weight: {
      type: Number,
    },
    notes: {
      type: String,
    },
    eligibleForNextDonation: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
reportSchema.index({ user: 1, lastBloodDonate: -1 });

// Calculate next eligible donation date (typically 56 days after last donation)
reportSchema.pre("save", function (next) {
  if (this.lastBloodDonate) {
    const nextDate = new Date(this.lastBloodDonate);
    nextDate.setDate(nextDate.getDate() + 56);
    this.eligibleForNextDonation = nextDate;
  }
  next();
});

const Report = mongoose.model("Report", reportSchema);

module.exports = Report;
