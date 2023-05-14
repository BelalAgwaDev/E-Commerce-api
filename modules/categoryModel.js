const mongoose = require("mongoose");

const CategorySchema = mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      require: [true, "Category name required"],
      unique: [true, "Category name must be unique"],
      minlength: [3, "too short Category name"],
      maxlength: [32, "too long Category name"],
    },

    slug: {
      type: String,
      lowercase: true,
    },

    image: {
      type: String,
    },
  },
  { timestamps: true }
);

const setImageUrl=(doc)=>{
  if(doc.image){
    const imageUrl=`${process.env.BATH_URL}/categories/${doc.image}`
    doc.image=imageUrl
  }
}

CategorySchema.post('init', (doc)=>{
  setImageUrl(doc)
});

CategorySchema.post('save', (doc)=>{
  setImageUrl(doc)
});

const CategoryModel = mongoose.model("Category", CategorySchema);

module.exports = CategoryModel;
