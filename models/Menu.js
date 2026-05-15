const mongoose = require("mongoose");

const menuSchema = new mongoose.Schema(
  {
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    foodName: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    image: {
      type: String,
      default: "",
    },

    description: {
      type: String,
      default: "",
    },

    stockStatus: {
      type: String,
      enum: ["In Stock", "Out Of Stock"],
      default: "In Stock",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Menu", menuSchema);