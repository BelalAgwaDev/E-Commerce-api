const express = require("express");
const {
  getUser,
  UpdateUser,
  deleteUser,
  createUser,
  getAllUsers,
  uploadUserImage,
  resizeImage,
} = require("../services/userService");
const {
  getBrandValidator,
  createBrandValidator,
  updateBrandValidator,
  deleteBrandValidator,
} = require("../utils/validators/brandValidator");

const router = express.Router();

router
  .route("/")
  .post(uploadUserImage, resizeImage, createBrandValidator, createUser)
  .get(getAllUsers);

router
  .route("/:id")
  .get(getBrandValidator, getUser)
  .put(uploadUserImage, resizeImage, updateBrandValidator, UpdateUser)
  .delete(deleteBrandValidator, deleteUser);
module.exports = router;
