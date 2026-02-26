const express = require("express");
const router = express.Router();
const { registerUser, loginUser } = require("../controllers/userController");
const { getProductById } = require("../controllers/productController");

router.post("/register", registerUser);
router.post("/login", loginUser);

// Public product details for frontend
router.get("/product/:id", getProductById);

module.exports = router;
