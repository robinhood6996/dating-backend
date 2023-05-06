const { EscortProfile } = require("../models/escort.model");
const User = require("../models/user.model");

// Update Biography Data
exports.updateBiographyData = async (req, res) => {
  const user = req.user;
  const { name, email, slogan, age, gender, ethnicity, nationality } = req.body;
  try {
    // Find the escort profile by profileId
    const profile = await EscortProfile.findOne({ email: user.email });
    console.log(profile);
    if (name) profile.name = name;
    if (email) profile.email = email;
    if (slogan) profile.slogan = slogan;
    if (age) profile.age = age;
    if (gender) profile.gender = gender;
    if (ethnicity) profile.ethnicity = ethnicity;
    if (nationality) profile.nationality = nationality;
    // Save the updated profile
    await profile.save();

    res.status(200).json({
      success: true,
      message: "Biography data updated successfully",
      data: profile,
      statusCode: 200,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      // If the error is due to data type validation, send an error response
      return res.status(400).json({
        message: "Data type validation failed",
        error: error.message,
        statusCode: 400,
      });
    }
    // console.log(error);
    res.status(500).json({
      success: false,
      message: "Failed to update biography data",
      error,
      statusCode: 500,
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
      return res
        .status(404)
        .json({ message: "Escort profile not found", statusCode: 404 });
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
    res.status(200).json({
      message: "Physical data updated successfully",
      data: profile,
      statusCode: 200,
    });
  } catch (error) {
    // Send an error response if something goes wrong
    res.status(500).json({
      message: "Something went wrong",
      error: error.message,
      statusCode: 500,
    });
  }
};

exports.updateAdditionalData = async (req, res) => {
  const { email } = req.user; // Extract the ID of the escort profile from the request params
  const { about, smoking, drinking, tattoos, piercings, languages } = req.body; // Extract the updated additional data from the request body

  try {
    // Find the escort profile by ID
    const profile = await EscortProfile.findOne({ email });

    // If the profile is not found, send an error response
    if (!profile) {
      return res
        .status(404)
        .json({ message: "Escort profile not found", statusCode: 404 });
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
    if (languages !== undefined) {
      if (!Array.isArray(languages)) {
        throw new Error(
          "Invalid data type for languages, Expecting array of language object"
        );
      }
      languages.forEach((lang) => {
        if (Object.keys(lang).length > 2) {
          throw new Error(
            "Invalid data type for language, expecting two keys language and expertise"
          );
        }
        if (lang["language"] === undefined && lang["expertise"] === undefined) {
          throw new Error(
            "Invalid data type for language, expecting two keys language and expertise"
          );
        }
      });
      profile.languages = languages;
    }
    // Save the updated profile to the database
    await profile.save();

    // Send a success response
    res.status(200).json({
      message: "Additional data updated successfully",
      data: profile,
      statusCode: 200,
    });
  } catch (error) {
    // Handle known errors
    if (error.name === "ValidationError") {
      // If the error is due to data type validation, send an error response
      return res.status(400).json({
        message: "Data type validation failed",
        error: error.message,
        statusCode: 400,
      });
    } else if (error instanceof Error) {
      // If a custom error is thrown, send an error response
      return res.status(400).json({ message: error.message, statusCode: 400 });
    }

    // Handle unknown errors
    res
      .status(500)
      .json({ message: "Failed to update additional data", statusCode: 500 });
  }
};

exports.updateContactData = async (req, res) => {
  const { email: userEmail } = req.user; // Extract the ID of the escort profile from the request params
  const { phone, phoneDirection, apps, website, email } = req.body; // Extract the updated contact data from the request body

  try {
    // Find the escort profile by ID
    const profile = await EscortProfile.findOne({ email: userEmail });

    // If the profile is not found, send an error response
    if (!profile) {
      return res
        .status(404)
        .json({ message: "Escort profile not found", statusCode: 404 });
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
    if (email) {
      if (typeof website !== "string") {
        throw new Error("Invalid data type for email");
      }
      profile.website = website;
    }

    // Save the updated profile to the database
    await profile.save();

    // Send a success response
    res.status(200).json({
      message: "Contact data updated successfully",
      data: profile,
      statusCode: 200,
    });
  } catch (error) {
    // Handle known errors
    if (error.name === "ValidationError") {
      // If the error is due to data type validation, send an error response
      return res.status(400).json({
        message: "Data type validation failed",
        error: error.message,
        statusCode: 400,
      });
    } else if (error instanceof Error) {
      // If a custom error is thrown, send an error response
      return res.status(400).json({ message: error.message, statusCode: 400 });
    }

    // Handle unknown errors
    res
      .status(500)
      .json({ message: "Failed to update contact data", statusCode: 500 });
  }
};

exports.getAllEscort = async (req, res) => {
  try {
    let { limit, offset, gender } = req.query;
    let genderN = gender?.toLowerCase();
    // Fetch all escort profiles from the database
    const escorts = await EscortProfile.find({ gender: genderN })
      .limit(limit || 0)
      .skip(offset || 0)
      .exec();
    // Send the retrieved data as a response
    res.status(200).json({
      message: "All escort profiles retrieved successfully",
      resultCount: escorts.length,
      data: escorts,
      statusCode: 200,
    });
  } catch (error) {
    // Send an error response if something goes wrong
    res.status(500).json({
      message: "Something went wrong",
      error: error.message,
      statusCode: 500,
    });
  }
};

exports.getEscort = async (req, res) => {
  try {
    let { username } = req.query;
    console.log("escort", username);
    let escort = await EscortProfile.findOne({ username });
    if (escort) {
      return res.status(200).json({ data: escort, statusCode: 200 });
    } else {
      return res
        .status(404)
        .json({ message: "No escort found", statusCode: 404 });
    }
  } catch (error) {
    console.log("error", error);
    return res
      .status(500)
      .json({ message: "Something went wrong", statusCode: 500 });
  }
};

exports.getEscorts = async (req, res) => {
  try {
    let { country, limit, offset } = req.query;
    let query = {};
    if (country) {
      query.country = country;
    }

    let escort = await EscortProfile.find(query)
      .limit(limit || 0)
      .skip(offset || 0)
      .exec();
    if (escort) {
      return res
        .status(200)
        .json({ data: escort, resultCount: escort.length, statusCode: 200 });
    } else {
      return res
        .status(404)
        .json({ message: "No escort found", statusCode: 404 });
    }
  } catch (error) {
    console.log("error", error);
    return res
      .status(500)
      .json({ message: "Something went wrong", statusCode: 500 });
  }
};

exports.uploadFile = async (req, res) => {
  try {
    let user = req.user;
    if (req.files) {
      let files = req.files.map((file) => {
        let image = file.path.replace("\\", "/");
        let image2 = image.replace("\\", "/");
        return image2;
      });
      let escortImages = [...files];
      let escort = await EscortProfile.findOne({ email: user.email });
      console.log("escort", escort);
      let currentImages = [...escort.images];
      files.map((file) => {
        currentImages.push(file);
      });
      escort.images = currentImages;
      await escort.save();
      return res
        .status(200)
        .json({ message: "Photo Uploaded", statusCode: 200 });
    }
    res.send();
  } catch (error) {
    return res.status(500).json({ message: "Error", error, statusCode: 500 });
  }
};

exports.getEscortByCat = async (req, res) => {
  try {
    let { cat } = req.params;
    let { limit, offset } = req.query;

    let escort = await EscortProfile.find({ gender: cat })
      .limit(limit)
      .skip(offset)
      .exec();
    if (escort) {
      return res
        .status(200)
        .json({ escort, resultCount: escort.length, statusCode: 200 });
    } else {
      return res
        .status(404)
        .json({ message: "No escort found", statusCode: 404 });
    }
  } catch (error) {
    console.log("error", error);
    return res
      .status(500)
      .json({ message: "Something went wrong", statusCode: 500 });
  }
};
