const Order = require("../models/Order");
const User = require("../models/User");

// 📊 SALES GRAPH
const getSalesGraph = async (req, res) => {
  try {
    const sales = await Order.aggregate([
      { $match: { paymentStatus: "Paid" } },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt",
            },
          },
          totalSales: { $sum: "$totalAmount" },
          totalOrders: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json(sales);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🏪 TOP VENDORS
const getTopVendors = async (req, res) => {
  try {
    const vendors = await Order.aggregate([
      {
        $group: {
          _id: "$vendor",
          totalSales: { $sum: "$totalAmount" },
          totalOrders: { $sum: 1 },
        },
      },
      { $sort: { totalSales: -1 } },
      { $limit: 5 },
    ]);

    res.json(vendors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ⏰ PEAK HOURS
const getPeakHours = async (req, res) => {
  try {
    const data = await Order.aggregate([
      {
        $group: {
          _id: { $hour: "$createdAt" },
          totalOrders: { $sum: 1 },
        },
      },
      { $sort: { totalOrders: -1 } },
    ]);

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 📦 DASHBOARD STATS
const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();

    const totalOrders = await Order.countDocuments();

    const revenue = await Order.aggregate([
      { $match: { paymentStatus: "Paid" } },
      {
        $group: {
          _id: null,
          revenue: { $sum: "$totalAmount" },
        },
      },
    ]);

    res.json({
      totalUsers,
      totalOrders,
      totalRevenue: revenue[0]?.revenue || 0,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 📤 EXPORT
module.exports = {
  getSalesGraph,
  getTopVendors,
  getPeakHours,
  getDashboardStats,
};