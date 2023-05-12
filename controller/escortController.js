const { EscortProfile } = require("../models/escort.model");
const User = require("../models/user.model");
const searchQueries = require("../helpers/categories.json");
const fs = require("fs");
// Update Biography Data
exports.updateBiographyData = async (req, res) => {
  const user = req.user;
  const {
    name,
    email,
    slogan,
    age,
    sex,
    ethnicity,
    nationality,
    country,
    state,
    category,
  } = req.body;
  console.log(req.body);
  try {
    // Find the escort profile by profileId
    const profile = await EscortProfile.findOne({ email: user.email });
    console.log(profile);
    if (name) profile.name = name;
    if (email) profile.email = email;
    if (slogan) profile.slogan = slogan;
    if (age) profile.age = age;
    if (sex) profile.gender = sex;
    if (ethnicity) profile.ethnicity = ethnicity;
    if (nationality) profile.nationality = nationality;
    if (country) profile.country = country;
    if (state) profile.state = state;
    if (category) profile.category = category;
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

//update physical Data
exports.updatePhysicalData = async (req, res) => {
  const { email } = req.user; // Extract the ID of the escort profile from the request params
  const {
    hairColor,
    eyeColor,
    hairLength,
    height,
    weight,
    dressSize,
    shoeSize,
    bustWaistHips,
    brest,
    brestSize,
    pubicHair,
    smoke,
    drinking,
    tattoos,
    piercings,
    languages,
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
    if (hairColor) profile.hairColor = hairColor;
    if (hairLength) profile.hairLength = hairLength;
    if (eyeColor) profile.eyeColor = eyeColor;
    if (height) profile.height = height;
    if (weight) profile.weight = weight;
    if (dressSize) profile.dressSize = dressSize;
    if (shoeSize) profile.shoeSize = shoeSize;
    if (bustWaistHips) profile.bustWaistHips = bustWaistHips;
    if (brest) profile.brest = brest;
    if (brestSize) profile.brestSize = brestSize;
    if (pubicHair) profile.pubicHair = pubicHair;
    if (smoke !== undefined) {
      if (typeof smoke !== "boolean") {
        throw new Error("Invalid data type for smoking");
      }
      profile.smoking = smoke;
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
        if (Object.keys(lang).length > 3) {
          throw new Error(
            "Invalid data type for language, expecting two keys language and expertise"
          );
        }
        if (lang["language"] === undefined && lang["type"] === undefined) {
          throw new Error(
            "Invalid data type for language, expecting two keys language and expertise"
          );
        }
      });
      let mergeSet = new Set([...profile.language, languages]);
      profile.languages = [...mergeSet];
    }
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
    console.log(error);
    res.status(500).json({
      message: "Something went wrong",
      error: error.message,
      statusCode: 500,
    });
  }
};

