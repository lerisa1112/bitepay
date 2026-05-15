// ===============================
// routes/vendorDashboardRoutes.js
// ===============================

const express = require("express");

const router = express.Router();

const {

  getVendorDashboard,

} = require("../controllers/vendorDashboardController");

const {

  protect,

} = require("../middleware/authMiddleware");

// ===============================
// DASHBOARD API
// ===============================

router.get(

  "/dashboard",

  protect,

  getVendorDashboard

);

module.exports = router;