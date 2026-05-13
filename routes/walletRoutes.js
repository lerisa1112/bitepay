const express = require("express");
const router = express.Router();

const {
  getWallet,
  addMoney,
  deductMoney,
} = require("../controllers/walletController");

const { protect } = require("../middleware/authMiddleware");

router.get("/", protect, getWallet);
router.post("/add", protect, addMoney);
router.post("/deduct", protect, deductMoney);

module.exports = router;