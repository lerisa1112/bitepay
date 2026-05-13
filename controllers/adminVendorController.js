const User = require("../models/User");

//
// 🚀 GET ALL VENDORS
//
const getAllVendors = async (req, res) => {
  try {

    // 📊 COUNTS
    const pendingReview = await User.countDocuments({
      role: "vendor",
      vendorStatus: "Pending",
    });

    const approved = await User.countDocuments({
      role: "vendor",
      vendorStatus: "Approved",
    });

    const rejected = await User.countDocuments({
      role: "vendor",
      vendorStatus: "Rejected",
    });

    // 📋 VENDORS LIST
    const vendors = await User.find({
      role: "vendor",
    })
    .select("-password")
    .sort({ createdAt: -1 });

    res.json({
      pendingReview,
      approved,
      rejected,
      vendors,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

//
// ✅ APPROVE VENDOR
//
const approveVendor = async (req, res) => {
  try {

    const vendor = await User.findById(req.params.id);

    if (!vendor) {
      return res.status(404).json({
        message: "Vendor not found",
      });
    }

    vendor.vendorStatus = "Approved";
    vendor.isApproved = true;

    await vendor.save();

    res.json({
      message: "Vendor approved successfully",
      vendor,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

//
// ❌ REJECT VENDOR
//
const rejectVendor = async (req, res) => {
  try {

    const vendor = await User.findById(req.params.id);

    if (!vendor) {
      return res.status(404).json({
        message: "Vendor not found",
      });
    }

    vendor.vendorStatus = "Rejected";
    vendor.isApproved = false;

    await vendor.save();

    res.json({
      message: "Vendor rejected successfully",
      vendor,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getAllVendors,
  approveVendor,
  rejectVendor,
};