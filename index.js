const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
app.use(cors());
const multer = require("multer");

//Routes
const authRoutes = require("./routes/auth.route");
const settingsRoutes = require("./routes/settings.route");
const escortRoutes = require("./routes/escortRoutes");
const countryRoutes = require("./routes/country.route");
const cityRoutes = require("./routes/cities.route");

const freeAdController = require("./routes/freeads.route");
const bannerController = require("./routes/banner.route");
const cityTour = require("./routes/tour.route");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var uploads = multer().any();
app.use(uploads);

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization, timeZone, x-token"
  );
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS, PATCH"
  );
  next();
});

//mongodb+srv://datingadmin:D88CQRZrzRSvTGD@cluster0.oulrk.mongodb.net/?retryWrites=true&w=majority
//mongodb://127.0.0.1:27017/dating
//mongodb+srv://<username>:<password>@cluster0.oulrk.mongodb.net/?retryWrites=true&w=majority
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
    app.use("/", settingsRoutes);
    app.use("/auth", authRoutes);
    app.use("/escort", escortRoutes);
    app.use("/country", countryRoutes);
    app.use("/city", cityRoutes);
    app.use("/freead", freeAdController);
    app.use("/banner", bannerController);
    app.use("/city-tour", cityTour);
  })
  .catch((error) => {
    console.log(error);
  });

// mongodb+srv://<username>:<password>@cluster0.oulrk.mongodb.net/?retryWrites=true&w=majority
