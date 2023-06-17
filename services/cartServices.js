const asyncHandler = require("express-async-handler");
const CartModel = require("../modules/cartModel");
const ProductModel = require("../modules/productModel");
const CouponModel = require("../modules/couponModel");
const ApiError = require("../utils/apiError/apiError");

const calculateTotalPrice = (cart) => { 
  let totalPrice = 0;

  cart.cartItems.forEach((item) => {
    totalPrice += item.quantity * item.price;
  });
  cart.totalCartPrice = totalPrice;
  cart.totalPriceAfterDiscount=undefined
  return totalPrice;
};

//  @dec    Add product to Cart
//  @route  Post  /api/v1/cart
//  @access Private/user
exports.addProdctToCart = asyncHandler(async (req, res, next) => {
  const { productId, color } = req.body;

  const product = await ProductModel.findById(productId);

  //get cart for logged user
  let cart = await CartModel.findOne({ user: req.user.id });

  if (!cart) {
    cart = await CartModel.create({
      user: req.user.id,
      cartItems: [{ product: productId, color: color, price: product.price }],
    });
  } else {
    //product exist in cart ,update product quantity
    const productIndex = cart.cartItems.findIndex(
      (item) => item.product.toString() === productId && item.color === color
    );

    if (productIndex > -1) {
      const cartItem = cart.cartItems[productIndex];
      cartItem.quantity += 1;
      cart.cartItems[productIndex] = cartItem;
    } else {
      //product not exist in cart, push product to cartItmes array
      cart.cartItems.push({
        product: productId,
        color: color,
        price: product.price,
      });
    }
  }

  //calculate total cart price
  calculateTotalPrice(cart);

  await cart.save();
  res.status(200).json({
    status: "success",
    message: "protuct added to cart successfully",
    numOfCartItems: cart.cartItems.length,
    data: cart,
  });
});

//  @dec    get logged use  cart
//  @route  Get  /api/v1/cart
//  @access Private/user
exports.getLoggedUsercart = asyncHandler(async (req, res, next) => {
  //get cart for logged user
  const cart = await CartModel.findOne({ user: req.user.id }).populate(
    "cartItems.product"
  );

  if (!cart) {
    return next(
      new ApiError(`there is no cart for this user id : ${req.user.id}`, 404)
    );
  }

  res.status(200).json({
    status: "success",
    numOfCartItems: cart.cartItems.length,
    data: cart,
  });
});

//  @dec    remove specific  Cart item
//  @route  Delete  /api/v1/cart/:itemId
//  @access Private/user
exports.removeSpecificCartItem = asyncHandler(async (req, res, next) => {
  const cart = await CartModel.findOneAndUpdate(
    { user: req.user._id },
    {
      $pull: { cartItems: { _id: req.params.itemId } },
    },
    {
      new: true,
    }
  );

  calculateTotalPrice(cart);
  await cart.save();

  res.status(200).json({
    status: "success",
    numOfCartItems: cart.cartItems.length,
    data: cart,
  });
});

//  @dec    clear logged Cart item
//  @route  Delete  /api/v1/cart/:itemId
//  @access Private/user
exports.clearLoggedCartItem = asyncHandler(async (req, res, next) => {
  await CartModel.findOneAndDelete(
    { user: req.user._id },
    {
      $pull: { cartItems: { _id: req.params.itemId } },
    },
    {
      new: true,
    }
  );

  res.status(200).json({
    status: "success to clear data",
  });
});

//  @dec    update specific Cart item quantity
//  @route  Put  /api/v1/cart/:itemId
//  @access Private/user
exports.updateSpecificCartItemQuantity = asyncHandler(
  async (req, res, next) => {
    const { quantity } = req.body;

    const cart = await CartModel.findOne({ user: req.user._id });

    if (!cart) {
      return next(
        new ApiError(`there is no cart for this user id : ${req.user.id}`, 404)
      );
    }

    const itemIndex = cart.cartItems.findIndex(
      (item) => item._id.toString() === req.params.itemId
    );
    if (itemIndex > -1) {
      const cartItem = cart.cartItems[itemIndex];
      cartItem.quantity = quantity;
    } else {
      return next(
        new ApiError(
          `there is no item for this  id : ${req.params.itemId}`,
          404
        )
      );
    }

    calculateTotalPrice(cart);
    await cart.save();

    res.status(200).json({
      status: "success",
      numOfCartItems: cart.cartItems.length,
      data: cart,
    });
  }
);

//  @dec    apply coupon on logged user cart
//  @route  Put  /api/v1/cart/applyCoupon
//  @access Private/user
exports.applyCouponOnLoggedUserCart = asyncHandler(async (req, res, next) => {
  //1) get coupon based on coupon name

  const coupon = await CouponModel.findOne({
    name: req.body.coupon,
    expire: { $gt: Date.now() },
  });

  if (!coupon) {
    return next(new ApiError(`coupon is invalid or expire`));
  }

  // get logged user cart to get total price
  const cart = await CartModel.findOne({ user: req.user._id });

  if (!cart) {
    return next(
      new ApiError(`there is no cart for this user id : ${req.user.id}`, 404)
    );
  }

  const totalPrice = cart.totalCartPrice;

  // calculate price after totalPriceAfterDiscount

  const totalPriceAfterDiscount = (
    totalPrice -
    (coupon.discount * totalPrice) / 100
  ).toFixed(2);
  cart.totalPriceAfterDiscount = totalPriceAfterDiscount;

  await cart.save();

  res.status(200).json({
    status: "success",
    numOfCartItems: cart.cartItems.length,
    data: cart,
  });
});
