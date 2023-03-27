const Banner = require('../models/banner.model');

exports.addBanner = async (req, res) => {
  try {
    const { position, country, city, image, duration, price, paymentStatus, transactionId } = req.body;

    // Check if required fields are provided
    if (!position || !country || !city || !image || !duration || !price || !paymentStatus || !transactionId) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Check if position is a valid value
    const validPositions = ['top', 'bottom', 'left', 'right'];
    if (!validPositions.includes(position)) {
      return res.status(400).json({ message: 'Invalid position' });
    }

    // Check if duration is a positive number
    if (duration <= 0) {
      return res.status(400).json({ message: 'Duration must be a positive number' });
    }

    // Check if price is a positive number
    if (price <= 0) {
      return res.status(400).json({ message: 'Price must be a positive number' });
    }

    // Check if paymentStatus is a valid value
    const validPaymentStatuses = ['paid', 'unpaid'];
    if (!validPaymentStatuses.includes(paymentStatus)) {
      return res.status(400).json({ message: 'Invalid payment status' });
    }

    // Create and save the new banner
    const banner = new Banner({ position, country, city, image, duration, price, paymentStatus, transactionId });
    await banner.save();

    res.status(201).json({ banner });
  } catch (error) {
    console.error(error);

    // If the error is a Mongoose validation error, return the specific error message
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: errors.join(', ') });
    }

    res.status(500).json({ message: 'Internal server error' });
  }
};
