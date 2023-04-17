const { EscortProfile } = require("../models/escort.model");
const User = require("../models/user.model");

// Update Biography Data
exports.updateBiographyData = async (req, res) => {
  const { name, email, slogan, age, gender, ethnicity, nationality } = req.body;
  const user = req.user;
  try {
    // Find the escort profile by profileId
    const profile = await EscortProfile.findOne({ email: user.email });

    // Update the physical data
    if (hairColor) profile.hairColor = hairColor;
    if (eyeColor) profile.eyeColor = eyeColor;
    if (height) profile.height = height;
    if (weight) profile.weight = weight;
    if (dressSize) profile.dressSize = dressSize;
    if (shoeSize) profile.shoeSize = shoeSize;
    if (bustWaistHips) profile.bustWaistHips = bustWaistHips;
    if (brest) profile.brest = brest;
    if (pubicHair) profile.pubicHair = pubicHair;

    // Save the updated profile
    await profile.save();

    res.status(200).json({
      success: true,
      message: "Biography data updated successfully",
      data: profile,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      // If the error is due to data type validation, send an error response
      return res.status(400).json({
        message: "Data type validation failed",
        error: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to update biography data",
      error,
    });
  }
};

exports.updatePhysicalData = async (req, res) => {
  const { email } = req.user; // Extract the ID of the escort profile from the request params
  const {
    hairColor,
    eyeColor,
    height,
    weight,
    dressSize,
    shoeSize,
    bustWaistHips,
    brest,
    pubicHair,
  } = req.body; // Extract the updated physical data from the request body

  try {
    // Find the escort profile by ID
    const profile = await EscortProfile.findOne({ email });
    // If the profile is not found, send an error response
    if (!profile) {
      return res.status(404).json({ message: "Escort profile not found" });
    }
    // Update the physical data
    profile.hairColor = hairColor;
    profile.eyeColor = eyeColor;
    profile.height = height;
    profile.weight = weight;
    profile.dressSize = dressSize;
    profile.shoeSize = shoeSize;
    profile.bustWaistHips = bustWaistHips;
    profile.brest = brest;
    profile.pubicHair = pubicHair;
    // Save the updated profile to the database
    await profile.save();
    // Send a success response
    res
      .status(200)
      .json({ message: "Physical data updated successfully", data: profile });
  } catch (error) {
    // Send an error response if something goes wrong
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};

exports.updateAdditionalData = async (req, res) => {
  const { email } = req.user; // Extract the ID of the escort profile from the request params
  const { about, smoking, drinking, tattoos, piercings } = req.body; // Extract the updated additional data from the request body

  try {
    // Find the escort profile by ID
    const profile = await EscortProfile.findOne({ email });

    // If the profile is not found, send an error response
    if (!profile) {
      return res.status(404).json({ message: "Escort profile not found" });
    }

    // Validate and update the additional data
    if (about) {
      if (typeof about !== "string") {
        throw new Error("Invalid data type for about");
      }
      profile.about = about;
    }
    if (smoking !== undefined) {
      if (typeof smoking !== "boolean") {
        throw new Error("Invalid data type for smoking");
      }
      profile.smoking = smoking;
    }
    if (drinking !== undefined) {
      if (typeof drinking !== "boolean") {
        throw new Error("Invalid data type for drinking");
      }
      profile.drinking = drinking;
    }
    if (tattoos !== undefined) {
      if (typeof tattoos !== "boolean") {
        throw new Error("Invalid data type for tattoos");
      }
      profile.tattoos = tattoos;
    }
    if (piercings !== undefined) {
      if (typeof piercings !== "boolean") {
        throw new Error("Invalid data type for piercings");
      }
      profile.piercings = piercings;
    }

    // Save the updated profile to the database
    await profile.save();

    // Send a success response
    res
      .status(200)
      .json({ message: "Additional data updated successfully", data: profile });
  } catch (error) {
    // Handle known errors
    if (error.name === "ValidationError") {
      // If the error is due to data type validation, send an error response
      return res
        .status(400)
        .json({ message: "Data type validation failed", error: error.message });
    } else if (error instanceof Error) {
      // If a custom error is thrown, send an error response
      return res.status(400).json({ message: error.message });
    }

    // Handle unknown errors
    res.status(500).json({ message: "Failed to update additional data" });
  }
};

exports.updateContactData = async (req, res) => {
  const { email } = req.user; // Extract the ID of the escort profile from the request params
  const { phone, phoneDirection, apps, website } = req.body; // Extract the updated contact data from the request body

  try {
    // Find the escort profile by ID
    const profile = await EscortProfile.findOne({ email });

    // If the profile is not found, send an error response
    if (!profile) {
      return res.status(404).json({ message: "Escort profile not found" });
    }

    // Validate and update the contact data
    if (phone) {
      if (typeof phone !== "string") {
        throw new Error("Invalid data type for phone");
      }
      profile.phone = phone;
    }
    if (phoneDirection) {
      if (typeof phoneDirection !== "string") {
        throw new Error("Invalid data type for phoneDirection");
      }
      profile.phoneDirection = phoneDirection;
    }
    if (apps) {
      if (typeof apps !== "string") {
        throw new Error("Invalid data type for apps");
      }
      profile.apps = apps;
    }
    if (website) {
      if (typeof website !== "string") {
        throw new Error("Invalid data type for website");
      }
      profile.website = website;
    }

    // Save the updated profile to the database
    await profile.save();

    // Send a success response
    res
      .status(200)
      .json({ message: "Contact data updated successfully", data: profile });
  } catch (error) {
    // Handle known errors
    if (error.name === "ValidationError") {
      // If the error is due to data type validation, send an error response
      return res
        .status(400)
        .json({ message: "Data type validation failed", error: error.message });
    } else if (error instanceof Error) {
      // If a custom error is thrown, send an error response
      return res.status(400).json({ message: error.message });
    }

    // Handle unknown errors
    res.status(500).json({ message: "Failed to update contact data" });
  }
};

exports.getAllEscort = async (req, res) => {
  try {
    // Fetch all escort profiles from the database
    const escorts = await EscortProfile.find({});
    // Send the retrieved data as a response
    res.status(200).json({
      message: "All escort profiles retrieved successfully",
      data: escorts,
    });
  } catch (error) {
    // Send an error response if something goes wrong
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};
