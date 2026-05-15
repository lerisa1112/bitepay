const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    orderId: {
      type: String,
      required: true,
    },

    items: [
      {
        foodName: String,
        quantity: Number,
        price: Number,
      },
    ],

    totalAmount: {
      type: Number,
      required: true,
    },

    paymentMethod: {
      type: String,
      default: "Wallet",
    },

    orderStatus: {
      type: String,
      enum: ["Pending", "Preparing", "Ready", "Completed"],
      default: "Pending",
    },

    // 🍔 NEW FIELDS
    menuName: {
      type: String,
      default: "",
    },

    readyTime: {
      type: Number,
      default: 0,
    },

    pickupTime: {
      type: String,
      default: "",
    },

    qrCode: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);