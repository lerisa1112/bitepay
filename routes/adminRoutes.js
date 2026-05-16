// ===============================
// routes/adminRoutes.js
// FULL UPDATED CODE
// ===============================

const express = require("express");

const router = express.Router();

const {

  getDashboardData,

  getAllUsers,

  getAllVendors,

  getPendingVendors,

  getAllOrders,

  getAllWallets,

  approveVendor,

  rejectVendor,

  sendAdminMessage,

} = require(
  "../controllers/adminController"
);

const {
  protect,
} = require(
  "../middleware/authMiddleware"
);

// ===============================
// DASHBOARD
// ===============================

router.get(

  "/dashboard",

  protect,

  getDashboardData

);

// ===============================
// GET ALL USERS
// ===============================

router.get(

  "/users",

  protect,

  getAllUsers

);

// ===============================
// GET PENDING VENDORS
// ===============================

router.get(

  "/pending-vendors",

  protect,

  getPendingVendors

);

// ===============================
// GET ALL ORDERS
// ===============================

router.get(

  "/orders",

  protect,

  getAllOrders

);

// ===============================
// GET ALL WALLETS
// ===============================

router.get(

  "/wallets",

  protect,

  getAllWallets

);

// ===============================
// APPROVE VENDOR
// ===============================

router.put(

  "/approve-vendor/:id",

  protect,

  approveVendor

);



router.get(

  "/vendors",

  protect,

  getAllVendors

);

// ===============================
// REJECT VENDOR
// ===============================

router.put(

  "/reject-vendor/:id",

  protect,

  rejectVendor

);

// ===============================
// SEND ADMIN MESSAGE
// ===============================

router.post(

  "/send-message",

  protect,

  sendAdminMessage

);

module.exports = router;