const Countries = require("../models/countries.model");
const nationality = require('../helpers/countries.json');
exports.createCountry = async (req, res) => {
  try {
    if (req.body) {
      let exist = await Countries.findOne({ name: req.body.name });
      if (!exist) {
        let country = new Countries({
          name: req.body.name.toLowerCase(),
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
  const { name } = req.body; // Assuming the new name is provided in the request body

  try {
    // Find the country by ID
    const country = await Countries.findById(id);

    if (!country) {
      // If the country doesn't exist, return an error
      return res.status(404).json({ error: "Country not found" });
    }
    // Update the name of the country
    country.name = name;
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
    const query = await Countries.find({});
    const countries = query;
    res.status(200).json({ countries, counts: countries.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};
//Get all nationality
exports.getNationality = async (req, res) => {
  try {
    const data = nationality;
    res.status(200).json({data});
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
