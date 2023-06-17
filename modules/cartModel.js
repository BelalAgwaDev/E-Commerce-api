const mongoose = require("mongoose");

const CartSchema = mongoose.Schema(
  {
    cartItems: [
      {
        product: {
          type: mongoose.Schema.ObjectId,
          ref: "Product",
        },
        quantity: { type: Number, default: 1 },
        color: String,
        price: Number,
      },
    ],
    totalCartPrice: Number,
    totalPriceAfterDiscount: Number,
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

CartSchema.pre(/^find/,function(next){
  this.populate({
    path:"user",
    select:"name profileImage email phone"
  }).populate({
    path:"cartItems.product",
    select:"title imageCover "
  })

  next()
})
const CartModel = mongoose.model("Cart", CartSchema);

module.exports = CartModel;
