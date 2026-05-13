const express = require("express");
const router = express.Router();

const {
  getOrdersData,
} = require("../controllers/adminOrderController");

const {
  protect,
  adminOnly,
} = require("../middleware/authMiddleware");

//
// 🚀 GET ORDER DATA
//
router.get(
  "/orders-data",
  protect,
  adminOnly,
  getOrdersData
);

module.exports = router;