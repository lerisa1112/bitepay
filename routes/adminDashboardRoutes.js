const express = require("express");
const router = express.Router();

const {
  getDashboardData,
} = require("../controllers/adminDashboardController");

const {
  protect,
  adminOnly,
} = require("../middleware/authMiddleware");

// 🚀 ADMIN DASHBOARD
router.get(
  "/dashboard",
  protect,
  adminOnly,
  getDashboardData
);

module.exports = router;