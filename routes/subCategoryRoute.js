const express = require("express");
const authServices = require("../services/authServices");
const {
  createSubCategory,
  getSubCategory,
  getAllSubCategory,
  deleteSubCategory,
  UpdateSubCategory,
  setCategoryIdToBody,
  createFilterObject
} = require("../services/subCategoryServices");
const {
  deleteSubCategoryValidator,
  updateSubCategoryValidator,
  createSubCategoryValidator,
  getSubCategoryValidator,
} = require("../utils/validators/subCategoryValidator");

//mergeparms: allow us to access parameters on other routers
//ex: we need to access category id from category router
const router = express.Router({mergeParams:true});

router
  .route("/")
  .post(authServices.protect,
    authServices.allowedTo("admin"),setCategoryIdToBody,createSubCategoryValidator, createSubCategory)
  .get(createFilterObject,getAllSubCategory);

router
  .route("/:id")
  .get(getSubCategoryValidator, getSubCategory)
  .delete(authServices.protect,
    authServices.allowedTo("admin"),deleteSubCategoryValidator, deleteSubCategory)
  .put(authServices.protect,
    authServices.allowedTo("admin"),updateSubCategoryValidator, UpdateSubCategory);

module.exports = router;
