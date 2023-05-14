const express = require("express");



const {
  getCategory,
  UpdateCategory,
  deleteCategory,
  createCategory,
  getAllCategory,
  uploadImage
  
} = require("../services/categoryServices");
const {
  getCategoryValidator,
  createCategoryValidator,
  updateCategoryValidator,
  deleteCategoryValidator,
} = require("../utils/validators/categoryValidator");

const subCategoryRoute = require("./subCategoryRoute");

const router = express.Router();

router.use("/:categoryId/subCategory", subCategoryRoute);
router
  .route("/")
  .post(uploadImage,createCategoryValidator, createCategory)
  .get(getAllCategory);

router
  .route("/:id")
  .get(getCategoryValidator, getCategory)
  .put(updateCategoryValidator, UpdateCategory)
  .delete(deleteCategoryValidator, deleteCategory);
module.exports = router;
