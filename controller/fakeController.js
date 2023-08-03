const FakePhoto = require("../models/fakePhoto.model"); // Replace with the correct path to your model file

// Controller function to add a new fakePhoto entry
exports.addFakePhoto = async (req, res) => {
  const { name, email, username, comment } = req.body;
  const user = req.user;
  try {
    // Create a new fakePhoto document
    const newFakePhoto = new FakePhoto({
      name: name.toLowerCase(),
      email: email.toLowerCase(),
      username: username,
      reporterName: user.name,
      reporterEmail: user.email,
      reporterUsername: user.username,
      comment,
    });

    // Save the new fakePhoto entry to the database
    await newFakePhoto.save();

    res.status(201).json({
      message: "FakePhoto entry added successfully",
      fakePhoto: newFakePhoto,
    });
  } catch (error) {
    console.error("Error adding fakePhoto entry:", error);
    res.status(500).json({ error: "Failed to add fakePhoto entry" });
  }
};
