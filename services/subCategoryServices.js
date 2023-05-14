const SubCategoryModel = require("../modules/subCategoryModel");
const factory = require("./handlerFactory");

//  @dec    create Sub category
//  @route  Post  /api/v1/subcategories
//  @access Private
exports.createSubCategory = factory.createOne(SubCategoryModel);

//@dec nested route
//@route  Get  /api/v1/categories/:categoryId/subcategories

//  @dec    get list of sub categories
//  @route  Get  /api/v1/subcategories?page=?&limit=?
//  @access Public
exports.getAllSubCategory = factory.getAll(SubCategoryModel);

//  @dec    get specific sub category by id
//  @route  Get  /api/v1/subCategories/:id
//  @access Public
exports.getSubCategory = factory.getOne(SubCategoryModel);

//  @dec    update  SubCategory by id
//  @route  Put  /api/v1/subCategories/:id
//  @access Private
exports.UpdateSubCategory = factory.updateOne(SubCategoryModel);

//  @dec    delete  subCategory by id
//  @route  Delete  /api/v1/subCategories/:id
//  @access Private
exports.deleteSubCategory = factory.deleteOne(SubCategoryModel);

//@dec nested route
exports.setCategoryIdToBody = (req, res, next) => {
  if (!req.body.category) req.body.category = req.params.categoryId;
  next();
};

exports.createFilterObject = (req, res, next) => {
  let filterObject = {};
  if (req.params.categoryId) filterObject = { category: req.params.categoryId };
  req.filterObject = filterObject;
  next();
};
