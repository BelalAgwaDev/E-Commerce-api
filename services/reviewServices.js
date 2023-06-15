const ReviewModel = require("../modules/reviewModel");
const factory = require("./handlerFactory");

//nested route
// get /api/v1/products/:productId/reviews 
exports.createFilterObject = (req, res, next) => {
    let filterObject = {};
    if (req.params.productId) filterObject = { product: req.params.productId };
    req.filterObject = filterObject;
    next();
  };

  
//  @dec    create Reviews
//  @route  Post  /api/v1/reviews
//  @access Private/protect/user
exports.createReviews = factory.createOne(ReviewModel);

//  @dec    get list of Reviews
//  @route  Get  /api/v1/reviews?page=?&limit=?
//  @access Public
exports.getAllReviews = factory.getAll(ReviewModel);
//  @dec    get specific Reviews by id
//  @route  Get  /api/v1/reviews/:id
//  @access Public
exports.getReviews = factory.getOne(ReviewModel);

//  @dec    update  Reviews by id
//  @route  Put  /api/v1/reviews/:id
//  @access Private/protect/user
exports.UpdateReviews = factory.updateOne(ReviewModel);

//  @dec    delete  Reviews by id
//  @route  Delete  /api/v1/reviews/:id
//  @access Private/protect/user/admin/manger
exports.deleteReviews = factory.deleteOne(ReviewModel);
