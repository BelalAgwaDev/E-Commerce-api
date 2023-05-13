const mongoose = require("mongoose");

const ProductSchema = mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      minlength: [3, "too short product title"],
      maxlength: [200, "too long product title"],
    },

    slug: {
      type: String,
      lowercase: true,
      required: true,
    },

    description: {
      type: String,
      required: true,
      minlength: [20, "too short product description"],
    },

    quantity: {
      type: Number,
      required: [true, "product quantity is required"],
    },
    sold: {
      type: Number,
      default: 0,
    },

    price: {
      type: Number,
      required: [true, "product price is required"],
      trim: true,
      max: [200000, "too long product price"],
    },

    priceAfterDiscount: {
      type: Number,
    },
    colors: [String],
    imageCover: {
      type: String,
      required: [true, "product image cover is required"],
    },
    images: [String],

    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      required: [true, "product must be belong to category"],
    },

    subCategory: {
      type: [mongoose.Schema.ObjectId],
      ref: "SubCategory",
    },

    brand: {
      type: mongoose.Schema.ObjectId,
      ref: "Brand",
    },
    ratingsAverage: {
      type: Number,
      min: [1, "rating must be above or equal 1.0"],
      max: [5, "rating must be below or equal 5.0"],
    },

    ratingsQuantity: {
      type: Number,
      default: 0,
    },
  },

  { timestamps: true }
);

const productModel = mongoose.model("Product", ProductSchema);

module.exports = productModel;
