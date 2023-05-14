const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");
const asyncHandler = require("express-async-handler");
const { uploadSingleImage } = require("../middlewares/uploadImageMiddleware");
const UserModel = require("../modules/userModel");
const factory = require("./handlerFactory");

//upload single image
exports.uploadUserImage = uploadSingleImage("profileImage");

//image processing
exports.resizeImage = asyncHandler(async (req, res, next) => {
  const fileName = `users-${uuidv4()}-${Date.now()}.jpeg`;
  if (req.file) {
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`uploads/users/${fileName}`);

    //save image into our db
    req.body.image = fileName;
  }

  next();
});

//  @dec    create user
//  @route  Post  /api/v1/users
//  @access Private
exports.createUser = factory.createOne(UserModel);

//  @dec    get list of users
//  @route  Get  /api/v1/users?page=?&limit=?
//  @access Private
exports.getAllUsers = factory.getAll(UserModel);

//  @dec    get specific user by id
//  @route  Get  /api/v1/users/:id
//  @access Private
exports.getUser = factory.getOne(UserModel);

//  @dec    update  user by id
//  @route  Put  /api/v1/users/:id
//  @access Private
exports.UpdateUser = factory.updateOne(UserModel);

//  @dec    delete  user by id
//  @route  Delete  /api/v1/users/:id
//  @access Private
exports.deleteUser = factory.deleteOne(UserModel);
