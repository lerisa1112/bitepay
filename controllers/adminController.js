const User = require("../models/User");
const Order = require("../models/Order");
const Wallet = require("../models/Wallet");
const Notification = require("../models/Notification");

const sendPushNotification = require("../utils/sendPushNotification");

const sendVendorApprovalMail = require("../utils/sendVendorApprovalMail");

const sendVendorRejectMail = require("../utils/sendVendorRejectMail");



// ==========================
// DASHBOARD DATA
// ==========================
const getDashboardData = async (
  req,
  res
) => {

  try {

    const totalUsers =
        await User.countDocuments({
      role: "user",
    });

    const activeVendors =
        await User.countDocuments({

      role: "vendor",

      isApproved: true,

    });

    const pendingVendors =
        await User.countDocuments({

      role: "vendor",

      isApproved: false,

    });

    const totalOrders =
        await Order.countDocuments();

    const revenueData =
        await Order.find({
      paymentStatus: "Paid",
    });

    let totalRevenue = 0;

    revenueData.forEach((order) => {

      totalRevenue +=
          order.totalAmount || 0;

    });

    const wallets =
        await Wallet.find();

    let walletBalance = 0;

    wallets.forEach((wallet) => {

      walletBalance +=
          wallet.balance || 0;

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

    res.status(500).json({
      message: error.message,
    });

  }

};

// ==========================
// USERS
// ==========================
const getAllUsers = async (
  req,
  res
) => {

  try {

    const users =
        await User.find({
      role: "user",
    }).select("-password");

    const result =
        await Promise.all(

      users.map(async (user) => {

        const orderCount =
            await Order.countDocuments({
          user: user._id,
        });

        return {

          _id: user._id,

          name: user.name,

          email: user.email,

          role: user.role,

          phone: user.phone,

          isActiveCustomer:
              orderCount > 0,

          totalOrders:
              orderCount,

        };

      }),

    );

    res.json(result);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }

};

// ==========================
// GET ALL VENDORS
// ==========================
const getAllVendors = async (
  req,
  res
) => {

  try {

    const vendors =
        await User.find({
      role: "vendor",
    }).select("-password");

    res.json(vendors);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }

};

// ==========================
// PENDING VENDORS
// ==========================
const getPendingVendors =
    async (req, res) => {

  try {

    const vendors =
        await User.find({

      role: "vendor",

      isApproved: false,

    }).select("-password");

    res.json(vendors);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }

};

// ==========================
// APPROVED VENDORS
// ==========================
const getApprovedVendors =
    async (req, res) => {

  try {

    const vendors =
        await User.find({

      role: "vendor",

      isApproved: true,

    }).select("-password");

    res.json(vendors);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }

};

// ==========================
// APPROVE VENDOR
// ==========================



// ==========================
// APPROVE VENDOR
// ==========================
const approveVendor = async (req, res) => {
  try {
    const vendorId = req.params.id;

    const vendor = await User.findById(vendorId);

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }

    // ======================
    // UPDATE STATUS
    // ======================
    vendor.isApproved = true;
    vendor.vendorStatus = "Approved";

    await vendor.save();

    // ======================
    // SAVE NOTIFICATION (DB)
    // ======================
    await Notification.create({
      user: vendor._id,
      title: "Vendor Approved",
      message: "Your vendor account has been approved by admin",
      type: "admin",
    });

    // ======================
    // PUSH NOTIFICATION (FCM)
    // ======================
    if (vendor.fcmToken) {
      await sendPushNotification({
        token: vendor.fcmToken,
        title: "🎉 Vendor Approved",
        body: "Your canteen account has been approved by admin",
      });
    }

    // ======================
    // EMAIL
    // ======================
    if (sendVendorApprovalMail) {
      await sendVendorApprovalMail(vendor.email, vendor.name);
    }

    return res.json({
      success: true,
      message: "Vendor approved successfully",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ==========================
// REJECT VENDOR
// ==========================
const rejectVendor = async (req, res) => {
  try {
    const vendorId = req.params.id;

    const vendor = await User.findById(vendorId);

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }

    // ======================
    // UPDATE STATUS
    // ======================
    vendor.isApproved = false;
    vendor.vendorStatus = "Rejected";

    await vendor.save();

    // ======================
    // SAVE NOTIFICATION (DB)
    // ======================
    await Notification.create({
      user: vendor._id,
      title: "Vendor Rejected",
      message: "Your vendor request was rejected by admin",
      type: "admin",
    });

    // ======================
    // PUSH NOTIFICATION (FCM)
    // ======================
    if (vendor.fcmToken) {
      await sendPushNotification({
        token: vendor.fcmToken,
        title: "❌ Vendor Rejected",
        body: "Your canteen request was rejected by admin",
      });
    }

    // ======================
    // EMAIL
    // ======================
    if (sendVendorRejectMail) {
      await sendVendorRejectMail(vendor.email, vendor.name);
    }

    return res.json({
      success: true,
      message: "Vendor rejected successfully",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};




// ==========================
// ALL ORDERS
// ==========================
const getAllOrders = async (
  req,
  res
) => {

  try {

    const orders =
        await Order.find()

      .populate(
        "user",
        "name email",
      )

      .populate(
        "vendor",
        "name email",
      );

    res.json(orders);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }

};

// ==========================
// ALL WALLETS
// ==========================
const getAllWallets = async (
  req,
  res
) => {

  try {

    const wallets =
        await Wallet.find()

      .populate(
        "user",
        "name email",
      );

    res.json(wallets);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }

};

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
      message,
    } = req.body;

    const user =
        await User.findById(
      userId,
    );

    const notification =
        await Notification.create({

      user: userId,

      title,

      message,

      type: "admin",

    });

    // ======================
    // PUSH NOTIFICATION
    // ======================

    if (user?.fcmToken) {

      await sendPushNotification({

        token: user.fcmToken,

        title,

        body: message,

      });

    }

    res.json({

      success: true,

      notification,

    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

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