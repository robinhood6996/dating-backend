const Cities = require("../models/cities.model");
const Areas = require("../models/area.model");

exports.addArea = async (req, res) => {
  try {
    const { name, city } = req.body;

    if (!city) {
      return res.status(400).json({ message: "Country name is required." });
    }

    const cityExists = await Cities.exists({ name: city });

    if (!cityExists) {
      return res.status(404).json({ message: `City "${country}" not found.` });
    }

    // Check if city exists
    const areaExist = await Areas.findOne({ name: name });
    if (areaExist) {
      return res.status(400).json({ message: "City already exists" });
    }
    const area = new Areas({
      name,
      city,
      escortCount: 0,
      escortsOnTour: 0,
    });

    const savedArea = await area.save();
    // Add city to country's cities array
    await Cities.findOneAndUpdate(
      { name: city },
      { $push: { areas: name } },
      { new: true }
    );
    res.status(201).json({ area: savedArea, message: "Area added." });
  } catch (error) {
    console.error(error);

    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);

      return res.status(400).json({ message: errors });
    }

    res.status(500).json({ message: "Internal server error." });
  }
};

//Edit city

exports.editCity = async (req, res) => {
  try {
    const cityId = req.params.cityId;
    const newCityName = req.body.name;

    if (!cityId || !newCityName) {
      return res
        .status(400)
        .json({ message: "City name and country name are required" });
    }
    const existingCity = await Cities.findOne({ _id: cityId });
    if (!existingCity) {
      return res.status(400).json({ message: "City does not exist" });
    }
    const existingCityWithName = await Cities.findOne({ name: newCityName });
    if (existingCityWithName) {
      if (existingCityWithName._id.toString() !== cityId) {
        return res.status(400).json({ message: "City already exist" });
      }
    }
    const updatedCity = await Cities.findOneAndUpdate(
      { _id: cityId },
      { $set: { name: newCityName } },
      { new: true }
    );

    res.json({ city: updatedCity });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

//Delete City
exports.deleteCity = async (req, res) => {
  try {
    const cityId = req.params.cityId;
    // Check if the city exists in the database
    const city = await Cities.findOne({ _id: cityId });
    if (!city) {
      return res.status(404).json({ message: "City not found" });
    }
    // Delete the city
    await city.deleteOne();
    res.json({ message: "City deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

//Get All Cities
exports.getAllCity = async (req, res) => {
  try {
    const { city } = req.query;
    const areas = await Areas.find({ city });
    // if (req.query) {
    //   if (req?.query?.limit) {
    //     const limit = parseInt(req.query.limit);
    //     query = query.limit(limit);
    //   }
    // }
    res.status(200).json({ areas, counts: areas.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};
//Get All Cities By country
exports.getCityByCountry = async (req, res) => {
  try {
    const country = req.params.country;
    const existCountry = Countries.find({ name: country });
    if (existCountry) {
      const cities = await Cities.find({ country: country });
      res.status(200).json({ cities, counts: cities.length });
    } else {
      res.status(400).json({ message: "Bad request" });
    }
    // if (req.query) {
    //   if (req?.query?.limit) {
    //     const limit = pars{eInt(req.query.limit);
    //     query = query.limit(limit);
    //   }
    // }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};
