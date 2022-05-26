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

    const data = await entrantModel
      .exists({ fullname: fullName, email: email })// check i there is any dat with the emeil
      .then((data) => {
        if (data) {
          console.log("entry is alredy found");
          console.log(data._id);
          res
            .status(409)
            .send({ message: `user ${fullName} is already entered thank you participation` });
        } else if (!data) {
          /* if there is no existing entry the entry can be saved */
          saveEntrant();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  async function saveEntrant() {
    console.log(` now saving to DB `);
    await entrant.save((err, entrant) => {
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
