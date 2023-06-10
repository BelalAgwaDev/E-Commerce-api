const express = require("express");
const authServices = require("../services/authServices");
const {
  getBrands,
  UpdateBrand,
  deleteBrand,
  createBrand,
  getAllBrands,
  uploadBrandImage,
  resizeImage,
} = require("../services/brandServices");
const {
  getBrandValidator,
  createBrandValidator,
  updateBrandValidator,
  deleteBrandValidator,
} = require("../utils/validators/brandValidator");

const router = express.Router();

router
  .route("/")
  .post(authServices.protect,
    authServices.allowedTo("admin"),uploadBrandImage, resizeImage, createBrandValidator, createBrand)
  .get(getAllBrands);

router
  .route("/:id")
  .get(getBrandValidator, getBrands)
  .put(authServices.protect,
    authServices.allowedTo("admin"),uploadBrandImage, resizeImage, updateBrandValidator, UpdateBrand)
  .delete(authServices.protect,
    authServices.allowedTo("admin"),deleteBrandValidator, deleteBrand);
module.exports = router;
