const express = require("express");
const router = express.Router();

const {
  getDashboardData,
  getAllUsers,
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

// all vendors (optional use if needed)
router.get("/vendors", protect, (req, res) => {
  res.json({ message: "Use pending/approved APIs" });
});

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