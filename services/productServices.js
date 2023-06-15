const asyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");
const { uploadListOfImage } = require("../middlewares/uploadImageMiddleware");
const ProductModel = require("../modules/productModel");
const factory = require("./handlerFactory");

exports.uploadProductImage = uploadListOfImage([
  {
    name: "imageCover",
    maxCount: 1,
  },
  {
    name: "images",
    maxCount: 5,
  },
]);

exports.resizeImage = asyncHandler(async (req, res, next) => {
  if (req.files) {
    //image processing for imageCover
    if (req.files.imageCover) {
      const imageCoverFileName = `products-${uuidv4()}-${Date.now()}-cover.jpeg`;

      await sharp(req.files.imageCover[0].buffer)
        .resize(2000, 1333)
        .toFormat("jpeg")
        .jpeg({ quality: 95 })
        .toFile(`uploads/products/${imageCoverFileName}`);

      //save image into our db
      req.body.imageCover = imageCoverFileName;
    }

    //image processing for images

    if (req.files.images) {
      req.body.images = [];
      await Promise.all(
        req.files.images.map(async (img, index) => {
          const imageName = `products-${uuidv4()}-${Date.now()}-${
            index + 1
          }.jpeg`;

          await sharp(img.buffer)
            .resize(2000, 1333)
            .toFormat("jpeg")
            .jpeg({ quality: 95 })
            .toFile(`uploads/products/${imageName}`);

          //save image into our db
          req.body.images.push(imageName);
        })
      );
    }
  }

  next();
});

//  @dec    create product
//  @route  Post  /api/v1/products
//  @access Private
exports.createProduct = factory.createOne(ProductModel);

//  @dec    get list of product
//  @route  Get  /api/v1/products?page=?&limit=?
//  @access Public
exports.getAllProduct = factory.getAll(ProductModel, "product");

//  @dec    get specific product by id
//  @route  Get  /api/v1/products/:id
//  @access Public
exports.getProduct = factory.getOne(ProductModel,"reviews");

//  @dec    update  product by id
//  @route  Put  /api/v1/products/:id
//  @access Private
exports.updateProduct = factory.updateOne(ProductModel);
//  @dec    delete  product by id
//  @route  Delete  /api/v1/products/:id
//  @access Private
exports.deleteProduct = factory.deleteOne(ProductModel);
