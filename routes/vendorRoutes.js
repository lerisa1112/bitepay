const express = require("express");
const router = express.Router();

const {
  addMenu,
  getMyMenu,
  updateOrderStatus,
} = require("../controllers/vendorController");

const {
  protect,
  vendorOnly,
} = require("../middleware/authMiddleware");

// 🍔 ONLY VENDOR CAN ADD MENU
router.post("/menu", protect, vendorOnly, addMenu);

// 📋 ONLY VENDOR CAN SEE OWN MENU
router.get("/menu", protect, vendorOnly, getMyMenu);

// 🏪 ONLY VENDOR CAN UPDATE ORDER
router.put(
  "/order/:id",
  protect,
  vendorOnly,
  updateOrderStatus
);

module.exports = router;