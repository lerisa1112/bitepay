// ===============================
// models/Notification.js
// ===============================

const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    // 👇 user optional karvu padse (admin notifications mate)
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },

    // 👇 optional: admin/user/vendor classify karva mate
    receiverType: {
      type: String,
      enum: ["user", "admin", "vendor"],
      default: "user",
    },

    title: {
      type: String,
      required: true,
    },

    message: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      default: "general",
    },

    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Notification", notificationSchema);