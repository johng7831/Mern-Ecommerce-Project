const express = require("express");
const router = express.Router();

const { protect, adminOnly } = require("../middleware/authMiddleware");

const {
  createCollection,
  getAllCollections,
  getCollectionById,
  updateCollection,
  deleteCollection,
} = require("../controllers/collectionController");

// ========================
// Category Controllers
// ========================
const {
  createCategory,
  getCategories,
  deleteCategory,
  updateCategory,
} = require("../controllers/categoryController");

// ========================
// Brand Controllers
// ========================
const {
  createBrand,
  getBrands,
  updateBrand,
  deleteBrand,
} = require("../controllers/brandController");

// ========================
// Product Controllers
// ========================
const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getFeaturedProducts,
  getNewArrivalProducts,
  getCategoryProducts,
} = require("../controllers/productController");

// ========================
// Order Controllers
// ========================
const {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
  getMyOrders,
} = require("../controllers/orderController");

// ========================
// ✅ Admin Dashboard
// ========================
router.get("/dashboard", protect, adminOnly, (req, res) => {
  res.json({
    success: true,
    message: "Welcome Admin Dashboard",
  });
});


// ========================
// ✅ Collection Routes (Admin)
// ========================
router.post("/collection", protect, adminOnly, createCollection);
router.get("/collections", protect, adminOnly, getAllCollections);
router.get("/collection/:id", protect, adminOnly, getCollectionById);
router.put("/collection/:id", protect, adminOnly, updateCollection);
router.delete("/collection/:id", protect, adminOnly, deleteCollection);

// ========================
// ✅ Category Routes (Admin)
// ========================
router.post("/category", protect, adminOnly, createCategory);
router.get("/categories", protect, adminOnly, getCategories);
router.put("/category/:id", protect, adminOnly, updateCategory);
router.delete("/category/:id", protect, adminOnly, deleteCategory);

// ========================
// ✅ Brand Routes (Admin)
// ========================
router.post("/brand", protect, adminOnly, createBrand);
router.get("/brands", protect, adminOnly, getBrands);
router.put("/brand/:id", protect, adminOnly, updateBrand);
router.delete("/brand/:id", protect, adminOnly, deleteBrand);

// ========================
// ✅ Product Routes (Admin)
// ========================
router.post("/product", protect, adminOnly, createProduct);
router.get("/products", protect, adminOnly, getProducts);
router.get("/product/:id", protect, adminOnly, getProductById);
router.put("/product/:id", protect, adminOnly, updateProduct);
router.delete("/product/:id", protect, adminOnly, deleteProduct);
router.get("/products-by-category",protect, adminOnly, getCategoryProducts);

// ========================
// ✅ Order Routes
// ========================
router.post("/order",  protect,createOrder);                          
router.get("/myorders", protect, getMyOrders);                       
router.get("/getorders", protect, adminOnly, getAllOrders);
router.get("/order/:id", protect, getOrderById);
router.put("/order/:id", protect, adminOnly, updateOrderStatus);
router.delete("/order/:id", protect, adminOnly, deleteOrder);         

// ========================
// ✅ Public Product Routes
// ========================
router.get("/featured-products", getFeaturedProducts);
router.get("/new-arrivals", getNewArrivalProducts);

module.exports = router;