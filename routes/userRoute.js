const express = require("express");
const authServices = require("../services/authServices");

const {
  getUser,
  UpdateUser,
  deleteUser,
  createUser,
  getAllUsers,
  uploadUserImage,
  resizeImage,
  changeUserPassword,
} = require("../services/userService");
const {
  getUserValidator,
  createUserValidator,
  updateUserValidator,
  deleteUserValidator,
  changeUserPasswordValidator,
} = require("../utils/validators/userValidator");

const router = express.Router();

router
  .route("/")
  .post(
    authServices.protect,
    authServices.allowedTo("admin"),
    uploadUserImage,
    resizeImage,
    createUserValidator,
    createUser
  )
  .get(authServices.protect, authServices.allowedTo("admin"), getAllUsers);

router
  .route("/:id")
  .get(
    authServices.protect,
    authServices.allowedTo("admin"),
    getUserValidator,
    getUser
  )
  .put(
    authServices.protect,
    authServices.allowedTo("admin"),
    uploadUserImage,
    resizeImage,
    updateUserValidator,
    UpdateUser
  )
  .delete(
    authServices.protect,
    authServices.allowedTo("admin"),
    deleteUserValidator,
    deleteUser
  );

router.put(
  "/changePassword/:id",
  changeUserPasswordValidator,
  changeUserPassword
);

module.exports = router;
