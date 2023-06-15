const express = require("express");
const authServices = require("../services/authServices");
const {
  addProductToWishList,
  removeProductFromWishList,
  getLoggedUserWishList,
} = require("../services/wishListServieces");

const router = express.Router();

router.use(authServices.protect, authServices.allowedTo("user"));
router.route("/").post(addProductToWishList).get(getLoggedUserWishList);

router.route("/:productId").delete(removeProductFromWishList);

module.exports = router;
