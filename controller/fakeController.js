const FakePhoto = require("./path/to/fakePhotoModel"); // Replace with the correct path to your model file

// Controller function to add a new fakePhoto entry
exports.addFakePhoto = async (req, res) => {
  const {
    name,
    email,
    username,
    reporterName,
    reporterEmail,
    reporterUsername,
  } = req.body;

  try {
    // Create a new fakePhoto document
    const newFakePhoto = new FakePhoto({
      name: name.toLowerCase(),
      email: email.toLowerCase(),
      username: username.toLowerCase(),
      reporterName: reporterName.toLowerCase(),
      reporterEmail: reporterEmail.toLowerCase(),
      reporterUsername: reporterUsername.toLowerCase(),
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
