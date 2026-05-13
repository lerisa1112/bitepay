const express = require("express");
const router = express.Router();

const {
  getAllVendors,
  approveVendor,
  rejectVendor,
} = require("../controllers/adminVendorController");

const {
  protect,
  adminOnly,
} = require("../middleware/authMiddleware");

//
// 🚀 GET ALL VENDORS
//
router.get(
  "/vendors",
  protect,
  adminOnly,
  getAllVendors
);

//
// ✅ APPROVE
//
router.put(
  "/vendor/:id/approve",
  protect,
  adminOnly,
  approveVendor
);

//
// ❌ REJECT
//
router.put(
  "/vendor/:id/reject",
  protect,
  adminOnly,
  rejectVendor
);

module.exports = router;