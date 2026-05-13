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

const { protect } = require("../middleware/authMiddleware");

// auth
router.post("/register", registerUser);
router.post("/login", loginUser);

// reset
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

// otp
router.post("/send-otp", sendOTP);
router.post("/verify-otp", verifyOTP);

// delete
router.delete("/delete", protect, deleteAccount);

module.exports = router;