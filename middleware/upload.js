const multer = require("multer");
const path = require("path");

// let storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     console.log("file", file);
//     cb(null, "../uploads");
//   },
//   filename: (req, file, cb) => {
//     console.log("file", file);
//     let ext = path.extname(file.originalname);
//     cb(null, Date.now() + ext);
//   },
// });

var storage = multer.diskStorage({
  destination: function (request, file, callback) {
    callback(null, "../uploads");
  },
  filename: function (request, file, callback) {
    callback(null, Date.now() + file.originalname);
  },
});

var upload = multer({
  storage: storage,
});

module.exports = upload;
