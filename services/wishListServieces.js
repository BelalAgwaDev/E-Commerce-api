const asyncHandler = require("express-async-handler");

const UserModel = require("../modules/userModel");

//  @dec    add product to wishList
//  @route  Post  /api/v1/wishList
//  @access Protect/user
exports.addProductToWishList = asyncHandler(async (req, res, next) => {
  const user = await UserModel.findByIdAndUpdate(
    req.user.id,
    {
      $addToSet: { wishList: req.body.productId },
    },
    {
      new: true,
    }
  );
  res
    .status(201)
    .json({
      status: "success",
      message: "product add successfully to your wishlist",
      data:user.wishList
    });
});




//  @dec    remove product from wishList
//  @route  Delete  /api/v1/wishList
//  @access Protect/user
exports.removeProductFromWishList = asyncHandler(async (req, res, next) => {
    const user = await UserModel.findByIdAndUpdate(
      req.user.id,
      {
        $pull: { wishList: req.params.productId },
      },
      {
        new: true,
      }
    );
    res
      .status(201)
      .json({
        status: "success",
        message: "product removed successfully from your wishlist",
        data:user.wishList
      });
  });
  


  
//  @dec    get logged user wishList
//  @route  Get  /api/v1/wishList
//  @access Protect/user
exports.getLoggedUserWishList = asyncHandler(async (req, res, next) => {
  const user = await UserModel.findById(req.user.id).populate("wishList")
  res
  .status(201)
  .json({
    status: "success",
    message: "successfully get all wishList",
    result:user.wishList.length,
    data:user.wishList
  });
})