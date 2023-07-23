const citiesModel = require("../models/cities.model");
const countriesModel = require("../models/countries.model");
const { EscortProfile } = require("../models/escort.model");
const CityTour = require("../models/tour.model");
const User = require("../models/user.model");

exports.getAllCityTours = async (req, res) => {
  try {
    let { country, city, limit, offset, search } = req.query;
    let query = {};
    if (country) {
      query.country = country;
    }
    if (city) {
      query.city = city;
    }
    if (search) {
      const searchRegex = new RegExp(search, "i"); // Case-insensitive search regex
      query.$or = [
        { name: searchRegex },
        { userName: searchRegex },
        { escortEmail: searchRegex },
        { country: searchRegex },
        { city: searchRegex },
      ];
    }
    const cityTours = await CityTour.find(query).limit(limit).skip(offset);
    res.json({ cityTours });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.createCityTour = async (req, res) => {
  try {
    const { email: userEmail, username } = req.user;
    const { name, dateFrom, dateTo, email, phone, city, country } = req.body;
    let escort = await EscortProfile.findOne({ email: userEmail });
    // Check if all required fields are present in the request body
    if (
      !name ||
      !dateFrom ||
      !dateTo ||
      !email ||
      !phone ||
      !city ||
      !country
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Validate email address
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email address" });
    }
    const cityTour = new CityTour({
      name,
      dateFrom,
      dateTo,
      email,
      phone,
      city,
      country,
      userName: username,
      status: "pending",
      profileImage: escort?.profileImage,
      escortEmail: userEmail,
    });
    if (country) {
      let theCountry = await countriesModel.findOne({ name: country });
      theCountry.escortsOnTour = theCountry.escortsOnTour + 1;
      await theCountry.save();
    }
    if (city) {
      let theCity = await citiesModel.findOne({ name: city });
      theCity.escortsOnTour = theCity.escortsOnTour + 1;
      await theCity.save();
    }
    await cityTour.save();

    return res.status(201).json({ cityTour, message: "City tour created" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.deleteCityTour = async (req, res) => {
  try {
    const { email } = req.user;
    const { id } = req.query;
    const user = await User.findOne({ email });

    const cityTour = await CityTour.findOne({ _id: id });
    if (cityTour) {
      let hasAccess = cityTour.escortEmail === email;
      if (hasAccess || user.type === "admin") {
        await cityTour.deleteOne({ _id: id });
        return res
          .status(200)
          .json({ message: "Deleted successfully", statusCode: 200 });
      } else {
        res
          .status(403)
          .json({ message: "Forbidden this request", statusCode: 403 });
      }
    }
    res
      .status(404)
      .json({ message: "Not found city tour data", statusCode: 404 });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getUserCityTour = async (req, res) => {
  const { email } = req.user;
  try {
    const cityTours = await CityTour.find({ escortEmail: email });
    res.json({ cityTours });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
exports.getEscortTours = async (req, res) => {
  const { userName } = req.params;
  try {
    const cityTours = await CityTour.find({ userName: userName });
    res.json({ cityTours });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
