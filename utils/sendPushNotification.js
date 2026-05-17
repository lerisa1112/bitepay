const admin = require("../config/firebase");

const sendPushNotification = async ({ token, title, body }) => {
  try {
    if (!token) {
      console.log("❌ No FCM token provided");
      return;
    }

    const message = {
      token,
      notification: {
        title: title || "Notification",
        body: body || "",
      },
      android: {
        priority: "high",
      },
      apns: {
        payload: {
          aps: {
            sound: "default",
          },
        },
      },
    };

    const response = await admin.messaging().send(message);

    console.log("✅ FCM SENT SUCCESS =>", response);

    return response;
  } catch (error) {
    console.log("❌ FCM ERROR FULL =>", {
      message: error.message,
      code: error.code,
      stack: error.stack,
    });
  }
};

module.exports = sendPushNotification;