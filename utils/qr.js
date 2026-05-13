const QRCode = require("qrcode");

const generateQR = async (data) => {
  try {
    const qr = await QRCode.toDataURL(JSON.stringify(data));
    return qr;
  } catch (err) {
    console.log(err);
  }
};

module.exports = generateQR;