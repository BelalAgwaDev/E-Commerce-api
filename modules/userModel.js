const mongoose = require("mongoose");

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
    role:{
        type:String,
        enum:["user","admin"],
        default:"user"
    }
  },
  { timestamps: true }
);

const UserModel = mongoose.model("User", UserSchema);

module.exports = UserModel;
