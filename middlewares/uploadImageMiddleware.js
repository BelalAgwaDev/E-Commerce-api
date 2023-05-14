const multer = require("multer");
const ApiError = require("../utils/apiError/apiError");

//Disk storage engine
// const multerStorage=multer.diskStorage({
//     destination:function(req,res,cb){
//          cb(null,"uploads/category")
//     },
//     filename: function (req, file, cb) {
//         const ext=file.mimetype.split("/")[1]
//         const filename = `category-${uuidv4()}-${Date.now()}.${ext}`
//         cb(null,filename)

//       }
// })

exports.uploadSingleImage=(fieldName)=>{
 const multerStorage = multer.memoryStorage();
    //memory storage
const multerFilter = function (req, file, cb) {
    
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(new ApiError("only images are allowed", 400), false);
    }
  };
 
  const upload = multer({ storage: multerStorage, fileFilter: multerFilter });
  
  return  upload.single(fieldName);


}