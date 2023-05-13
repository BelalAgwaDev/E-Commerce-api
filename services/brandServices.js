const BrandModel = require("../modules/brandModel");
const factory = require('./handlerFactory');

//  @dec    create brand
//  @route  Post  /api/v1/brands
//  @access Private
exports.createBrand = factory.createOne(BrandModel)

//  @dec    get list of Brands
//  @route  Get  /api/v1/brands?page=?&limit=?
//  @access Public
exports.getAllBrands = factory.getAll(BrandModel)
//  @dec    get specific Brand by id
//  @route  Get  /api/v1/brands/:id
//  @access Public
exports.getBrands = factory.getOne(BrandModel)

//  @dec    update  Brand by id
//  @route  Put  /api/v1/brands/:id
//  @access Private
exports.UpdateBrand =factory.updateOne(BrandModel)

//  @dec    delete  Brand by id
//  @route  Delete  /api/v1/brands/:id
//  @access Private
exports.deleteBrand = factory.deleteOne(BrandModel)
