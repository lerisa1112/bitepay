const express = require("express");
const router = express.Router();

const {
  placeOrder,
  getMyOrders,
  updateStatus,
} = require("../controllers/orderController");

const { protect } = require("../middleware/authMiddleware");

// 🛒 place order
router.post("/", protect, placeOrder);

// 📦 my orders
router.get("/", protect, getMyOrders);

// 🏪 update order status (vendor use)
router.put("/:id", protect, updateStatus);

module.exports = router;