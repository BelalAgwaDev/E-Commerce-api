const express = require("express");
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
  .post(uploadBrandImage, resizeImage, createBrandValidator, createBrand)
  .get(getAllBrands);

router
  .route("/:id")
  .get(getBrandValidator, getBrands)
  .put(uploadBrandImage, resizeImage, updateBrandValidator, UpdateBrand)
  .delete(deleteBrandValidator, deleteBrand);
module.exports = router;
