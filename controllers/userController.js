const User = require("../models/User");

// ===============================
// GET USER PROFILE
// ===============================
const getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


const updateFcmToken = async (req, res) => {
  try {
    const { userId, fcmToken } = req.body;

    if (!userId || !fcmToken) {
      return res.status(400).json({
        message: "userId and fcmToken required",
      });
    }

    await User.findByIdAndUpdate(userId, {
      fcmToken: fcmToken,
    });

    res.json({
      success: true,
      message: "FCM token updated",
    });

  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

module.exports = {
  getMyProfile,
  updateFcmToken,
};