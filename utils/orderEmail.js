const sendEmail = require("./mailer");

const sendOrderConfirmation = async (user, order) => {
  const html = `
    <h2>🍔 Order Confirmed</h2>
    <p>Hello ${user.name},</p>
    <p>Your order has been placed successfully.</p>

    <h3>Order Details:</h3>
    <p>Order ID: ${order._id}</p>
    <p>Total: ₹${order.totalAmount}</p>
    <p>Status: ${order.status}</p>

    <p>Thank you for using Campus Food App 🚀</p>
  `;

  await sendEmail(user.email, "Order Confirmation", html);
};

module.exports = sendOrderConfirmation;