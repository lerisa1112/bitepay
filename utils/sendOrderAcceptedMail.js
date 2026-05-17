const transporter =
    require("../config/mail");

const sendOrderAcceptedMail =
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
          "Order Accepted",

      html: `
        <h2>
          Hello ${name}
        </h2>

        <p>
          Your order
          ${orderId}
          has been accepted ✅
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
    sendOrderAcceptedMail;