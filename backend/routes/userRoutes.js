const express = require("express");
const router = express.Router();

const { 
  registerUser, 
  loginUser 
} = require("../controllers/userController");

const {
  getProductById,
  getShopProducts,
  getCategoryProducts,
  getBrandProducts,
  searchProducts,
} = require("../controllers/productController");

const { getCategories } = require("../controllers/categoryController");
const { 
  getAllCollections, 
  getCollectionById 
} = require("../controllers/collectionController");
const { getBrands, getBrandById } = require("../controllers/brandController");

// Auth Routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Search routes (multiple paths for compatibility)
router.get("/search-products", searchProducts);
router.get("/products/search", searchProducts);

// Public Product Routes
router.get("/products", getShopProducts);
router.get("/product/:id", getProductById);
router.get("/products-by-category", getCategoryProducts);
router.get("/products-by-brand", getBrandProducts);

// Public Category Routes
router.get("/categories", getCategories);

// Public Collection Routes
router.get("/collections", getAllCollections);
router.get("/collection/:id", getCollectionById);

// Public Brand Routes
router.get("/brands", getBrands);
router.get("/brand/:id", getBrandById);

module.exports = router;