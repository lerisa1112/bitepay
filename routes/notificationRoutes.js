// ===============================
// routes/notificationRoutes.js
// ===============================

const express = require("express");
const router = express.Router();

const {
  getMyNotifications,
  markAsRead,
  deleteNotification,
} = require("../controllers/notificationController");

const { protect } = require("../middleware/authMiddleware");

// ===============================
// USER NOTIFICATIONS
// ===============================
router.get("/", protect, getMyNotifications);

// ===============================
// ADMIN NOTIFICATIONS (NEW)
// ===============================
router.get("/admin", protect, async (req, res) => {
  try {
    const Notification = require("../models/Notification");

    const notifications = await Notification.find({
      role: "admin",
    }).sort({ createdAt: -1 });

    const unreadCount = await Notification.countDocuments({
      role: "admin",
      isRead: false,
    });

    res.json({
      success: true,
      notifications,
      unreadCount,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// ===============================
// MARK AS READ
// ===============================
router.put("/read/:id", protect, markAsRead);

// ===============================
// DELETE NOTIFICATION
// ===============================
router.delete("/:id", protect, deleteNotification);

module.exports = router;