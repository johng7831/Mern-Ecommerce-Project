const Brand = require("../models/Brand");

// ✅ Create Brand (Admin)
exports.createBrand = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) return res.status(400).json({ message: "Brand name is required" });

    const exists = await Brand.findOne({ name });
    if (exists) return res.status(400).json({ message: "Brand already exists" });

    const brand = await Brand.create({ name, description });

    res.status(201).json({
      message: "Brand created successfully",
      brand,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get All Brands (Admin)
exports.getBrands = async (req, res) => {
  try {
    const brands = await Brand.find().sort({ createdAt: -1 });
    res.json(brands);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Update Brand (Admin)
exports.updateBrand = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, isActive } = req.body;

    const brand = await Brand.findById(id);
    if (!brand) return res.status(404).json({ message: "Brand not found" });

    if (name && name !== brand.name) {
      const exists = await Brand.findOne({ name });
      if (exists) return res.status(400).json({ message: "Brand name already exists" });
      brand.name = name;
    }

    if (description !== undefined) brand.description = description;
    if (isActive !== undefined) brand.isActive = isActive;

    await brand.save();

    res.json({ message: "Brand updated successfully", brand });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Delete Brand (Admin)
exports.deleteBrand = async (req, res) => {
  try {
    const brand = await Brand.findById(req.params.id);
    if (!brand) return res.status(404).json({ message: "Brand not found" });

    await brand.deleteOne();
    res.json({ message: "Brand deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};