require("dotenv").config();
const User = require("../models/user.model");
const BlacklistToken = require("../models/blacklistToken.model");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { EscortProfile } = require("../models/escort.model");
const { generateRandomNumber } = require("../helpers/utils");
const defaultUser = require("../models/defaultUser.model");
const { sendWelcomeMessageToOwnerForEscort, sendWelcomeMessageToOwnerForUser, sendWelcomeMessageToUser, sendPasswordResetEmail } = require("../services/email.service");

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
    console.log("req.body.email", req.body);
    let nameSplit = req.body.email.split("@")[0];
    let username = nameSplit + generateRandomNumber();
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      // password: hashedPassword,
      gender: req.body.gender,
      age: req.body.age || null,
      phone: req.body.phone,
      type: req.body.type,
      username,
    });

    // Save the user document
    await user.save();
    if (user.type === "escort") {
      let escort = new EscortProfile({
        name: user.name,
        email: user.email,
        age: user.age,
        phone: req.body.phone,
        gender: user.gender.toLowerCase(),
        userName: username,
      });
      await escort.save();
      sendWelcomeMessageToOwnerForEscort(process.env.ADMIN_EMAIL, username);
      
    }
    if (user.type === "default") {
      let user = new defaultUser({
        name: req.body.name,
        email: req.body.email,
        age: req.body.age,
        phone: req.body.phone,
        gender: req.body.gender.toLowerCase(),
        username,
      });
      await user.save();
      sendWelcomeMessageToOwnerForUser(process.env.ADMIN_EMAIL, username)
    }
    sendWelcomeMessageToUser(user.email)
    return res.status(201).json({ message: "Successfully registered" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong", error });
  }
};

exports.getAllUser = async (req, res) => {
  try {
    const { search, limit, offset } = req.query;

    let query = {};

    if (search) {
      const searchRegex = new RegExp(search, "i");
      query.$or = [
        { email: searchRegex },
        { username: searchRegex },
        { name: searchRegex },
        // Add more fields as needed for searching
      ];
    }

    // Exclude the password field from the query projection
    const projection = { password: 0 };
    const totalUsers = await User.countDocuments(query);

    const allUsers = await User.find(query, projection)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(offset));
    res.status(200).json({
      data: allUsers,
      currentPage: Math.floor(offset / (parseInt(limit) || 10)) + 1,
      totalPages: Math.ceil(totalUsers / (parseInt(limit) || 10)),
      totalCount: totalUsers,
      resultCount: allUsers.length,
    });
  } catch (error) {
    console.log("user", error);
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
    if (existingUser) {
      // Generate a JWT token
      // const matched = await bcrypt.compare(password, existingUser.password);
      const matched = password === existingUser.password;
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
          username: existingUser.username,
        };
        res.status(200).json({ user, token });
      } else {
        res.status(400).json({
          message: "Invalid email or password",
          statusCode: 400,
          existingUser,
        });
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
    let requestedUser = req.user;
    let { username } = req.query;
    let userExist = await User.findOne({ username });

    // if (requestedUser.type === "admin") {
    if (userExist) {
      if (userExist.type === "escort") {
        const escort = await EscortProfile.findOne({ username });
        if (escort) {
          await escort.deleteOne();
        }
      }
      if (userExist.type === "default") {
        const defaultUsr = await defaultUser.findOne({ username });
        if (defaultUsr) {
          await defaultUsr.deleteOne();
        }
      }
      await userExist.deleteOne();
      res.status(200).json({ message: "Deleted user" });
    } else {
      res.status(404).json({ message: "User not found", statusCode: 404 });
    }
    // } else {
    //   res.status(405).json({
    //     message: "Sorry you're not allowed to delete user",
    //     statusCode: 405,
    //   });
    // }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong", statusCode: 500 });
  }
};

//Change Password
exports.changePassword = async (req, res) => {
  let requestedUser = req.user;
  console.log("requestedUser", requestedUser);
  const { currentPassword, newPassword } = req.body;

  try {
    // Find the user by ID
    const user = await User.findById(requestedUser._id);
    // return res.json(user);
    // Check if the user exists
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify the current password
    // const isPasswordValid = await bcrypt.compare(
    //   currentPassword,
    //   user.password
    // );

    const isPasswordValid = currentPassword === user.password;

    if (!isPasswordValid) {
      return res.status(403).json({ message: "Current password is incorrect" });
    }

    // Hash the new password
    // const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password
    user.password = newPassword;

    // Save the updated user document
    await user.save();
  sendPasswordForPwChange(requestedUser.email)
    return res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong", error });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Find the user with the provided email address
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate a JWT token with user's email for password reset
    const token = jwt.sign({ email }, process.env.ACCESS_SECRET_TOKEN, { expiresIn: '1h' });

    // Send password reset link/token to the user's email
    const resetLink = `${req.protocol}://${req.get('host')}/reset-password?token=${token}`;
    await sendPasswordResetEmail(email, resetLink); // Assuming you have a function to send email

    res.json({ message: 'Password reset link sent to your email' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    // Verify and decode the token
    const decoded = jwt.verify(token, process.env.ACCESS_SECRET_TOKEN);

    // Find the user with the decoded email
    const user = await User.findOne({ email: decoded.email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user's password
    user.password = newPassword; // Assuming you have a proper hashing mechanism for passwords
    await user.save();

    res.json({ message: 'Password reset successful' });
  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};