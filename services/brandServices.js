
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError/apiError");
const BrandModel = require("../modules/brandModel");
const ApiFeatures = require("../utils/apiFeatures/apiFeatures");
const factory = require('./handlerFactory');

//  @dec    create brand
//  @route  Post  /api/v1/brands
//  @access Private
exports.createBrand = factory.createOne(BrandModel)

//  @dec    get list of Brands
//  @route  Get  /api/v1/brands?page=?&limit=?
//  @access Public
exports.getAllBrands = asyncHandler(async (req, res) => {

  // build quary
  const apiFeatures = new ApiFeatures(BrandModel.find(), req.query)
    .pagination()
    .sorting()
    .Limitfields()
    .filterData()
    .search();

  //   execute mongose quary
  const { mongooseQuery, paginationRuslt } = apiFeatures;
  const brands = await mongooseQuery;
  res.status(201).json({
    results: brands.length,
    page: paginationRuslt.currentPage,
    data: brands,
  });
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
exports.UpdateBrand =factory.updateOne(BrandModel)

//  @dec    delete  Brand by id
//  @route  Delete  /api/v1/brands/:id
//  @access Private
exports.deleteBrand = factory.deleteOne(BrandModel)
