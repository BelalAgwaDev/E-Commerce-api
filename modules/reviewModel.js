const mongoose = require("mongoose");
const productModel = require("./productModel");

const ReviewSchema = mongoose.Schema(
  {
    title: {
      type: String,
    },

    rating: {
      type: Number,
      min: [1, "Min rating value is 1.0"],
      max: [5, "Max rating value is 5.0"],
      required: [true, "review rating required"],
    },

    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "review must be belong to user"],
    },

    product: {
      type: mongoose.Schema.ObjectId,
      ref: "Product",
      required: [true, "review must be belong to Product"],
    },
  },
  { timestamps: true }
);

ReviewSchema.pre(/^find/, function (next) {
  this.populate({ path: "user", select: "name" });
  next();
});

ReviewSchema.statics.calcAvrageRatingsQuantity = async function (productId) {
  const result = await this.aggregate([
    //stage 1: get all reviews in specific product
    {
      $match: { product: productId },
    },
    //stage 2: grouping reviews based on product id and calc avrage ratings ,ratings quantity 
    {
      $group: {
        _id: "Product",
        ratingsAverage: { $avg: "$rating" },
        ratingsQuantity: { $sum: 1 },
      },
    },
  ]);
  
  if (result.length > 0) {
    await productModel.findByIdAndUpdate(productId, {
      ratingsAverage: result[0].ratingsAverage,
      ratingsQuantity: result[0].ratingsQuantity,

    });
  }else{
    await productModel.findByIdAndUpdate(productId, {
      ratingsAverage: 0,
      ratingsQuantity: 0,

    });
  }
};



ReviewSchema.post('save', async function () {
  await this.constructor.calcAvrageRatingsQuantity(this.product);
});




const ReviewModel = mongoose.model("Review", ReviewSchema);


module.exports = ReviewModel;
