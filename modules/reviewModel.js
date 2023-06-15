const mongoose = require("mongoose");

const ReviewSchema = mongoose.Schema(
  {
title:{
    type:String,

},

rating:{
    type:Number,
    min:[1,"Min rating value is 1.0"],
    max:[5,"Max rating value is 5.0"],
    required:[true,"review rating required"]
},

user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'review must be belong to user'],
  },

  product: {
    type: mongoose.Schema.ObjectId,
    ref: 'Product',
    required: [true, 'review must be belong to Product'],
  },
  },  { timestamps: true });

  ReviewSchema.pre(/^find/,function(next){
    this.populate({path:"user",select:"name"})
    next()
  })

  const ReviewModel = mongoose.model("Review", ReviewSchema);
  
  module.exports = ReviewModel;
  