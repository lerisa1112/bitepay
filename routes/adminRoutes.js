const express = require("express");
const router = express.Router();

const {
  getDashboardData,
  getAllUsers,
  getAllVendors,   // ✅ ADD THIS
  getPendingVendors,
  getApprovedVendors,
  approveVendor,
  rejectVendor,
  getAllOrders,
  getAllWallets,
  sendAdminMessage,
} = require("../controllers/adminController");

const { protect } = require("../middleware/authMiddleware");


// ===============================
// DASHBOARD
// ===============================
router.get("/dashboard", protect, getDashboardData);


// ===============================
// USERS
// ===============================
router.get("/users", protect, getAllUsers);


// ===============================
// VENDORS
// ===============================

// ✅ FIXED: REAL VENDORS API (IMPORTANT)
router.get("/vendors", protect, getAllVendors);

// pending vendors
router.get("/vendors/pending", protect, getPendingVendors);

// approved vendors
router.get("/vendors/approved", protect, getApprovedVendors);

// approve vendor
router.put("/vendor/approve/:id", protect, approveVendor);

// reject vendor
router.put("/vendor/reject/:id", protect, rejectVendor);


// ===============================
// ORDERS
// ===============================
router.get("/orders", protect, getAllOrders);


// ===============================
// WALLETS
// ===============================
router.get("/wallets", protect, getAllWallets);


// ===============================
// ADMIN MESSAGE
// ===============================
router.post("/send-message", protect, sendAdminMessage);


module.exports = router;