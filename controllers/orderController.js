const Order = require("../models/Order");
const Wallet = require("../models/Wallet");
const User = require("../models/User");
const Notification = require("../models/Notification");

const sendOrderConfirmation = require("../utils/orderEmail");
const generateQR = require("../utils/qr");

// ===============================
// PLACE ORDER
// ===============================
const placeOrder = async (req, res) => {
  try {
    const io = req.app.get("io");
    const userSocketMap = req.app.get("userSocketMap");

    const { vendor, items, totalAmount, pickupTime, pickupSlotId } = req.body;

    // =========================
    // 1. WALLET CHECK
    // =========================
    const wallet = await Wallet.findOneAndUpdate(
      {
        user: req.user._id,
        balance: { $gte: totalAmount }, // 🔥 important check
      },
      {
        $inc: { balance: -totalAmount },
        $push: {
          transactions: {
            type: "debit",
            amount: totalAmount,
            note: "Food Order Payment",
            canteenName: vendor,
            createdAt: new Date(),
          },
        },
      },
      { new: true }
    );

    if (!wallet) {
      return res.status(400).json({
        success: false,
        message: "Insufficient balance",
      });
    }

    // =========================
    // 3. CREATE ORDER
    // =========================
    let order = await Order.create({
      orderId: "ORD-" + Date.now(),
      user: req.user._id,
      vendor,
      items,
      totalAmount,
      pickupTime,
      pickupSlot: pickupSlotId,
      paymentMethod: "Wallet",
      orderStatus: "Pending",
    });

    // =========================
    // 4. POPULATE USER + VENDOR
    // =========================
    order = await Order.findById(order._id)
      .populate("user", "name email phone")
      .populate("vendor", "name canteenName");

    // =========================
    // 5. GENERATE QR
    // =========================
    const qr = await generateQR({
      orderId: order._id,
      user: req.user._id,
      pickupTime,
    });

    order.qrCode = qr;
    await order.save();

    // =========================
    // 6. NOTIFICATIONS
    // =========================

    // user notification
    await Notification.create({
      user: req.user._id,
      title: "Order Placed",
      message: `Order ${order.orderId} placed successfully`,
      type: "order",
      role: "user",
    });

    // admin notification
    await Notification.create({
      user: null,
      title: "New Order",
      message: `Order ${order.orderId} received`,
      type: "admin",
      role: "admin",
    });

    // =========================
    // 7. SOCKET EMIT (VENDOR)
    // =========================
    const vendorSocket = userSocketMap.get(vendor?.toString());

    if (vendorSocket && io) {
      io.to(vendorSocket).emit("new_order", order);
    }

    // =========================
    // 8. FINAL RESPONSE
    // =========================
    res.json({
      success: true,
      message: "Order placed successfully",
      order,
      qrCode: qr,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


const getWalletOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      user: req.user._id,
      paymentMethod: "Wallet",
    })
      .populate("vendor", "name canteenName")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      total: orders.length,
      orders,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


const getOrdersByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const orders = await Order.find({ user: userId })
      .populate("vendor", "name canteenName")
      .populate("user", "name email phone")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      total: orders.length,
      orders,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// USER ORDERS
// ===============================
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("vendor", "name canteenName")
      .sort({ createdAt: -1 });

    res.json({ success: true, orders });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// VENDOR ORDERS
// ===============================
const getVendorOrders = async (req, res) => {
  try {
    const orders = await Order.find({ vendor: req.user._id })
      .populate({
        path: "user",
        select: "name email phone",
      })
      .populate({
        path: "vendor",
        select: "name canteenName",
      })
      .lean() 
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      totalOrders: orders.length,
      orders,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// ACCEPT ORDER (USER NOTIFY)
// ===============================
const acceptOrder = async (req, res) => {
  try {
    const io = req.app.get("io");
    const userSocketMap = req.app.get("userSocketMap");

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    order.orderStatus = "Preparing";
    await order.save();

    await Notification.create({
      user: order.user,
      title: "Order Accepted",
      message: "Your order is being prepared",
      type: "order",
      role: "user",
    });

    const userSocket = userSocketMap.get(order.user?.toString());

    if (userSocket && io) {
      io.to(userSocket).emit("order_accepted", order);
    }

    res.json({ success: true, order });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ===============================
// READY ORDER
// ===============================
const markOrderReady = async (req, res) => {
  try {
    const io = req.app.get("io");
    const userSocketMap = req.app.get("userSocketMap");

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    order.orderStatus = "Ready";
    await order.save();

    // USER NOTIFICATION
    await Notification.create({
      user: order.user,
      title: "Order Ready",
      message: "Your order is ready for pickup",
      type: "order",
    });

    const userSocket = userSocketMap.get(order.user?.toString());

    if (userSocket && io) {
      io.to(userSocket).emit("order_ready", {
        orderId: order.orderId,
        message: "Order ready",
      });
    }

    res.json({
      success: true,
      message: "Order is ready",
      order,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// ===============================
// COMPLETE ORDER
// ===============================
const completeOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    order.orderStatus = "Completed";
    await order.save();

    await Notification.create({
      user: order.user,
      title: "Order Completed",
      message: "Enjoy your meal 🎉",
      type: "order",
    });

    res.json({
      success: true,
      message: "Order completed successfully",
      order,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  placeOrder,
  getMyOrders,
  getVendorOrders,
  acceptOrder,
  markOrderReady,
  completeOrder,
  getOrdersByUser,
  getWalletOrders
};