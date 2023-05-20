const { defaultUser } = require("../models/defaultUser.model");

exports.editDefaultUser = async (req, res) => {
  try {
    const { username } = req.user; // Assuming userId is passed as a parameter
    console.log("user", req.user);
    const { name, phone, gender, ethnicity, nationality, country, city } =
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
    };

    // Find the user by ID and update the fields
    const updatedUser = await defaultUser
      .findOneAndUpdate(
        { username: username },
        { $set: { ...update } },
        {
          new: true,
        }
      )
      .then((value) => {})
      .catch((err) => {
        console.log("error", err);
      });

    if (updatedUser) {
      res
        .status(200)
        .json({ user: updatedUser, message: "User updated successfully" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
