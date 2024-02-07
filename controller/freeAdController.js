const { EscortProfile } = require("../models/escort.model");
const { FreeAd } = require("../models/freeads.model");
const fs = require("fs");
exports.createAd = async (req, res) => {
  try {
    const user = req.user;
    const files = req.files;
    const { title, category, description, phone, email, duration, username } =
      req.body;
    let escort = null;
    if(user.type === 'admin'){
     escort = await EscortProfile.findOne({ userName: username });
    } else{
      escort = await EscortProfile.findOne({ email: user.email });
    }
    // Check if request body exists
    if (!req.body) {
      return res.status(400).json({ message: "Request body is required" });
    }

    // Check if required fields exist in request body
    const requiredFields = ["title", "category", "description", "phone"];
    const missingFields = requiredFields.filter(
      (field) => !(field in req.body)
    );
    if (missingFields.length > 0) {
      return res.status(400).json({
        message: `Missing required fields: ${missingFields.join(", ")}`,
      });
    }
    if (email) {
      const emailRegex = /\S+@\S+\.\S+/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Invalid email address" });
      }
    }
    if (files?.length < 1) {
      return res
        .status(400)
        .json({ message: "Minimum one photo is required!" });
    }

    // Create new free ad document
    const freeAd = new FreeAd({
      title,
      category,
      city: req.body.city || "",
      country: req.body.country || "",
      description,
      phone,
      email: email ?? "",
      duration: duration ?? 15,
      status: req.body.status ?? "pending",
      author: user.email,
      photos: files,
      username: username ?? user.username,
      ownerEmail: escort.email ?? email,
    });

    // Save new free ad document
    const savedFreeAd = await freeAd.save();
    res.status(201).json({ freeAd: savedFreeAd, message: "Free ad added" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

//Edit ad
exports.editFreeAd = async (req, res) => {
  try {
    const freeAdId = req.params.id;
    const update = req.body;
    const files = req.files;
    if (!freeAdId) {
      return res.status(400).json({ message: "FreeAd id is required" });
    }

    // Find the existing FreeAd document by id
    const existingFreeAd = await FreeAd.findById(freeAdId);

    if (!existingFreeAd) {
      return res.status(400).json({ message: "FreeAd not found" });
    }
    console.log('files', files)
     // Update photos array only if new files are provided
    if (files && files.length > 0) {
      existingFreeAd.photos = existingFreeAd.photos.concat(files);
    }
    // Update the FreeAd document with the new data
    Object.keys(update).forEach((key) => {
      existingFreeAd[key] = update[key];
    });

    // Save the updated FreeAd document
    const updatedFreeAd = await existingFreeAd.save();

    res.json({ freeAd: updatedFreeAd });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

//Find active Freeads
exports.activeAds = async (req, res) => {
  try {
    let { limit, offset, search } = req.query;
    limit = parseInt(limit) || 10; // Default limit is 10 if not provided or not a valid number
    offset = parseInt(offset) || 0; // Default offset is 0 if not provided or not a valid number

    // Construct the search query with the "status" set to "active" and optional search text
    const query = {
      status: "active",
    };

    if (search) {
      const searchRegex = new RegExp(search, "i"); // Case-insensitive search regex
      query.$or = [
        { title: searchRegex },
        { category: searchRegex },
        { city: searchRegex },
        { description: searchRegex },
      ];
    }

    // Fetch active FreeAds from the database
    const activeFreeAds = await FreeAd.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(offset)
      .exec();

    // Count the total number of active FreeAds for pagination purposes
    const totalActiveFreeAds = await FreeAd.countDocuments(query);

    // Send the retrieved data as a response
    res.status(200).json({
      message: "Active FreeAds retrieved successfully",
      resultCount: activeFreeAds.length,
      totalCount: totalActiveFreeAds,
      data: activeFreeAds,
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
//Find active Freeads
exports.inactiveAds = async (req, res) => {
  try {
    let { limit, offset, search } = req.query;
    limit = parseInt(limit) || 10; // Default limit is 10 if not provided or not a valid number
    offset = parseInt(offset) || 0; // Default offset is 0 if not provided or not a valid number

    // Construct the search query with the "status" set to "active" and optional search text
    const query = {
      status: "pending",
    };

    if (search) {
      const searchRegex = new RegExp(search, "i"); // Case-insensitive search regex
      query.$or = [
        { title: searchRegex },
        { category: searchRegex },
        { city: searchRegex },
        { description: searchRegex },
      ];
    }

    // Fetch active FreeAds from the database
    const activeFreeAds = await FreeAd.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(offset)
      .exec();

    // Count the total number of active FreeAds for pagination purposes
    const totalActiveFreeAds = await FreeAd.countDocuments(query);

    // Send the retrieved data as a response
    res.status(200).json({
      message: "Active FreeAds retrieved successfully",
      resultCount: activeFreeAds.length,
      totalCount: totalActiveFreeAds,
      data: activeFreeAds,
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

//Get all ads

exports.getAll = async (req, res) => {
  try {
    const { category, city, limit, offset } = req.query;
    let query = { status: "active" };
    //status: "active"
    if (category) {
      query.category = category;
    }

    if (city) {
      query.city = city;
    }
    // Count the total number of active FreeAds for pagination purposes
    const totalActiveFreeAds = await FreeAd.countDocuments(query);
    let data = await FreeAd.find(query)
      .sort({ createdAt: -1 })
      .limit(limit || 0)
      .skip(offset || 0)
      .exec();
    return res
      .status(200)
      .json({ data, count: data.length, totalCount: totalActiveFreeAds });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
exports.getSingleAd = async (req, res) => {
  try {
    const { adId } = req.params;
    let NewAd = await FreeAd.findById(adId);
    let user = await EscortProfile.findOne({userName: NewAd?.username})
    res.status(200).json({ NewAd: {...NewAd?._doc, escort: {...user?._doc}}, statusCode: 200 });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "Internal server error", statusCode: 500 });
  }
};
exports.deleteAd = async (req, res) => {
  try {
    const { email } = req.user;
    const { adId } = req.params;
    const foundAd = await FreeAd.findOne({ _id: adId });
    if (foundAd) {
      let images = foundAd.photos;
      if (images.length > 0) {
        const directoryPath = __dirname + "/../uploads/escort/";
        let filenames = images.map((img) => img.filename);
        filenames.forEach((file) => {
          fs.unlinkSync(directoryPath + file, (err) => {
            if (err) {
              res.status(500).send({
                message: "Could not delete the file. " + err,
              });
            }
          });
        });
      }
      await FreeAd.deleteById(adId);
      return res
        .status(200)
        .json({ message: "Deleted successfully", statusCode: 200 });
    }
    return res.status(404).json({ message: "Ad not found", statusCode: 404 });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "Internal server error", statusCode: 500 });
  }
};

//Get own free ads
exports.getMyAds = async (req, res) => {
  const { email } = req.user;
  try {
    const { limit, offset } = req.query;
    console.log('email',email)
    let query = { ownerEmail: email };
    // Count the total number of active FreeAds for pagination purposes
    const totalActiveFreeAds = await FreeAd.countDocuments(query);
    let data = await FreeAd.find(query)
      .sort({ createdAt: -1 })
      .limit(limit || 0)
      .skip(offset || 0)
      .exec();
    return res
      .status(200)
      .json({ data, count: data.length, totalCount: totalActiveFreeAds });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.deleteAdImage = async(req, res) => {
    try {
    let {adId} = req.params;
    const { filename } = req.query;
    const directoryPath = __dirname + "/../uploads/escort/";
    if (filename) {
      let ad = await FreeAd.findOne({ _id: adId });
      console.log('filename', adId, filename, ad)
      if (ad) {
        let existFile = ad?.photos?.find(
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
          let filtered = ad.photos.filter(
            (img) => img.filename !== filename
          );
          ad.photos = filtered;
          await ad.save();
          return res.status(200).json({
            message: "Deleted image",
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
}
