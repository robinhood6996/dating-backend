require("dotenv").config();
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const BlacklistToken = require("../models/blacklistToken.model");
// Function to generate a random token
const getToken = () => {
  return process.env.ACCESS_SECRET_TOKEN;
};

// Middleware function to authenticate user
const authenticate = async (req, res, next) => {
  // Get the token from the request header
  const tokenHeader = req.header("authorization");
  if (!tokenHeader) {
    return res.status(401).json({ message: "Unauthorized", statusCode: 401 });
  }
  const token = tokenHeader.split(" ")[1];

  // Check if token is provided
  if (!token) {
    return res.status(401).json({ message: "Unauthorized", statusCode: 401 });
  }

  try {
    const blacklistedToken = await BlacklistToken.findOne({ token });
    if (blacklistedToken) {
      return res
        .status(401)
        .json({ message: "Invalid token", statusCode: 401 });
    }
    // Verify and decode the token
    const decoded = jwt.verify(token, process.env.ACCESS_SECRET_TOKEN);

    // Attach the decoded user information to the request object
    req.user = decoded.user;
    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: "Unauthorized", statusCode: 401 });
  }
};

module.exports = { getToken, authenticate };
