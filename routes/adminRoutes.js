const express = require("express");
const router = express.Router();

const {
  getAllUsers,
  getAllOrders,
  getAllWallets,
  approveVendor,
  sendAdminMessage,
} = require("../controllers/adminController");

const {
  protect,
  adminOnly,
} = require("../middleware/authMiddleware");

// 👥 GET ALL USERS
router.get(
  "/users",
  protect,
  adminOnly,
  getAllUsers
);

// 🛒 GET ALL ORDERS
router.get(
  "/orders",
  protect,
  adminOnly,
  getAllOrders
);

// 💰 GET ALL WALLETS
router.get(
  "/wallets",
  protect,
  adminOnly,
  getAllWallets
);

// 🏪 APPROVE VENDOR
router.put(
  "/vendor/:id/approve",
  protect,
  adminOnly,
  approveVendor
);

// 📢 SEND ADMIN MESSAGE
router.post(
  "/message",
  protect,
  adminOnly,
  sendAdminMessage
);

module.exports = router;