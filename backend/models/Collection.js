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

    images: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Image",
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