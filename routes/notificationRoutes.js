// ===============================
// routes/notificationRoutes.js
// ===============================

const express = require("express");

const router = express.Router();

const {

  getMyNotifications,

  markAsRead,

  deleteNotification,

} = require(
  "../controllers/notificationController"
);

const {
  protect,
} = require(
  "../middleware/authMiddleware"
);

// ===============================
// GET NOTIFICATIONS
// ===============================

router.get(
  "/",
  protect,
  getMyNotifications
);

// ===============================
// MARK AS READ
// ===============================

router.put(
  "/read/:id",
  protect,
  markAsRead
);

// ===============================
// DELETE
// ===============================

router.delete(
  "/:id",
  protect,
  deleteNotification
);

module.exports = router;