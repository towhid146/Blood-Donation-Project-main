const Report = require("../models/Report");

class ReportService {
  /**
   * Create a new report
   * @param {Object} reportData - The report data
   * @returns {Promise<Object>} The created report
   */
  async create(reportData) {
    const report = new Report(reportData);
    return report.save();
  }

  /**
   * Get report by ID
   * @param {string} id - The report ID
   * @returns {Promise<Object>} The report object
   */
  async findById(id) {
    const report = await Report.findById(id)
      .populate("user", "username firstName lastName")
      .populate("hospital", "hbcName city");

    if (!report) {
      throw new Error(`Report not found with id: ${id}`);
    }
    return report;
  }

  /**
   * Get all reports for a user
   * @param {string} userId - The user ID
   * @returns {Promise<Array>} Array of reports
   */
  async findByUser(userId) {
    return Report.find({ user: userId })
      .populate("hospital", "hbcName city")
      .sort({ lastBloodDonate: -1 });
  }

  /**
   * Get latest report for a user
   * @param {string} userId - The user ID
   * @returns {Promise<Object>} The latest report
   */
  async getLatestByUser(userId) {
    return Report.findOne({ user: userId })
      .populate("hospital", "hbcName city")
      .sort({ lastBloodDonate: -1 });
  }

  /**
   * Get reports by hospital
   * @param {string} hospitalId - The hospital ID
   * @returns {Promise<Array>} Array of reports
   */
  async findByHospital(hospitalId) {
    return Report.find({ hospital: hospitalId })
      .populate("user", "username firstName lastName bloodType")
      .sort({ lastBloodDonate: -1 });
  }

  /**
   * Check if user is eligible to donate
   * @param {string} userId - The user ID
   * @returns {Promise<Object>} Eligibility status and next eligible date
   */
  async checkEligibility(userId) {
    const latestReport = await this.getLatestByUser(userId);

    if (!latestReport) {
      return { eligible: true, message: "No previous donation records found" };
    }

    const now = new Date();
    const eligibleDate = new Date(latestReport.eligibleForNextDonation);

    if (now >= eligibleDate) {
      return {
        eligible: true,
        message: "You are eligible to donate",
        lastDonation: latestReport.lastBloodDonate,
      };
    }

    const daysRemaining = Math.ceil(
      (eligibleDate - now) / (1000 * 60 * 60 * 24)
    );
    return {
      eligible: false,
      message: `You need to wait ${daysRemaining} more days before donating`,
      eligibleDate: eligibleDate,
      lastDonation: latestReport.lastBloodDonate,
    };
  }

  /**
   * Update a report
   * @param {string} id - The report ID
   * @param {Object} updateData - The data to update
   * @returns {Promise<Object>} The updated report
   */
  async update(id, updateData) {
    return Report.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
  }

  /**
   * Delete a report
   * @param {string} id - The report ID
   * @returns {Promise<Object>} The deleted report
   */
  async delete(id) {
    const report = await Report.findByIdAndDelete(id);
    if (!report) {
      throw new Error(`Report not found with id: ${id}`);
    }
    return report;
  }
}

module.exports = new ReportService();
