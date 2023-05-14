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
  getUserValidator,
  createUserValidator,
  updateUserValidator,
  deleteUserValidator,
} = require("../utils/validators/userValidator");

const router = express.Router();

router
  .route("/")
  .post(uploadUserImage, resizeImage, createUserValidator, createUser)
  .get(getAllUsers);

router
  .route("/:id")
  .get(getUserValidator, getUser)
  .put(uploadUserImage, resizeImage, updateUserValidator, UpdateUser)
  .delete(deleteUserValidator, deleteUser);
module.exports = router;
