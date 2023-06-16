const CouponModel = require("../modules/couponModel");
const factory = require("./handlerFactory");



//  @dec    create Coupon
//  @route  Post  /api/v1/Coupons
//  @access Private (admin)
exports.createCoupon = factory.createOne(CouponModel);

//  @dec    get list of Coupons
//  @route  Get  /api/v1/Coupons?page=?&limit=?
//  @access Private (admin)
exports.getAllCoupons = factory.getAll(CouponModel);

//  @dec    get specific Coupon by id
//  @route  Get  /api/v1/Coupons/:id
//  @access Private (admin)
exports.getCoupons = factory.getOne(CouponModel);

//  @dec    update  Coupon by id
//  @route  Put  /api/v1/Coupons/:id
//  @access Private (admin)
exports.UpdateCoupon = factory.updateOne(CouponModel);

//  @dec    delete  Coupon by id
//  @route  Delete  /api/v1/Coupons/:id
//  @access Private (admin)
exports.deleteCoupon = factory.deleteOne(CouponModel);
