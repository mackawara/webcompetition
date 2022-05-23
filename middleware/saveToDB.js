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
      unique: [true, `link already exists`],
      type: String,
      required: true,
      minlength: [2, `please enter a valid name`],
      validate: function (v) {
        check(v).isURL;
      },
      message: `please submit a valid link`,

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

let saveEntrantToDataBase = async (req, res, next) => {
  console.log("attempting to save to database");
  const fullName = req.body.fullName;
  const bizLocation = req.body.bizLocation;
  const bizDescription = req.body.bizDescription;
  const fbLink = req.body.fbLink;
  const phoneNumber = req.body.phoneNumber;
  const email = req.body.email;

  /* takes the valid */
  const entrant = new entrantModel({
    fullName: fullName,
    bizLocation: bizLocation,
    bizDescription: bizDescription,
    fbLink: fbLink,
    phoneNumber: phoneNumber,
    email: email,
  });
  /* query Entrant queries the database to see if this is not a duplicate of existing entry */
  const queryEntrant = async function (response) {
    /* prevents duplicate from being recorded on db */
    console.log(`query Entrant is working`);

    const result = await entrantModel
      .exists({ fullname: fullName })
      .maxTimeMS(15000)
      .catch((err) => {
        console.log(err);
        res
          .status(500)
          .send({ message: `server error ocured, please resubmit` });
        return;
      });
    if (result) {
      console.log(result._id);
      res.status(400).send({ message: `user  is already entered thank you` });
    } else if (result) {
      /* if there is no existing entry the entry can be saved */
      saveEntrant();
    }
  };

  function saveEntrant() {
    console.log(`save entrant working `);
    entrant.save((err, entrant) => {
      if (err) {
        const errors = err.errors;
        res.status(422).send(errors);
        return;
      } else next();
    });
  }
  queryEntrant();
}; //module.exports(entrant)=entrant
module.exports = saveEntrantToDataBase;
