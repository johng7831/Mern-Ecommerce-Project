const express = require("express");
const router = express.Router();
const { registerUser, loginUser } = require("../controllers/userController");
const { getProductById, getShopProducts } = require("../controllers/productController");

router.post("/register", registerUser);
router.post("/login", loginUser);

// Public shop catalog and product details for frontend
router.get("/products", getShopProducts);
router.get("/product/:id", getProductById);

module.exports = router;