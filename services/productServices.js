const ProductModel = require("../modules/productModel");
const factory = require('./handlerFactory');

//  @dec    create product
//  @route  Post  /api/v1/products
//  @access Private
exports.createProduct =factory.createOne(ProductModel)

//  @dec    get list of product
//  @route  Get  /api/v1/products?page=?&limit=?
//  @access Public
exports.getAllProduct = factory.getAll(ProductModel,"product")

//  @dec    get specific product by id
//  @route  Get  /api/v1/products/:id
//  @access Public
exports.getProduct = factory.getOne(ProductModel)

//  @dec    update  product by id
//  @route  Put  /api/v1/products/:id
//  @access Private
exports.updateProduct = factory.updateOne(ProductModel)
//  @dec    delete  product by id
//  @route  Delete  /api/v1/products/:id
//  @access Private
exports.deleteProduct =factory.deleteOne(ProductModel)