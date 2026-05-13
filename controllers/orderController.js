const Order = require("../models/Order");
const Wallet = require("../models/Wallet");

// 🔥 utilities (email + qr)
const sendOrderConfirmation = require("../utils/orderEmail");
const generateQR = require("../utils/qr");

// 🛒 PLACE ORDER
const placeOrder = async (req, res) => {
  try {
    const { vendor, items, totalAmount, pickupTime, pickupSlotId } =
      req.body;

    // 1️⃣ wallet check
    const wallet = await Wallet.findOne({
      user: req.user._id,
    });

    if (!wallet) {
      return res.status(404).json({
        message: "Wallet not found",
      });
    }

    if (wallet.balance < totalAmount) {
      return res.status(400).json({
        message: "Insufficient wallet balance",
      });
    }

    // 2️⃣ deduct wallet money
    wallet.balance -= totalAmount;

    wallet.transactions.push({
      type: "debit",
      amount: totalAmount,
      note: "Food Order Payment",
    });

    await wallet.save();

    // 3️⃣ create order
    const order = await Order.create({
      user: req.user._id,
      vendor,
      items,
      totalAmount,
      pickupTime,
      pickupSlot: pickupSlotId,
      paymentStatus: "Paid",
      status: "Placed",
    });

    // 4️⃣ generate QR
    const qr = await generateQR({
      orderId: order._id,
      user: req.user._id,
      pickupTime,
    });

    order.qrCode = qr;
    await order.save();

    // 5️⃣ send email (non-blocking safe)
    try {
      const user = req.user;

      await sendOrderConfirmation(user, order);
    } catch (err) {
      console.log("Email error:", err.message);
    }

    // 6️⃣ response
    res.status(201).json({
      message: "Order placed successfully",
      order,
      qrCode: qr,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// 📦 GET USER ORDERS
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      user: req.user._id,
    }).populate("vendor", "name email");

    res.json(orders);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// 🏪 VENDOR UPDATE STATUS
const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    // update status
    order.status = status;

    await order.save();

    res.json({
      message: "Order status updated",
      order,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  placeOrder,
  getMyOrders,
  updateStatus,
};