/**
 * Database Seed Script
 * Run: node backend/seed.js
 * 
 * This script creates dummy users and blood requests for testing
 */

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

// Import models
const User = require("./models/User");
const BloodRequest = require("./models/BloodRequest");
const DonorResponse = require("./models/DonorResponse");

// MongoDB connection
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/blood_donation_db";

// Dummy users data
const dummyUsers = [
  {
    username: "donor1",
    email: "donor1@bdms.com",
    password: "password123",
    firstName: "Rahim",
    lastName: "Ahmed",
    number: "01712345678",
    bloodType: "A+",
    gender: "Male",
    age: 28,
    division: "Dhaka",
    district: "Dhaka",
    upazila: "Dhanmondi",
    bio: "Regular blood donor. Happy to help anytime!",
    donationsCount: 5,
    completedRequests: 4,
    missedRequests: 1,
    lastDonationDate: new Date("2025-09-15"), // 3+ months ago - eligible
    isEnabled: true,
    isVerified: true,
  },
  {
    username: "donor2",
    email: "donor2@bdms.com",
    password: "password123",
    firstName: "Karim",
    lastName: "Hassan",
    number: "01812345678",
    bloodType: "O-",
    gender: "Male",
    age: 32,
    division: "Dhaka",
    district: "Dhaka",
    upazila: "Mirpur",
    bio: "Universal donor. Always ready to save lives.",
    donationsCount: 12,
    completedRequests: 10,
    missedRequests: 2,
    lastDonationDate: new Date("2025-08-20"), // 4+ months ago - eligible
    isEnabled: true,
    isVerified: true,
  },
  {
    username: "donor3",
    email: "donor3@bdms.com",
    password: "password123",
    firstName: "Fatima",
    lastName: "Begum",
    number: "01912345678",
    bloodType: "B+",
    gender: "Female",
    age: 25,
    division: "Dhaka",
    district: "Gazipur",
    upazila: "Gazipur Sadar",
    bio: "First-time donor looking to help.",
    donationsCount: 1,
    completedRequests: 1,
    missedRequests: 0,
    lastDonationDate: new Date("2025-06-01"), // 7+ months ago - eligible
    isEnabled: true,
    isVerified: true,
  },
  {
    username: "donor4",
    email: "donor4@bdms.com",
    password: "password123",
    firstName: "Jamal",
    lastName: "Uddin",
    number: "01612345678",
    bloodType: "AB+",
    gender: "Male",
    age: 35,
    division: "Chittagong",
    district: "Chittagong",
    upazila: "Kotwali",
    bio: "Healthcare worker and regular donor.",
    donationsCount: 8,
    completedRequests: 7,
    missedRequests: 1,
    lastDonationDate: new Date("2025-10-01"), // 3 months ago - eligible
    isEnabled: true,
    isVerified: true,
  },
  {
    username: "donor5",
    email: "donor5@bdms.com",
    password: "password123",
    firstName: "Nusrat",
    lastName: "Jahan",
    number: "01512345678",
    bloodType: "O+",
    gender: "Female",
    age: 29,
    division: "Dhaka",
    district: "Dhaka",
    upazila: "Gulshan",
    bio: "Blood donation is the best gift of life.",
    donationsCount: 3,
    completedRequests: 3,
    missedRequests: 0,
    lastDonationDate: new Date("2025-12-20"), // Recent - NOT eligible
    isEnabled: true,
    isVerified: true,
  },
  {
    username: "donor6",
    email: "donor6@bdms.com",
    password: "password123",
    firstName: "Shakib",
    lastName: "Rahman",
    number: "01412345678",
    bloodType: "A-",
    gender: "Male",
    age: 27,
    division: "Rajshahi",
    district: "Rajshahi",
    upazila: "Boalia",
    bio: "Student at Rajshahi University.",
    donationsCount: 2,
    completedRequests: 2,
    missedRequests: 0,
    lastDonationDate: null, // Never donated - eligible
    isEnabled: true,
    isVerified: true,
  },
  {
    username: "donor7",
    email: "donor7@bdms.com",
    password: "password123",
    firstName: "Ayesha",
    lastName: "Siddiqua",
    number: "01312345678",
    bloodType: "B-",
    gender: "Female",
    age: 24,
    division: "Khulna",
    district: "Khulna",
    upazila: "Khulna Sadar",
    bio: "Medical student at Khulna Medical College.",
    donationsCount: 4,
    completedRequests: 3,
    missedRequests: 1,
    lastDonationDate: new Date("2025-07-15"), // 5+ months ago - eligible
    isEnabled: true,
    isVerified: true,
  },
  {
    username: "requester1",
    email: "requester1@bdms.com",
    password: "password123",
    firstName: "Mahbub",
    lastName: "Alam",
    number: "01112345678",
    bloodType: "AB-",
    gender: "Male",
    age: 45,
    division: "Dhaka",
    district: "Dhaka",
    upazila: "Motijheel",
    bio: "Hospital administrator.",
    donationsCount: 0,
    completedRequests: 0,
    missedRequests: 0,
    lastDonationDate: null,
    isEnabled: true,
    isVerified: true,
  },
  {
    username: "testuser",
    email: "test@bdms.com",
    password: "test123",
    firstName: "Test",
    lastName: "User",
    number: "01011111111",
    bloodType: "O+",
    gender: "Male",
    age: 30,
    division: "Dhaka",
    district: "Dhaka",
    upazila: "Uttara",
    bio: "Test account for demo purposes.",
    donationsCount: 0,
    completedRequests: 0,
    missedRequests: 0,
    lastDonationDate: null,
    isEnabled: true,
    isVerified: true,
  },
  {
    username: "admin",
    email: "admin@bdms.com",
    password: "admin123",
    firstName: "Admin",
    lastName: "BDMS",
    number: "01000000000",
    bloodType: "O-",
    gender: "Male",
    age: 35,
    division: "Dhaka",
    district: "Dhaka",
    upazila: "Dhanmondi",
    bio: "System Administrator",
    donationsCount: 0,
    completedRequests: 0,
    missedRequests: 0,
    lastDonationDate: null,
    isEnabled: true,
    isVerified: true,
  },
];

