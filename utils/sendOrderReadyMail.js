const transporter =
    require("../config/mail");

const sendOrderReadyMail =
    async (
      email,
      name,
      orderId,
    ) => {

  try {

    await transporter.sendMail({

      from:
          process.env.EMAIL_USER,

      to: email,

      subject:
          "Order Ready",

      html: `
        <h2>
          Hello ${name}
        </h2>

        <p>
          Your order
          ${orderId}
          is ready 🍕
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
    sendOrderReadyMail;