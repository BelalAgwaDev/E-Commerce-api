const asyncHandler = require("express-async-handler");
const OrderModel = require("../modules/orderModel");
const CartModel = require("../modules/cartModel");
const ProductModel = require("../modules/productModel");
//const factory = require("./handlerFactory");
const ApiError = require("../utils/apiError/apiError");

//  @dec    create cash Order
//  @route  Post  /api/v1/orders/cardId
//  @access Protect/user
exports.createCashOrder = asyncHandler(async (req, res, next) => {
  const taxPrice = 0;
  const shippingPrice = 0;

  //1) get Cart depend on cartId
  const cart = await CartModel.findById(req.params.cartId);
  if (!cart) {
    return next(
      new ApiError(`there is no cart for this  id : ${req.params.cartId}`, 404)
    );
  }

  //2) get order price depend on cart price "check coupon apply"
  const cartPrice = cart.totalPriceAfterDiscount
    ? cart.totalPriceAfterDiscount
    : cart.totalCartPrice;

  const totalOrderPrice = cartPrice + taxPrice + shippingPrice;

  //3) create order with default payment method type cash
  const order = await OrderModel.create({
    user: req.user._id,
    cartItems: cart.cartItems,
    totalOrderPrice: totalOrderPrice,
    shippingAddress: req.body.shippingAddress,
  });


  if (order) {
      
  //4) after creating order decrement product quantity ,increament product sold
    const bulkOption = cart.cartItems.map((item) => ({
      updateOne: {
        filter: { _id: item.product },
        update: { $inc: { quantity: -item.quantity, sold: +item.quantity } },
      },
    }));
    await ProductModel.bulkWrite(bulkOption, {});

    //5) clear cart depend on cartId
    await cart.findByIdAndDelete(req.params.cartId);
  }
  res.status(200).send({status:"success",data:order})
});
