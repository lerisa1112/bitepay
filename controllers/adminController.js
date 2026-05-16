const User = require("../models/User");
const Order = require("../models/Order");
const Wallet = require("../models/Wallet");
const Notification = require("../models/Notification");

// ==========================
// DASHBOARD DATA
// ==========================
const getDashboardData = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: "user" });

    const activeVendors = await User.countDocuments({
      role: "vendor",
      isApproved: true,
    });

    const pendingVendors = await User.countDocuments({
      role: "vendor",
      isApproved: false,
    });

    const totalOrders = await Order.countDocuments();

    const revenueData = await Order.find({ paymentStatus: "Paid" });

    let totalRevenue = 0;
    revenueData.forEach((order) => {
      totalRevenue += order.totalAmount || 0;
    });

    const wallets = await Wallet.find();

    let walletBalance = 0;
    wallets.forEach((wallet) => {
      walletBalance += wallet.balance || 0;
    });

    res.json({
      totalUsers,
      activeVendors,
      pendingVendors,
      totalOrders,
      totalRevenue,
      walletBalance,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==========================
// USERS
// ==========================
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: "user" }).select("-password");

    const result = await Promise.all(
      users.map(async (user) => {
        const orderCount = await Order.countDocuments({
          user: user._id,
        });

        return {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          isActiveCustomer: orderCount > 0,
          totalOrders: orderCount,
        };
      })
    );

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==========================
// GET ALL VENDORS  ⭐ ADD FIX
// ==========================
const getAllVendors = async (req, res) => {
  try {
    const vendors = await User.find({ role: "vendor" }).select("-password");
    res.json(vendors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==========================
// PENDING VENDORS
// ==========================
const getPendingVendors = async (req, res) => {
  try {
    const vendors = await User.find({
      role: "vendor",
      isApproved: false,
    }).select("-password");

    res.json(vendors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==========================
// APPROVED VENDORS
// ==========================
const getApprovedVendors = async (req, res) => {
  try {
    const vendors = await User.find({
      role: "vendor",
      isApproved: true,
    }).select("-password");

    res.json(vendors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==========================
// APPROVE VENDOR
// ==========================
const approveVendor = async (req, res) => {
  try {
    const vendor = await User.findById(req.params.id);

    if (!vendor)
      return res.status(404).json({ message: "Vendor not found" });

    vendor.isApproved = true;
    vendor.vendorStatus = "Approved";

    await vendor.save();

    await Notification.create({
      user: vendor._id,
      title: "Vendor Approved",
      message: "Approved by admin",
      type: "admin",
    });

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==========================
// REJECT VENDOR
// ==========================
const rejectVendor = async (req, res) => {
  try {
    const vendor = await User.findById(req.params.id);

    if (!vendor)
      return res.status(404).json({ message: "Vendor not found" });

    vendor.isApproved = false;
    vendor.vendorStatus = "Rejected";

    await vendor.save();

    await Notification.create({
      user: vendor._id,
      title: "Vendor Rejected",
      message: "Rejected by admin",
      type: "admin",
    });

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==========================
// ORDERS
// ==========================
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("vendor", "name email");

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==========================
// WALLETS
// ==========================
const getAllWallets = async (req, res) => {
  try {
    const wallets = await Wallet.find().populate("user", "name email");
    res.json(wallets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==========================
// SEND MESSAGE
// ==========================
const sendAdminMessage = async (req, res) => {
  try {
    const { userId, title, message } = req.body;

    const notification = await Notification.create({
      user: userId,
      title,
      message,
      type: "admin",
    });

    res.json({ success: true, notification });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==========================
// EXPORT
// ==========================
module.exports = {
  getDashboardData,
  getAllUsers,
  getAllVendors,
  getPendingVendors,
  getApprovedVendors,
  approveVendor,
  rejectVendor,
  getAllOrders,
  getAllWallets,
  sendAdminMessage,
};