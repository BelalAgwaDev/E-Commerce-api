
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
exports.getAllCategory =factory.getAll(CategoryModel)

//  @dec    get specific category by id
//  @route  Get  /api/v1/categories/:id
//  @access Public
exports.getCategory = factory.getOne(CategoryModel)

//  @dec    update  category by id
//  @route  Put  /api/v1/categories/:id
//  @access Private
exports.UpdateCategory = factory.updateOne(CategoryModel)

//  @dec    delete  category by id
//  @route  Delete  /api/v1/categories/:id
//  @access Private
exports.deleteCategory = factory.deleteOne(CategoryModel)