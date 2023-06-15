const { check } = require("express-validator");

const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const ReviewModel = require("../../modules/reviewModel");

exports.getReviewValidator = [
  check("id").isMongoId().withMessage("Invalid Review id format"),
  validatorMiddleware,
];

exports.createReviewValidator = [
  check("title").optional(),

  check("rating")
    .notEmpty()
    .withMessage("Rating value required")
    .isFloat({ min: 1, max: 5 })
    .withMessage("Ratings value must be between 1 to 5"),

  check("user").isMongoId().withMessage("Invalid Review user id format"),
  check("product")
    .isMongoId()
    .withMessage("Invalid Review product id format")
    .custom((val, { req }) => 
      //check if logged user create review before
       ReviewModel.findOne({
        user: req.user._id,
        product: req.body.product,
      }).then((review) => {
        if (review) {
          return Promise.reject(
            new Error("you already create a review before")
          );
        }
      })
    ),

  validatorMiddleware,
];

exports.updateReviewValidator = [
  check("id").isMongoId().withMessage("Invalid Review id format").custom((val,{req})=>
    //check review ownership before update
    ReviewModel.findById(val).then((review)=>{
      if(!review){
        return Promise.reject(
          new Error("there is no review with id")
        );
      }

      if(review.user._id.toString() !== req.user._id.toString()){
        return Promise.reject(
          new Error("your are not allowed to perform this action")
        );
      }
    })
  ),
  validatorMiddleware,
];

exports.deleteReviewValidator = [
  check("id").isMongoId().withMessage("Invalid Review id format").custom((val,{req})=>{
     //check review ownership before update
  if(req.user.role==="user"){
   return ReviewModel.findById(val).then((review)=>{
      if(!review){
        return Promise.reject(
          new Error("there is no review with id")
        );
      }
  
      if(review.user.toString() !== req.user._id.toString()){
        return Promise.reject(
          new Error("your are not allowed to perform this action")
        );
      }
    })
  }
  return true
  }),
  validatorMiddleware,
];
