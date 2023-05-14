const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");
const asyncHandler = require("express-async-handler");
const { uploadSingleImage } = require("../middlewares/uploadImageMiddleware");
const BrandModel = require("../modules/brandModel");
const factory = require("./handlerFactory");

//upload single image
exports.uploadBrandImage = uploadSingleImage("image");

//image processing
exports.resizeImage = asyncHandler(async (req, res, next) => {
  const fileName = `brand-${uuidv4()}-${Date.now()}.jpeg`;
  if (req.file) {
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`uploads/brands/${fileName}`);

    //save image into our db
    req.body.image = fileName;
  }

  next();
});

//  @dec    create brand
//  @route  Post  /api/v1/brands
//  @access Private
exports.createBrand = factory.createOne(BrandModel);

//  @dec    get list of Brands
//  @route  Get  /api/v1/brands?page=?&limit=?
//  @access Public
exports.getAllBrands = factory.getAll(BrandModel);
//  @dec    get specific Brand by id
//  @route  Get  /api/v1/brands/:id
//  @access Public
exports.getBrands = factory.getOne(BrandModel);

//  @dec    update  Brand by id
//  @route  Put  /api/v1/brands/:id
//  @access Private
exports.UpdateBrand = factory.updateOne(BrandModel);

//  @dec    delete  Brand by id
//  @route  Delete  /api/v1/brands/:id
//  @access Private
exports.deleteBrand = factory.deleteOne(BrandModel);
