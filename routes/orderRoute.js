const express = require("express");
const authServices = require("../services/authServices");
const {
    createCashOrder
} = require("../services/orderServices");

const router = express.Router();
router.use(authServices.protect, authServices.allowedTo("user"));

router
  .route("/:cartId")
  .post(createCashOrder)
  

module.exports = router;
