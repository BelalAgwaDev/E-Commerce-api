const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");
const asyncHandler = require("express-async-handler");
const { uploadSingleImage } = require("../middlewares/uploadImageMiddleware");
const CategoryModel = require("../modules/categoryModel");
const factory = require("./handlerFactory");

//upload single image
exports.uploadCategoryImage = uploadSingleImage("image");

//image processing
exports.resizeImage = asyncHandler(async (req, res, next) => {
  const fileName = `category-${uuidv4()}-${Date.now()}.jpeg`;
  if (req.file) {
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`uploads/categories/${fileName}`);

    //save image into our db
    req.body.image =fileName;
  }
  next();
});

//  @dec    create category
//  @route  Post  /api/v1/categories
//  @access Private
exports.createCategory = factory.createOne(CategoryModel);

//  @dec    get list of categories
//  @route  Get  /api/v1/categories?page=?&limit=?
//  @access Public
exports.getAllCategory = factory.getAll(CategoryModel);

//  @dec    get specific category by id
//  @route  Get  /api/v1/categories/:id
//  @access Public
exports.getCategory = factory.getOne(CategoryModel);

//  @dec    update  category by id
//  @route  Put  /api/v1/categories/:id
//  @access Private
exports.UpdateCategory = factory.updateOne(CategoryModel);

//  @dec    delete  category by id
//  @route  Delete  /api/v1/categories/:id
//  @access Private
exports.deleteCategory = factory.deleteOne(CategoryModel);
