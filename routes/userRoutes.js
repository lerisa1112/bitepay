const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const { getMyProfile } = require("../controllers/userController");
const {
  updateFcmToken,
} = require("../controllers/userController");

// GET PROFILE
router.get("/me", protect, getMyProfile);
router.post("/update-token", protect, updateFcmToken);


module.exports = router;