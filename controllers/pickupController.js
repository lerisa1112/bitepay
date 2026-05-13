const PickupSlot = require("../models/PickupSlot");

// 🏪 ADD SLOT
const addSlot = async (req, res) => {
  try {
    const { time, maxOrders } = req.body;

    const slot = await PickupSlot.create({
      vendor: req.user._id,
      time,
      maxOrders,
    });

    res.status(201).json(slot);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// 👨‍🎓 GET SLOTS
const getVendorSlots = async (req, res) => {
  try {
    const slots = await PickupSlot.find({
      vendor: req.params.vendorId,
      isActive: true,
    });

    res.json(slots);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  addSlot,
  getVendorSlots,
};