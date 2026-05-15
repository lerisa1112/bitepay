const mongoose = require("mongoose");

const canteenSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    address: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Canteen", canteenSchema);