const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError/apiError");
const BrandModel = require("../modules/brandModel");

//  @dec    create brand
//  @route  Post  /api/v1/brands
//  @access Private
exports.createBrand = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const brands = await BrandModel.create({ name, slug: slugify(name) });
  res.status(201).json({ data: brands });
});


//  @dec    get list of Brands
//  @route  Get  /api/v1/brands?page=?&limit=?
//  @access Public
exports.getAllBrands = asyncHandler(async (req, res) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 5;
  const skip = (page - 1) * limit;
  const brands = await BrandModel.find({}).skip(skip).limit(limit);
  res
    .status(201)
    .json({ results: brands.length, page: page, data: brands });
});

//  @dec    get specific Brand by id
//  @route  Get  /api/v1/brands/:id
//  @access Public
exports.getBrands = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const brands = await BrandModel.findById(id);
  if (!brands) {
    return next(new ApiError(`No Category for this id ${id}`, 404));
  }

  res.status(201).json({ data: brands });
});

//  @dec    update  Brand by id
//  @route  Put  /api/v1/brands/:id
//  @access Private
exports.UpdateBrand = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;

  const brands = await BrandModel.findOneAndUpdate(
    { _id: id },
    { name, slug: slugify(name) },
    { new: true }
  );
  if (!brands) {
    return next(new ApiError(`No Brands for this id ${id}`, 404));
  }

  res.status(201).json({ data: brands });
});

//  @dec    delete  Brand by id
//  @route  Delete  /api/v1/brands/:id
//  @access Private
exports.deleteBrand = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const brands = await BrandModel.findByIdAndDelete(id);
  if (!brands) {
    return next(new ApiError(`No Brands for this id ${id}`, 404));
  }

  res
    .status(201)
    .json({ status: 201, message: "sucess to delete this Brands" });
});
