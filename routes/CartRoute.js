const express = require("express");
const authServices = require("../services/authServices");
const { addProdctToCart,getLoggedUsercart,removeSpecificCartItem ,clearLoggedCartItem,updateSpecificCartItemQuantity,applyCouponOnLoggedUserCart} = require("../services/cartServices");



const router = express.Router();
router.use(authServices.protect, authServices.allowedTo("user"));

router.route("/").post(addProdctToCart).get(getLoggedUsercart).delete(clearLoggedCartItem);
router.route("/applyCoupon").put(applyCouponOnLoggedUserCart);
router.route("/:itemId").delete(removeSpecificCartItem).put(updateSpecificCartItemQuantity);

module.exports = router;
