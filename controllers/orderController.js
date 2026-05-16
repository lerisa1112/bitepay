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

    const wallet = await Wallet.findOne({ user: req.user._id });

    if (!wallet) {
      return res.status(404).json({ success: false, message: "Wallet not found" });
    }

    if (wallet.balance < totalAmount) {
      return res.status(400).json({ success: false, message: "Insufficient balance" });
    }

    wallet.balance -= totalAmount;

    wallet.transactions.push({
      type: "debit",
      amount: totalAmount,
      note: "Food Order Payment",
      canteenName: vendor,
      createdAt: new Date(),
    });

    await wallet.save();

    const order = await Order.create({
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

    const qr = await generateQR({
      orderId: order._id,
      user: req.user._id,
      pickupTime,
    });

    order.qrCode = qr;
    await order.save();

    // ✅ USER NOTIFICATION
    await Notification.create({
      user: req.user._id,
      title: "Order Placed",
      message: `Order ${order.orderId} placed successfully`,
      type: "order",
      role: "user",
    });

    // ✅ ADMIN NOTIFICATION (FIXED)
    await Notification.create({
      user: null,
      title: "New Order",
      message: `Order ${order.orderId} received`,
      type: "admin",
      role: "admin",
    });

    const vendorSocket = userSocketMap.get(vendor?.toString());

    if (vendorSocket && io) {
      io.to(vendorSocket).emit("new_order", order);
    }

    res.json({ success: true, order, qrCode: qr });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
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
};