const User = require("../models/User");
const Order = require("../models/Order");
const Wallet = require("../models/Wallet");
const Notification = require("../models/Notification");

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

    const today = new Date();

    today.setHours(0, 0, 0, 0);

    const newUsersToday =
        await User.countDocuments({

      createdAt: {
        $gte: today,
      },

    });

    const ordersToday =
        await Order.countDocuments({

      createdAt: {
        $gte: today,
      },

    });

    const salesOverview =
        await Order.aggregate([

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

    const recentOrders =
        await Order.find()

      .populate(
        "user",
        "name"
      )

      .sort({
        createdAt: -1,
      })

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

// ==========================
// GET ALL USERS
// ==========================

const getAllUsers = async (req, res) => {
  try {

    const users = await User.find({
      role: "user",
    }).select("-password");

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
    res.status(500).json({
      message: error.message,
    });
  }
};



const getAllVendors = async (req, res) => {
  try {

    const vendors = await User.find({
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
// GET PENDING VENDORS
// ==========================

const getPendingVendors =
    async (req, res) => {

  try {

    const vendors =
        await User.find({

      role: "vendor",

      isApproved: false,

    }).select("-password");

    res.json({

      success: true,

      vendors,

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      message: error.message,

    });

  }

};

// ==========================
// GET ALL ORDERS
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
        "name email"
      )

      .populate(
        "vendor",
        "name email"
      );

    res.json(orders);

  } catch (error) {

    res.status(500).json({

      message: error.message,

    });

  }

};

// ==========================
// GET ALL WALLETS
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
        "name email"
      );

    res.json(wallets);

  } catch (error) {

    res.status(500).json({

      message: error.message,

    });

  }

};

// ==========================
// APPROVE VENDOR
// ==========================

const approveVendor =
    async (req, res) => {

  try {

    const vendor =
        await User.findById(
          req.params.id
        );

    if (!vendor) {

      return res.status(404).json({

        success: false,

        message:
            "Vendor not found",

      });

    }

    vendor.isApproved = true;

    vendor.vendorStatus =
        "Approved";

    await vendor.save();

    // NOTIFICATION

    await Notification.create({

      user: vendor._id,

      title:
          "Vendor Approved",

      message:
          "Your vendor account has been approved by admin.",

      type: "admin",

    });

    res.json({

      success: true,

      message:
          "Vendor approved successfully",

      vendor,

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      message: error.message,

    });

  }

};

// ==========================
// REJECT VENDOR
// ==========================

const rejectVendor =
    async (req, res) => {

  try {

    const vendor =
        await User.findById(
          req.params.id
        );

    if (!vendor) {

      return res.status(404).json({

        success: false,

        message:
            "Vendor not found",

      });

    }

    vendor.isApproved = false;

    vendor.vendorStatus =
        "Rejected";

    await vendor.save();

    await Notification.create({

      user: vendor._id,

      title:
          "Vendor Rejected",

      message:
          "Your vendor request was rejected by admin.",

      type: "admin",

    });

    res.json({

      success: true,

      message:
          "Vendor rejected successfully",

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      message: error.message,

    });

  }

};

// ==========================
// SEND ADMIN MESSAGE
// ==========================

const sendAdminMessage =
    async (req, res) => {

  try {

    const {

      userId,

      title,

      message,

    } = req.body;

    const notification =
        await Notification.create({

      user: userId,

      title,

      message,

      type: "admin",

    });

    res.json({

      success: true,

      message:
          "Admin notification sent successfully",

      notification,

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      message: error.message,

    });

  }

};

module.exports = {

  getDashboardData,

  getAllUsers,

  getAllVendors,

  getPendingVendors,

  getAllOrders,

  getAllWallets,

  approveVendor,

  rejectVendor,

  sendAdminMessage,

};