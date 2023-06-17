const asyncHandler = require("express-async-handler");
const CartModel = require("../modules/cartModel");
const ProductModel = require("../modules/productModel");
const ApiError = require("../utils/apiError/apiError");

const calculateTotalPrice = (cart) => {
  let totalPrice = 0;

  cart.cartItems.forEach((item) => {
    totalPrice += item.quantity * item.price;
  });
  cart.totalCartPrice = totalPrice;
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
      ApiError(`there is no cart for this user id : ${req.user.id}`, 404)
    );
  }

  res.status(200).json({
    status: "success",
    numOfCartItems: cart.cartItems.length,
    data: cart,
  });
});

//  @dec    update  Cart by id
//  @route  Put  /api/v1/cart/:id
//  @access Private
exports.UpdateCart = asyncHandler(async (req, res, next) => {});

//  @dec    remove specific  Cart item
//  @route  Delete  /api/v1/cart/:itemId
//  @access Private
exports.removeSpecificCartItem = asyncHandler(async (req, res, next) => {
  //get cart for logged user
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
