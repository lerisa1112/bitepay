const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const { getMyProfile } = require("../controllers/userController");

// GET PROFILE
router.get("/me", protect, getMyProfile);

module.exports = router;