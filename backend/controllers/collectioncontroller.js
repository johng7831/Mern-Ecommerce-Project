const mongoose = require("mongoose");

const Collection = require("../models/Collection");
const Product = require("../models/Product");
const Image = require("../models/Image");


// ======================================
// CREATE COLLECTION
// ======================================
exports.createCollection = async (req, res) => {
  try {
    const {
      collectionTitle,
      description,
      images,
      products,
      isActive,
    } = req.body;

    // =========================
    // VALIDATE PRODUCTS
    // =========================
    if (!products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please select at least one product",
      });
    }

    for (const productId of products) {
      if (!mongoose.Types.ObjectId.isValid(productId)) {
        return res.status(400).json({
          success: false,
          message: `Invalid product ID: ${productId}`,
        });
      }

      const productExists = await Product.findById(productId);

      if (!productExists) {
        return res.status(404).json({
          success: false,
          message: `Product not found: ${productId}`,
        });
      }
    }

    // =========================
    // HANDLE IMAGES
    // =========================
    let imageIds = [];

    // Existing Image IDs
    if (images && Array.isArray(images)) {
      for (const img of images) {
        if (mongoose.Types.ObjectId.isValid(img)) {
          imageIds.push(img);
        }
      }
    }

    // Uploaded Files
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const img = await Image.create({
          filename: file.filename,
          path: file.path.replace(/\\/g, "/"),
          url: `${req.protocol}://${req.get("host")}/uploads/${file.filename}`,
        });

        imageIds.push(img._id);
      }
    }

    // =========================
    // CREATE COLLECTION
    // =========================
    let collection = await Collection.create({
      collectionTitle,
      description,
      images: imageIds,
      products,
      isActive,
    });

    // =========================
    // POPULATE
    // =========================
    collection = await Collection.findById(collection._id)
      .populate("images")
      .populate({
        path: "products",
        populate: [
          {
            path: "category",
            select: "name",
          },
          {
            path: "brand",
            select: "name",
          },
          {
            path: "images",
            select: "url",
          },
        ],
      });

    // =========================
    // RESPONSE
    // =========================
    const response = {
      ...collection.toObject(),

      imageObjects: collection.images,

      images: collection.images.map((img) => img.url),
    };

    res.status(201).json({
      success: true,
      data: response,
    });

  } catch (error) {
    console.log(error);

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
      .populate({
        path: "products",
        populate: [
          {
            path: "category",
            select: "name",
          },
          {
            path: "brand",
            select: "name",
          },
          {
            path: "images",
            select: "url",
          },
        ],
      })
      .sort({ createdAt: -1 });

    const response = collections.map((col) => ({
      ...col.toObject(),

      imageObjects: col.images,

      images: col.images.map((img) => img.url),
    }));

    res.status(200).json({
      success: true,
      count: collections.length,
      data: response,
    });

  } catch (error) {
    console.log(error);

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
    const collection = await Collection.findById(req.params.id)
      .populate("images")
      .populate({
        path: "products",
        populate: [
          {
            path: "category",
            select: "name",
          },
          {
            path: "brand",
            select: "name",
          },
          {
            path: "images",
            select: "url",
          },
        ],
      });

    if (!collection) {
      return res.status(404).json({
        success: false,
        message: "Collection not found",
      });
    }

    const response = {
      ...collection.toObject(),

      imageObjects: collection.images,

      images: collection.images.map((img) => img.url),
    };

    res.status(200).json({
      success: true,
      data: response,
    });

  } catch (error) {
    console.log(error);

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
    const {
      collectionTitle,
      description,
      images,
      products,
      isActive,
    } = req.body;

    // =========================
    // VALIDATE PRODUCTS
    // =========================
    if (products && Array.isArray(products)) {
      for (const productId of products) {

        if (!mongoose.Types.ObjectId.isValid(productId)) {
          return res.status(400).json({
            success: false,
            message: `Invalid product ID: ${productId}`,
          });
        }

        const productExists = await Product.findById(productId);

        if (!productExists) {
          return res.status(404).json({
            success: false,
            message: `Product not found: ${productId}`,
          });
        }
      }
    }

    // =========================
    // HANDLE IMAGES
    // =========================
    let imageIds = [];

    if (images && Array.isArray(images)) {

      for (const img of images) {

        // Existing ObjectId
        if (mongoose.Types.ObjectId.isValid(img)) {
          imageIds.push(img);
        }

        // Existing URL
        else if (typeof img === "string") {

          const imageDoc = await Image.findOne({ url: img });

          if (imageDoc) {
            imageIds.push(imageDoc._id);
          }
        }
      }
    }

    // Uploaded New Files
    if (req.files && req.files.length > 0) {

      for (const file of req.files) {

        const img = await Image.create({
          filename: file.filename,
          path: file.path.replace(/\\/g, "/"),
          url: `${req.protocol}://${req.get("host")}/uploads/${file.filename}`,
        });

        imageIds.push(img._id);
      }
    }

    // =========================
    // UPDATE COLLECTION
    // =========================
    let collection = await Collection.findByIdAndUpdate(
      req.params.id,
      {
        collectionTitle,
        description,
        images: imageIds,
        products,
        isActive,
      },
      {
        new: true,
      }
    )
      .populate("images")
      .populate({
        path: "products",
        populate: [
          {
            path: "category",
            select: "name",
          },
          {
            path: "brand",
            select: "name",
          },
          {
            path: "images",
            select: "url",
          },
        ],
      });

    if (!collection) {
      return res.status(404).json({
        success: false,
        message: "Collection not found",
      });
    }

    // =========================
    // RESPONSE
    // =========================
    const response = {
      ...collection.toObject(),

      imageObjects: collection.images,

      images: collection.images.map((img) => img.url),
    };

    res.status(200).json({
      success: true,
      data: response,
    });

  } catch (error) {
    console.log(error);

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
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};