const mongoose = require("mongoose");

const { check } = require("express-validator");

const entrantSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      minlength: [2, `please enter a valid name`],
      maxlength: [45, `please enter a valid name`],
      //match: [/^[a-z ,.'-]+$/ , " Name contains Invalid characters"],
    },

    bizLocation: {
      type: String,
      required: true,
      trim: true,

      // maxlength: [30, "Please keep Subject to within 30 characters"],
    },
    bizDescription: {
      type: String,
      required: true,
      minlength: [
        400,
        "Please provide a detailed description , minimum 400 letters",
      ],
      maxlength: [
        2000,
        "Please keep description to within 2000 characters(letters)",
      ],
      trim: true,
    },

    fbLink: {
      type: String,
      required: true,
      minlength: [2, `please enter a valid name`],
      validate: [
        function (v) {
          check(v).isURL;
        },
        `please submit a valid link`,
      ],

      //match: [/^[a-z ,.'-]+$/ , " Name contains Invalid characters"],
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      validate: {
        validator: function (v) {
          check(v).isEmail;
        },
      },
    },
  },
  { timestamps: true }
);

const entrantModel = mongoose.model("entrant", entrantSchema);

// const entrantModel = require("./models/entrant");

let saveEntrantToDataBase = async (req, res, next) => {
  console.log("save to database is working");
  /* takes the valid */
  const entrant = new entrantModel({
    fullName: req.body.fullName,
    bizLocation: req.body.bizLocation,
    bizDescription: req.body.bizDescription,
    fbLink: req.body.fbLink,
    phoneNumber: req.body.phoneNumber,
    email: req.body.email,
  });

  try {
     entrant.save();
     next();
     console.log(`${entrant} saved to DB`);
  } catch {}
}; //module.exports(entrant)=entrant
module.exports = saveEntrantToDataBase;
