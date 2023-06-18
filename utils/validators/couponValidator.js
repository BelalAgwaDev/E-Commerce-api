const { check, body } = require("express-validator");

const validatorMiddleware = require("../../middlewares/validatorMiddleware");

exports.getCouponValidator = [
  check("id").isMongoId().withMessage("Invalid Coupon id format"),
  validatorMiddleware,
];

exports.createCouponValidator = [
  check("name")
    .notEmpty()
    .withMessage("Coupon name required")
    .isLength({ min: 3 })
    .withMessage("too short Coupon name")
    .isLength({ max: 32 })
    .withMessage("too long Coupon name"),

  check("expire")
    .notEmpty()
    .withMessage("Coupon expire required")
    .custom((val, { req }) => {
      if (Date.parse(val) <= Date.now()) {
        throw new Error("Coupon Date expired please enter a valid date ");
      }

      return true;
    }),

  check("discount")
    .notEmpty()
    .withMessage("Coupon discount required")
    .isNumeric()
    .withMessage("Coupon discount must be a number"),

  validatorMiddleware,
];

exports.updateCouponValidator = [
  check("id").isMongoId().withMessage("Invalid Coupon id format"),
  body("name")
    .optional()
    .isLength({ min: 3 })
    .withMessage("too short Coupon name")
    .isLength({ max: 32 })
    .withMessage("too long Coupon name"),

  body("discount")
    .optional()
    .isNumeric()
    .withMessage("Coupon discount must be a number"),

  validatorMiddleware,
];

exports.deleteCouponValidator = [
  check("id").isMongoId().withMessage("Invalid Coupon id format"),
  validatorMiddleware,
];
