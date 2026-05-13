const mongoose = require("mongoose");

const pickupSlotSchema = new mongoose.Schema(
  {
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    time: {
      type: String,
      required: true,
    },

    maxOrders: {
      type: Number,
      default: 10,
    },

    currentOrders: {
      type: Number,
      default: 0,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "PickupSlot",
  pickupSlotSchema
);