const express = require("express");
const router = express.Router();

const {
  getWalletData,
} = require("../controllers/adminWalletController");

const {
  protect,
  adminOnly,
} = require("../middleware/authMiddleware");

//
// 🚀 GET WALLET DATA
//
router.get(
  "/wallet-data",
  protect,
  adminOnly,
  getWalletData
);

module.exports = router;