const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    // ======================
    // BASIC INFO
    // ======================
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
      select: false, // 🔥 auto-hide password
    },

    phone: {
      type: String,
      required: true,
    },

    // ======================
    // ROLE
    // ======================
    role: {
      type: String,
      enum: ["user", "vendor", "admin"],
      default: "user",
    },

    // ======================
    // FCM TOKEN
    // ======================
    fcmToken: {
      type: String,
      default: null,
    },

    // ======================
    // VENDOR DETAILS
    // ======================
    canteenName: {
      type: String,
      default: "",
    },

    shopDescription: {
      type: String,
      default: "",
    },

    canteenLocation: {
      type: String,
      default: "",
    },

    openingTime: {
      type: String,
      default: "",
    },

    closingTime: {
      type: String,
      default: "",
    },

    vendorStatus: {
      type: String,
      enum: ["Pending Review", "Approved", "Rejected"],
      default: "Pending Review",
    },

    isApproved: {
      type: Boolean,
      default: false,
    },

    isOpen: {
      type: Boolean,
      default: true,
    },

    // ======================
    // RESET PASSWORD
    // ======================
    resetToken: {
      type: String,
      default: "",
    },

    resetTokenExpire: {
      type: Date,
    },

    // ======================
    // OTP RESET
    // ======================
    resetOTP: {
      type: String,
      default: "",
    },

    otpExpire: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);