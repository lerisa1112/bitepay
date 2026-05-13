const mongoose = require("mongoose");

const menuSchema = new mongoose.Schema(
  {
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    name: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    description: String,

    isAvailable: {
      type: Boolean,
      default: true,
    },

    discount: {
      type: Number,
      default: 0, // rupees discount
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Menu", menuSchema);