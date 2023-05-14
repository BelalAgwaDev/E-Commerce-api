const mongoose = require("mongoose");

const BrandSchema = mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      require: [true, "Brand name required"],
      unique: [true, "Brand name must be unique"],
      minlength: [3, "too short Brand name"],
      maxlength: [32, "too long Brand name"],
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
    const imageUrl=`${process.env.BATH_URL}/brands/${doc.image}`
    doc.image=imageUrl
  }
}

BrandSchema.post('init', (doc)=>{
  setImageUrl(doc)
});

BrandSchema.post('save', (doc)=>{
  setImageUrl(doc)
});

const BrandModel = mongoose.model("Brand", BrandSchema);

module.exports = BrandModel;
