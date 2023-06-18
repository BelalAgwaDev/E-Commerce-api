const { check } = require("express-validator");

const validatorMiddleware = require("../../middlewares/validatorMiddleware");

exports.createAddressValidator = [
  check("BuildingName")
    .notEmpty()
    .withMessage("Address Building Name required")
    .isLength({ min: 3 })
    .withMessage("too short Address Building Name")
    .isLength({ max: 50 })
    .withMessage("too long Address Building Name"),

  check("region")
    .notEmpty()
    .withMessage("Address region Name required")
    .isLength({ min: 3 })
    .withMessage("too short Address region Name")
    .isLength({ max: 50 })
    .withMessage("too long Address region Name"),

  check("phone")
    .notEmpty()
    .withMessage("Address phone required")
    .isMobilePhone(["ar-EG"])
    .withMessage("Invalid phone number only accepted Egypt phone numbers"),

  check("alias")
    .isIn(["Apartment", "House", "Office"])
    .withMessage("alias data not match data"),

  check("latitude")
    .notEmpty()
    .withMessage("Address latitude required")
    .isNumeric()
    .withMessage("Address latitude must  be numeric").custom((val, { req }) => {
      if(val >= -90 && val <= 90){
                //
      }else{
        throw new Error("latitude must be between -90 and 90");
      }

      return true;
    }),


    

  check("longitude")
    .notEmpty()
    .withMessage("Address latitude required")
    .isNumeric()
    .withMessage("Address latitude must  be numeric").custom((val, { req }) => {
      if(val >= -180 && val <= 180){
                //
      }else{
        throw new Error("longitude must be between -180 and 180");
      }

      return true;
    }),

    


   
  validatorMiddleware,
];

