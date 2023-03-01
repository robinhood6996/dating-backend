const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const crypto = require('crypto');


// Route to register a new user
router.post('/register', async (req, res) => {
  try {
    // Check if user with the email already exists
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    // Create a new user document
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      gender: req.body.gender,
      age: req.body.age
    });

    // Save the user document
    await user.save();
     
    // Generate a JWT token
    const secretKey = crypto.randomBytes(64).toString('hex');
    const token = jwt.sign({ userId: user._id }, secretKey);
    // Send the user details and token in the response
    res.status(201).json({ user, token });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
});

module.exports = router;
