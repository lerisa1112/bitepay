const Menu = require("../models/Menu");

// ===============================
// ADD MENU ITEM
// ===============================
const addMenuItem = async (req, res) => {
  try {
    const { foodName, price, image, description } = req.body;

    if (!foodName || !price) {
      return res.status(400).json({
        success: false,
        message: "Food name and price required",
      });
    }

    const menu = await Menu.create({
      vendor: req.user._id,
      foodName,
      price,
      image,
      description,
    });

    res.status(201).json({
      success: true,
      message: "Menu item added successfully",
      menu,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// GET MY VENDOR MENU
// ===============================
const getVendorMenu = async (req, res) => {
  try {
    const menuItems = await Menu.find({
      vendor: req.user._id,
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      totalItems: menuItems.length,
      menuItems,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// DELETE MENU ITEM (SECURE)
// ===============================
const deleteMenuItem = async (req, res) => {
  try {
    const item = await Menu.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Menu item not found",
      });
    }

    // security check (only owner can delete)
    if (item.vendor.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    await item.deleteOne();

    res.json({
      success: true,
      message: "Menu item deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// UPDATE STOCK STATUS
// ===============================
const updateStockStatus = async (req, res) => {
  try {
    const { stockStatus } = req.body;

    const menu = await Menu.findById(req.params.id);

    if (!menu) {
      return res.status(404).json({
        success: false,
        message: "Menu item not found",
      });
    }

    if (menu.vendor.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    menu.stockStatus = stockStatus;
    await menu.save();

    res.json({
      success: true,
      message: "Stock updated successfully",
      menu,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  addMenuItem,
  getVendorMenu,
  deleteMenuItem,
  updateStockStatus,
};