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
  getLoggedUserData,
  updateLoggedUserPassword,
  updateLoggedUserData,
  deleteLoggedUserData
} = require("../services/userService");
const {
  getUserValidator,
  createUserValidator,
  updateUserValidator,
  deleteUserValidator,
  changeUserPasswordValidator,
  updateLoggedUserValidator,
  changeLoggedUserPasswordValidator
} = require("../utils/validators/userValidator");

const router = express.Router();

router.use(authServices.protect);
router.get("/getMe",getLoggedUserData, getUser)
router.put("/changeMyPassword",changeLoggedUserPasswordValidator,updateLoggedUserPassword)
router.put("/changeMyData",updateLoggedUserValidator,updateLoggedUserData)
router.delete("/deleteMe",deleteLoggedUserData)


router.use(authServices.allowedTo("admin"));
router
  .route("/")
  .post(uploadUserImage, resizeImage, createUserValidator, createUser)
  .get(getAllUsers);

router
  .route("/:id")
  .get(getUserValidator, getUser)
  .put(uploadUserImage, resizeImage, updateUserValidator, UpdateUser)
  .delete(deleteUserValidator, deleteUser);

router.put(
  "/changePassword/:id",
  changeUserPasswordValidator,
  changeUserPassword
);

module.exports = router;
