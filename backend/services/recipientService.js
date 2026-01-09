const Recipient = require("../models/Recipient");

class RecipientService {
  /**
   * Create a new recipient request
   * @param {Object} recipientData - The recipient data
   * @returns {Promise<Object>} The created recipient request
   */
  async createRequest(recipientData) {
    const recipient = new Recipient(recipientData);
    return recipient.save();
  }

  /**
   * Get recipient by ID
   * @param {string} id - The recipient ID
   * @returns {Promise<Object>} The recipient object
   */
  async findById(id) {
    const recipient = await Recipient.findById(id)
      .populate("user", "username firstName lastName")
      .populate("hospital", "hbcName city");

    if (!recipient) {
      throw new Error(`Recipient request not found with id: ${id}`);
    }
    return recipient;
  }

  /**
   * Get all requests for a user
   * @param {string} userId - The user ID
   * @returns {Promise<Array>} Array of recipient requests
   */
  async findByUser(userId) {
    return Recipient.find({ user: userId })
      .populate("hospital", "hbcName city")
      .sort({ registrationDate: -1 });
  }

  /**
   * Get pending requests by blood group
   * @param {string} bloodGroup - The blood group needed
   * @returns {Promise<Array>} Array of pending requests
   */
  async findPendingByBloodGroup(bloodGroup) {
    return Recipient.find({
      bloodGroupNeeded: bloodGroup,
      status: "pending",
    })
      .populate("user", "username firstName lastName location")
      .populate("hospital", "hbcName city")
      .sort({ urgency: -1, registrationDate: 1 });
  }

  /**
   * Update request status
   * @param {string} id - The recipient ID
   * @param {string} status - The new status
   * @returns {Promise<Object>} The updated recipient request
   */
  async updateStatus(id, status) {
    return Recipient.findByIdAndUpdate(id, { status }, { new: true });
  }

  /**
   * Get all pending requests
   * @returns {Promise<Array>} Array of pending requests
   */
  async getAllPending() {
    return Recipient.find({ status: "pending" })
      .populate("user", "username firstName lastName location")
      .populate("hospital", "hbcName city")
      .sort({ urgency: -1, registrationDate: 1 });
  }

  /**
   * Get urgent requests
   * @returns {Promise<Array>} Array of urgent/critical requests
   */
  async getUrgentRequests() {
    return Recipient.find({
      status: "pending",
      urgency: { $in: ["high", "critical"] },
    })
      .populate("user", "username firstName lastName location number")
      .populate("hospital", "hbcName city phone")
      .sort({ urgency: -1 });
  }
}

module.exports = new RecipientService();
