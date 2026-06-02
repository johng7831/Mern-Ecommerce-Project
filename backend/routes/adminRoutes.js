const express = require("express");
const router = express.Router();

const { protect, adminOnly } = require("../middleware/authMiddleware");

const {
  createCollection,
  updateCollection,
  deleteCollection,
} = require("../controllers/collectionController");

// ========================
// Category Controllers
// ========================
const {
  createCategory,
  deleteCategory,
  updateCategory,
} = require("../controllers/categoryController");

// ========================
// Brand Controllers
// ========================
const {
  createBrand,
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
router.post("/collection", protect, adminOnly, createCollection)
router.put("/collection/:id", protect, adminOnly, updateCollection);
router.delete("/collection/:id", protect, adminOnly, deleteCollection);

// ========================
// ✅ Category Routes (Admin)
// ========================
router.post("/category", protect, adminOnly, createCategory);
router.put("/category/:id", protect, adminOnly, updateCategory);
router.delete("/category/:id", protect, adminOnly, deleteCategory);

// ========================
// ✅ Brand Routes (Admin)
// ========================
router.post("/brand", protect, adminOnly, createBrand);
router.put("/brand/:id", protect, adminOnly, updateBrand);
router.delete("/brand/:id", protect, adminOnly, deleteBrand);

// ========================
// ✅ Product Routes (Admin)
// ========================
router.post("/product", protect, adminOnly, createProduct);
router.get("/product/:id", protect, adminOnly, getProductById);
router.put("/product/:id", protect, adminOnly, updateProduct);
router.delete("/product/:id", protect, adminOnly, deleteProduct);

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