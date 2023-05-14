const express = require("express");

const {
  getCategory,
  UpdateCategory,
  deleteCategory,
  createCategory,
  getAllCategory,
  uploadCategoryImage,
  resizeImage,
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
  .post(
    uploadCategoryImage,
    resizeImage,
    createCategoryValidator,
    createCategory
  )
  .get(getAllCategory);

router
  .route("/:id")
  .get(getCategoryValidator, getCategory)
  .put(
    uploadCategoryImage,
    resizeImage,
    updateCategoryValidator,
    UpdateCategory
  )
  .delete(deleteCategoryValidator, deleteCategory);
module.exports = router;
