const Jimp = require("jimp");
const watermark2 = require("jimp-watermark");
const ffmpeg = require("fluent-ffmpeg");
const { EscortProfile } = require("../models/escort.model");
const User = require("../models/user.model");
const searchQueries = require("../helpers/categories.json");
const fs = require("fs");
const Countries = require("../models/countries.model");
const citiesModel = require("../models/cities.model");
const userModel = require("../models/user.model");
const { mergeArrays } = require("../helpers/utils");
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
    baseCity,
    area,
  } = req.body;
  try {
    // Find the escort profile by profileId
    const profile = await EscortProfile.findOne({ email: user.email });

    if (name) profile.name = name;
    if (email) profile.email = email;
    if (slogan) profile.slogan = slogan;
    if (age) profile.age = age;
    if (sex) profile.gender = sex;
    if (ethnicity) profile.ethnicity = ethnicity;
    if (nationality) profile.nationality = nationality;
    if (country) {
      let previousCountry = profile.country;
      if (previousCountry === country) {
        profile.country = country;
      } else {
        let previous = await Countries.findOne({ name: profile?.country });
        if (previous) {
          previous.escortCount = previous.escortCount - 1;
          await previous.save();
        }
        let foundCountry = await Countries.findOne({ name: country });
        if (foundCountry) {
          foundCountry.escortCount += 1;
          await foundCountry.save();
        }
        profile.country = country;
      }
    }
    if (baseCity) {
      let previousCity = profile.baseCity;
      if (previousCity === baseCity) {
        profile.baseCity = baseCity;
      } else {
        let previous = await citiesModel.findOne({ name: profile?.baseCity });
        if (previous) {
          previous.escortCount = previous.escortCount - 1;
          await previous.save();
        }
        let foundCity = await citiesModel.findOne({ name: baseCity });
        if (foundCity) {
          foundCity.escortCount += 1;
          await foundCity.save();
        }
        profile.baseCity = baseCity;
      }
    }
    if (category) profile.category = category;
    if (area) {
      profile.area = area;
    }
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
    breastSize,
    pubicHair,
    smoke,
    drinking,
    tattoos,
    piercings,
    languages,
    breast,
    resetLanguage,
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
    if (breastSize) profile.brestSize = breastSize;
    if (pubicHair) profile.pubicHair = pubicHair;
    if (breast) profile.breast = breast;
    if (smoke) profile.smoke = smoke;
    if (drinking) profile.drinking = drinking;
    if (tattoos) profile.tattoos = tattoos;
    if (piercings) profile.piercings = piercings;

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
      let currentLanguages = [...profile.languages];

      // let mergeSet = new Set([...profile.languages, ...languages]);
      // profile.languages = [...mergeSet];

      let languagesNew = mergeArrays(currentLanguages, languages);
      profile.languages = languagesNew;
    }
    if (resetLanguage) {
      profile.languages = [];
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
    console.log("error=>", error);
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
    let query = { isActive: true };
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
    let escort = await EscortProfile.findOne({ userName: username });
    if (escort) {
      return res.status(200).json({ data: escort, statusCode: 200 });
    } else {
      return res
        .status(404)
        .json({ message: "No escort found", statusCode: 404 });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Something went wrong", statusCode: 500 });
  }
};
//Get escort data
exports.getEscortProfile = async (req, res) => {
  try {
    let { email } = req.user;
    let escort = await EscortProfile.findOne({ email });
    if (escort) {
      return res.status(200).json({ data: escort, statusCode: 200 });
    } else {
      return res
        .status(404)
        .json({ message: "No escort found", statusCode: 404 });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Something went wrong", statusCode: 500 });
  }
};
function formatWord(word) {
  // Use a regular expression to insert a space before each uppercase letter (except the first one)
  var formattedWord = word.replace(/([A-Z])/g, " $1");

  // Capitalize the first letter
  formattedWord =
    formattedWord.charAt(0).toUpperCase() + formattedWord.slice(1);

  return formattedWord;
}
//Get escorts data
exports.getEscorts = async (req, res) => {
  try {
    let {
      country,
      nationality,
      area,
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

    let query = { $or: [], isActive: true };
    if (country) {
      query.country = country;
    }
    if (nationality) {
      query.nationality = nationality;
    }
    if (area) {
      query.area = area.toLowerCase();
    }
    if (baseCity) {
      query.baseCity = baseCity.toLowerCase();
    }
    if (realPics) {
      query.realPics = realPics;
    }
    if (withVideo) {
      query.withVideo = withVideo;
    }
    if (verified) {
      query.verified = verified;
    }
    if (pornStar) {
      query.pornStar = pornStar;
    }
    if (tattoos) {
      query.tattoos = tattoos;
    }
    if (piercings) {
      query.piercings = piercings;
    }
    if (available24) {
      query.available24 = available24;
    }
    if (services) {
      let servicesArray = services.split(",");
      query.services = { $in: servicesArray };
    }
    if (weight) {
      let weights = weight.split(",").map((h) => h.trim().toLowerCase());
      query.weight = { $in: weights };
    }
    if (height) {
      let heights = height.split(",").map((h) => h.trim().toLowerCase());
      query.height = { $in: heights };
    }
    if (hairColor) {
      query.hairColor = hairColor.toLowerCase();
    }
    if (eyeColor) {
      query.eyeColor = eyeColor.toLowerCase();
    }
    if (breastSize) {
      query.breastSize = breastSize.toLowerCase();
    }
    if (ethnicity) {
      query.ethnicity = ethnicity.toLowerCase();
    }
    if (gender) {
      let genders = gender.split(",").map((h) => h.trim().toLowerCase());
      query.gender = { $in: genders };
    }
    if (inCall) {
      let inCalls = inCall.split(",").map((h) => h.trim().toLowerCase());
      query.inCall = { $in: inCalls };
    }
    if (outCall) {
      let outCalls = outCall.split(",").map((h) => h.trim().toLowerCase());
      query.outCall = { $in: outCalls };
    }
    if (orientation) {
      let orientations = orientation
        .split(",")
        .map((h) => h.trim().toLowerCase());
      query.orientation = { $in: orientations };
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
        // let image = file.path.replace("\\", "/");
        // let image2 = image.replace("\\", "/");
        return file;
      });
      let escortImages = [...files];
      let escort = await EscortProfile.findOne({ email: user.email });
      let currentImages = [...escort.images];
      files.map((file) => {
        watermark2.addWatermark(file.path, "./controller/watermark.png", {
          dstPath: `./uploads/escort/${file.filename}`,
        });
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
        // let image = file.path.replace("\\", "/");
        // let image2 = image.replace("\\", "/");
        return file;
      });
      let escort = await EscortProfile.findOne({ email: user.email });
      if (escort?.videos.length > 0) {
        let currentVideos = [...escort.videos];
        files.map((file) => {
          // const outputFilePath = `./uploads/escort/videos/${file.filename}`;
          // ffmpeg(file.path)
          //   // .inputOptions("-itsoffset 0.5") // Delay the overlay by 0.5 seconds (adjust as needed)
          //   .input("./watermark.png") // Path to the watermark image
          //   .complexFilter([
          //     "[0:v][1:v]overlay=W-w-10:H-h-10", // Overlay the watermark image
          //     // "[0:a]anull[a]", // Remove the audio from the video
          //   ])
          //   .output(outputFilePath)
          //   .on("end", (data) => {
          //     console.log("video=>", data);
          //     // Watermarking completed, do something with the modified video
          //     res.json({ videoPath: outputFilePath });
          //   })
          //   .on("error", (error) => {
          //     console.error(error);
          //     res.status(500).json({ error: "Something went wrong" });
          //   })
          //   .run();
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
    return res.status(400).json({
      message: "Video required",
      statusCode: 400,
    });
  } catch (error) {
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
      let escort = await EscortProfile.findOne({ email: user.email });
      watermark2
        .addWatermark(files.path, "./controller/watermark.png", {
          dstPath: `./uploads/escort/${files.filename}`,
        })
        .then((data) => {})
        .catch((err) => {});
      let profileImage = files.filename;
      escort.profileImage = profileImage;
      await escort.save();
      return res.status(200).json({
        message: "Profile Photo Uploaded",
        escort,
        statusCode: 200,
      });
    }
  } catch (error) {
    console.log("main", error);
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
  const { available24, availableDate, vacation } = req.body;

  try {
    let escort = await EscortProfile.findOne({ email });
    if (escort) {
      if (available24 !== undefined || available24 !== null) {
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

//Update rates
exports.updateRates = async (req, res) => {
  let { email } = req.user;
  const { currency, reachHome, host } = req.body;

  try {
    let escort = await EscortProfile.findOne({ email });
    if (escort) {
      if (currency) {
        escort.currency = currency;
      }
      if (reachHome) {
        escort.reachHome = {
          hour: reachHome.hour || escort.reachHome.hour,
          threeHour: reachHome.threeHour || escort.reachHome.threeHour,
          additionHour: reachHome.additionHour || escort.reachHome.additionHour,
          night: reachHome.night || escort.reachHome.night,
          dinner: reachHome.dinner || escort.reachHome.dinner,
          weekend: reachHome.weekend || escort.reachHome.weekend,
        };
      }
      if (host) {
        escort.host = {
          hour: host.hour || escort.host.hour,
          threeHour: host.threeHour || escort.host.threeHour,
          additionHour: host.additionHour || escort.host.additionHour,
          night: host.night || escort.host.night,
          dinner: host.dinner || escort.host.dinner,
          weekend: host.weekend || escort.host.weekend,
        };
      }

      const updatedData = await escort.save();
      return res.status(200).json({
        message: "Working hours data updated",
        updatedData,
        statusCode: 200,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error", error, statusCode: 500 });
  }
};

//update stats
exports.updateStatus = async (req, res) => {
  let { type } = req.user;
  const { id, isActive } = req.body;

  if (type === "admin") {
    try {
      let escort = await EscortProfile.findOne({ _id: id });
      if (escort) {
        escort.isActive = isActive;

        const updatedData = await escort.save();
        return res.status(200).json({
          message: "Working hours data updated",
          updatedData,
          statusCode: 200,
        });
      } else {
        return res
          .status(404)
          .json({ message: "Error", error, statusCode: 404 });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Error", error, statusCode: 500 });
    }
  } else {
    return res.status(403).json({ message: "You are not allowed" });
  }
};
exports.deleteEscort = async (req, res) => {
  let { email } = req.user;
  try {
    let { username } = req.query;
    let userProfile = await userModel.findOne({ email });
    if (userProfile.type === "admin") {
      let escort = await EscortProfile.findOne({ username });
      if (escort) {
        await EscortProfile.deleteOne({ username });
      }
      await userModel.deleteOne({ username });

      return res
        .status(200)
        .json({ message: "User & escort profile deleted", statusCode: 200 });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Something went wrong", statusCode: 500 });
  }
};

exports.getInactiveEscorts = async (req, res) => {
  try {
    let { limit, offset, gender, category } = req.query;
    let genderN = gender?.toLowerCase();
    let query = { isActive: false };
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
exports.getEscortVideos = async (req, res) => {
  try {
    let { limit, offset } = req.query;

    // Fetch all escort profiles from the database
    const escorts = await EscortProfile.find({
      videos: { $exists: true, $ne: [] },
    })
      .limit(limit || 0)
      .skip(offset || 0)
      .exec();
    // Send the retrieved data as a response
    res.status(200).json({
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
exports.getEscortPhotos = async (req, res) => {
  try {
    let { limit, offset } = req.query;

    // Fetch all escort profiles from the database
    const escorts = await EscortProfile.find({
      images: { $exists: true, $ne: [] },
    })
      .limit(limit || 0)
      .skip(offset || 0)
      .exec();
    // Send the retrieved data as a response
    res.status(200).json({
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
exports.ratePhotos = async (req, res) => {
  try {
    let { username: escortUserName, rate } = req.body;
    let { type, email } = req.user;
    if (type !== "default") {
      return res
        .status(403)
        .json({ message: "You should be a user to vote", statusCode: 403 });
    }
    // Fetch all escort profiles from the database
    const escort = await EscortProfile.findOne({ username: escortUserName });
    // Send the retrieved data as a response
    let ratedClients = [...escort.ratedClients];
    let exist = ratedClients.find((client) => client === email);
    if (exist) {
      return res
        .status(400)
        .json({ message: "You already voted", statusCode: 400 });
    }
    ratedClients.push(email);
    let rates = parseInt(escort.photosRate) + parseInt(rate);
    escort.photosRate = Math.ceil(rates);
    escort.ratedClients = ratedClients;
    const avg = parseInt(rates) / parseInt(escort.ratedClients?.length);
    console.log("avg", avg, rates);
    escort.avgRate = avg.toFixed(1);
    await escort.save();
    return res
      .status(200)
      .json({ message: "Successfully rated", statusCode: 200 });
  } catch (error) {
    // Send an error response if something goes wrong
    res.status(500).json({
      message: "Something went wrong",
      error: error.message,
      statusCode: 500,
    });
  }
};
