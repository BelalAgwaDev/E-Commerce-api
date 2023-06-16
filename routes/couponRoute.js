const express = require("express");
const authServices = require("../services/authServices");
const {
  getCoupons,
  UpdateCoupon,
  deleteCoupon,
  createCoupon,
  getAllCoupons,
} = require("../services/couponServices");

const router = express.Router();
router.use(authServices.protect, authServices.allowedTo("admin"));
router.route("/").post(createCoupon).get(getAllCoupons);

router.route("/:id").get(getCoupons).put(UpdateCoupon).delete(deleteCoupon);
module.exports = router;
