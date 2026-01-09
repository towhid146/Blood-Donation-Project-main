const express = require("express");
const router = express.Router();
const Message = require("../models/Message");
const BloodRequest = require("../models/BloodRequest");
const DonorResponse = require("../models/DonorResponse");

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Please login to continue" });
};

// Send a message
router.post("/send", isAuthenticated, async (req, res) => {
  try {
    const { bloodRequestId, receiverId, content } = req.body;

    if (!bloodRequestId || !receiverId || !content) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Verify the blood request exists
    const bloodRequest = await BloodRequest.findById(bloodRequestId);
    if (!bloodRequest) {
      return res.status(404).json({ message: "Blood request not found" });
    }

    // Verify user is part of this conversation (requester or responding donor)
    const isRequester =
      bloodRequest.requester &&
      bloodRequest.requester.toString() === req.user._id.toString();

    const donorResponse = await DonorResponse.findOne({
      bloodRequest: bloodRequestId,
      donor: req.user._id,
      isWilling: true,
    });

    const isDonor = !!donorResponse;

    if (!isRequester && !isDonor) {
      return res
        .status(403)
        .json({
          message: "Not authorized to send messages in this conversation",
        });
    }

    // Create message
    const message = new Message({
      bloodRequest: bloodRequestId,
      sender: req.user._id,
      receiver: receiverId,
      content: content.trim(),
    });

    await message.save();

    // Populate sender info
    await message.populate(
      "sender",
      "firstName lastName username profilePicture"
    );

    res.status(201).json({
      message: "Message sent successfully",
      data: message,
    });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({
      message: "Error sending message",
      error: error.message,
    });
  }
});

// Get conversation between two users for a blood request
router.get(
  "/conversation/:bloodRequestId/:userId",
  isAuthenticated,
  async (req, res) => {
    try {
      const { bloodRequestId, userId } = req.params;
      const currentUserId = req.user._id;

      // Get messages between the two users for this blood request
      const messages = await Message.getConversation(
        bloodRequestId,
        currentUserId,
        userId
      );

      // Mark messages as read
      await Message.updateMany(
        {
          bloodRequest: bloodRequestId,
          sender: userId,
          receiver: currentUserId,
          isRead: false,
        },
        {
          isRead: true,
          readAt: new Date(),
        }
      );

      res.json({ messages });
    } catch (error) {
      console.error("Error fetching conversation:", error);
      res.status(500).json({
        message: "Error fetching messages",
        error: error.message,
      });
    }
  }
);

// Get all conversations for a user
router.get("/conversations", isAuthenticated, async (req, res) => {
  try {
    const userId = req.user._id;

    // Find all unique conversations
    const messages = await Message.aggregate([
      {
        $match: {
          $or: [{ sender: userId }, { receiver: userId }],
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $group: {
          _id: {
            bloodRequest: "$bloodRequest",
            otherUser: {
              $cond: [{ $eq: ["$sender", userId] }, "$receiver", "$sender"],
            },
          },
          lastMessage: { $first: "$$ROOT" },
          unreadCount: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ["$receiver", userId] },
                    { $eq: ["$isRead", false] },
                  ],
                },
                1,
                0,
              ],
            },
          },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id.otherUser",
          foreignField: "_id",
          as: "otherUser",
        },
      },
      {
        $lookup: {
          from: "bloodrequests",
          localField: "_id.bloodRequest",
          foreignField: "_id",
          as: "bloodRequest",
        },
      },
      {
        $unwind: "$otherUser",
      },
      {
        $unwind: "$bloodRequest",
      },
      {
        $project: {
          _id: 0,
          bloodRequestId: "$_id.bloodRequest",
          bloodRequest: {
            patientName: "$bloodRequest.patientName",
            bloodType: "$bloodRequest.bloodType",
            hospital: "$bloodRequest.hospital",
          },
          otherUser: {
            _id: "$otherUser._id",
            firstName: "$otherUser.firstName",
            lastName: "$otherUser.lastName",
            username: "$otherUser.username",
            profilePicture: "$otherUser.profilePicture",
          },
          lastMessage: {
            content: "$lastMessage.content",
            createdAt: "$lastMessage.createdAt",
            isRead: "$lastMessage.isRead",
          },
          unreadCount: 1,
        },
      },
      {
        $sort: { "lastMessage.createdAt": -1 },
      },
    ]);

    res.json({ conversations: messages });
  } catch (error) {
    console.error("Error fetching conversations:", error);
    res.status(500).json({
      message: "Error fetching conversations",
      error: error.message,
    });
  }
});

// Get unread message count
router.get("/unread-count", isAuthenticated, async (req, res) => {
  try {
    const count = await Message.getUnreadCount(req.user._id);
    res.json({ unreadCount: count });
  } catch (error) {
    console.error("Error fetching unread count:", error);
    res.status(500).json({
      message: "Error fetching unread count",
      error: error.message,
    });
  }
});

// Mark all messages in a conversation as read
router.patch(
  "/mark-read/:bloodRequestId/:userId",
  isAuthenticated,
  async (req, res) => {
    try {
      const { bloodRequestId, userId } = req.params;

      await Message.updateMany(
        {
          bloodRequest: bloodRequestId,
          sender: userId,
          receiver: req.user._id,
          isRead: false,
        },
        {
          isRead: true,
          readAt: new Date(),
        }
      );

      res.json({ message: "Messages marked as read" });
    } catch (error) {
      console.error("Error marking messages as read:", error);
      res.status(500).json({
        message: "Error marking messages as read",
        error: error.message,
      });
    }
  }
);

module.exports = router;