// Dummy blood requests
const dummyBloodRequests = [
  {
    requesterName: "Mahbub Alam",
    requesterContact: "01112345678",
    requesterEmail: "requester1@bdms.com",
    patientName: "Abdul Karim",
    bloodType: "A+",
    division: "Dhaka",
    district: "Dhaka",
    upazila: "Dhanmondi",
    hospital: "Dhaka Medical College Hospital",
    specificLocation: "Ward 5, Bed 12",
    volumeNeeded: 450,
    unitsNeeded: 2,
    urgency: "critical",
    medicalPurpose: "Surgery",
    additionalNotes: "Urgent heart surgery scheduled for tomorrow morning.",
    status: "active",
  },
  {
    requesterName: "Fatima Begum",
    requesterContact: "01912345678",
    requesterEmail: "donor3@bdms.com",
    patientName: "Rashida Khatun",
    bloodType: "B+",
    division: "Dhaka",
    district: "Gazipur",
    upazila: "Gazipur Sadar",
    hospital: "Shaheed Tajuddin Ahmad Medical College Hospital",
    specificLocation: "Emergency Ward",
    volumeNeeded: 900,
    unitsNeeded: 2,
    urgency: "high",
    medicalPurpose: "Accident",
    additionalNotes: "Road accident victim. Multiple injuries.",
    status: "active",
  },
  {
    requesterName: "Nusrat Jahan",
    requesterContact: "01512345678",
    requesterEmail: "donor5@bdms.com",
    patientName: "Salma Akter",
    bloodType: "O+",
    division: "Dhaka",
    district: "Dhaka",
    upazila: "Gulshan",
    hospital: "United Hospital",
    specificLocation: "Maternity Ward",
    volumeNeeded: 450,
    unitsNeeded: 1,
    urgency: "normal",
    medicalPurpose: "Childbirth",
    additionalNotes: "Scheduled C-section next week.",
    status: "active",
  },
  {
    requesterName: "Jamal Uddin",
    requesterContact: "01612345678",
    requesterEmail: "donor4@bdms.com",
    patientName: "Mohammad Ali",
    bloodType: "AB+",
    division: "Chittagong",
    district: "Chittagong",
    upazila: "Kotwali",
    hospital: "Chittagong Medical College Hospital",
    specificLocation: "Oncology Department",
    volumeNeeded: 1350,
    unitsNeeded: 3,
    urgency: "normal",
    medicalPurpose: "Cancer Treatment",
    additionalNotes: "Leukemia patient requires regular transfusions.",
    status: "active",
  },
];

