const Collection = require("../models/Collection");
const Image = require("../models/Image");

// CREATE Collection with images
exports.createCollection = async (req, res) => {
  try {
    const { title, description } = req.body;

    // Save images
    const imageDocs = [];

    if (req.files) {
      for (let file of req.files) {
        const img = await Image.create({
          url: file.path,
        });
        imageDocs.push(img._id);
      }
    }

    const collection = await Collection.create({
      title,
      description,
      images: imageDocs,
    });

    res.status(201).json(collection);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET ALL Collections (with images)
exports.getAllCollections = async (req, res) => {
  try {
    const collections = await Collection.find().populate("images");

    res.status(200).json({
      success: true,
      data: collections,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET SINGLE Collection
exports.getCollectionById = async (req, res) => {
  try {
    const collection = await Collection.findById(req.params.id).populate("images");

    if (!collection) {
      return res.status(404).json({
        success: false,
        message: "Collection not found",
      });
    }

    res.status(200).json({
      success: true,
      data: collection,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// UPDATE (optional: add new images too)
exports.updateCollection = async (req, res) => {
  try {
    let imageIds = [];

    if (req.files && req.files.length > 0) {
      for (let file of req.files) {
        const newImage = await Image.create({
          url: `/uploads/${file.filename}`,
          filename: file.filename,
        });

        imageIds.push(newImage._id);
      }
    }

    const updateData = {
      ...req.body,
    };

    // if new images uploaded, push them
    if (imageIds.length > 0) {
      updateData.$push = { images: { $each: imageIds } };
    }

    const collection = await Collection.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).populate("images");

    if (!collection) {
      return res.status(404).json({
        success: false,
        message: "Collection not found",
      });
    }

    res.status(200).json({
      success: true,
      data: collection,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// DELETE Collection
exports.deleteCollection = async (req, res) => {
  try {
    const collection = await Collection.findByIdAndDelete(req.params.id);

    if (!collection) {
      return res.status(404).json({
        success: false,
        message: "Collection not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Collection deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};