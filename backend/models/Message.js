const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    // Conversation context - linked to a blood request
    bloodRequest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BloodRequest",
      required: true,
    },

    // Sender and receiver
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Message content
    content: {
      type: String,
      required: true,
      maxlength: 1000,
    },

    // Message type
    messageType: {
      type: String,
      enum: ["text", "system", "notification"],
      default: "text",
    },

    // Read status
    isRead: {
      type: Boolean,
      default: false,
    },

    // Read at timestamp
    readAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for fast queries
messageSchema.index({ bloodRequest: 1, createdAt: -1 });
messageSchema.index({ receiver: 1, isRead: 1 });
messageSchema.index({ sender: 1, receiver: 1 });

// Static method to get unread count
messageSchema.statics.getUnreadCount = async function (userId) {
  return this.countDocuments({ receiver: userId, isRead: false });
};

// Static method to get conversation
messageSchema.statics.getConversation = async function (
  bloodRequestId,
  user1Id,
  user2Id
) {
  return this.find({
    bloodRequest: bloodRequestId,
    $or: [
      { sender: user1Id, receiver: user2Id },
      { sender: user2Id, receiver: user1Id },
    ],
  })
    .sort({ createdAt: 1 })
    .populate("sender", "firstName lastName username profilePicture")
    .populate("receiver", "firstName lastName username profilePicture");
};

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
