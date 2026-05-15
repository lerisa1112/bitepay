const express = require("express");
const router = express.Router();

const {
  getCanteens,
  getCanteenById,
} = require("../controllers/canteenController");

// GET ALL
router.get("/", getCanteens);

// GET BY ID
router.get("/:id", getCanteenById);

module.exports = router;