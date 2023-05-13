
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError/apiError");
const CategoryModel = require("../modules/categoryModel");
const ApiFeatures = require("../utils/apiFeatures/apiFeatures");
const factory = require('./handlerFactory');
//  @dec    create category
//  @route  Post  /api/v1/categories
//  @access Private
exports.createCategory = factory.createOne(CategoryModel)

//  @dec    get list of categories
//  @route  Get  /api/v1/categories?page=?&limit=?
//  @access Public
exports.getAllCategory = asyncHandler(async (req, res) => {
  // build quary
  const apiFeatures = new ApiFeatures(CategoryModel.find(), req.query)
    .pagination()
    .sorting()
    .Limitfields()
    .filterData()
    .search();

  //   execute mongose quary
  const { mongooseQuery, paginationRuslt } = apiFeatures;
  const categories = await mongooseQuery;

  res
    .status(201)
    .json({
      results: categories.length,
      page: paginationRuslt.currentPage,
      data: categories,
    });
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
exports.UpdateCategory = factory.updateOne(CategoryModel)

//  @dec    delete  category by id
//  @route  Delete  /api/v1/categories/:id
//  @access Private
exports.deleteCategory = factory.deleteOne(CategoryModel)