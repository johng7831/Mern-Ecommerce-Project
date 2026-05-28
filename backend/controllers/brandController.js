const Brand = require("../models/Brand");

// ===============================
// CREATE BRAND
// ===============================
exports.createBrand = async (req, res) => {
  try {
    const {
      name,
      description,
      images,
      isActive,
    } = req.body;

    // Check existing brand
    const exists = await Brand.findOne({ name });

    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Brand already exists",
      });
    }

    const brand = await Brand.create({
      name,
      description,
      images,
      isActive,
    });

    const populatedBrand = await brand.populate([
      { path: "images", select: "url" },
    ]);

    res.status(201).json({
      success: true,
      data: populatedBrand,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// GET ALL BRANDS
// ===============================
exports.getBrands = async (req, res) => {
  try {
    const brands = await Brand.find()
      .populate("images", "url")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: brands.length,
      data: brands,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// GET SINGLE BRAND
// ===============================
exports.getBrandById = async (req, res) => {
  try {
    const brand = await Brand.findById(req.params.id)
      .populate("images", "url");

    if (!brand) {
      return res.status(404).json({
        success: false,
        message: "Brand not found",
      });
    }

    res.status(200).json({
      success: true,
      data: brand,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// UPDATE BRAND
// ===============================
exports.updateBrand = async (req, res) => {
  try {
    const brand = await Brand.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate("images", "url");

    if (!brand) {
      return res.status(404).json({
        success: false,
        message: "Brand not found",
      });
    }

    res.status(200).json({
      success: true,
      data: brand,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// DELETE BRAND
// ===============================
exports.deleteBrand = async (req, res) => {
  try {
    const brand = await Brand.findByIdAndDelete(req.params.id);

    if (!brand) {
      return res.status(404).json({
        success: false,
        message: "Brand not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Brand deleted successfully",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};