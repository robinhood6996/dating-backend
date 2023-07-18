const Cities = require("../models/cities.model");
const Areas = require("../models/area.model");
const countriesModel = require("../models/countries.model");

exports.addArea = async (req, res) => {
  try {
    const { name, city, country, description } = req.body;

    if (!city) {
      return res.status(400).json({ message: "Country name is required." });
    }

    const cityExists = await Cities.findOne({ name: city });
    const countryExists = await countriesModel.findOne({ name: country });

    if (!cityExists) {
      return res.status(404).json({ message: `City "${city}" not found.` });
    }
    if (!countryExists) {
      return res.status(404).json({ message: `City "${country}" not found.` });
    }

    // Check if city exists

    const area = new Areas({
      name,
      city,
      country,
      description,
      escortCount: 0,
      escortsOnTour: 0,
    });
    await countriesModel.findOneAndUpdate(
      { name: country },
      { $push: { areas: name } },
      { new: true }
    );
    await Cities.findOneAndUpdate(
      { name: country },
      { $push: { areas: name } },
      { new: true }
    );

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
    const newAreaName = req.body.name;
    const description = req.body.description;

    if (!cityId || !newAreaName) {
      return res
        .status(400)
        .json({ message: "City name and country name are required" });
    }
    const existingCity = await Areas.findOne({ _id: cityId });
    if (!existingCity) {
      return res.status(400).json({ message: "Area does not exist" });
    }
    const existingCityWithName = await Areas.findOne({ name: newAreaName });
    if (existingCityWithName) {
      if (existingCityWithName._id.toString() !== cityId) {
        return res.status(400).json({ message: "Area already exist" });
      }
    }
    const updatedCity = await Areas.findOneAndUpdate(
      { _id: cityId },
      { $set: { name: newAreaName, description } },
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
    const city = await Areas.findOne({ _id: cityId });
    if (!city) {
      return res.status(404).json({ message: "Area not found" });
    }
    // Delete the city
    await city.deleteOne();
    res.json({ message: "Area deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

//Get All Cities
exports.getAllCity = async (req, res) => {
  try {
    const { search, limit, offset, country, city } = req.query;

    // Create a query object with optional search condition and filtering by country name
    const query = {};
    if (search) {
      query.name = { $regex: search, $options: "i" };
    }
    if (country) {
      query.country = { $regex: country, $options: "i" };
    }
    if (city) {
      query.city = { $regex: city, $options: "i" };
    }

    // Fetching area names with limit and offset
    const areasQuery = Areas.find(query)
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip(Number(offset));

    // Execute the query and retrieve the cities
    const areas = await areasQuery.exec();

    res.status(200).json({ areas, counts: areas.length });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching area names" });
  }
};

exports.getSingleArea = async (req, res) => {
  try {
    const { area } = req.query;
    // Fetching area names with limit and offset
    const areas = await Areas.findOne({ name: area });

    res.json(areas);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching area names" });
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
