const express = require("express");

const {
  signUp,
  login
} = require("../services/authServices");
const {
  SignUpValidator,
  LoginValidator
} = require("../utils/validators/authValidator");

const router = express.Router();

router
  .route("/signUp")
  .post(SignUpValidator,signUp)
 

  router
  .route("/login")
  .post(LoginValidator,login)





module.exports = router;
