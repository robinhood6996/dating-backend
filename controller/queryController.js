const Query = require("../models/query.model"); // Replace with the correct path to your model file

// Controller function to create a new query
exports.createQuery = async (req, res) => {
  try {
    const { name, email, message, type } = req.body;

    // Validate the data (you can add more custom validation logic here)
    if (!name || !email || !message || !type) {
      return res
        .status(400)
        .json({ error: "Name, email, message and type are required fields." });
    }

    // Create a new query document using the Query model
    const newQuery = new Query({
      name,
      email,
      message,
      type,
    });

    // Save the new query document to the database
    await newQuery.save();

    // Return a success response
    return res
      .status(201)
      .json({ message: "Submitted your query!", query: newQuery });
  } catch (err) {
    // If an error occurs during validation or database save, return an error response
    console.error(err);
    return res
      .status(500)
      .json({ error: "An error occurred while creating the query." });
  }
};
