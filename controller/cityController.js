const Cities = require("../models/cities.model");
const Countries = require("../models/countries.model");

exports.addCity = async (req, res) => {
  try {
    const { name, country, description } = req.body;

    if (!country) {
      return res.status(400).json({ message: "Country name is required." });
    }

    const countryExists = await Countries.exists({ name: country });

    if (!countryExists) {
      return res
        .status(404)
        .json({ message: `Country "${country}" not found.` });
    }

    // Check if city exists
    const cityExists = await Cities.findOne({ name: name });
    if (cityExists) {
      return res.status(400).json({ message: "City already exists" });
    }
    const city = new Cities({
      name,
      country,
      description,
      escortCount: 0,
      escortsOnTour: 0,
    });

    const savedCity = await city.save();
    // Add city to country's cities array
    await Countries.findOneAndUpdate(
      { name: country },
      { $push: { cities: name } },
      { new: true }
    );
    res.status(201).json({ city: savedCity, message: "City added." });
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
    const description = req.body.description;

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
      { $set: { name: newCityName, description } },
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
    const cities = await Cities.find({}).sort({ createdAt: -1 });
    // if (req.query) {
    //   if (req?.query?.limit) {
    //     const limit = parseInt(req.query.limit);
    //     query = query.limit(limit);
    //   }
    // }
    res.status(200).json({ cities, counts: cities.length });
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

exports.getCity = async (req, res) => {
  try {
    let { city } = req.query;
    const cityData = await Cities.findOne({ name: city });
    res.status(200).json(cityData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};
