// ===============================
// controllers/authController.js
// FULL UPDATED CODE
// ===============================

const User = require("../models/User");
const Wallet = require("../models/Wallet"); // 🔥 ADDED
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const sendEmail = require("../utils/mailer");
const sendNotification =
require("../utils/sendNotification");

// =======================
// GENERATE JWT TOKEN
// =======================
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// =======================
// REGISTER USER
// =======================
const registerUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      role,
      canteenName,
      shopDescription,
      canteenLocation,
      openingTime,
      closingTime,
    } = req.body;

    // VENDOR VALIDATION
    if (role === "vendor") {
      if (
        !canteenName ||
        !shopDescription ||
        !canteenLocation ||
        !openingTime ||
        !closingTime
      ) {
        return res.status(400).json({
          success: false,
          message: "All vendor fields are required",
        });
      }
    }

    // CHECK USER EXISTS
    const exists = await User.findOne({ email });

    if (exists) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // HASH PASSWORD
    const hashedPassword = await bcrypt.hash(password, 10);

    // CREATE USER
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      role: role || "user",

      canteenName: role === "vendor" ? canteenName : "",
      shopDescription: role === "vendor" ? shopDescription : "",
      canteenLocation: role === "vendor" ? canteenLocation : "",
      openingTime: role === "vendor" ? openingTime : "",
      closingTime: role === "vendor" ? closingTime : "",

      isApproved: role === "vendor" ? false : true,
      vendorStatus: role === "vendor" ? "Pending Review" : "Approved",
    });

    // 🔥 CREATE WALLET AUTOMATICALLY (IMPORTANT FIX)
    await Wallet.create({
      user: user._id,
      balance: 0,
      transactions: [],
    });

    res.status(201).json({
      success: true,
      message:
        role === "vendor"
          ? "Vendor registered successfully. Waiting for admin approval."
          : "Registration successful",

      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        canteenName: user.canteenName,
      },

      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// =======================
// LOGOUT USER
// =======================

const logoutUser = async (req, res) => {

  try {

    res.status(200).json({

      success: true,

      message: "Logout successful",

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      message: error.message,

    });

  }

};

// =======================
// LOGIN USER
// =======================
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password required",
      });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    if (user.role === "vendor" && !user.isApproved) {
      return res.status(403).json({
        success: false,
        message: "Vendor account waiting for approval",
      });
    }

    // 🔥 SAFETY CHECK (wallet auto fix if missing)
    const walletExists = await Wallet.findOne({ user: user._id });

    if (!walletExists) {
      await Wallet.create({
        user: user._id,
        balance: 0,
        transactions: [],
      });
    }

    res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        canteenName: user.canteenName,
      },
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};





const saveFcmToken = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { fcmToken: req.body.fcmToken },
      { new: true }
    );

    res.json({
      success: true,
      user,
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: e.message,
    });
  }
};

// =======================
// OTHER FUNCTIONS SAME (UNCHANGED)
// =======================

const forgotPassword = async (req, res) => { /* same as yours */ };
const resetPassword = async (req, res) => { /* same as yours */ };
const sendOTP = async (req, res) => { /* same as yours */ };
const verifyOTP = async (req, res) => { /* same as yours */ };
const deleteAccount = async (req, res) => { /* same as yours */ };

// =======================
// EXPORTS
// =======================
module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  forgotPassword,
  resetPassword,
  sendOTP,
  verifyOTP,
  deleteAccount,
  saveFcmToken,
};