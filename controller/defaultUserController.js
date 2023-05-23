const DefaultUser = require("../models/defaultUser.model");
const fs = require("fs");

exports.editDefaultUser = async (req, res) => {
  const { username } = req.user; // Assuming the ID of the user to update is provided in the request URL

  const {
    name,
    phone,
    email,
    age,
    gender,
    ethnicity,
    nationality,
    country,
    city,
  } = req.body;
  const image = req.file;
  const directoryPath = __dirname + "/../uploads/escort/";
  try {
    let user = await DefaultUser.findOne({ username: username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.name = name || user.name;
    user.phone = phone || user.phone;
    user.email = email || user.email;
    user.age = age || user.age;
    if (user.profileImage.filename) {
      fs.unlinkSync(directoryPath + user.profileImage.filename, (err) => {
        if (err) {
          res.status(500).send({
            message: "Could not delete the file. " + err,
          });
        }
      });
      user.profileImage = { filename: image.filename, path: image.path };
    } else {
      user.profileImage = { filename: image.filename, path: image.path };
    }

    user.gender = gender || user.gender;
    user.ethnicity = ethnicity || user.ethnicity;
    user.nationality = nationality || user.nationality;
    user.country = country || user.country;
    user.city = city || user.city;

    const updatedUser = await user.save();
    res
      .status(200)
      .json({ updatedUser, statusCode: 200, message: "Profile updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await DefaultUser.find();
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getDefaultUserProfile = async (req, res) => {
  try {
    const { username } = req.user;
    const user = await DefaultUser.findOne({ username });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
