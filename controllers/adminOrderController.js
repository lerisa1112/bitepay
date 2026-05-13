const Order = require("../models/Order");

//
// 🚀 GET ALL ORDERS + STATS
//
const getOrdersData = async (req, res) => {
  try {

    // 📦 TOTAL ORDERS
    const totalOrders = await Order.countDocuments();

    // ✅ DELIVERED ORDERS
    const delivered = await Order.countDocuments({
      status: "Completed",
    });

    // ⏳ PENDING ORDERS
    const pending = await Order.countDocuments({
      status: {
        $in: ["Placed", "Accepted", "Preparing", "Ready"],
      },
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

    const revenue =
      revenueResult.length > 0
        ? revenueResult[0].totalRevenue
        : 0;

    // 📋 ORDER LIST
    const orders = await Order.find()
      .populate("user", "name")
      .sort({ createdAt: -1 });

    // ✅ FINAL RESPONSE
    res.json({
      totalOrders,
      delivered,
      pending,
      revenue,
      orders,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getOrdersData,
};