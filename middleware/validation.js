const { body, validationResult } = require("express-validator");

const userValidationRules = () => {
  return [
    body("fullName", "Please a enter a valid name")
      .not()
      .isEmpty()
      .isLength({ min: 2 })
      .isLength({max: 30})
      .trim()
      .escape(),

    body("email")
      .not()
      .isEmpty()
      .withMessage("Please enter a valid Email")
      .isEmail()
      .withMessage("Email entered is not a valid email address ")
      .normalizeEmail()
      .trim()
      .escape(),
    body("phoneNumber")
      .not()
      .isEmpty()
      .withMessage(`Mobile number is required`)
      .isLength({ min: 10, max: 13 })
      .isNumeric()
      .withMessage(`Ensure your mobile number has no invalid characters`)
      .isMobilePhone()
      .withMessage(`Ensure you entered a valid Mobile number`)
      .trim()
      .escape(),
    body("bizLocation", "Ensure you select your location/surburb")
      .not("Select One")
      .trim()
      .escape(),

    body("bizdescription")
      .not()
      .isEmpty()
      .withMessage(`Address is required`)
      .isLength({ min: 30 })
      .withMessage(`Check if your address is complete`)
      .trim()
      .escape(),

      body("fblink")
      .not()
      .isEmpty()
      .withMessage(`facebook link is required`)
      .isLength({ min: 6 })
      .withMessage(`Check if your fb link is correct`)
      .trim()
      .escape(),
  ];
};
const validateEntrant = (req, res, next) => {
  const result = validationResult(req);

  const myValidationResult = validationResult.withDefaults({
    formatter: (error) => {
      return {
        message: error.msg,
      };
    },
  });
  const errors = myValidationResult(req);
  //const result = myValidationResult(req);

  //const result = validationResult(req).formatWith(errorFormatter);
  if (!result.isEmpty()) {
    res.status("422").send(errors.mapped());

    console.log(errors.mapped());
    //next() // to be removed

    //return res.json({ errors: sresult.array() });
  } else {
    console.log("Validation passed");

    return next();
  }

};

module.exports = { userValidationRules, validateEntrant };