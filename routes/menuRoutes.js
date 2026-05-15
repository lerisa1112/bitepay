const express = require("express");
const router = express.Router();

const {
  addMenuItem,
  getVendorMenu,
  deleteMenuItem,
  updateStockStatus,
} = require("../controllers/menuController");

const { protect } = require("../middleware/authMiddleware");

// ADD MENU
router.post("/add", protect, addMenuItem);

// GET MY MENU
router.get("/my-menu", protect, getVendorMenu);

// DELETE MENU
router.delete("/delete/:id", protect, deleteMenuItem);

// STOCK UPDATE
router.put("/stock/:id", protect, updateStockStatus);

module.exports = router;