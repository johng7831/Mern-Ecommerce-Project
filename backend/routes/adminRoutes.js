const express = require("express");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const {
  createCategory,
  getCategories,
  deleteCategory,
  updateCategory,
} = require("../controllers/categoryController");

const {
  createBrand,
  getBrands,
  updateBrand,
  deleteBrand,
} = require("../controllers/brandController");

const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getFeaturedProducts,       
  getNewArrivalProducts,   
} = require("../controllers/productController");

const router = express.Router();

// ✅ Admin dashboard
router.get("/dashboard", protect, adminOnly, (req, res) => {
  res.json({ message: "Welcome Admin Dashboard" });
});

// 🔹 Category Routes (Admin)
router.post("/category", protect, adminOnly, createCategory);
router.put("/category/:id", protect, adminOnly, updateCategory);
router.get("/categories", protect, adminOnly, getCategories);
router.delete("/category/:id", protect, adminOnly, deleteCategory);

// 🔹 Brand Routes (Admin)
router.post("/brand", protect, adminOnly, createBrand);
router.put("/brand/:id", protect, adminOnly, updateBrand);
router.get("/brands", protect, adminOnly, getBrands);
router.delete("/brand/:id", protect, adminOnly, deleteBrand);

// 🔹 Product Routes (Admin)
router.post("/product", protect, adminOnly, createProduct);
router.put("/product/:id", protect, adminOnly, updateProduct);
router.delete("/product/:id", protect, adminOnly, deleteProduct);
router.get("/products", protect, adminOnly, getProducts);
router.get("/product/:id", protect, adminOnly, getProductById);


// 🔹 Public Product Routes (Frontend)
router.get("/featured-products", getFeaturedProducts);
router.get("/new-arrivals", getNewArrivalProducts);



module.exports = router;