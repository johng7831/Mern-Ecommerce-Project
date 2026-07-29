const mongoose = require("mongoose");

const variantSchema = new mongoose.Schema({
  size: {
    type: String,
    required: true,
  },

  color: {
    type: String,
    required: true,
  },

  price: {
    type: Number,
    required: true,
  },

  stock: {
    type: Number,
    default: 0,
  },

  images: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Image",
    },
  ],
});

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
    },

    price: {
      type: Number,
      required: true,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },

    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
    },

    images: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Image",
      },
    ],

    variants: [variantSchema],

    stock: {
      type: Number,
      default: 0,
    },

    productType: {
      type: String,
      enum: ["featured", "new"],
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// (Optional) Add Text Index for faster full-text searches as your catalog grows
productSchema.index({ name: "text", description: "text" });

module.exports = mongoose.model("Product", productSchema);