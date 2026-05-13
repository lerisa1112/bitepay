const User = require("../models/User");
const Order = require("../models/Order");
const Wallet = require("../models/Wallet");
const Notification = require("../models/Notification");

// 👥 GET ALL USERS
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

// 🛒 GET ALL ORDERS
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

// 💰 GET ALL WALLETS
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

// 🏪 APPROVE VENDOR
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

    // 🔔 notification
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

// 📢 SEND ADMIN MESSAGE
const sendAdminMessage = async (
  req,
  res
) => {
  try {
    const { userId, title, message } =
      req.body;

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
  getAllUsers,
  getAllOrders,
  getAllWallets,
  approveVendor,
  sendAdminMessage,
};