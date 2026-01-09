const User = require("../models/User");

class UserService {
  /**
   * Fetches the user details from the database based on the provided username.
   * @param {string} username - The username of the user to be fetched
   * @returns {Promise<Object>} The user object containing the user's details
   * @throws {Error} If the user is not found in the database
   */
  async findByUsername(username) {
    const user = await User.findOne({ username });
    if (!user) {
      throw new Error(`User not found with username: ${username}`);
    }
    return user;
  }

  /**
   * Creates or updates a user's profile in the database.
   * @param {Object} userData - The user data to save
   * @returns {Promise<Object>} The saved user object
   */
  async saveUserProfile(userData) {
    if (userData._id) {
      return User.findByIdAndUpdate(userData._id, userData, {
        new: true,
        runValidators: true,
      });
    }
    const user = new User(userData);
    return user.save();
  }

  /**
   * Fetches the user by their email address.
   * @param {string} email - The email of the user to be fetched
   * @returns {Promise<Object>} The user object containing the user's details
   * @throws {Error} If the user is not found with the provided email
   */
  async findByEmail(email) {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      throw new Error(`User not found with email: ${email}`);
    }
    return user;
  }

  /**
   * Updates the password for a given user.
   * @param {string} username - The username of the user whose password needs to be updated
   * @param {string} newPassword - The new password for the user
   * @returns {Promise<Object>} The updated user object
   * @throws {Error} If the user is not found with the given username
   */
  async updatePassword(username, newPassword) {
    const user = await this.findByUsername(username);
    user.password = newPassword;
    return user.save();
  }

  /**
   * Deletes a user by their username.
   * @param {string} username - The username of the user to be deleted
   * @throws {Error} If the user is not found with the given username
   */
  async deleteUser(username) {
    const user = await this.findByUsername(username);
    await User.findByIdAndDelete(user._id);
  }

  /**
   * Find user by ID
   * @param {string} id - The user ID
   * @returns {Promise<Object>} The user object
   */
  async findById(id) {
    const user = await User.findById(id);
    if (!user) {
      throw new Error(`User not found with id: ${id}`);
    }
    return user;
  }

  /**
   * Get all users
   * @returns {Promise<Array>} Array of all users
   */
  async getAllUsers() {
    return User.find({ isEnabled: true });
  }

  /**
   * Find donors by blood type
   * @param {string} bloodType - The blood type to search for
   * @returns {Promise<Array>} Array of donors with matching blood type
   */
  async findByBloodType(bloodType) {
    return User.find({ bloodType, isEnabled: true });
  }

  /**
   * Find donors by location
   * @param {string} location - The location to search for
   * @returns {Promise<Array>} Array of donors in the specified location
   */
  async findByLocation(location) {
    return User.find({
      location: { $regex: location, $options: "i" },
      isEnabled: true,
    });
  }

  /**
   * Update donation count for a user
   * @param {string} userId - The user ID
   * @returns {Promise<Object>} The updated user object
   */
  async incrementDonationCount(userId) {
    return User.findByIdAndUpdate(
      userId,
      {
        $inc: { donationsCount: 1 },
        lastDonationDate: new Date(),
      },
      { new: true }
    );
  }
}

module.exports = new UserService();
