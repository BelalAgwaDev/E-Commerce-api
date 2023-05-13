const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError/apiError");
const SubCategoryModel = require("../modules/subCategoryModel");
const ApiFeatures = require("../utils/apiFeatures/apiFeatures");
const factory = require('./handlerFactory');

//  @dec    create Sub category
//  @route  Post  /api/v1/subcategories
//  @access Private
exports.createSubCategory = asyncHandler(async (req, res) => {
  const { name, category } = req.body;
  console.log(category)
  console.log(name)
  const subcategory = await SubCategoryModel.create({
    name,
    slug: slugify(name),
    category,
  });
  res.status(201).json({ data: subcategory });
});

//@dec nested route
//@route  Get  /api/v1/categories/:categoryId/subcategories

//  @dec    get list of sub categories
//  @route  Get  /api/v1/subcategories?page=?&limit=?
//  @access Public
exports.getAllSubCategory = asyncHandler(async (req, res) => {

//  // pagination
//  const page = req.query.page * 1 || 1;
//  const limit = req.query.limit * 1 || 5;
//  const skip = (page - 1) * limit;

//   const subCategories = await SubCategoryModel.find(req.filterObject)
//      .skip(skip)
//      .limit(limit);
  // .populate({ path: "category", select: "name -_id" });

    // build quary
    const apiFeatures = new ApiFeatures(SubCategoryModel.find(req.filterObject), req.query)
    .pagination()
    .sorting()
    .Limitfields()
    .filterData()
    .search();

  //   execute mongose quary
  const { mongooseQuery, paginationRuslt } = apiFeatures;
  const subCategories = await mongooseQuery;
  res
    .status(201)
    .json({ results: subCategories.length,page: paginationRuslt.currentPage, data: subCategories });
});

//  @dec    get specific sub category by id
//  @route  Get  /api/v1/subCategories/:id
//  @access Public
exports.getSubCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const subCategories = await SubCategoryModel.findById(id);
  // .populate({
  //   path: "category",
  //   select: "name -_id",
  // });
  if (!subCategories) {
    return next(new ApiError(`No SubcCategory for this id ${id}`, 404));
  }

  res.status(201).json({ data: subCategories });
});

//  @dec    update  SubCategory by id
//  @route  Put  /api/v1/subCategories/:id
//  @access Private
exports.UpdateSubCategory = factory.updateOne(SubCategoryModel)

//  @dec    delete  subCategory by id
//  @route  Delete  /api/v1/subCategories/:id
//  @access Private
exports.deleteSubCategory =factory.deleteOne(SubCategoryModel)




//@dec nested route
exports.setCategoryIdToBody = (req, res, next) => {
  if (!req.body.category) req.body.category = req.params.categoryId;
  next()
};



exports.createFilterObject=(req,res,next)=>{
  
  let filterObject = {};
  if (req.params.categoryId) filterObject = { category: req.params.categoryId };
  req.filterObject=filterObject
  next()
}
