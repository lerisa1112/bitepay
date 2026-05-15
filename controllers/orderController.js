const Order = require("../models/Order");
const Wallet = require("../models/Wallet");
const User = require("../models/User");

const sendOrderConfirmation = require("../utils/orderEmail");
const generateQR = require("../utils/qr");

// ===============================
// PLACE ORDER
// ===============================
const placeOrder = async (req, res) => {
  try {
    const io = req.app.get("io");
    const userSocketMap = req.app.get("userSocketMap");

    const {
      vendor,
      items,
      totalAmount,
      pickupTime,
      pickupSlotId,
    } = req.body;

    // WALLET CHECK
    const wallet = await Wallet.findOne({ user: req.user._id });

    if (!wallet) {
      return res.status(404).json({
        success: false,
        message: "Wallet not found",
      });
    }

    if (wallet.balance < totalAmount) {
      return res.status(400).json({
        success: false,
        message: "Insufficient wallet balance",
      });
    }

    // GET VENDOR NAME
    const vendorUser = await User.findById(vendor);

    // DEDUCT MONEY
    wallet.balance -= totalAmount;

    wallet.transactions.push({
      type: "debit",
      amount: totalAmount,
      note: "Food Order Payment",
      canteenName: vendor, 
      createdAt: new Date(),
    });

    await wallet.save();

    // CREATE ORDER ID AUTO
    const orderId = "ORD-" + Date.now();

    // CREATE ORDER
    const order = await Order.create({
      orderId,
      user: req.user._id,
      vendor,
      items,
      totalAmount,
      pickupTime,
      pickupSlot: pickupSlotId,
      paymentMethod: "Wallet",
      orderStatus: "Pending",
    });

    // QR GENERATE
    const qr = await generateQR({
      orderId: order._id,
      user: req.user._id,
      pickupTime,
    });

    order.qrCode = qr;
    await order.save();

    // ===============================
    // 🔥 VENDOR NOTIFICATION
    // ===============================
    const vendorSocket = userSocketMap.get(vendor?.toString());

    if (vendorSocket && io) {
      io.to(vendorSocket).emit("new_order", {
        orderId: order.orderId,
        items: order.items,
        totalAmount: order.totalAmount,
        pickupTime: order.pickupTime,
      });
    }

    // EMAIL
    try {
      await sendOrderConfirmation(req.user, order);
    } catch (err) {
      console.log("Email error:", err.message);
    }

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order,
      qrCode: qr,
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
      .populate("user", "name email phone")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      totalOrders: orders.length,
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
// ACCEPT ORDER (USER NOTIFY)
// ===============================
const acceptOrder = async (req, res) => {
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

    order.orderStatus = "Preparing";
    await order.save();

    const userSocket = userSocketMap.get(order.user?.toString());

    if (userSocket && io) {
      io.to(userSocket).emit("order_accepted", {
        orderId: order.orderId,
        message: "🎉 Order accepted by vendor",
        status: "Preparing",
      });
    }

    res.json({
      success: true,
      message: "Order accepted successfully",
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

    const userSocket = userSocketMap.get(order.user?.toString());

    if (userSocket && io) {
      io.to(userSocket).emit("order_ready", {
        orderId: order.orderId,
        message: "🔥 Order is ready for pickup",
        pickupTime: order.pickupTime,
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
};