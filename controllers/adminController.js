const User = require("../models/User");
const Order = require("../models/Order");
const Wallet = require("../models/Wallet");
const Notification = require("../models/Notification");

//
// ==========================
// DASHBOARD DATA
// ==========================
const getDashboardData = async (req, res) => {

  try {

    // TOTAL USERS
    const totalUsers = await User.countDocuments({
      role: "user",
    });

    // ACTIVE VENDORS
    const activeVendors = await User.countDocuments({
      role: "vendor",
      isApproved: true,
    });

    // PENDING VENDORS
    const pendingVendors = await User.countDocuments({
      role: "vendor",
      isApproved: false,
    });

    // TOTAL ORDERS
    const totalOrders = await Order.countDocuments();

    // TOTAL REVENUE
    const revenueData = await Order.find({
      paymentStatus: "Paid",
    });

    let totalRevenue = 0;

    revenueData.forEach((order) => {
      totalRevenue += order.totalAmount || 0;
    });

    // WALLET BALANCE
    const wallets = await Wallet.find();

    let walletBalance = 0;

    wallets.forEach((wallet) => {
      walletBalance += wallet.balance || 0;
    });

    // TODAY USERS
    const today = new Date();

    today.setHours(0, 0, 0, 0);

    const newUsersToday =
      await User.countDocuments({
        createdAt: { $gte: today },
      });

    // TODAY ORDERS
    const ordersToday =
      await Order.countDocuments({
        createdAt: { $gte: today },
      });

    // SALES OVERVIEW
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

    // RECENT ORDERS
    const recentOrders = await Order.find()
      .populate("user", "name")
      .sort({ createdAt: -1 })
      .limit(5);

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

//
// ==========================
// GET ALL USERS
// ==========================
const getAllUsers = async (req, res) => {

  try {

    const users = await User.find().select(
      "-password"
    );

    res.json(users);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }

};

//
// ==========================
// GET ALL ORDERS
// ==========================
const getAllOrders = async (req, res) => {

  try {

    const orders = await Order.find()
      .populate("user", "name email")
      .populate("vendor", "name email");

    res.json(orders);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }

};

//
// ==========================
// GET ALL WALLETS
// ==========================
const getAllWallets = async (req, res) => {

  try {

    const wallets = await Wallet.find()
      .populate("user", "name email");

    res.json(wallets);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }

};

//
// ==========================
// APPROVE VENDOR
// ==========================
const approveVendor = async (req, res) => {

  try {

    const vendor = await User.findById(
      req.params.id
    );

    if (!vendor) {

      return res.status(404).json({
        message: "Vendor not found",
      });

    }

    vendor.isApproved = true;

    await vendor.save();

    // NOTIFICATION
    await Notification.create({
      user: vendor._id,
      title: "Vendor Approved",
      message:
        "Your vendor account has been approved by admin.",
      type: "admin",
    });

    res.json({
      message:
        "Vendor approved successfully",
      vendor,
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }

};

//
// ==========================
// SEND ADMIN MESSAGE
// ==========================
const sendAdminMessage = async (
  req,
  res
) => {

  try {

    const {
      userId,
      title,
      message
    } = req.body;

    const notification =
      await Notification.create({
        user: userId,
        title,
        message,
        type: "admin",
      });

    res.json({
      message:
        "Admin notification sent successfully",
      notification,
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }

};

module.exports = {
  getDashboardData,
  getAllUsers,
  getAllOrders,
  getAllWallets,
  approveVendor,
  sendAdminMessage,
};