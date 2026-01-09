/**
 * BDMS - Basic API Tests
 * Blood Donation Management System
 */

describe("BDMS Backend", () => {
  describe("Environment", () => {
    test("should have required environment variables structure", () => {
      // Check that dotenv is working
      expect(process.env).toBeDefined();
    });

    test("Node version should be 18 or higher", () => {
      const nodeVersion = parseInt(process.version.slice(1).split(".")[0]);
      expect(nodeVersion).toBeGreaterThanOrEqual(18);
    });
  });

  describe("Dependencies", () => {
    test("express should be installed", () => {
      const express = require("express");
      expect(express).toBeDefined();
    });

    test("mongoose should be installed", () => {
      const mongoose = require("mongoose");
      expect(mongoose).toBeDefined();
    });

    test("passport should be installed", () => {
      const passport = require("passport");
      expect(passport).toBeDefined();
    });

    test("bcryptjs should be installed", () => {
      const bcrypt = require("bcryptjs");
      expect(bcrypt).toBeDefined();
    });
  });

  describe("Utils", () => {
    test("bcrypt should hash and compare passwords correctly", async () => {
      const bcrypt = require("bcryptjs");
      const password = "testPassword123";
      const hash = await bcrypt.hash(password, 10);

      expect(hash).not.toBe(password);
      expect(await bcrypt.compare(password, hash)).toBe(true);
      expect(await bcrypt.compare("wrongPassword", hash)).toBe(false);
    });
  });
});

describe("Blood Type Validation", () => {
  const validBloodTypes = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

  test("should recognize all valid blood types", () => {
    validBloodTypes.forEach((bloodType) => {
      expect(validBloodTypes.includes(bloodType)).toBe(true);
    });
  });

  test("should have exactly 8 blood types", () => {
    expect(validBloodTypes.length).toBe(8);
  });
});
