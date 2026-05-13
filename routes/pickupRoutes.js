const express = require("express");
const router = express.Router();

const {
  addSlot,
  getVendorSlots,
} = require("../controllers/pickupController");

const {
  protect,
  vendorOnly,
} = require("../middleware/authMiddleware");

// 🏪 add slot
router.post("/add", protect, vendorOnly, addSlot);

// 👨‍🎓 get slots
router.get("/:vendorId", protect, getVendorSlots);

module.exports = router;