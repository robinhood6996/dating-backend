const { EscortProfile } = require("../models/escort.model");
const FakePhoto = require("../models/fakePhoto.model"); // Replace with the correct path to your model file
const watermark2 = require("jimp-watermark");
const fs = require("fs");
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

// Controller function to get all fakePhoto with limit, offset, and search
exports.getAllFakePhotos = async (req, res) => {
  const { limit, offset, search } = req.query;
  const query = { suspicious: true };

  // Apply search functionality if the "search" query parameter is provided
  if (search) {
    const searchRegex = new RegExp(search, "i"); // Case-insensitive search regex
    query.$or = [
      { name: searchRegex },
      { reporterName: searchRegex },
      { email: searchRegex },
      { reporterEmail: searchRegex },
      { username: searchRegex },
      { reporterUsername: searchRegex },
    ];
  }

  try {
    const totalCount = await FakePhoto.countDocuments(query);
    console.log("query", query);
    const fakePhotos = await FakePhoto.find(query)
      .limit(parseInt(limit) || 20) // Default limit is 10 if not provided or not a valid number
      .skip(parseInt(offset) || 0); // Default offset is 0 if not provided or not a valid number
    // .exec();

    res.status(200).json({
      fakePhotos,
      totalCount,
      count: fakePhotos.length,
    });
  } catch (error) {
    console.error("Error fetching fakePhotos:", error);
    res.status(500).json({ error: "Failed to fetch fakePhotos" });
  }
};
exports.getAllPendingFakePhotos = async (req, res) => {
  const { limit, offset, search } = req.query;
  const query = { suspicious: false };

  // Apply search functionality if the "search" query parameter is provided
  if (search) {
    const searchRegex = new RegExp(search, "i"); // Case-insensitive search regex
    query.$or = [
      { name: searchRegex },
      { reporterName: searchRegex },
      { email: searchRegex },
      { reporterEmail: searchRegex },
      { username: searchRegex },
      { reporterUsername: searchRegex },
    ];
  }

  try {
    const totalCount = await FakePhoto.countDocuments(query);

    const fakePhotos = await FakePhoto.find(query)
      .limit(parseInt(limit) || 20) // Default limit is 10 if not provided or not a valid number
      .skip(parseInt(offset) || 0) // Default offset is 0 if not provided or not a valid number
      .exec();

    res.status(200).json({
      fakePhotos,
      totalCount,
      count: fakePhotos.length,
    });
  } catch (error) {
    console.error("Error fetching fakePhotos:", error);
    res.status(500).json({ error: "Failed to fetch pending fakePhotos" });
  }
};

// Controller function to update suspicious field of a fakePhoto entry
exports.updateFakePhotoSuspicion = async (req, res) => {
  const { id } = req.params; // Extract the ID from URL parameters
  const { suspicious } = req.body; // Extract the new suspicious value from request body

  try {
    const fakePhoto = await FakePhoto.findOne({ _id: id });
    let escort = await EscortProfile.findOne({ userName: fakePhoto.username });
    let profileImage = escort?.profileImage;
    if (suspicious === true) {
      watermark2.addWatermark(
        `./uploads/escort/${profileImage}`,
        "./controller/suspicious.png",
        {
          dstPath: `./uploads/escort/${profileImage}`,
        }
      );
    }
    console.log("profileImage", profileImage);
    const updatedFakePhoto = await FakePhoto.findByIdAndUpdate(
      id,
      { $set: { suspicious } },
      { new: true }
    );

    if (!updatedFakePhoto) {
      return res.status(404).json({ message: "FakePhoto not found" });
    }

    res.status(200).json({
      message: "Suspicion status updated",
      fakePhoto: updatedFakePhoto,
    });
  } catch (error) {
    console.error("Error updating suspicion status:", error);
    res.status(500).json({ error: "Failed to update suspicion status" });
  }
};

//Delete Item
exports.deleteFakePhoto = async (req, res) => {
  const { id } = req.params; // Extract the ID from URL parameters

  try {
    const deletedFakePhoto = await FakePhoto.findByIdAndDelete(id);

    if (!deletedFakePhoto) {
      return res.status(404).json({ message: "FakePhoto not found" });
    }

    res
      .status(200)
      .json({ message: "FakePhoto deleted", fakePhoto: deletedFakePhoto });
  } catch (error) {
    console.error("Error deleting fakePhoto:", error);
    res.status(500).json({ error: "Failed to delete fakePhoto" });
  }
};
