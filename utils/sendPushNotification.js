const admin = require("../config/firebase");

const sendPushNotification = async ({
  token,
  title,
  body,
}) => {

  try {

    const message = {

      token,

      notification: {
        title,
        body,
      },

    };

    await admin
        .messaging()
        .send(message);

    console.log(
      "FCM SENT SUCCESS",
    );

  } catch (error) {

    console.log(
      "FCM ERROR =>",
      error.message,
    );

  }

};

module.exports =
    sendPushNotification;