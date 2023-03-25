const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
app.use(cors());

//Routes
const authRoutes = require("./routes/auth.route");
const settingsRoutes = require("./routes/settings.route");
const escortRoutes = require("./routes/escortRoutes");
const countryRoutes = require("./routes/country.route");
const cityRoutes = require("./routes/cities.route");
const freeAdController = require('./routes/freeads.route');
const bannerController = require('./routes/banner.route');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// app.use(express.json());
//mongodb+srv://datingadmin:D88CQRZrzRSvTGD@cluster0.oulrk.mongodb.net/?retryWrites=true&w=majority
//mongodb://127.0.0.1:27017/dating
mongoose
  .connect("mongodb+srv://datingadmin:D88CQRZrzRSvTGD@cluster0.oulrk.mongodb.net/dating?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
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
  })
  .catch((error) => {
    console.log(error);
  });

// mongodb+srv://<username>:<password>@cluster0.oulrk.mongodb.net/?retryWrites=true&w=majority
