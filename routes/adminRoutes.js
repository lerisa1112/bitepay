// ===============================
// routes/authRoutes.js
// FULL CODE
// ===============================

const express = require("express");

const router = express.Router();

const {

  registerUser,
  loginUser,

  forgotPassword,
  resetPassword,

  sendOTP,
  verifyOTP,

  deleteAccount,

} = require("../controllers/authController");

const {
  protect,
} = require("../middleware/authMiddleware");

// ===============================
// REGISTER
// ===============================

router.post(
  "/register",
  registerUser
);

// ===============================
// LOGIN
// ===============================

router.post(
  "/login",
  loginUser
);

// ===============================
// FORGOT PASSWORD LINK
// ===============================

router.post(
  "/forgot-password",
  forgotPassword
);

// ===============================
// RESET PASSWORD USING TOKEN
// ===============================

router.post(
  "/reset-password/:token",
  resetPassword
);

// ===============================
// SEND OTP
// ===============================

router.post(
  "/send-otp",
  sendOTP
);

// ===============================
// VERIFY OTP + RESET PASSWORD
// ===============================

router.post(
  "/verify-otp",
  verifyOTP
);

// ===============================
// DELETE ACCOUNT
// ===============================

router.delete(
  "/delete-account",
  protect,
  deleteAccount
);

module.exports = router;