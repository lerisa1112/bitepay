const transporter =
    require("../config/mail");

const sendOrderPlacedMail =
    async (
      email,
      vendorName,
      orderId,
    ) => {

  try {

    await transporter.sendMail({

      from:
          process.env.EMAIL_USER,

      to: email,

      subject:
          "New Order Received",

      html: `
        <h2>
          New Order Arrived 🍔
        </h2>

        <p>
          Order ID:
          ${orderId}
        </p>

        <p>
          Please prepare
          the order.
        </p>
      `,

    });

  } catch (error) {

    console.log(
      error.message,
    );

  }

};

module.exports =
    sendOrderPlacedMail;