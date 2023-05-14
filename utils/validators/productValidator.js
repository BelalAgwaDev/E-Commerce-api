const { check, body } = require("express-validator");
const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");

const CategoryModel = require("../../modules/categoryModel");
const SubCategoryModel = require("../../modules/subCategoryModel");
const BrandModel = require("../../modules/brandModel");

exports.getProductValidator = [
  check("id").isMongoId().withMessage("Invalid Product id format"),
  validatorMiddleware,
];

exports.createProductValidator = [
  check("title")
    .notEmpty()
    .withMessage("product title is required")
    .isLength({ min: 3 })
    .withMessage("too short title"),
  check("description")
    .notEmpty()
    .withMessage("product description is required")
    .isLength({ max: 2000 })
    .withMessage("too long description"),
  check("quantity")
    .notEmpty()
    .withMessage("product quantity is required")
    .isNumeric()
    .withMessage("product quantity must be a Number"),

  check("sold")
    .optional()
    .isNumeric()
    .withMessage("product sold must be a Number"),

  check("price")
    .notEmpty()
    .withMessage("product price is required")
    .isNumeric()
    .withMessage("product price must be a Number")
    .isLength({ max: 10 })
    .withMessage("too long price"),

  check("priceAfterDiscount")
    .optional()
    .toFloat()
    .isNumeric()
    .withMessage("product priceAfterDiscount must be a Number")
    .custom((value, { req }) => {
      if (req.body.price <= value) {
        throw new Error("priceAfterDiscount must be lower than price");
      }
      return true;
    }),

  check("colors")
    .optional()
    .isArray()
    .withMessage("product colors must be array of String"),

  check("imageCover").notEmpty().withMessage("product imageCover is required"),

  check("images")
    .optional()
    .isArray()
    .withMessage("images colors must be array of String"),

  check("category")
    .notEmpty()
    .withMessage("product must be belong to a category ")
    .isMongoId()
    .withMessage("Invalid id format")
    .custom(
      asyncHandler(async (categoryId) => {
        const category = await CategoryModel.findById(categoryId);
        if (!category) {
          throw new Error(`no category for this id ${categoryId}`);
        }
      })
    ),
  check("subCategory")
    .optional()
    .isMongoId()
    .withMessage("Invalid id format")
    .custom(
      asyncHandler(async (subCategoryId) => {
        const subCategory = await SubCategoryModel.find({
          _id: { $exists: true, $in: subCategoryId },
        });
        if (
          subCategory.length < 1 ||
          subCategory.length !== subCategoryId.length
        ) {
          throw new Error(`invalid subcategory ids`);
        }
      })
    )

    .custom(
      asyncHandler(async (val, { req }) => {
        await SubCategoryModel.find({ category: req.body.category }).then(
          (subCategories) => {
            const subcategoryIdInDB = [];
            subCategories.forEach((subCategory) => {
              subcategoryIdInDB.push(subCategory._id.toString());
            });

            if (!val.every((v) => subcategoryIdInDB.includes(v))) {
              throw new Error(`subCategories not belong to category`);
            }
          }
        );
      })
    ),

  check("brand")
    .optional()
    .isMongoId()
    .withMessage("Invalid id format")
    .custom(
      asyncHandler(async (brandId) => {
        const brand = await BrandModel.findById(brandId);
        if (!brand) {
          throw new Error(`no brand for this id ${brandId}`);
        }
      })
    ),

  check("ratingsAverage")
    .optional()
    .isNumeric()
    .withMessage(" ratingsAverage must be a Number")
    .isLength({ min: 1 })
    .withMessage("rating must be above or equal 1.0")
    .isLength({ max: 5 })
    .withMessage("rating must be below or equal 5.0"),

  check("ratingsQuantity")
    .optional()
    .isNumeric()
    .withMessage("ratingsQuantity must be a Number"),

  body("title").custom((val, { req }) => {
    req.body.slug = slugify(val);
    return true;
  }),
  validatorMiddleware,
];

exports.updateProductValidator = [
  check("id").isMongoId().withMessage("Invalid Product id format"),

  body("title").Option().custom((val, { req }) => {
     req.body.slug = slugify(val);
    return true;
  }),
  validatorMiddleware,
];

exports.deleteProductValidator = [
  check("id").isMongoId().withMessage("Invalid Product id format"),
  validatorMiddleware,
];
