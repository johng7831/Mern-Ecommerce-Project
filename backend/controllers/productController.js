const Product = require("../models/Product");
const mongoose = require("mongoose");
// ===============================
// CREATE PRODUCT
// ===============================
exports.createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      brand,
      stock,
      images,
      productType,
      isFeatured,
      isActive,
    } = req.body;

    const product = await Product.create({
      name,
      description,
      price,
      category,
      brand,
      stock,
      images,
      productType,
      isFeatured,
      isActive,
    });

    const populatedProduct = await product.populate([
      { path: "category", select: "name" },
      { path: "brand", select: "name" },
      { path: "images", select: "url" },
    ]);

    res.status(201).json({
      success: true,
      data: populatedProduct,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// GET ALL PRODUCTS
// ===============================
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate("category", "name")
      .populate("brand", "name")
      .populate("images", "url")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// GET SINGLE PRODUCT
// ===============================
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("category", "name")
      .populate("brand", "name")
      .populate("images", "url");

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      data: product,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// UPDATE PRODUCT
// ===============================
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )
      .populate("category", "name")
      .populate("brand", "name")
      .populate("images", "url");

    res.status(200).json({
      success: true,
      data: product,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// DELETE PRODUCT
// ===============================
exports.deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// GET FEATURED PRODUCTS (PUBLIC)
// ===============================
exports.getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.find({
      $or: [{ productType: "featured" }, { isFeatured: true }],
      isActive: { $ne: false },
    })
      .populate("category", "name")
      .populate("brand", "name")
      .populate("images", "url")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// GET NEW ARRIVAL PRODUCTS (PUBLIC)
// ===============================
exports.getNewArrivalProducts = async (req, res) => {
  try {
    const products = await Product.find({
      productType: "new",
      isActive: true,
    })
      .populate("category", "name")
      .populate("brand", "name")
      .populate("images", "url")
      .sort({ createdAt: -1 })
      .limit(8);

    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// GET SHOP CATALOG (PUBLIC)
// ===============================
exports.getShopProducts = async (req, res) => {
  try {
    const products = await Product.find({ isActive: { $ne: false } })
      .populate("category", "name")
      .populate("brand", "name")
      .populate("images", "url")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ===============================
// GET PRODUCTS BY CATEGORY
// ===============================
exports.getCategoryProducts = async (req, res) => {
  try {
    const { category } = req.query;

    if (!category) {
      return res.status(400).json({
        success: false,
        message: "Category ID is required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(category)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category ID",
      });
    }

    const products = await Product.find({
      category,
      isActive: { $ne: false },
    })
      .populate("category", "name")
      .populate("brand", "name")
      .populate("images", "url")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

