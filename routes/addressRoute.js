const express = require("express");
const authServices = require("../services/authServices");
const {
 addAddress,
 removeAddress,
 getLoggedAddress
} = require("../services/addressServieces");


const router = express.Router();

router.use(authServices.protect, authServices.allowedTo("user"));
router.route("/").post(addAddress).get(getLoggedAddress);

router.route("/:addressId").delete(removeAddress);

module.exports = router;
