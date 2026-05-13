const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  return jwt.sign(
    { id }, 
    process.env.JWT_SECRET,
    {
      expiresIn: "30d", // token 30 days sudhi valid
    }
  );
};

module.exports = generateToken;