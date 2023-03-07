const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/auth.route");
const cors = require("cors");
const app = express();
app.use(cors());
// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept, Authorization, timeZone, x-token"
//   );
//   res.header(
//     "Access-Control-Allow-Methods",
//     "GET, POST, PUT, DELETE, OPTIONS, PATCH"
//   );
//   next();
// });

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// app.use(express.json());
app.get("/", function (req, res) {
  res.send("Hello World");
});

mongoose
  .connect("mongodb://127.0.0.1:27017/dating", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected");

    app.listen(3000);
    app.use("/api/auth", authRoutes);
  })
  .catch((error) => {
    console.log(error);
  });

// mongodb+srv://<username>:<password>@cluster0.oulrk.mongodb.net/?retryWrites=true&w=majority
