const transporter =
    require("../config/mail");

const sendOrderCompletedMail =
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
          "Order Completed",

      html: `
        <h2>
          Hello ${name}
        </h2>

        <p>
          Your order
          ${orderId}
          completed 🎉
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
    sendOrderCompletedMail;