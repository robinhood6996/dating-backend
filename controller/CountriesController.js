const Countries = require("../models/countries.model");

exports.createCountry = async (req, res) => {
  try {
    if (req.body) {
      let exist = await Countries.findOne({ name: req.body.name });
      if (!exist) {
        let country = new Countries({
          name: req.body.name,
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
