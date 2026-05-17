const transporter =
    require("../config/mail");

const sendVendorApprovalMail =
    async (email, name) => {

  try {

    await transporter.sendMail({

      from:
          process.env.EMAIL_USER,

      to: email,

      subject:
          "Vendor Approved",

      html: `
        <h2>Hello ${name}</h2>

        <p>
          Your vendor account
          has been approved 🎉
        </p>

        <p>
          You can now login
          and start selling.
        </p>
      `,

    });

    console.log(
      "APPROVAL MAIL SENT",
    );

  } catch (error) {

    console.log(
      "MAIL ERROR =>",
      error.message,
    );

  }

};

module.exports =
    sendVendorApprovalMail;