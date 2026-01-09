/**
 * Blood Donation Management System - API Service
 * Handles all REST API calls to the backend
 */

const API_BASE_URL = "/api";

class ApiService {
  /**
   * Make a fetch request with common configuration
   */
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      credentials: "include", // Include cookies for session
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw {
          status: response.status,
          message: data.message || "An error occurred",
          errors: data.errors || [],
        };
      }

      return data;
    } catch (error) {
      if (error.status) {
        throw error;
      }
      throw {
        status: 500,
        message: "Network error. Please check your connection.",
      };
    }
  }

  // ==================== AUTH ====================

  /**
   * Register a new user
   */
  async signup(userData) {
    return this.request("/auth/signup", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  }

  /**
   * Login user
   */
  async login(username, password) {
    return this.request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });
  }

  /**
   * Logout user
   */
  async logout() {
    return this.request("/auth/logout", {
      method: "POST",
    });
  }

  /**
   * Check authentication status
   */
  async checkAuth() {
    return this.request("/auth/check");
  }

  // ==================== USER ====================

  /**
   * Get all donors
   */
  async getAllDonors() {
    return this.request("/users");
  }

  /**
   * Get user by ID
   */
  async getUserById(id) {
    return this.request(`/users/${id}`);
  }

  /**
   * Get donors by blood type
   */
  async getDonorsByBloodType(bloodType) {
    return this.request(`/users/blood-type/${encodeURIComponent(bloodType)}`);
  }

  /**
   * Get donors by location
   */
  async getDonorsByLocation(location) {
    return this.request(`/users/location/${encodeURIComponent(location)}`);
  }

  /**
   * Update user profile
   */
  async updateUser(id, userData) {
    return this.request(`/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(userData),
    });
  }

  /**
   * Update user password
   */
  async updatePassword(id, currentPassword, newPassword) {
    return this.request(`/users/${id}/password`, {
      method: "PUT",
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  }

  /**
   * Delete user account
   */
  async deleteUser(id) {
    return this.request(`/users/${id}`, {
      method: "DELETE",
    });
  }

  // ==================== PROFILE ====================

  /**
   * Get current user's profile
   */
  async getProfile() {
    return this.request("/profile");
  }

  /**
   * Update current user's profile
   */
  async updateProfile(profileData) {
    return this.request("/profile", {
      method: "PUT",
      body: JSON.stringify(profileData),
    });
  }

  /**
   * Get current user's donation history
   */
  async getMyDonations() {
    return this.request("/profile/donations");
  }

  /**
   * Get current user's reports
   */
  async getMyReports() {
    return this.request("/profile/reports");
  }

  /**
   * Check donation eligibility
   */
  async checkEligibility() {
    return this.request("/profile/eligibility");
  }

  /**
   * Get user statistics
   */
  async getMyStats() {
    return this.request("/profile/stats");
  }

  // ==================== DONATIONS ====================

  /**
   * Create a new donation
   */
  async createDonation(donationData) {
    return this.request("/donations", {
      method: "POST",
      body: JSON.stringify(donationData),
    });
  }

  /**
   * Get recent donations
   */
  async getRecentDonations(limit = 10) {
    return this.request(`/donations?limit=${limit}`);
  }

  /**
   * Get donation statistics
   */
  async getDonationStats() {
    return this.request("/donations/stats");
  }

  /**
   * Get donation by ID
   */
  async getDonationById(id) {
    return this.request(`/donations/${id}`);
  }

  // ==================== RECIPIENTS (BLOOD REQUESTS) ====================

  /**
   * Create blood request
   */
  async createBloodRequest(requestData) {
    return this.request("/blood-requests", {
      method: "POST",
      body: JSON.stringify(requestData),
    });
  }

  /**
   * Get blood requests for donor (in their area)
   */
  async getBloodRequestsForDonor() {
    return this.request("/blood-requests/for-donor");
  }

  /**
   * Get my blood requests (as requester)
   */
  async getMyBloodRequests() {
    return this.request("/blood-requests/my-requests");
  }

  /**
   * Get single blood request with responses
   */
  async getBloodRequestById(id) {
    return this.request(`/blood-requests/${id}`);
  }

  /**
   * Update blood request status
   */
  async updateBloodRequestStatus(id, status) {
    return this.request(`/blood-requests/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  }

  /**
   * Respond to a blood request (as donor)
   */
  async respondToBloodRequest(requestId, responseData) {
    return this.request(`/blood-requests/${requestId}/respond`, {
      method: "POST",
      body: JSON.stringify(responseData),
    });
  }

  /**
   * Get my responses (as donor)
   */
  async getMyDonorResponses() {
    return this.request("/blood-requests/donor/my-responses");
  }

  /**
   * Mark donation as completed
   */
  async markDonationComplete(responseId) {
    return this.request(`/blood-requests/response/${responseId}/complete`, {
      method: "PATCH",
    });
  }

  /**
   * Get notification count
   */
  async getNotificationCount() {
    return this.request("/blood-requests/notifications/count");
  }

  /**
   * Get all pending requests (legacy)
   */
  async getPendingRequests() {
    return this.request("/recipients");
  }

  /**
   * Get urgent blood requests (legacy)
   */
  async getUrgentRequests() {
    return this.request("/recipients/urgent");
  }

  /**
   * Get requests by blood group (legacy)
   */
  async getRequestsByBloodGroup(bloodGroup) {
    return this.request(
      `/recipients/blood-group/${encodeURIComponent(bloodGroup)}`
    );
  }

  /**
   * Update request status (legacy)
   */
  async updateRequestStatus(id, status) {
    return this.request(`/recipients/${id}/status`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    });
  }

  // ==================== MESSAGES ====================

  /**
   * Send a message
   */
  async sendMessage(bloodRequestId, receiverId, content) {
    return this.request("/messages/send", {
      method: "POST",
      body: JSON.stringify({ bloodRequestId, receiverId, content }),
    });
  }

  /**
   * Get conversation between two users
   */
  async getConversation(bloodRequestId, userId) {
    return this.request(`/messages/conversation/${bloodRequestId}/${userId}`);
  }

  /**
   * Get all conversations
   */
  async getConversations() {
    return this.request("/messages/conversations");
  }

  /**
   * Get unread message count
   */
  async getUnreadMessageCount() {
    return this.request("/messages/unread-count");
  }

  /**
   * Mark messages as read
   */
  async markMessagesRead(bloodRequestId, userId) {
    return this.request(`/messages/mark-read/${bloodRequestId}/${userId}`, {
      method: "PATCH",
    });
  }

  // ==================== HOSPITALS/BLOOD CENTERS ====================

  /**
   * Get all hospitals/blood centers
   */
  async getAllHospitals() {
    return this.request("/hbc");
  }

  /**
   * Get hospital by ID
   */
  async getHospitalById(id) {
    return this.request(`/hbc/${id}`);
  }

  /**
   * Get hospitals by city
   */
  async getHospitalsByCity(city) {
    return this.request(`/hbc/city/${encodeURIComponent(city)}`);
  }

  /**
   * Get hospitals with blood type available
   */
  async getHospitalsWithBlood(bloodType) {
    return this.request(`/hbc/blood/${encodeURIComponent(bloodType)}`);
  }

  // ==================== REPORTS ====================

  /**
   * Create health report
   */
  async createReport(reportData) {
    return this.request("/reports", {
      method: "POST",
      body: JSON.stringify(reportData),
    });
  }

  /**
   * Get report by ID
   */
  async getReportById(id) {
    return this.request(`/reports/${id}`);
  }

  /**
   * Check eligibility for user
   */
  async checkUserEligibility(userId) {
    return this.request(`/reports/user/${userId}/eligibility`);
  }
}

// Create global instance
const api = new ApiService();

// Export for module systems
if (typeof module !== "undefined" && module.exports) {
  module.exports = { ApiService, api };
}
