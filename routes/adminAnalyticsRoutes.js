const express = require("express");
const router = express.Router();

const {
  getSalesGraph,
  getTopVendors,
  getPeakHours,
  getDashboardStats,
} = require("../controllers/adminAnalyticsController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

// 📊 SALES GRAPH
router.get("/sales", protect, adminOnly, getSalesGraph);

// 🏪 TOP VENDORS
router.get("/vendors", protect, adminOnly, getTopVendors);

// ⏰ PEAK HOURS
router.get("/peak-hours", protect, adminOnly, getPeakHours);

// 📦 OVERALL STATS
router.get("/stats", protect, adminOnly, getDashboardStats);

module.exports = router;