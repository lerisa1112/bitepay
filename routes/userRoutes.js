const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const { getMyProfile } = require("../controllers/userController");

const User = require("../models/User");

// ======================
// GET PROFILE
// ======================
router.get("/me", protect, getMyProfile);

// ======================
// UPDATE FCM TOKEN
// ======================
router.post("/update-token", async (req, res) => {
  try {
    const { userId, fcmToken } = req.body;

    if (!userId || !fcmToken) {
      return res.status(400).json({
        success: false,
        message: "Missing data",
      });
    }

    await User.findByIdAndUpdate(userId, { fcmToken });

    return res.json({
      success: true,
      message: "Token saved",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;