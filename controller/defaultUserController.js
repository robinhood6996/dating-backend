const { defaultUser } = require("../models/defaultUser.model");

exports.editDefaultUser = async (req, res) => {
  try {
    const { username } = req.user; // Assuming userId is passed as a parameter
    console.log("user", req.user);
    const { name, phone, gender, ethnicity, nationality, country, city, age } =
      req.body;

    // Construct the update object with the provided fields
    const update = {
      name,
      phone,
      gender,
      ethnicity,
      nationality,
      country,
      city,
      age,
    };

    // Find the user by ID and update the fields
    const existUser = await defaultUser.findOne({ username });
    if (existUser) {
      if (name) existUser.name = name;
      if (phone) existUser.phone = phone;
      if (gender) existUser.gender = gender;
      if (ethnicity) existUser.ethnicity = ethnicity;
      if (nationality) existUser.nationality = nationality;
      if (country) existUser.country = country;
      if (city) existUser.city = city;
      if (age) existUser.age = age;
      await existUser.save();
      return res
        .status(200)
        .json({ user: existUser, message: "User updated successfully" });
    } else {
      return res
        .status(404)
        .json({ message: "User not found", statusCode: 404 });
    }
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
