const Product = require("../models/Product");
const Category = require("../models/Category");
const Brand = require("../models/Brand");
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
      variants,
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
      variants,
      productType,
      isFeatured,
      isActive,
    });

    const populatedProduct = await product.populate([
      { path: "category", select: "name" },
      { path: "brand", select: "name" },
      { path: "images", select: "url" },
      { path: "variants.images", select: "url" },
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
      .populate("variants.images", "url")
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
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Product ID format",
      });
    }

    const product = await Product.findById(req.params.id)
      .populate("category", "name")
      .populate("brand", "name")
      .populate("images", "url")
      .populate("variants.images", "url");

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
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    })
      .populate("category", "name")
      .populate("brand", "name")
      .populate("images", "url")
      .populate("variants.images", "url");

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
// GET FEATURED PRODUCTS
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
      .populate("variants.images", "url")
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
// GET NEW ARRIVAL PRODUCTS
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
      .populate("variants.images", "url")
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
// GET SHOP PRODUCTS
// ===============================
exports.getShopProducts = async (req, res) => {
  const searchTerm = req.query.search || req.query.q || req.query.query;
  if (searchTerm && String(searchTerm).trim()) {
    req.query.query = String(searchTerm).trim();
    return exports.searchProducts(req, res);
  }

  try {
    const products = await Product.find({
      isActive: { $ne: false },
    })
      .populate("category", "name")
      .populate("brand", "name")
      .populate("images", "url")
      .populate("variants.images", "url")
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
      .populate("variants.images", "url")
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
// GET PRODUCTS BY BRAND
// ===============================
exports.getBrandProducts = async (req, res) => {
  try {
    const { brand } = req.query;
    if (!brand) {
      return res.status(400).json({
        success: false,
        message: "Brand ID is required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(brand)) {
      return res.status(400).json({
        success: false,
        message: "Invalid brand ID",
      });
    }

    const products = await Product.find({
      brand,
      isActive: { $ne: false },
    })
      .populate("category", "name")
      .populate("brand", "name")
      .populate("images", "url")
      .populate("variants.images", "url")
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
// SEARCH PRODUCTS API
// ===============================
exports.searchProducts = async (req, res) => {
  try {
    const query = req.query.query || req.query.search || req.query.q;

    if (!query || query.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Search query is required",
      });
    }

    // Safe escape for special regex characters to avoid application crashing
    const safeQuery = query.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const searchRegex = new RegExp(safeQuery, "i");

    // Parallel fetch for matching category & brand ObjectIds
    const [categories, brands] = await Promise.all([
      Category.find({ name: searchRegex }).select("_id"),
      Brand.find({ name: searchRegex }).select("_id"),
    ]);

    const categoryIds = categories.map((c) => c._id);
    const brandIds = brands.map((b) => b._id);

    // Search products matching name, description, category, or brand
    const products = await Product.find({
      isActive: { $ne: false },
      $or: [
        { name: searchRegex },
        { description: searchRegex },
        { category: { $in: categoryIds } },
        { brand: { $in: brandIds } },
      ],
    })
      .populate("category", "name")
      .populate("brand", "name")
      .populate("images", "url")
      .populate("variants.images", "url")
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