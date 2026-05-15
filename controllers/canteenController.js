const Canteen = require("../models/Canteen");

// ===============================
// GET ALL CANTEENS
// ===============================
const getCanteens = async (req, res) => {
  try {
    const canteens = await Canteen.find({ isActive: true }).sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      count: canteens.length,
      canteens,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// GET SINGLE CANTEEN
// ===============================
const getCanteenById = async (req, res) => {
  try {
    const canteen = await Canteen.findById(req.params.id);

    if (!canteen) {
      return res.status(404).json({
        success: false,
        message: "Canteen not found",
      });
    }

    res.json({
      success: true,
      canteen,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getCanteens,
  getCanteenById,
};