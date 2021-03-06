const { body, validationResult } = require("express-validator");

const userValidationRules = () => {
  return [
    body("fullName", "Please a enter a valid name")
      .not()
      .isEmpty()
      .withMessage("Your full Name is required")
      .isLength({ min: 2 })
      .isLength({ max: 45 })
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
      .isLength({ min: 10, max: 14 })
      .isMobilePhone()
      .withMessage(`Ensure you entered a valid Mobile number`)
      .trim()
      .escape(),
    body("bizLocation", "Ensure you select your location/surburb")
      .not()
      .isEmpty()
      .withMessage(`The location of your business is required`)
      .trim()
      .escape(),

    body("bizDescription", "Please enter a working facebook link")
      .not()
      .isEmpty()
      .withMessage(`facebook page link is required`)
      .isLength({ min: 400 })
      .withMessage(
        `Please provide a detailed description , minimum 400 characters long`
      )
      .isLength({ max: 2000 })
      .withMessage(`Please keep description to within 2000 characters(letters)`)
      .trim()
      .escape(),

    body("fbLink")
      .not()
      .isEmpty()
      .withMessage(`facebook link is required`)
      .isLength({ min: 6 })
      .isURL()
      .withMessage(`Check if your facebook link is correct`)
      .trim()
      .escape(),
  ];
};
const validateEntrant = (req, res, next) => {
  console.log(req.body  );

  const result = validationResult(req);

  const myValidationResult = validationResult.withDefaults({
    formatter: (error) => {
      return {
        message: error.msg,
      };
    },
  });
  const errors = myValidationResult(req);

  //const result = validationResult(req).formatWith(errorFormatter);
  if (!result.isEmpty()) {
    res.status(422).send(errors.mapped());

    console.log(errors.mapped());
  } else {
    console.log("Validation passed");

    return next();
  }
};

module.exports = { userValidationRules, validateEntrant };
