const express = require("express");
const router = express.Router();

const {
  getMyNotifications,
  markAsRead,
} = require("../controllers/notificationController");

const { protect } = require("../middleware/authMiddleware");

// 🔔 get notifications
router.get("/", protect, getMyNotifications);

// ✅ mark read
router.put("/:id", protect, markAsRead);

module.exports = router;