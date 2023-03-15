const EscortProfile = require("../models/escort.model");
const User = require("../models/user.model");
exports.updateEscortBiography = async (req, res) => {
  try {
    if (req.params.userId) {
      const user = await User.findOne({ _id: req.params.userId });
      console.log("user", user);
      if (user) {
        console.log("user found");
        const foundEscort = await EscortProfile.findOne({
          userId: req.params.userId,
        });
        console.log("foundEscort", foundEscort);
        if (foundEscort) {
          if (req.body) {
            let body = req.body;
            await EscortProfile.updateOne(
              { userId: req.params.userId },
              {
                $set: {
                  ...body,
                },
              }
            )
              .then((response) => {
                console.log("response", response);
                res.status(200).json({ message: "updated profile 1" });
              })
              .catch((error) => {
                console.log("error", error);
                res.status(400).json({ message: "Invalid input data 1" });
              });
          } else {
            res.status(400).json({ message: "Invalid input data" });
          }
        } else {
          if (req.body) {
            let body = req.body;
            const escort = new EscortProfile({
              ...body,
              userId: req.params.userId,
            });
            let error = escort.validateSync();
            console.log("error", error);
            await escort
              .save()
              .then(() => {
                res.status(200).json({ message: "updated profile 2" });
              })
              .catch((error) => {
                console.log("error", error);
              });
          } else {
            res.status(400).json({ message: "Invalid input data 2" });
          }
        }
      }
    } else {
      res.status(400).json({ message: "Bad request" });
    }
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
};
