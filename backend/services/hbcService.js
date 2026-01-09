const HBC = require("../models/HBC");

class HBCService {
  /**
   * Create a new hospital/blood center
   * @param {Object} hbcData - The HBC data
   * @returns {Promise<Object>} The created HBC
   */
  async create(hbcData) {
    const hbc = new HBC(hbcData);
    return hbc.save();
  }

  /**
   * Get HBC by ID
   * @param {string} id - The HBC ID
   * @returns {Promise<Object>} The HBC object
   */
  async findById(id) {
    const hbc = await HBC.findById(id);
    if (!hbc) {
      throw new Error(`Hospital/Blood Center not found with id: ${id}`);
    }
    return hbc;
  }

  /**
   * Get all HBCs
   * @returns {Promise<Array>} Array of all HBCs
   */
  async getAll() {
    return HBC.find({ isActive: true });
  }

  /**
   * Find HBCs by city
   * @param {string} city - The city to search for
   * @returns {Promise<Array>} Array of HBCs in the city
   */
  async findByCity(city) {
    return HBC.find({
      city: { $regex: city, $options: "i" },
      isActive: true,
    });
  }

  /**
   * Find HBCs by division
   * @param {string} division - The division to search for
   * @returns {Promise<Array>} Array of HBCs in the division
   */
  async findByDivision(division) {
    return HBC.find({
      division: { $regex: division, $options: "i" },
      isActive: true,
    });
  }

  /**
   * Find HBCs by organization type
   * @param {string} type - The organization type
   * @returns {Promise<Array>} Array of HBCs of the specified type
   */
  async findByType(type) {
    return HBC.find({
      organizationType: type,
      isActive: true,
    });
  }

  /**
   * Update HBC information
   * @param {string} id - The HBC ID
   * @param {Object} updateData - The data to update
   * @returns {Promise<Object>} The updated HBC
   */
  async update(id, updateData) {
    return HBC.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
  }

  /**
   * Update blood inventory
   * @param {string} id - The HBC ID
   * @param {string} bloodType - The blood type to update
   * @param {number} quantity - The quantity to add (can be negative)
   * @returns {Promise<Object>} The updated HBC
   */
  async updateBloodInventory(id, bloodType, quantity) {
    const updateField = `bloodInventory.${bloodType}`;
    return HBC.findByIdAndUpdate(
      id,
      { $inc: { [updateField]: quantity } },
      { new: true }
    );
  }

  /**
   * Get HBCs with available blood type
   * @param {string} bloodType - The blood type needed
   * @returns {Promise<Array>} Array of HBCs with the blood type available
   */
  async findWithBloodAvailable(bloodType) {
    const queryField = `bloodInventory.${bloodType}`;
    return HBC.find({
      [queryField]: { $gt: 0 },
      isActive: true,
    });
  }

  /**
   * Deactivate an HBC
   * @param {string} id - The HBC ID
   * @returns {Promise<Object>} The updated HBC
   */
  async deactivate(id) {
    return HBC.findByIdAndUpdate(id, { isActive: false }, { new: true });
  }
}

module.exports = new HBCService();
