const mongoose = require("mongoose");

const AddressSchema = mongoose.Schema(
  {
    latitude: {
      type: Number,

      required: [true, "Address latitude required"],
    },
    longitude: {
      type: Number,

      required: [true, "Address longitude required"],
    },

    alias: {
      type: String,
      enum: ["Apartment", "House", "Office"],
      default: "Apartment",
    },

    BuildingName: {
      type: String,
      trim: true,
      required: [true, "Address Building Name required"],
      minlength: [3, "too short Address Building Name"],
      maxlength: [50, "too long Address Building Name"],
    },

    aptNo: String,
    floor: String,
    region: {
      type: String,
      trim: true,
      required: [true, "Address region required"],
      minlength: [3, "too short Address region"],
      maxlength: [50, "too long Address region"],
    },
    additionalDirections: String,
    phone: {
      type: String,
      required: [true, "phone required"],
    },
    addressLabel: String,

    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const AddressModel = mongoose.model("Address", AddressSchema);

module.exports = AddressModel;
