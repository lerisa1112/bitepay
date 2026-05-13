const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    // 👨‍🎓 USER
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // 🏪 VENDOR
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // 🛒 ITEMS
    items: [
      {
        name: String,
        price: Number,
        qty: Number,
      },
    ],

    // 💰 TOTAL AMOUNT
    totalAmount: {
      type: Number,
      required: true,
    },

    // 📦 ORDER STATUS
    status: {
      type: String,
      enum: [
        "Placed",
        "Accepted",
        "Preparing",
        "Ready",
        "Completed",
        "Cancelled",
      ],
      default: "Placed",
    },

    // 💳 PAYMENT STATUS
    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Refunded"],
      default: "Paid",
    },

    // ⏰ PICKUP TIME (IMPORTANT)
    pickupTime: {
      type: String,
      required: true,
    },

    // 📍 SLOT ID (QUEUE SYSTEM)
    pickupSlot: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PickupSlot",
    },

    // 📱 QR CODE (for pickup verification)
    qrCode: {
      type: String,
    },

    // 🔁 CANCEL FLAG
    isCancelled: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);