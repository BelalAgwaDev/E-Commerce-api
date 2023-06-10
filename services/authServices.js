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



// @dec make sure the user is logged in
exports.protect = asyncHandler(async (req, res, next) => {
  // 1) check if token exist
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(
      new ApiError(
        "you are not login ,please login to grt access this route.",
        401
      )
    );
  }

  //2) verify token(no change happens ,expire token)
const decoded=  jwt.verify(token,process.env.JWT_SECRET_KEY)


  //check if user exist
  const currentUser=await UserModel.findById(decoded.userId)
  if(!currentUser){
    return next(new ApiError("the user that belong to this token does no longer exist.",401));
  }

  //check if user change his password after token created
  if(currentUser.passwordChangedAt){
    const passChangeTimeStamp=parseInt(currentUser.passwordChangedAt.getTime()/1000,10)
    if(passChangeTimeStamp>decoded.iat){
      return next(new ApiError("User recently changed his password, please login again .",401));
    }
    
  }

  req.user=currentUser
  next()
});



exports.allowedTo=(...roles)=>asyncHandler(async (req, res, next) => {
    //access roles
  //access registered user 
  if(!roles.includes(req.user.role)){
    return next(new ApiError("you are not allowed to access this route .",403));
  }
  next()

})