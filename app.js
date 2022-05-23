const express = require("express");
//const { dirname } = require("path/posix")
const app = express();
const PORT = process.env.PORT || 3000 || 3500;
const multer = require("multer");
const upload = multer();

// mongoose configuration

const mongoose = require("mongoose");

const { MongoClient } = require("mongodb");
const req = require("express/lib/request");
require("dotenv").config();

const databaseName = "Entrants";
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbname: databaseName,
};
const uri =
  process.env
    .MONGODB_URI; /* process.env.MONGODB_URI || process.env.MONGOLAB_URI || process.env.MONGOLHQ_URI  */

let connection = mongoose.connect(uri || process.env.DB_URI, options);

const database = mongoose.connection;
database.on("error", console.error.bind(console, "connection error:"));
database.once("open", function () {
  console.log(`DAtabase connection established  and checking`);
});
app.listen(PORT, () => {
  console.log(`Server started, listening on  port: ${PORT} `);
});

app.use(express.static("public"));

app.use(express.static(__dirname + "/public"));

app.use(express.json());
app.use(upload.array());
/* MiddleWare */
const {
  userValidationRules,
  validateEntrant,
} = require("./middleware/validation.js");
const saveEntrantToDataBase = require("./middleware/saveToDB.js");
//ROUTES
app.post(
  "/register",
  userValidationRules(),
  validateEntrant,
  saveEntrantToDataBase,
  (req, res) => {
    console.log(req.body);
    res.send(req.body);
  }
);
//HOME PAGE

// BOOKING PAGE
//const { body, validationResult } = require("express-validator");

app.get("/", (req, res) => {
  res.sendFile(__dirname + "index.html");
});
