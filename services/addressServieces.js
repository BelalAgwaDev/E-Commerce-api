const asyncHandler = require("express-async-handler");
const factory = require("./handlerFactory");
const addressModel = require("../modules/addressModel");
const ApiError = require("../utils/apiError/apiError");
//  @dec    create new address
//  @route  Post  /api/v1/address
//  @access Protect/user
exports.createAddress = asyncHandler(async (req, res, next) => {
  const address = await addressModel.create({
    user: req.user._id,
    alias: req.body.alias,
    BuildingName: req.body.BuildingName,
    aptNo: req.body.aptNo,
    floor: req.body.floor,
    region: req.body.region,
    additionalDirections: req.body.additionalDirections,
    latitude: req.body.latitude,
    longitude: req.body.longitude,
    phone: req.body.phone,
    addressLabel: req.body.addressLabel,
  });

  res.status(201).json({
    status: "success",
    message: "create address successfully",
    data: address,
  });
});

//  @dec    remove address
//  @route  Delete  /api/v1/address:addressId
//  @access Protect/user
exports.removeAddress = factory.deleteOne(addressModel);


//  @dec    get address logged
//  @route  Get  /api/v1/address:addressId
//  @access Protect/user
exports.getLoggedAddress = asyncHandler(async (req, res, next) => {
  const address= await addressModel.find({user:req.user.id})
  
  if (address.length===0) {
    return next(
      new ApiError(`there is no address for this  id : ${req.user.id}`, 404)
    );
  }
  
  res.status(201).json({
    status: "success",
    message: "successfully get all address",
    result: address.length,
    data: address,
  });
});
