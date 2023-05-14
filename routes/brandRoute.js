const express = require("express");
const {
  getBrands,
  UpdateBrand,
  deleteBrand,
  createBrand,
  getAllBrands,
  uploadCategoryImage,
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
  .post(uploadCategoryImage, resizeImage, createBrandValidator, createBrand)
  .get(getAllBrands);

router
  .route("/:id")
  .get(getBrandValidator, getBrands)
  .put(uploadCategoryImage, resizeImage, updateBrandValidator, UpdateBrand)
  .delete(deleteBrandValidator, deleteBrand);
module.exports = router;
