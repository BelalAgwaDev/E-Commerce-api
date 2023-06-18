const express = require("express");
const authServices = require("../services/authServices");
const {
  createAddress,
  removeAddress,
  getLoggedAddress,
} = require("../services/addressServieces");


const {
  createAddressValidator
} = require("../utils/validators/addressValidator");

const router = express.Router();

router.use(authServices.protect, authServices.allowedTo("user"));
router.route("/").post(createAddressValidator,createAddress).get(getLoggedAddress);

router.route("/:id").delete(removeAddress);

module.exports = router;
