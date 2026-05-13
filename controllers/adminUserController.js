const User = require("../models/User");

// 🚀 GET ALL USERS + STATS
const getUsersData = async (req, res) => {
  try {

    // 👥 TOTAL USERS
    const totalUsers = await User.countDocuments({
      role: "user",
    });

    // ✅ ACTIVE USERS
    const activeUsers = await User.countDocuments({
      isApproved: true,
    });

    // ❌ INACTIVE USERS
    const inactiveUsers = await User.countDocuments({
      isApproved: false,
    });

    // 📋 USER LIST
    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 });

    // ✅ RESPONSE
    res.json({
      totalUsers,
      activeUsers,
      inactiveUsers,
      users,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getUsersData,
};