const Menu = require("../models/Menu");
const Order = require("../models/Order");
const Notification = require("../models/Notification");

// 🍔 ADD MENU ITEM
const addMenu = async (req, res) => {
  try {
    const { name, price, description, discount } = req.body;

    const menu = await Menu.create({
      vendor: req.user._id,
      name,
      price,
      description,
      discount,
    });

    res.status(201).json(menu);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// 📋 GET VENDOR MENU
const getMyMenu = async (req, res) => {
  try {
    const menu = await Menu.find({
      vendor: req.user._id,
    });

    res.json(menu);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// 🏪 UPDATE ORDER STATUS
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    // 🔐 only vendor can update own order
    if (
      order.vendor.toString() !==
      req.user._id.toString()
    ) {
      return res.status(401).json({
        message: "Not authorized",
      });
    }

    // update status
    order.status = status;

    await order.save();

    // 🔔 create notification
    await Notification.create({
      user: order.user,
      title: "Order Update",
      message: `Your order is now ${status}`,
      type: "order",
    });

    res.json({
      message: "Order status updated",
      order,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  addMenu,
  getMyMenu,
  updateOrderStatus,
};