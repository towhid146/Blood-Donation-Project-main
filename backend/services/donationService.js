const Donation = require("../models/Donation");
const User = require("../models/User");

class DonationService {
  /**
   * Create a new donation record
   * @param {Object} donationData - The donation data
   * @returns {Promise<Object>} The created donation
   */
  async createDonation(donationData) {
    const donation = new Donation(donationData);
    const savedDonation = await donation.save();

    // Update user's donation count
    await User.findByIdAndUpdate(donationData.user, {
      $inc: { donationsCount: 1 },
      lastDonationDate: new Date(),
    });

    return savedDonation;
  }

  /**
   * Get donation by ID
   * @param {string} id - The donation ID
   * @returns {Promise<Object>} The donation object
   */
  async findById(id) {
    const donation = await Donation.findById(id)
      .populate("user", "username firstName lastName bloodType")
      .populate("hospital", "hbcName city")
      .populate("recipient");

    if (!donation) {
      throw new Error(`Donation not found with id: ${id}`);
    }
    return donation;
  }

  /**
   * Get all donations for a user
   * @param {string} userId - The user ID
   * @returns {Promise<Array>} Array of donations
   */
  async findByUser(userId) {
    return Donation.find({ user: userId })
      .populate("hospital", "hbcName city")
      .sort({ donDate: -1 });
  }

  /**
   * Get all donations at a hospital
   * @param {string} hospitalId - The hospital ID
   * @returns {Promise<Array>} Array of donations
   */
  async findByHospital(hospitalId) {
    return Donation.find({ hospital: hospitalId })
      .populate("user", "username firstName lastName bloodType")
      .sort({ donDate: -1 });
  }

  /**
   * Update donation status
   * @param {string} id - The donation ID
   * @param {string} status - The new status
   * @returns {Promise<Object>} The updated donation
   */
  async updateStatus(id, status) {
    return Donation.findByIdAndUpdate(id, { status }, { new: true });
  }

  /**
   * Get recent donations
   * @param {number} limit - Number of donations to retrieve
   * @returns {Promise<Array>} Array of recent donations
   */
  async getRecentDonations(limit = 10) {
    return Donation.find({ status: "completed" })
      .populate("user", "username firstName lastName")
      .populate("hospital", "hbcName city")
      .sort({ donDate: -1 })
      .limit(limit);
  }

  /**
   * Get donation statistics
   * @returns {Promise<Object>} Donation statistics
   */
  async getStatistics() {
    const totalDonations = await Donation.countDocuments({
      status: "completed",
    });
    const todayDonations = await Donation.countDocuments({
      status: "completed",
      donDate: { $gte: new Date().setHours(0, 0, 0, 0) },
    });

    const byBloodType = await Donation.aggregate([
      { $match: { status: "completed" } },
      { $group: { _id: "$bloodType", count: { $sum: 1 } } },
    ]);

    return {
      totalDonations,
      todayDonations,
      byBloodType,
    };
  }
}

module.exports = new DonationService();
