const express = require("express");
const router = express.Router();

const {
  getWallet,
  addMoney,
} = require("../controllers/walletController");

const { protect } = require("../middleware/authMiddleware");

// GET WALLET
router.get("/", protect, getWallet);

// ADD MONEY
router.post("/add", protect, addMoney);

module.exports = router;