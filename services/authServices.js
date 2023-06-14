const asyncHandler = require("express-async-handler");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const ApiError = require("../utils/apiError/apiError");
const UserModel = require("../modules/userModel");
const sendEmail = require("../utils/sendEmail/sendEmail");
const createToken = require("../utils/creatToken/createToken");

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
  let user = await UserModel.findOne({
    email: req.body.email,
  });

  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    return next(new ApiError("Incorrect email or password."));
  }

  //3) generate token
  const token = createToken(user._id);

  //4(check user active or not active)
  if (user.active === false) {
     user = await UserModel.findByIdAndUpdate(user.id, {
      active: true,
    },{
      new: true,
    });
   
  }

  //5) send response to client side
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
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

  //check if user exist
  const currentUser = await UserModel.findById(decoded.userId);
  if (!currentUser) {
    return next(
      new ApiError(
        "the user that belong to this token does no longer exist.",
        401
      )
    );
  }

  if (currentUser.active === false) {
    return next(
      new ApiError(
        "this user not active now please login in again to active your email",
        401
      )
    );
  }

  //check if user change his password after token created
  if (currentUser.passwordChangedAt) {
    const passChangeTimeStamp = parseInt(
      currentUser.passwordChangedAt.getTime() / 1000,
      10
    );
    if (passChangeTimeStamp > decoded.iat) {
      return next(
        new ApiError(
          "User recently changed his password, please login again .",
          401
        )
      );
    }
  }

  req.user = currentUser;
  next();
});

// @desc user permissions
exports.allowedTo = (...roles) =>
  asyncHandler(async (req, res, next) => {
    //access roles
    //access registered user
    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError("you are not allowed to access this route .", 403)
      );
    }
    next();
  });

//  @dec    forget Password
//  @route  Post  /api/v1/auth/forgetPassword
//  @access Public
exports.forgetPassword = asyncHandler(async (req, res, next) => {
  //1) get user by email
  const user = UserModel.findOne({ email: req.body.email });
  if (!user) {
    return next(
      new ApiError(`there is no user with that email ${req.body.email}.`, 404)
    );
  }

  //2) if user exist ,generate hash randam & digits and save it in db
  const restCode = Math.floor(100000 + Math.random() * 900000).toString();
  const hashRestCode = crypto
    .createHash("sha256")
    .update(restCode)
    .digest("hex");

  //save hash pass into db
  user.passwordRestCode = hashRestCode;
  //Add ecpiration time for pass rest code
  user.passwordRestExpire = Date.now() + 10 * 60 * 1000;
  user.passwordRestVerified = false;

  await user.save;
  //3) send the reset code via email

  await sendEmail({
    email: user.email,
    subject: "your password reset code (valid for 10 min )",
    message: "kkjkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk",
  });

  res.status(200).json({ status: 200, message: "rest code send to email" });
});
