require('dotenv').config()
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// Function to generate a random token
const getToken = () => {
  return process.env.ACCESS_SECRET_TOKEN
};

// Middleware function to authenticate user
const authenticate = (req, res, next) => {
  // Get the token from the request header
  const tokenHeader = req.header('authorization');
  if(!tokenHeader){
    return res.status(401).json({ message: 'Unauthorized' });
  }
  const token = tokenHeader.split(' ')[1];

  // Check if token is provided
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    // Verify and decode the token
    const decoded = jwt.verify(token, process.env.ACCESS_SECRET_TOKEN);

    // Attach the decoded user information to the request object
    req.user = decoded.user;
    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: 'Unauthorized' });
  }
};

module.exports = { getToken, authenticate };
