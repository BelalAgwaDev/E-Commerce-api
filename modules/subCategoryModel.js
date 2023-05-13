const mongoose = require("mongoose");

const SubCategorySchema = mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      require: [true, "Category name required"],
      unique: [true, "Category name must be unique"],
      minlength: [2, "too short Category name"],
      maxlength: [32, "too long Category name"],
    },

    slug: {
      type: String,
      lowercase: true,
    },

    category: {
      type: mongoose.Schema.ObjectId,
      ref: 'Category',
      required: [true, 'SubCategory must be belong to parent category'],
    },
  },
  { timestamps: true }
);

const SubCategoryModel = mongoose.model("SubCategory", SubCategorySchema);

module.exports = SubCategoryModel;
