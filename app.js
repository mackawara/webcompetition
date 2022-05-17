const express = require("express");
//const { dirname } = require("path/posix")
const app = express();
const PORT = process.env.PORT || 3000;
const multer = require("multer");
const upload = multer();

// mongoose configuration

const mongoose = require("mongoose");

const { MongoClient } = require("mongodb");
require("dotenv").config();

const databaseName = "players";
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbname: databaseName,
};
const uri = process.env.MONGODB_URI || process.env.MONGOLAB_URI || process.env.MONGOLHQ_URI 

let connection = mongoose.connect(uri || process.env.DB_URI, options );

const database = mongoose.connection;
database.on("error", console.error.bind(console, "connection error:"));
database.once("open", function () {
  console.log(`DAtabase connection established on this uri :${uri}`);

}); 
app.listen(PORT, () => {
  console.log(`Server started, listening on  port: ${PORT} `);
});

app.use(express.static("public"));

app.use(express.static(__dirname + "/public"));

app.use(express.json());
app.use(upload.array());
//ROUTES
//HOME PAGE

 
// BOOKING PAGE
//const { body, validationResult } = require("express-validator");

app.get("/", (req, res) => {
  res.sendFile(__dirname + "index.html");
});