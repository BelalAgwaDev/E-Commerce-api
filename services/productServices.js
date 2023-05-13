const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError/apiError");
const ProductModel = require("../modules/productModel");

//  @dec    create product
//  @route  Post  /api/v1/products
//  @access Private
exports.createProduct = asyncHandler(async (req, res) => {
  req.body.slug = slugify(req.body.title);
  const product = await ProductModel.create(req.body);
  res.status(201).json({ data: product });
});

//  @dec    get list of product
//  @route  Get  /api/v1/products?page=?&limit=?
//  @access Public
exports.getAllProduct = asyncHandler(async (req, res) => {
  // 1) filtering
  const quaryStringObj = { ...req.query };
  const excludesFields = ["page", "sort", "limit", "fields"];
  excludesFields.forEach((field) => delete quaryStringObj[field]);

  //apply filteration using [gte,gt,lte,lt]
let quaryStr=JSON.stringify(quaryStringObj)
quaryStr=quaryStr.replace(/\b(gte|gt|lte|lt)\b/g,(match)=>`$${match}`)
  //2) pagination
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 5;
  const skip = (page - 1) * limit;

  // 3) build quary
  const mongoseQuery = ProductModel.find(JSON.parse(quaryStr))
    .skip(skip)
    .limit(limit)
    .populate({ path: "category", select: "name -_id" });

  // 4)  execute mongose quary
  const product = await mongoseQuery;

  res.status(201).json({ results: product.length, page: page, data: product });
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
exports.updateProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  req.body.slug = slugify(req.body.title);

  const product = await ProductModel.findOneAndUpdate({ _id: id }, req.body, {
    new: true,
  });
  if (!product) {
    return next(new ApiError(`No Product for this id ${id}`, 404));
  }

  res.status(201).json({ data: product });
});

//  @dec    delete  product by id
//  @route  Delete  /api/v1/products/:id
//  @access Private
exports.deleteProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const product = await ProductModel.findByIdAndDelete(id);
  if (!product) {
    return next(new ApiError(`No Product for this id ${id}`, 404));
  }

  res
    .status(201)
    .json({ status: 201, message: "sucess to delete this Product" });
});
