const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
//Routes
const authRoutes = require("./routes/auth.route");
const settingsRoutes = require("./routes/settings.route");
const escortRoutes = require("./routes/escortRoutes");
const countryRoutes = require("./routes/country.route");
const cityRoutes = require("./routes/cities.route");
const freeAdController = require("./routes/freeads.route");
const bannerController = require("./routes/banner.route");
const cityTour = require("./routes/tour.route");
const functions = require("firebase-functions");
const app = express();
app.use(
  cors({
    origin: "https://incontriesc.onrender.com",
    // origin: "http://localhost:3011",
  })
);
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
//mongodb+srv://datingadmin:D88CQRZrzRSvTGD@cluster0.oulrk.mongodb.net/?retryWrites=true&w=majority
//mongodb://127.0.0.1:27017/dating

mongoose
  .connect(
    "mongodb+srv://datingadmin:D88CQRZrzRSvTGD@cluster0.oulrk.mongodb.net/?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("Connected");
    app.listen(3000);
    app.get("/esc/:filename", (req, res) => {
      const { filename } = req.params;
      res.sendFile(`${__dirname}/uploads/escort/${filename}`);
    });
    app.use("/", settingsRoutes);
    app.use("/auth", authRoutes);
    app.use("/escort", escortRoutes);
    app.use("/country", countryRoutes);
    app.use("/city", cityRoutes);
    app.use("/freead", freeAdController);
    app.use("/banner", bannerController);
    app.use("/city-tour", cityTour);
    exports.api = functions.https.onRequest(app);
  })
  .catch((error) => {
    console.log(error);
  });
