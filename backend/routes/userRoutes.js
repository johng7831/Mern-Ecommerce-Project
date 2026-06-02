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
} = require("../controllers/productController");
const { 
  getCategories 
} = require("../controllers/categoryController");
const {
  getAllCollections,
  getCollectionById,
} = require("../controllers/collectionController");
const {
  getBrands,
  getBrandById,
} = require("../controllers/brandController");


// Auth
router.post("/register", registerUser);
router.post("/login", loginUser);

// Public Products
router.get("/products", getShopProducts);
router.get("/product/:id", getProductById);

// Public Categories
router.get("/categories", getCategories);

// Public Products by Category
router.get("/products-by-category", getCategoryProducts);

// Public All Collection Get
router.get("/collections", getAllCollections);
router.get("/collection/:id", getCollectionById);
router.get("/products-by-brand", getBrandProducts);


// Public All Brands Get
router.get("/brands", getBrands);
router.get("/brand/:id", getBrandById);



module.exports = router;