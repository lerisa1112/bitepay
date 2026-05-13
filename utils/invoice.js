const PDFDocument = require("pdfkit");

const generateInvoice = (order) => {
  const doc = new PDFDocument();

  doc.fontSize(20).text("Campus Food Invoice", { align: "center" });
  doc.moveDown();

  doc.fontSize(14).text(`Order ID: ${order._id}`);
  doc.text(`Total Amount: ₹${order.totalAmount}`);
  doc.text(`Status: ${order.status}`);

  doc.moveDown();
  doc.text("Thank you for your order!");

  doc.end();

  return doc;
};

module.exports = generateInvoice;