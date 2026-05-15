const express = require("express");
const router = express.Router();

const {
  placeOrder,
  getMyOrders,
  getVendorOrders,
  acceptOrder,
  markOrderReady,
  completeOrder,
} = require("../controllers/orderController");

const { protect } = require("../middleware/authMiddleware");

// ===============================
// USER PLACE ORDER
// ===============================
router.post("/", protect, placeOrder);

// ===============================
// USER MY ORDERS
// ===============================
router.get("/my-orders", protect, getMyOrders);

// ===============================
// VENDOR GET ORDERS
// ===============================
router.get("/vendor-orders", protect, getVendorOrders);

// ===============================
// ACCEPT ORDER (VENDOR)
// ===============================
router.put("/accept/:id", protect, acceptOrder);

// ===============================
// MARK ORDER READY (VENDOR)
// ===============================
router.put("/ready/:id", protect, markOrderReady);

// ===============================
// COMPLETE ORDER
// ===============================
router.put("/complete/:id", protect, completeOrder);

module.exports = router;