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

const authServices = require("../services/authServices");
const subCategoryRoute = require("./subCategoryRoute");

const router = express.Router();

router.use("/:categoryId/subCategory", subCategoryRoute);
router
  .route("/")
  .post(
    authServices.protect,
    authServices.allowedTo("admin"),
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
    authServices.protect,
    authServices.allowedTo("admin"),
    uploadCategoryImage,
    resizeImage,
    updateCategoryValidator,
    UpdateCategory
  )
  .delete(authServices.protect,
    authServices.allowedTo("admin"),deleteCategoryValidator, deleteCategory);
module.exports = router;
