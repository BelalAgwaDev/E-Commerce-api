const express = require("express");
const authServices = require("../services/authServices");
const { addProdctToCart,getLoggedUsercart,removeSpecificCartItem } = require("../services/cartServices");



const router = express.Router();
router.use(authServices.protect, authServices.allowedTo("user"));

router.route("/").post(addProdctToCart).get(getLoggedUsercart);
router.route("/:itemId").delete(removeSpecificCartItem);

module.exports = router;
