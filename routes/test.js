const express = require("express");
const router = express.Router();

router.post("/test-fcm", async (req, res) => {
  try {
    const admin = require("../config/firebase"); // 🔥 INSIDE FUNCTION

    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Token required",
      });
    }

    const response = await admin.messaging().send({
      token,
      notification: {
        title: "🔥 Test",
        body: "Firebase working fine",
      },
    });

    return res.json({
      success: true,
      message: "Notification sent",
      response,
    });

  } catch (error) {
    console.log("FCM ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;