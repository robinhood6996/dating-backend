const Countries = require("../models/countries.model");
const nationality = require("../helpers/countries.json");
exports.createCountry = async (req, res) => {
  try {
    if (req.body) {
      const { name, description } = req.body;
      let exist = await Countries.findOne({ name: name });
      if (!exist) {
        let country = new Countries({
          name: name.toLowerCase(),
          description: description,
          cities: [],
          escortCount: 0,
          cityCount: 0,
          escortsOnTour: 0,
        });

        await country.save().then(() => {
          res.status(201).json({ country: country, message: "Country added" });
        });
      } else {
        res.status(400).json({ message: "Already exist" });
      }
    } else {
      res.status(400).json({ message: "Country name is required" });
    }
  } catch (err) {
    res.status(500).json("Internal server error");
  }
};

exports.editCountry = async (req, res) => {
  const { id } = req.params; // Assuming the ID is passed as a route parameter
  const { name, description } = req.body; // Assuming the new name is provided in the request body

  try {
    // Find the country by ID
    const country = await Countries.findById(id);

    if (!country) {
      // If the country doesn't exist, return an error
      return res.status(404).json({ error: "Country not found" });
    }
    // Update the name of the country
    country.name = name;
    country.description = description;
    // Save the updated country
    await country.save();
    // Return the updated country as the response
    return res.json(country);
  } catch (error) {
    // Handle any errors that occur during the process
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
};
//Get all countries
exports.getAllCountries = async (req, res) => {
  try {
    const { search, limit, offset } = req.query;

    // Create a query object with optional search condition
    const query = {};
    if (search) {
      const searchRegex = new RegExp(search, "i"); // Case-insensitive search regex
      query.$or = [{ name: searchRegex }];
    }
    const totalCountries = await Countries.countDocuments(query);
    const countriesQuery = Countries.find(query)
      .limit(parseInt(limit))
      .skip(parseInt(offset));
    const countries = await countriesQuery.exec();
    res.status(200).json({
      countries,
      resultCount: countries.length,
      totalCount: totalCountries,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};
//Get all nationality
exports.getNationality = async (req, res) => {
  try {
    const data = nationality;
    res.status(200).json({ data });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.deleteCountry = async (req, res) => {
  try {
    let countryId = req.params.id;
    await Countries.deleteOne({ _id: countryId }).then((response) => {
      res.status(200).json({ message: "Country deleted" });
    });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getCountry = async (req, res) => {
  try {
    let { country } = req.query;
    const countryData = await Countries.findOne({ name: country });
    res.status(200).json(countryData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};
