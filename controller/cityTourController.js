const CityTour = require('../models/tour.model');

exports.createCityTour = async (req, res) => {
  try {
    const {
      name,
      dateFrom,
      dateTo,
      email,
      phone,
      city,
      user,
    } = req.body;

    // Check if all required fields are present in the request body
    if (!name || !dateFrom || !dateTo || !email || !phone || !city || !user) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Validate email address
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email address' });
    }

    // Check if the user type is correct
    if (user.type !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized access' });
    }

    const cityTour = new CityTour({
      name,
      dateFrom,
      dateTo,
      email,
      phone,
      city,
      status: 'pending',
      user,
    });

    await cityTour.save();

    return res.status(201).json({ cityTour, message: 'City tour created' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};
