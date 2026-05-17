const transporter =
    require("../config/mail");

const sendVendorRejectMail =
    async (email, name) => {

  try {

    await transporter.sendMail({

      from:
          process.env.EMAIL_USER,

      to: email,

      subject:
          "Vendor Rejected",

      html: `
        <h2>Hello ${name}</h2>

        <p>
          Your vendor request
          was rejected ❌
        </p>

        <p>
          Please contact admin.
        </p>
      `,

    });

    console.log(
      "REJECT MAIL SENT",
    );

  } catch (error) {

    console.log(
      "MAIL ERROR =>",
      error.message,
    );

  }

};

module.exports =
    sendVendorRejectMail;