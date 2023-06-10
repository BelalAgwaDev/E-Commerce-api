const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');

const UserSchema = mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "name required"],
    },
    slug: {
      type: String,
      lowerCase: true,
    },
    email: {
      type: String,
      required: [true, "email required"],
      unique: true,
      lowerCase: true,
    },
    phone: String,
    profileImage: String,
    password:{
        type:String,
        required:[true,"password required"],
        minLength:[6,"Too short password"]
    },
    passwordChangedAt:Date,
    role:{
        type:String,
        enum:["user","admin"],
        default:"user"
    },
    active:{
        type:Boolean,
        default:true
    }
  },
  { timestamps: true }
);


UserSchema.pre("save",async function(next){
  if(!this.isModified("password")) return next()
  //hashing user password
  this.password=await bcrypt.hash(this.password,12)
  next()
})

const UserModel = mongoose.model("User", UserSchema);

module.exports = UserModel;
