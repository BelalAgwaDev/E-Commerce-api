const express = require("express");
const authServices = require("../services/authServices");
const ReviewRoute = require("./reviewRoute");

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

//post  /product/productId/reviews
//Get  /product/productId/reviews
//Get  /product/productId/reviews/reviewId
router.use("/:productId/reviews", ReviewRoute);
router
  .route("/")
  .post(authServices.protect,
    authServices.allowedTo("admin"),uploadProductImage, resizeImage, createProductValidator, createProduct)
  .get(getAllProduct);

router
  .route("/:id")
  .get(getProductValidator, getProduct)
  .put(authServices.protect,
    authServices.allowedTo("admin"),uploadProductImage, resizeImage, updateProductValidator, updateProduct)
  .delete(authServices.protect,
    authServices.allowedTo("admin"),deleteProductValidator, deleteProduct);
module.exports = router;
