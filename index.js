const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
app.use(cors());

//Routes
const authRoutes = require("./routes/auth.route");
const settingsRoutes = require("./routes/settings.route");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// app.use(express.json());

mongoose
  .connect("mongodb://127.0.0.1:27017/dating", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected");

    app.listen(3000);
    app.use("/", settingsRoutes);
    app.use("/api/auth", authRoutes);
  })
  .catch((error) => {
    console.log(error);
  });

// mongodb+srv://<username>:<password>@cluster0.oulrk.mongodb.net/?retryWrites=true&w=majority
