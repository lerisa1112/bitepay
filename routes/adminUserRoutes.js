const express = require("express");
const router = express.Router();

const {
  getUsersData,
} = require("../controllers/adminUserController");

const {
  protect,
  adminOnly,
} = require("../middleware/authMiddleware");

// 🚀 GET USERS DATA
router.get(
  "/users-data",
  protect,
  adminOnly,
  getUsersData
);

module.exports = router;