const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError/apiError");
const CategoryModel = require("../modules/categoryModel");

//  @dec    create category
//  @route  Post  /api/v1/categories
//  @access Private
exports.createCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const category = await CategoryModel.create({ name, slug: slugify(name) });
  res.status(201).json({ data: category });
});


//  @dec    get list of categories
//  @route  Get  /api/v1/categories?page=?&limit=?
//  @access Public
exports.getAllCategory = asyncHandler(async (req, res) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 5;
  const skip = (page - 1) * limit;
  const categories = await CategoryModel.find({}).skip(skip).limit(limit);
  res
    .status(201)
    .json({ results: categories.length, page: page, data: categories });
});

//  @dec    get specific category by id
//  @route  Get  /api/v1/categories/:id
//  @access Public
exports.getCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const categories = await CategoryModel.findById(id);
  if (!categories) {
    return next(new ApiError(`No Category for this id ${id}`, 404));
  }

  res.status(201).json({ data: categories });
});

//  @dec    update  category by id
//  @route  Put  /api/v1/categories/:id
//  @access Private
exports.UpdateCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;

  const categories = await CategoryModel.findOneAndUpdate(
    { _id: id },
    { name, slug: slugify(name) },
    { new: true }
  );
  if (!categories) {
    return next(new ApiError(`No Category for this id ${id}`, 404));
  }

  res.status(201).json({ data: categories });
});

//  @dec    delete  category by id
//  @route  Delete  /api/v1/categories/:id
//  @access Private
exports.deleteCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const categories = await CategoryModel.findByIdAndDelete(id);
  if (!categories) {
    return next(new ApiError(`No Category for this id ${id}`, 404));
  }

  res
    .status(201)
    .json({ status: 201, message: "sucess to delete this category" });
});
