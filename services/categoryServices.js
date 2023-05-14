const { v4: uuidv4 } = require('uuid');
const multer  = require('multer')
const CategoryModel = require("../modules/categoryModel");
const factory = require('./handlerFactory');
const ApiError = require('../utils/apiError/apiError');


//Disk storage engine
const multerStorage=multer.diskStorage({
    destination:function(req,res,cb){
         cb(null,"uploads/category")
    },
    filename: function (req, file, cb) {
        const ext=file.mimetype.split("/")[1]
        const filename = `category-${uuidv4()}-${Date.now()}.${ext}`
        cb(null,filename)
       
      }
})

const multerFilter=function(req,file,cb){
    if(file.mimetype.startsWith("image")){
        cb(null,true)
    }else{
        cb(new ApiError("only images are allowed",400),false)
    }
}
const upload = multer({ storage: multerStorage,fileFilter:multerFilter })

exports.uploadImage=upload.single('image')

//  @dec    create category
//  @route  Post  /api/v1/categories
//  @access Private
exports.createCategory = factory.createOne(CategoryModel)

//  @dec    get list of categories
//  @route  Get  /api/v1/categories?page=?&limit=?
//  @access Public
exports.getAllCategory =factory.getAll(CategoryModel)

//  @dec    get specific category by id
//  @route  Get  /api/v1/categories/:id
//  @access Public
exports.getCategory = factory.getOne(CategoryModel)

//  @dec    update  category by id
//  @route  Put  /api/v1/categories/:id
//  @access Private
exports.UpdateCategory = factory.updateOne(CategoryModel)

//  @dec    delete  category by id
//  @route  Delete  /api/v1/categories/:id
//  @access Private
exports.deleteCategory = factory.deleteOne(CategoryModel)