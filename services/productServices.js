
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError/apiError");
const ProductModel = require("../modules/productModel");

const ApiFeatures = require("../utils/apiFeatures/apiFeatures");
const factory = require('./handlerFactory');

//  @dec    create product
//  @route  Post  /api/v1/products
//  @access Private
exports.createProduct =factory.createOne(ProductModel)

//  @dec    get list of product
//  @route  Get  /api/v1/products?page=?&limit=?
//  @access Public
exports.getAllProduct = asyncHandler(async (req, res) => {
  // build quary
  const apiFeatures = new ApiFeatures(ProductModel.find(), req.query)
    .pagination()
    .sorting()
    .Limitfields()
    .filterData()
    .search("product");

  //   execute mongose quary
  const { mongooseQuery, paginationRuslt } = apiFeatures;
  const product = await mongooseQuery;

  res
    .status(201)
    .json({
      results: product.length,
      page: paginationRuslt.currentPage,
      data: product,
    });
});

//  @dec    get specific product by id
//  @route  Get  /api/v1/products/:id
//  @access Public
exports.getProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const product = await ProductModel.findById(id).populate({
    path: "category",
    select: "name -_id",
  });
  if (!product) {
    return next(new ApiError(`No Product for this id ${id}`, 404));
  }

  res.status(201).json({ data: product });
});

//  @dec    update  product by id
//  @route  Put  /api/v1/products/:id
//  @access Private
exports.updateProduct = factory.updateOne(ProductModel)
//  @dec    delete  product by id
//  @route  Delete  /api/v1/products/:id
//  @access Private
exports.deleteProduct =factory.deleteOne(ProductModel)