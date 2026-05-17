const admin = require("../config/firebase");

const sendNotification = async ({
  token,
  title,
  body,
}) => {

  try {

    if (!token) return;

    await admin.messaging().send({

      token,

      notification: {
        title,
        body,
      },

    });

    console.log("Notification Sent");

  } catch (e) {

    console.log(
      "NOTIFICATION ERROR =>",
      e.message
    );

  }

};

module.exports = sendNotification;