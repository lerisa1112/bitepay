// ===============================
// controllers/vendorController.js
// FULL UPDATED CODE
// ===============================

const User = require("../models/User");
const Menu = require("../models/Menu");
const Order = require("../models/Order");
const Notification = require("../models/Notification");

// ===============================
// GET VENDOR PROFILE
// ===============================

const getVendorProfile = async (req, res) => {

  try {

    const vendor = await User.findById(
      req.user._id
    ).select("-password");

    if (!vendor) {

      return res.status(404).json({

        success: false,
        message: "Vendor not found",

      });

    }

    res.json({

      success: true,

      vendor,

    });

  } catch (error) {

    res.status(500).json({

      success: false,
      message: error.message,

    });

  }

};

// ===============================
// UPDATE CANTEEN INFO
// ===============================

const updateCanteenInfo = async (
  req,
  res
) => {

  try {

    const {

      canteenName,
      managerName,

    } = req.body;

    const vendor = await User.findById(
      req.user._id
    );

    if (!vendor) {

      return res.status(404).json({

        success: false,
        message: "Vendor not found",

      });

    }

    // UPDATE

    vendor.canteenName =
      canteenName || vendor.canteenName;

    vendor.name =
      managerName || vendor.name;

    await vendor.save();

    res.json({

      success: true,

      message:
        "Canteen info updated successfully",

      vendor,

    });

  } catch (error) {

    res.status(500).json({

      success: false,
      message: error.message,

    });

  }

};

// ===============================
// UPDATE CANTEEN STATUS
// ===============================

const updateCanteenStatus = async (
  req,
  res
) => {

  try {

    const { canteenStatus } = req.body;

    if (
      canteenStatus !== "Open" &&
      canteenStatus !== "Closed"
    ) {

      return res.status(400).json({

        success: false,

        message:
          "Status must be Open or Closed",

      });

    }

    const vendor = await User.findById(
      req.user._id
    );

    if (!vendor) {

      return res.status(404).json({

        success: false,

        message: "Vendor not found",

      });

    }

    vendor.canteenStatus =
      canteenStatus;

    await vendor.save();

    res.json({

      success: true,

      message:
        `Canteen is now ${canteenStatus}`,

      canteenStatus:
        vendor.canteenStatus,

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      message: error.message,

    });

  }

};

// ===============================
// ADD MENU ITEM
// ===============================

const addMenu = async (req, res) => {

  try {

    const {

      name,
      price,
      description,
      image,
      discount,

    } = req.body;

    const menu = await Menu.create({

      vendor: req.user._id,

      name,

      price,

      description,

      image,

      discount,

      inStock: true,

    });

    res.status(201).json({

      success: true,

      message: "Menu item added",

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
// GET MY MENU
// ===============================

const getMyMenu = async (req, res) => {

  try {

    const menu = await Menu.find({

      vendor: req.user._id,

    });

    res.json({

      success: true,

      totalItems: menu.length,

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
// DELETE MENU ITEM
// ===============================

const deleteMenu = async (req, res) => {

  try {

    const menu = await Menu.findById(
      req.params.id
    );

    if (!menu) {

      return res.status(404).json({

        success: false,
        message: "Menu not found",

      });

    }

    await menu.deleteOne();

    res.json({

      success: true,

      message: "Menu deleted",

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

const updateStockStatus = async (
  req,
  res
) => {

  try {

    const { inStock } = req.body;

    const menu = await Menu.findById(
      req.params.id
    );

    if (!menu) {

      return res.status(404).json({

        success: false,
        message: "Menu item not found",

      });

    }

    menu.inStock = inStock;

    await menu.save();

    res.json({

      success: true,

      message: inStock
          ? "Item In Stock"
          : "Item Out Of Stock",

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
// GET VENDOR ORDERS
// ===============================

const getVendorOrders = async (
  req,
  res
) => {

  try {

    const orders = await Order.find({

      vendor: req.user._id,

    })

      .populate("user", "name email")

      .sort({ createdAt: -1 });

    res.json({

      success: true,

      totalOrders: orders.length,

      orders,

    });

  } catch (error) {

    res.status(500).json({

      success: false,
      message: error.message,

    });

  }

};

// ===============================
// UPDATE ORDER STATUS
// ===============================

const updateOrderStatus = async (
  req,
  res
) => {

  try {

    const { status } = req.body;

    const order = await Order.findById(
      req.params.id
    );

    if (!order) {

      return res.status(404).json({

        success: false,
        message: "Order not found",

      });

    }

    // ONLY OWNER VENDOR

    if (
      order.vendor.toString() !==
      req.user._id.toString()
    ) {

      return res.status(401).json({

        success: false,
        message: "Unauthorized",

      });

    }

    order.orderStatus = status;

    await order.save();

    // CREATE NOTIFICATION

    await Notification.create({

      user: order.user,

      title: "Order Status Updated",

      message:
        `Your order is now ${status}`,

      type: "order",

    });

    res.json({

      success: true,

      message: "Order updated",

      order,

    });

  } catch (error) {

    res.status(500).json({

      success: false,
      message: error.message,

    });

  }

};

// ===============================
// EXPORTS
// ===============================

module.exports = {

  getVendorProfile,

  updateCanteenInfo,

  updateCanteenStatus,

  addMenu,

  getMyMenu,

  deleteMenu,

  updateStockStatus,

  getVendorOrders,

  updateOrderStatus,

};