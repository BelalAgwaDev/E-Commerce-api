const express = require("express");
const authServices = require("../services/authServices");
const {
  getReviews,
  getAllReviews,
  UpdateReviews,
  createReviews,
  deleteReviews,
  createFilterObject,
  setProductIdAndUserIdToBody
} = require("../services/reviewServices");
const {
 createReviewValidator,
 updateReviewValidator,
 getReviewValidator,
 deleteReviewValidator
} = require("../utils/validators/reviewsValidator");

const router = express.Router({mergeParams:true});

router
  .route("/")
  .post(authServices.protect,
    authServices.allowedTo("user"),setProductIdAndUserIdToBody,createReviewValidator, createReviews)
  .get(createFilterObject,getAllReviews);

router
  .route("/:id")
  .get(getReviewValidator,getReviews)
  .put(authServices.protect,
    authServices.allowedTo("user"),updateReviewValidator, UpdateReviews)
  .delete(authServices.protect,
    authServices.allowedTo("user","admin"),deleteReviewValidator, deleteReviews);
module.exports = router;
