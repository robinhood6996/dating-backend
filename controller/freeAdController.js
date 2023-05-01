const { FreeAd } = require("../models/freeads.model");
exports.createAd = async (req, res) => {
  try {
    const { title, category, description, phone, email, photo1, duration } =
      req.body;
    // Check if request body exists
    if (!req.body) {
      return res.status(400).json({ message: "Request body is required" });
    }

    // Check if required fields exist in request body
    const requiredFields = [
      "title",
      "category",
      "description",
      "phone",
      "photo1",
    ];
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
    if (duration) {
      if (typeof duration !== "number") {
        return res
          .status(400)
          .json({ message: "Invalid duration, expecting number of days" });
      }
    }
    // Create new free ad document
    const freeAd = new FreeAd({
      title,
      category,
      city: req.body.city || "",
      description,
      phone,
      email: email || "",
      duration: req.body.duration || 15,
      photo1,
      photo2: req.body.photo2 || "",
      photo3: req.body.photo3 || "",
      status: req.body.status || "inactive",
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

    if (!freeAdId) {
      return res.status(400).json({ message: "FreeAd id is required" });
    }

    // Find the existing FreeAd document by id
    const existingFreeAd = await FreeAd.findById(freeAdId);

    if (!existingFreeAd) {
      return res.status(400).json({ message: "FreeAd not found" });
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
    let NewAd = new FreeAd();
    let data = await NewAd.findActive();
    res.status(200).json({ data, count: data.length });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
//Find active Freeads
exports.inactiveAds = async (req, res) => {
  try {
    let NewAd = new FreeAd();
    let data = await NewAd.findInactive();
    res.status(200).json({ data, count: data.length });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//Get all ads

exports.getAll = async (req, res) => {
  try {
    const { category, city, limit, offset } = req.query;
    let query = {};

    if (category) {
      query.category = category;
    }

    if (city) {
      query.city = city;
    }

    let data = await FreeAd.find(query)
      .limit(limit || 0)
      .skip(offset || 0)
      .exec();
    return res.status(200).json({ data, count: data.length });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
exports.getSingleAd = async (req, res) => {
  try {
    const { adId } = req.params;
    let NewAd = await FreeAd.findById(adId);
    res.status(200).json({ NewAd, statusCode: 200 });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "Internal server error", statusCode: 500 });
  }
};
exports.deleteAd = async (req, res) => {
  try {
    const { adId } = req.params;
    await FreeAd.deleteById(adId);
    res.status(200).json({ message: "Deleted successfully", statusCode: 200 });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "Internal server error", statusCode: 500 });
  }
};