async function seedDatabase() {
  try {
    console.log("🔄 Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // Clear existing data (optional - comment out if you want to keep existing data)
    console.log("🗑️  Clearing existing data...");
    await User.deleteMany({});
    await BloodRequest.deleteMany({});
    await DonorResponse.deleteMany({});
    console.log("✅ Cleared existing data");

    // Create users with hashed passwords
    console.log("👤 Creating users...");
    const createdUsers = [];

    for (const userData of dummyUsers) {
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userData.password, salt);

      // Calculate response ratio
      const total = userData.completedRequests + userData.missedRequests;
      const responseRatio = total > 0 ? (userData.completedRequests / total) * 100 : 0;

      const user = new User({
        ...userData,
        password: hashedPassword,
        responseRatio,
      });

      await user.save();
      createdUsers.push(user);
      console.log(`   ✅ Created user: ${userData.username}`);
    }

    // Create blood requests
    console.log("🩸 Creating blood requests...");
    const requesterUser = createdUsers.find((u) => u.username === "requester1");

    for (const requestData of dummyBloodRequests) {
      const expiresAt = BloodRequest.calculateExpiry(requestData.urgency);

      // Find requester user if exists
      const requester = createdUsers.find(
        (u) => u.email === requestData.requesterEmail
      );

      const request = new BloodRequest({
        ...requestData,
        requester: requester ? requester._id : requesterUser._id,
        expiresAt,
        notifiedDonors: Math.floor(Math.random() * 10) + 5,
      });

      await request.save();
      console.log(`   ✅ Created request for: ${requestData.patientName}`);
    }

    console.log("\n========================================");
    console.log("🎉 DATABASE SEEDED SUCCESSFULLY!");
    console.log("========================================\n");

    console.log("📋 TEST CREDENTIALS:");
    console.log("----------------------------------------");
    console.log("| Username     | Password     | Role      |");
    console.log("----------------------------------------");
    console.log("| testuser     | test123      | Test User |");
    console.log("| admin        | admin123     | Admin     |");
    console.log("| donor1       | password123  | Donor     |");
    console.log("| donor2       | password123  | Donor     |");
    console.log("| donor3       | password123  | Donor     |");
    console.log("| donor4       | password123  | Donor     |");
    console.log("| donor5       | password123  | Donor     |");
    console.log("| donor6       | password123  | Donor     |");
    console.log("| donor7       | password123  | Donor     |");
    console.log("| requester1   | password123  | Requester |");
    console.log("----------------------------------------\n");

    console.log("📍 Users by Location:");
    console.log("  - Dhaka: donor1, donor2, donor5, requester1, testuser, admin");
    console.log("  - Gazipur: donor3");
    console.log("  - Chittagong: donor4");
    console.log("  - Rajshahi: donor6");
    console.log("  - Khulna: donor7\n");

    console.log("🩸 Users by Blood Type:");
    console.log("  - A+: donor1");
    console.log("  - A-: donor6");
    console.log("  - B+: donor3");
    console.log("  - B-: donor7");
    console.log("  - O+: donor5, testuser");
    console.log("  - O-: donor2, admin");
    console.log("  - AB+: donor4");
    console.log("  - AB-: requester1\n");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
}

// Run the seed function
seedDatabase();
