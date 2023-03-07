const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

exports.registerUser = async (req, res) => {
  try {
    console.log("user => ", req.body);
    // Check if user with the email already exists
    const existingUser = await User.findOne({ email: req.body.email });
    console.log("existingUser", existingUser);
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User with this email already exists" });
    }

    // Hash the password

    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    // Create a new user document
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      gender: req.body.gender,
      age: req.body.age,
    });
    // Save the user document
    await user.save().then(() => {
      // Generate a JWT token
      const secretKey = crypto.randomBytes(64).toString("hex");
      const token = jwt.sign({ userId: user._id }, secretKey);
      // Send the user details and token in the response
      res.status(201).json({ user, token });
    });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

exports.getAllUser = async (req, res) => {
  try {
    const allUsers = await User.find({});
    console.log("allUsers", allUsers);
    res.send(allUsers);
  } catch {
    res.status(500).json({ message: "Something went wrong" });
  }
};
exports.postUser = async (req, res) => {
  try {
    const user = req.body;
    const allUsers = User.find({});
    console.log("user=>", allUsers);
    res.send(user);
  } catch {
    res.status(500).json({ message: "Something went wrong" });
  }
};
