// ===============================
// routes/vendorRoutes.js
// FULL UPDATED CODE
// ===============================

const express = require("express");

const router = express.Router();

const {

  getVendorProfile,

  updateCanteenInfo,


  getPendingVendors ,


  getApprovedVendors ,

  approveVendor ,


  rejectVendor ,

  updateCanteenStatus,

  addMenu,

  getMyMenu,

  deleteMenu,

  updateStockStatus,

  getVendorOrders,

  updateOrderStatus,

} = require("../controllers/vendorController");

const {

  protect,
  vendorOnly,

} = require("../middleware/authMiddleware");

// ===============================
// PROFILE
// ===============================

router.get(
  "/profile",
  protect,
  vendorOnly,
  getVendorProfile
);

// ===============================
// UPDATE CANTEEN INFO
// ===============================

router.put(
  "/canteen-info",
  protect,
  vendorOnly,
  updateCanteenInfo
);

// ===============================
// UPDATE CANTEEN STATUS
// ===============================

router.put(
  "/canteen-status",
  protect,
  vendorOnly,
  updateCanteenStatus
);

// ===============================
// MENU
// ===============================

router.post(
  "/menu",
  protect,
  vendorOnly,
  addMenu
);

router.get(
  "/menu",
  protect,
  vendorOnly,
  getMyMenu
);

router.delete(
  "/menu/:id",
  protect,
  vendorOnly,
  deleteMenu
);

// ===============================
// STOCK
// ===============================

router.put(
  "/menu/stock/:id",
  protect,
  vendorOnly,
  updateStockStatus
);

// ===============================
// ORDERS
// ===============================

router.get(
  "/orders",
  protect,
  vendorOnly,
  getVendorOrders
);

router.put(
  "/order/:id",
  protect,
  vendorOnly,
  updateOrderStatus
);

router.get("/vendors/pending", protect, getPendingVendors);

// APPROVED
router.get("/vendors/approved", protect, getApprovedVendors);

// APPROVE
router.put("/vendor/approve/:id", protect, approveVendor);

// REJECT
router.put("/vendor/reject/:id", protect, rejectVendor);


module.exports = router;