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

const updateCanteenStatus = async (req, res) => {

  try {

    const { canteenStatus } = req.body;

    if (
      canteenStatus !== "Open" &&
      canteenStatus !== "Closed"
    ) {

      return res.status(400).json({

        success: false,

        message: "Status must be Open or Closed",

      });

    }

    const vendor = await User.findById(req.user._id);

    if (!vendor) {

      return res.status(404).json({

        success: false,

        message: "Vendor not found",

      });

    }

    // UPDATE STATUS
    vendor.canteenStatus = canteenStatus;

    vendor.isOpen = canteenStatus === "Open";

    await vendor.save();

    // SOCKET 🔥
    const io = req.app.get("io");

    io.emit("vendorStatusChanged", {

      vendorId: vendor._id,

      isOpen: vendor.isOpen,

      canteenStatus: vendor.canteenStatus

    });

    res.json({

      success: true,

      message: `Canteen is now ${canteenStatus}`,

      canteenStatus: vendor.canteenStatus,

      isOpen: vendor.isOpen

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      message: error.message,

    });

  }

};


const getAllVendorsWithMenu = async (req, res) => {

  try {

    const { status } = req.query;

    let filter = {

      role: "vendor",

      isApproved: true,

      // IMPORTANT 🔥
      isOpen: true

    };

    // OPTIONAL
    if (status === "closed") {

      filter.isOpen = false;

    }

    const vendors = await User.find(filter)
      .select("-password");

    const result = await Promise.all(

      vendors.map(async (vendor) => {

        const menu = await Menu.find({

          vendor: vendor._id,

          stockStatus: "In Stock",

        });

        return {

          vendor: {

            _id: vendor._id,

            name: vendor.name,

            canteenName: vendor.canteenName,

            canteenLocation: vendor.canteenLocation,

            address: vendor.address,

            phone: vendor.phone,

            vendorStatus: vendor.vendorStatus,

            isApproved: vendor.isApproved,

            isOpen: vendor.isOpen,

          },

          menuItems: menu,

        };

      })

    );

    res.json({

      success: true,

      totalVendors: result.length,

      data: result,

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
    const menu = await Menu.create({
      vendor: req.user._id,
      foodName: req.body.foodName,
      price: req.body.price,
      image: req.body.image,
      description: req.body.description,
    });

    // 🔥 ONLY vendor required fields
    const populatedMenu = await Menu.findById(menu._id).populate(
      "vendor",
      "canteenName canteenLocation address" // 👈 only these fields
    );

    return res.json({
      success: true,
      message: "Menu item added successfully",
      menu: populatedMenu,
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


// ===============================
// GET MY MENU
// ===============================


const getMyMenu = async (req, res) => {
  try {
    const menuItems = await Menu.find({ vendor: req.user._id }).sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      totalItems: menuItems.length,
      menuItems, // 👈 IMPORTANT (exact same key as Postman)
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

const getPendingVendors = async (req, res) => {
  try {
    const vendors = await User.find({
      role: "vendor",
      isApproved: false,
    }).select("-password");

    res.json(vendors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// APPROVED
const getApprovedVendors = async (req, res) => {
  try {
    const vendors = await User.find({
      role: "vendor",
      isApproved: true,
    }).select("-password");

    res.json(vendors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// APPROVE
const approveVendor = async (req, res) => {
  try {
    const vendor = await User.findById(req.params.id);

    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    vendor.isApproved = true;
    vendor.vendorStatus = "Approved";

    await vendor.save();

    res.json({ message: "Vendor approved" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// REJECT
const rejectVendor = async (req, res) => {
  try {
    const vendor = await User.findById(req.params.id);

    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    vendor.isApproved = false;
    vendor.vendorStatus = "Rejected";

    await vendor.save();

    res.json({ message: "Vendor rejected" });
  } catch (error) {
    res.status(500).json({ message: error.message });
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

  getPendingVendors ,


  getApprovedVendors ,

  approveVendor ,


  rejectVendor ,

  updateCanteenInfo,

  updateCanteenStatus,

  addMenu,

  getAllVendorsWithMenu,

  getMyMenu,

  deleteMenu,

  updateStockStatus,

  getVendorOrders,

  updateOrderStatus,

};