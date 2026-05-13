const User = require("../models/User");
const Order = require("../models/Order");
const Wallet = require("../models/Wallet");

//
// 🚀 GET ADMIN DASHBOARD
//
const getDashboardData = async (req, res) => {
  try {

    // 👥 TOTAL USERS
    const totalUsers = await User.countDocuments({
      role: "user",
    });

    // 🏪 ACTIVE VENDORS
    const activeVendors = await User.countDocuments({
      role: "vendor",
      isApproved: true,
    });

    // ⏳ PENDING VENDORS
    const pendingVendors = await User.countDocuments({
      role: "vendor",
      isApproved: false,
    });

    // 🛒 TOTAL ORDERS
    const totalOrders = await Order.countDocuments();

    // 📅 TODAY DATE
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 👤 NEW USERS TODAY
    const newUsersToday = await User.countDocuments({
      createdAt: { $gte: today },
    });

    // 📦 ORDERS TODAY
    const ordersToday = await Order.countDocuments({
      createdAt: { $gte: today },
    });

    // 💰 TOTAL REVENUE
    const revenueResult = await Order.aggregate([
      {
        $match: {
          paymentStatus: "Paid",
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: {
            $sum: "$totalAmount",
          },
        },
      },
    ]);

    const totalRevenue =
      revenueResult.length > 0
        ? revenueResult[0].totalRevenue
        : 0;

    // 👛 TOTAL WALLET BALANCE
    const walletResult = await Wallet.aggregate([
      {
        $group: {
          _id: null,
          totalWallet: {
            $sum: "$balance",
          },
        },
      },
    ]);

    const walletBalance =
      walletResult.length > 0
        ? walletResult[0].totalWallet
        : 0;

    // 📈 SALES OVERVIEW
    const salesOverview = await Order.aggregate([
      {
        $match: {
          paymentStatus: "Paid",
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt",
            },
          },
          sales: {
            $sum: "$totalAmount",
          },
        },
      },
      {
        $sort: {
          _id: 1,
        },
      },
    ]);

    // 🕒 RECENT ORDERS
    const recentOrders = await Order.find()
      .populate("user", "name")
      .sort({ createdAt: -1 })
      .limit(10);

    // ✅ FINAL RESPONSE
    res.json({
      totalUsers,
      activeVendors,
      pendingVendors,
      totalOrders,
      totalRevenue,
      walletBalance,
      newUsersToday,
      ordersToday,
      salesOverview,
      recentOrders,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getDashboardData,
};