// models/Collection.js

const mongoose = require("mongoose");

const collectionSchema = new mongoose.Schema(
  {
    collectionTitle: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
    },

    // Collection Images
    images: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Image",
      },
    ],

    // Products inside collection
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Collection", collectionSchema);