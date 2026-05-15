// ===============================
// controllers/notificationController.js
// ===============================

const Notification =
require("../models/Notification");

// ===============================
// GET MY NOTIFICATIONS
// ===============================

const getMyNotifications = async (
  req,
  res
) => {

  try {

    const notifications =
      await Notification.find({

        user: req.user._id,

      }).sort({

        createdAt: -1,

      });

    res.json({

      success: true,

      totalNotifications:
        notifications.length,

      notifications,

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      message: error.message,

    });

  }

};

// ===============================
// MARK AS READ
// ===============================

const markAsRead = async (
  req,
  res
) => {

  try {

    const notification =
      await Notification.findById(
        req.params.id
      );

    if (!notification) {

      return res.status(404).json({

        success: false,

        message:
          "Notification not found",

      });

    }

    notification.isRead = true;

    await notification.save();

    res.json({

      success: true,

      message:
        "Notification marked as read",

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      message: error.message,

    });

  }

};

// ===============================
// DELETE NOTIFICATION
// ===============================

const deleteNotification = async (
  req,
  res
) => {

  try {

    const notification =
      await Notification.findById(
        req.params.id
      );

    if (!notification) {

      return res.status(404).json({

        success: false,

        message:
          "Notification not found",

      });

    }

    await notification.deleteOne();

    res.json({

      success: true,

      message:
        "Notification deleted",

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      message: error.message,

    });

  }

};

module.exports = {

  getMyNotifications,

  markAsRead,

  deleteNotification,

};