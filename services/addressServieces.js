const asyncHandler = require("express-async-handler");

const UserModel = require("../modules/userModel");

//  @dec    add address to user address list
//  @route  Post  /api/v1/address
//  @access Protect/user
exports.addAddress = asyncHandler(async (req, res, next) => {
  const user = await UserModel.findByIdAndUpdate(
    req.user.id,
    {
      $addToSet: { addresses: req.body },
    },
    {
      new: true,
    }
  );
  res
    .status(201)
    .json({
      status: "success",
      message: "address add successfully",
      data:user.addresses
    });
});




//  @dec    remove address from address list
//  @route  Delete  /api/v1/address:addressId
//  @access Protect/user
exports.removeAddress = asyncHandler(async (req, res, next) => {
    const user = await UserModel.findByIdAndUpdate(
      req.user.id,
      {
        $pull: { addresses: {_id:req.params.addressId} },
      },
      {
        new: true,
      }
    );
    res
      .status(201)
      .json({
        status: "success",
        message: "address removed successfully",
        data:user.addresses
      });
  });
  


  
//  @dec    get address to user 
//  @route  Get  /api/v1/address
//  @access Protect/user
exports.getLoggedAddress = asyncHandler(async (req, res, next) => {
  const user = await UserModel.findById(req.user.id).populate("addresses")
  res
  .status(201)
  .json({
    status: "success",
    message: "successfully get all address",
    result:user.addresses.length,
    data:user.addresses
  });
})