require("dotenv").config();
const User = require("../models/user.model");
const BlacklistToken = require("../models/blacklistToken.model");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { EscortProfile } = require("../models/escort.model");

exports.registerUser = async (req, res) => {
  try {
    // Check if user with the email already exists
    const existingUser = await User.findOne({ email: req.body.email });
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
      type: req.body.type,
    });

    // Save the user document
    await user.save();
    console.log(user.type);
    if (user.type === "escort") {
      let escort = new EscortProfile({
        name: user.name,
        email: user.email,
        age: user.age,
        gender: user.gender,
      });
      await escort.save();
    }
    return res.status(201).json({ message: "Successfully registered" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

exports.getAllUser = async (req, res) => {
  try {
    const allUsers = await User.find({});
    res.send(allUsers);
  } catch {
    res.status(500).json({ message: "Something went wrong" });
  }
};

exports.login = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const existingUser = await User.findOne({
      email: email,
    });
    console.log(req.body);
    if (existingUser) {
      // Generate a JWT token
      const matched = await bcrypt.compare(password, existingUser.password);
      if (matched) {
        const token = jwt.sign(
          { user: existingUser },
          process.env.ACCESS_SECRET_TOKEN,
          { expiresIn: "1h" }
        );
        let user = {
          name: existingUser.name,
          email: existingUser.email,
          gender: existingUser.gender,
          type: existingUser.type,
        };
        res.status(200).json({ user, token });
      } else {
        res
          .status(400)
          .json({ message: "Invalid email or password", statusCode: 400 });
      }
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

//Logout Controller
exports.logout = async (req, res) => {
  try {
    // get the token from the authorization header
    const token = req.headers.authorization.split(" ")[1];

    // invalidate the token by adding it to the blacklist
    await BlacklistToken.create({ token });

    res.json({ message: "Logout successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};
//Logout Controller
exports.deleteUser = async (req, res) => {
  try {
    let email = req.body.email;
    let userExist = await User.findOne({ email });
    console.log("userExist", userExist);
    if (userExist) {
      await User.deleteOne({ email });
      res.json({ message: "Deleted user" });
    } else {
      res.status(404).json({ message: "User not found", statusCode: 404 });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong", statusCode: 500 });
  }
};
