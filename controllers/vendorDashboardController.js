// ===============================
// controllers/vendorDashboardController.js
// ===============================

const Order = require("../models/Order");

// ===============================
// GET DASHBOARD DATA
// ===============================

const getVendorDashboard = async (
  req,
  res
) => {

  try {

    // ===============================
    // TOTAL REVENUE
    // ===============================

    const totalRevenueData =
      await Order.aggregate([

        {

          $match: {

            vendor: req.user._id,

            orderStatus: "Completed",

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
      totalRevenueData.length > 0
        ? totalRevenueData[0]
            .totalRevenue
        : 0;

    // ===============================
    // TOTAL COMPLETED ORDERS
    // ===============================

    const completedOrders =
      await Order.countDocuments({

        vendor: req.user._id,

        orderStatus: "Completed",

      });

    // ===============================
    // RECENT TRANSACTIONS
    // ===============================

    const recentTransactions =
      await Order.find({

        vendor: req.user._id,

      })

      .select(

        "orderId totalAmount paymentMethod orderStatus createdAt"

      )

      .sort({

        createdAt: -1,

      })

      .limit(5);

    // ===============================
    // RESPONSE
    // ===============================

    res.json({

      success: true,

      totalRevenue,

      completedOrders,

      recentTransactions,

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      message: error.message,

    });

  }

};

module.exports = {

  getVendorDashboard,

};