const Collection = require("../models/Collection");
const Image = require("../models/Image");

// ======================================
// CREATE COLLECTION
// ======================================
exports.createCollection = async (req, res) => {
  try {
    const { collectionTitle, description, images, isActive } = req.body;

    let imageIds = [];

    // Existing image IDs
    if (images) {
      imageIds = Array.isArray(images) ? images : [images];
    }

    // New uploaded files
    if (req.files && req.files.length > 0) {
      for (let file of req.files) {
        const img = await Image.create({
          filename: file.filename,
          path: file.path.replace(/\\/g, "/"),
          url: `${req.protocol}://${req.get("host")}/uploads/${file.filename}`,
        });

        imageIds.push(img._id);
      }
    }

    // Create collection
    let collection = await Collection.create({
      collectionTitle,
      description,
      images: imageIds,
      isActive,
    });

    // Populate images
    collection = await Collection.findById(collection._id).populate("images");

    // Convert images → URLs (IMPORTANT FIX)
    const response = {
      ...collection.toObject(),
      images: collection.images.map((img) => img.url),
    };

    res.status(201).json({
      success: true,
      data: response,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// GET ALL COLLECTIONS
// ======================================
exports.getAllCollections = async (req, res) => {
  try {
    const collections = await Collection.find()
      .populate("images")
      .sort({ createdAt: -1 });

    // FIX: convert images → URLs
    const response = collections.map((col) => ({
      ...col.toObject(),
      images: col.images.map((img) => img.url),
    }));

    res.status(200).json({
      success: true,
      data: response,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// GET SINGLE COLLECTION
// ======================================
exports.getCollectionById = async (req, res) => {
  try {
    let collection = await Collection.findById(req.params.id).populate("images");

    if (!collection) {
      return res.status(404).json({
        success: false,
        message: "Collection not found",
      });
    }

    const response = {
      ...collection.toObject(),
      images: collection.images.map((img) => img.url),
    };

    res.status(200).json({
      success: true,
      data: response,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// UPDATE COLLECTION
// ======================================
exports.updateCollection = async (req, res) => {
  try {
    const { collectionTitle, description, images, isActive } = req.body;

    let imageIds = [];

    if (images) {
      imageIds = Array.isArray(images) ? images : [images];
    }

    if (req.files && req.files.length > 0) {
      for (let file of req.files) {
        const img = await Image.create({
          filename: file.filename,
          path: file.path.replace(/\\/g, "/"),
          url: `${req.protocol}://${req.get("host")}/uploads/${file.filename}`,
        });

        imageIds.push(img._id);
      }
    }

    let collection = await Collection.findByIdAndUpdate(
      req.params.id,
      {
        collectionTitle,
        description,
        images: imageIds,
        isActive,
      },
      { new: true }
    ).populate("images");

    if (!collection) {
      return res.status(404).json({
        success: false,
        message: "Collection not found",
      });
    }

    const response = {
      ...collection.toObject(),
      images: collection.images.map((img) => img.url),
    };

    res.status(200).json({
      success: true,
      data: response,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// DELETE COLLECTION
// ======================================
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