const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const ApiError = require("../utils/apiError/apiError");
const UserModel = require("../modules/userModel");

const createToken = (payload) =>
  jwt.sign({ userId: payload }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRY_TIME,
  });

//  @dec    sign up
//  @route  Post  /api/v1/auth/signUp
//  @access Public
exports.signUp = asyncHandler(async (req, res, next) => {
  //1) create user
  const user = await UserModel.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });

  //2) generate token
  const token = createToken(user._id);

  //4) send response to client side
  res.status(201).json({ token, data: user });
});

//  @dec   login
//  @route  Post  /api/v1/auth/login
//  @access Public
exports.login = asyncHandler(async (req, res, next) => {
  //1) check if password and email in the body (validation)
  //2) check if  user exist & check if passwoed is correct
  const user = await UserModel.findOne({
    email: req.body.email,
  });

  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    return next(new ApiError("Incorrect email or password."));
  }
  //3) generate token
  const token = createToken(user._id);

  //4) send response to client side
  res.status(201).json({ token, data: user });
});
