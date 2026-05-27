const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { 
      type: String, 
      required: true,
      trim: true 
    },

    description: { 
      type: String 
    },

    price: { 
      type: Number, 
      required: true 
    },

    category: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Category" 
    },

    brand: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Brand" 
    },

    images: [
      { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Image" 
      }
    ], 

    stock: { 
      type: Number, 
      default: 0 
    },

    // Product type: featured / new 
    productType: {
      type: String,
      enum: ["featured", "new",],
    },

    isFeatured: { 
      type: Boolean, 
      default: false 
    },

    isActive: { 
      type: Boolean, 
      default: true 
    },
  },
  { 
    timestamps: true 
  }
);

module.exports = mongoose.model("Product", productSchema);