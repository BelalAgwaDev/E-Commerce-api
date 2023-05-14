const express = require("express");
const {
  getProduct,
  updateProduct,
  deleteProduct,
  createProduct,
  getAllProduct,
  uploadProductImage,
  resizeImage,
} = require("../services/productServices");
const {
  getProductValidator,
  createProductValidator,
  updateProductValidator,
  deleteProductValidator,
} = require("../utils/validators/productValidator");

const router = express.Router();

router
  .route("/")
  .post(uploadProductImage, resizeImage, createProductValidator, createProduct)
  .get(getAllProduct);

router
  .route("/:id")
  .get(getProductValidator, getProduct)
  .put(uploadProductImage, resizeImage, updateProductValidator, updateProduct)
  .delete(deleteProductValidator, deleteProduct);
module.exports = router;
