const { check, body } = require("express-validator");
const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const bcrypt = require("bcryptjs");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const UserModel = require("../../modules/userModel");

exports.getUserValidator = [
  check("id").isMongoId().withMessage("Invalid User id format"),
  validatorMiddleware,
];

exports.createUserValidator = [
  check("name")
    .notEmpty()
    .withMessage("User name required")
    .isLength({ min: 3 })
    .withMessage("too short User name"),
  body("name").custom((val, { req }) => {
    req.body.slug = slugify(val);
    return true;
  }),

  check("email")
    .notEmpty()
    .withMessage("User Email required")
    .isEmail()
    .withMessage("Invalid email address format")
    .custom(
      asyncHandler(async (val) => {
        const emailUser = await UserModel.findOne({ email: val });
        if (emailUser) {
          throw new Error("E-mail already in user");
        }
      })
    ),

  check("passwordConfirm")
    .notEmpty()
    .withMessage("password confirmation required"),

  check("password")
    .notEmpty()
    .withMessage("password required")
    .isLength({ min: 6 })
    .withMessage("password must be at least 6 characters long")
    .custom((password, { req }) => {
      if (password !== req.body.passwordConfirm) {
        throw new Error("password confirmation incorrect");
      }
      return true;
    }),

  check("phone")
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("Invalid phone number only accepted Egy and SA phone numbers"),

  check("profileImage").optional(),
  check("role").optional(),
  check("active").optional(),

  validatorMiddleware,
];

exports.updateUserValidator = [
  check("id").isMongoId().withMessage("Invalid User id format"),
  check("email")
    .optional()
    .isEmail()
    .withMessage("Invalid email address format")
    .custom(
      asyncHandler(async (val) => {
        const emailUser = await UserModel.findOne({ email: val });
        if (emailUser) {
          throw new Error("E-mail already in user");
        }
      })
    ),

  check("phone")
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("Invalid phone number only accepted Egy and SA phone numbers"),
  body("name")
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validatorMiddleware,
];

exports.deleteUserValidator = [
  check("id").isMongoId().withMessage("Invalid User id format"),
  validatorMiddleware,
];

exports.changeUserPasswordValidator = [
  check("id").isMongoId().withMessage("Invalid User id format"),

  check("currentPassword").notEmpty().withMessage("current Password required"),

  check("passwordConfirm")
    .notEmpty()
    .withMessage("password confirmation required"),

  check("password")
    .notEmpty()
    .withMessage("password required")
    .isLength({ min: 6 })
    .withMessage("password must be at least 6 characters long")
    .custom(async (val, { req }) => {
      //1) verify current password
      const user = await UserModel.findById(req.params.id);
      if (!user) {
        throw new Error("there is no user with id");
      }

      const isCorrectPassword = await bcrypt.compare(
        req.body.currentPassword,
        user.password
      );

      if (!isCorrectPassword) {
        throw new Error("Incorrect current password");
      }

      if (val !== req.body.passwordConfirm) {
        throw new Error("password confirmation incorrect");
      }
      return true;
    }),
  validatorMiddleware,
];
