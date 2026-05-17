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
        message: "userId or fcmToken missing",
      });
    }

    await User.findByIdAndUpdate(userId, {
      fcmToken: fcmToken,
    });

    res.json({
      success: true,
      message: "FCM token saved successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;