//update escort about data
exports.updateAdditionalData = async (req, res) => {
  const { email } = req.user; // Extract the ID of the escort profile from the request params
  const { about, aboutItalian } = req.body; // Extract the updated additional data from the request body

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
    if (aboutItalian) {
      if (typeof aboutItalian !== "string") {
        throw new Error("Invalid data type for about Italian");
      }
      profile.aboutItalian = aboutItalian;
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

//Working cities upate api
exports.workingCity = async (req, res) => {
  const { email } = req.user;
  const { secondCity, thirdCity, fourthCity, inCall, outCall } = req.body;
  try {
    const profile = await EscortProfile.findOne({ email });
    if (!profile) {
      return res
        .status(404)
        .json({ message: "Escort profile not found", statusCode: 404 });
    }
    let workingCities = {};
    if (secondCity) {
      if (typeof secondCity !== "string") {
        throw new Error("Invalid data type for secondCity");
      }
      profile.workingCities.secondCity = secondCity;
    }
    if (thirdCity) {
      if (typeof thirdCity !== "string") {
        throw new Error("Invalid data type for thirdCity");
      }
      profile.workingCities.thirdCity = thirdCity;
    }
    if (fourthCity) {
      if (typeof fourthCity !== "string") {
        throw new Error("Invalid data type for fourthCity");
      }
      profile.workingCities.fourthCity = fourthCity;
    }
    if (inCall) {
      if (typeof inCall !== "string") {
        throw new Error("Invalid data type for inCall");
      }
      profile.incomingCall = inCall;
    }
    if (outCall) {
      if (typeof outCall !== "string") {
        throw new Error("Invalid data type for inCall");
      }
      profile.outgoingCall = outCall;
    }

    await profile.save();
    res.status(200).json({
      message: "Working cities data updated successfully",
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
exports.updateServices = async (req, res) => {
  const { email } = req.user;
  const { orientation, offerFor, services } = req.body;
  try {
    const profile = await EscortProfile.findOne({ email });
    if (!profile) {
      return res
        .status(404)
        .json({ message: "Escort profile not found", statusCode: 404 });
    }

    if (orientation) {
      if (typeof orientation !== "string") {
        throw new Error("Invalid data type for secondCity");
      }
      profile.orientation = orientation;
    }
    if (services) {
      console.log(services);
      if (typeof services !== "object" && !services.isArray()) {
        throw new Error("Invalid data type for services");
      }
      const currentServices = [...profile.services];
      if (services.length) {
        let servicesSet = new Set([...currentServices, ...services]);
        profile.services = [...servicesSet];
      }
    }
    if (offerFor) {
      if (typeof offerFor !== "object" && !services.isArray()) {
        throw new Error("Invalid data type for services");
      }
      let currentOfferFor = [...profile.offerFor];
      if (offerFor.length) {
        offerFor.forEach((offer) => {
          if (!profile.offerFor.includes(offer)) {
            currentOfferFor.push(offer);
          }
        });
      }
      profile.offerFor = currentOfferFor;
    }

    await profile.save();
    res.status(200).json({
      message: "Services data updated successfully",
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
      .json({ message: "Failed to update services data", statusCode: 500 });
  }
};

//Update Contact Data
exports.updateContactData = async (req, res) => {
  const { email: userEmail } = req.user; // Extract the ID of the escort profile from the request params
  const { countryCode, phone, phoneDirection, apps, website, contactEmail } =
    req.body; // Extract the updated contact data from the request body

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
    if (countryCode) {
      profile.countryCode = countryCode;
    }
    if (phone) {
      profile.phone = phone;
    }
    if (phoneDirection) {
      if (typeof phoneDirection !== "string") {
        throw new Error("Invalid data type for phoneDirection");
      }
      profile.phoneDirection = phoneDirection;
    }
    if (apps) {
      if (profile?.apps.length > 0) {
        let prevApps = new Set([...profile.apps, ...apps]);
        profile.apps = [...prevApps];
      } else {
        profile.apps = [...apps];
      }
    }
    if (website) {
      if (typeof website !== "string") {
        throw new Error("Invalid data type for website");
      }
      profile.website = website;
    }
    if (contactEmail) {
      if (typeof contactEmail !== "string") {
        throw new Error("Invalid data type for email");
      }
      profile.contactEmail = contactEmail;
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

//Get all escorts data
exports.getAllEscort = async (req, res) => {
  try {
    let { limit, offset, gender, category } = req.query;
    let genderN = gender?.toLowerCase();
    let query = {};
    if (gender) query.gender = genderN;
    if (category) query.category = category;
    // Fetch all escort profiles from the database
    const escorts = await EscortProfile.find({ ...query })
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

//Get escort data
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
//Get escort data
exports.getEscortProfile = async (req, res) => {
  try {
    let { email } = req.user;
    console.log(req.user);
    let escort = await EscortProfile.findOne({ email });
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

//Get escorts data
exports.getEscorts = async (req, res) => {
  try {
    let {
      country,
      nationality,
      state,
      baseCity,
      realPics,
      verified,
      pornStar,
      withVideo,
      limit,
      offset,
      services,
      inCall,
      outCall,
      hairColor,
      eyeColor,
      breastSize,
      ethnicity,
      gender,
      height,
      orientation,
      weight,
      tattoos,
      piercings,
      available24,
    } = req.query;

    let query = { $or: [] };

    if (country) {
      query.$or.push({ country });
    }
    if (nationality) {
      query.$or.push({ nationality });
    }
    if (state) {
      query.$or.push({ state });
    }
    if (baseCity) {
      query.$or.push({ baseCity: baseCity.toLowerCase() });
    }
    if (realPics) {
      query.$or.push({ realPics });
    }
    if (withVideo) {
      query.$or.push({ withVideo });
    }
    if (verified) {
      query.$or.push({ verified: verified });
    }
    if (pornStar) {
      query.$or.push({ pornStar });
    }
    if (tattoos) {
      query.$or.push({ tattoos });
    }
    if (piercings) {
      query.$or.push({ piercings });
    }
    if (available24) {
      query.$or.push({ available24 });
    }
    if (services) {
      let servicesArray = services.split(",");
      query.$or.push({ services: { $in: servicesArray } });
    }
    if (weight) {
      let weights = weight.split(",").map((h) => h.trim().toLowerCase());
      query.$or.push({ weight: { $in: weights } });
    }
    if (height) {
      let heights = height.split(",").map((h) => h.trim().toLowerCase());
      query.$or.push({ height: { $in: heights } });
    }
    if (hairColor) {
      query.$or.push({ hairColor: hairColor.toLowerCase() });
    }
    if (eyeColor) {
      query.$or.push({ hairColor: hairColor.toLowerCase() });
    }
    if (breastSize) {
      query.$or.push({ breastSize: breastSize.toLowerCase() });
    }
    if (ethnicity) {
      query.$or.push({ ethnicity: ethnicity.toLowerCase() });
    }
    if (gender) {
      let genders = gender.split(",").map((h) => h.trim().toLowerCase());
      query.$or.push({ gender: { $in: genders } });
    }
    if (inCall) {
      let inCalls = inCall.split(",").map((h) => h.trim().toLowerCase());
      query.$or.push({ inCall: { $in: inCalls } });
    }
    if (outCall) {
      let outCalls = outCall.split(",").map((h) => h.trim().toLowerCase());
      query.$or.push({ outCall: { $in: outCalls } });
    }
    if (orientation) {
      let orientations = orientation
        .split(",")
        .map((h) => h.trim().toLowerCase());
      query.$or.push({ orientation: { $in: orientations } });
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

//Upload photo
exports.uploadFile = async (req, res) => {
  try {
    let user = req.user;
    if (req.files) {
      let files = req.files.map((file) => {
        console.log("file", file);
        // let image = file.path.replace("\\", "/");
        // let image2 = image.replace("\\", "/");
        return file;
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
      return res.status(200).json({
        message: "Photo Uploaded",
        images: escort.images,
        statusCode: 200,
      });
    }
    res.send();
  } catch (error) {
    return res.status(500).json({ message: "Error", error, statusCode: 500 });
  }
};

//Upload video
exports.uploadVideos = async (req, res) => {
  try {
    let user = req.user;
    if (req.files) {
      let files = req.files.map((file) => {
        console.log("file", file);
        // let image = file.path.replace("\\", "/");
        // let image2 = image.replace("\\", "/");
        return file;
      });
      let escort = await EscortProfile.findOne({ email: user.email });
      console.log("escort", escort);
      if (escort?.videos.length > 0) {
        let currentVideos = [...escort.videos];
        files.map((file) => {
          currentVideos.push(file);
        });
        escort.videos = currentVideos;
      } else {
        escort.videos = files;
      }
      await escort.save();
      return res.status(200).json({
        message: "Video Uploaded",
        images: escort.videos,
        statusCode: 200,
      });
    }
    res.send();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error", error, statusCode: 500 });
  }
};

//Get escort data by category
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

//Get escort data by categories
exports.escortCategories = async (req, res) => {
  let categories = searchQueries;
  res.status(200).json({ data: categories });
};

//Upload profile image
exports.uploadProfileImage = async (req, res) => {
  try {
    let user = req.user;
    if (req.files) {
      let files = req.files[0];
      let profileImage = files.filename;
      let escort = await EscortProfile.findOne({ email: user.email });

      escort.profileImage = profileImage;
      await escort.save();
      return res.status(200).json({
        message: "Profile Photo Uploaded",
        escort,
        statusCode: 200,
      });
    }
  } catch (error) {
    return res.status(500).json({ message: "Error", error, statusCode: 500 });
  }
};
//Delete images
exports.deleteImage = async (req, res) => {
  try {
    let user = req.user;
    const { filename } = req.query;
    const directoryPath = __dirname + "/../uploads/escort/";
    if (filename) {
      let escort = await EscortProfile.findOne({ email: user.email });
      if (escort) {
        let existFile = escort?.images?.find(
          (img) => img.filename === filename
        );
        if (existFile) {
          fs.unlinkSync(directoryPath + filename, (err) => {
            if (err) {
              res.status(500).send({
                message: "Could not delete the file. " + err,
              });
            }
          });
          let filtered = escort.images.filter(
            (img) => img.filename !== filename
          );
          escort.images = filtered;
          await escort.save();
          return res.status(200).json({
            message: "Deleted image",
            escort,
            statusCode: 200,
          });
        }
        return res.status(403).json({
          message: "You are not allowed for this action",
          statusCode: 403,
        });
      } else {
        return res.status(401).json({
          message: "Escort not found",
          escort,
          statusCode: 401,
        });
      }
    }
    return res.status(400).json({
      message: "image parameter expected with filename",
      statusCode: 400,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error", error, statusCode: 500 });
  }
};

//Delete videos
exports.deleteVideo = async (req, res) => {
  try {
    let user = req.user;
    const { filename } = req.query;
    const directoryPath = __dirname + "/../uploads/escort/videos/";
    if (filename) {
      let escort = await EscortProfile.findOne({ email: user.email });
      if (escort) {
        let existFile = escort?.videos?.find(
          (vid) => vid.filename === filename
        );
        if (existFile) {
          fs.unlinkSync(directoryPath + filename, (err) => {
            if (err) {
              res.status(500).send({
                message: "Could not delete the file. " + err,
              });
            }
          });
          let filtered = escort.videos.filter(
            (vid) => vid.filename !== filename
          );
          escort.videos = filtered;
          await escort.save();
          return res.status(200).json({
            message: "Deleted video",
            escort,
            statusCode: 200,
          });
        }
        return res.status(403).json({
          message: "You are not allowed for this action",
          statusCode: 403,
        });
      } else {
        return res.status(401).json({
          message: "Escort not found",
          escort,
          statusCode: 401,
        });
      }
    }
    return res.status(400).json({
      message: "video parameter expected with filename",
      statusCode: 400,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error", error, statusCode: 500 });
  }
};

exports.workingHours = async (req, res) => {
  let { email } = req.user;
  const { available24, availableDate, vacation } = req.query;

  try {
    let escort = await EscortProfile.findOne({ email });
    if (escort) {
      if (available24) {
        escort.available24 = available24;
      }
      if (availableDate) {
        if (escort?.availableDate?.length > 0) {
          let formated = availableDate.map((date) => {
            let exist = escort?.availableDate.find(
              (date2) => date2.day === date.day
            );
            if (exist) {
              return {
                ...exist,
                from: date.from,
                to: date.to,
              };
            }
            return date;
          });
          escort.availableDate = formated;
        } else {
          escort.availableDate = availableDate;
        }
      }
      if (vacation) {
        const { from, to } = vacation;
        // Check if from and to dates are not in the past
        if (new Date(from) < new Date() || new Date(to) < new Date()) {
          return res.status(400).json({
            message: "Vacation date must not be in the past",
            statusCode: 400,
          });
        }
        escort.vacation = vacation;
      }

      await escort.save();
      return res.status(200).json({
        message: "Working hours data updated",
        escort,
        statusCode: 200,
      });
    }
    return res.status(401).json({
      message: "Escort not found",
      escort,
      statusCode: 401,
    });
  } catch (error) {
    return res.status(500).json({ message: "Error", error, statusCode: 500 });
  }
};
