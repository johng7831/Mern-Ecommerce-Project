import React, { useEffect, useState, useContext } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { CartContext } from "../../context/CartContext";
import API_URL from "../../api";
import { displayBrandName, displayCategoryName } from "../../utils/productDisplay";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  // Variant selection states
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");

  const { addToCart, cartItems } = useContext(CartContext);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`${API_URL}/product/${id}`);
        const data = res.data.data;
        setProduct(data);

        // Pre-select first variant options if variants exist
        if (data?.variants && data.variants.length > 0) {
          const defaultVariant = data.variants[0];
          setSelectedSize(defaultVariant.size || "");
          setSelectedColor(defaultVariant.color || "");
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    fetchProduct();
  }, [id]);

  if (!product)
    return <h2 className="product-detail-loading">Loading...</h2>;

  const hasVariants = product.variants && product.variants.length > 0;

  // Extract unique sizes and colors
  const availableSizes = hasVariants
    ? [...new Set(product.variants.map((v) => v.size))].filter(Boolean)
    : [];

  const availableColors = hasVariants
    ? [...new Set(product.variants.map((v) => v.color))].filter(Boolean)
    : [];

  // Find the exact active variant matching both selected size and color
  const activeVariant = hasVariants
    ? product.variants.find(
        (v) => v.size === selectedSize && v.color === selectedColor
      ) || product.variants.find((v) => v.size === selectedSize || v.color === selectedColor)
    : null;

  // Calculate dynamic price and stock based on active variant (or fall back to base product)
  const currentPrice = activeVariant ? activeVariant.price : product.price;
  const currentStock = activeVariant ? activeVariant.stock : product.stock;
  const outOfStock = typeof currentStock === "number" && currentStock < 1;

  // Cart logic
  const inCart = cartItems.some((item) => item._id === product._id);

  const handleAddToCart = () => {
    const productToAdd = {
      ...product,
      price: currentPrice,
      selectedVariant: activeVariant
        ? {
            size: selectedSize,
            color: selectedColor,
            price: currentPrice,
            stock: currentStock,
          }
        : null,
    };
    addToCart(productToAdd);
  };

  const imageUrl = product.images?.[0]?.url;

  return (
    <div className="product-detail">
      {/* Image Section */}
      <div className="product-detail-image-wrapper">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product.name}
            className="product-detail-image"
          />
        ) : (
          <div className="product-detail-image product-detail-image--placeholder">
            No image
          </div>
        )}
      </div>

      {/* Details Section */}
      <div>
        <h1 className="product-detail-title">{product.name}</h1>
        <p className="product-detail-meta">
          Brand: {displayBrandName(product.brand) ?? "Not set"} · Category:{" "}
          {displayCategoryName(product.category) ?? "Not set"}
        </p>

        {/* Dynamic Price */}
        <p className="product-detail-price">₹ {currentPrice}</p>

        {product.description && (
          <p className="product-detail-description">{product.description}</p>
        )}

        {/* =========================================
            VARIANTS SELECTOR (BOX TYPE)
           ========================================= */}
        {hasVariants && (
          <div className="variant-section" style={{ margin: "20px 0" }}>
            {/* Size Options */}
            {availableSizes.length > 0 && (
              <div style={{ marginBottom: "15px" }}>
                <label style={{ fontWeight: "bold", display: "block", marginBottom: "8px" }}>
                  Select Size:
                </label>
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                  {availableSizes.map((size) => {
                    const isSelected = selectedSize === size;
                    return (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setSelectedSize(size)}
                        style={{
                          padding: "8px 16px",
                          border: isSelected ? "2px solid #000" : "1px solid #ccc",
                          backgroundColor: isSelected ? "#000" : "#fff",
                          color: isSelected ? "#fff" : "#000",
                          borderRadius: "6px",
                          cursor: "pointer",
                          fontWeight: isSelected ? "bold" : "normal",
                          transition: "all 0.2s ease",
                        }}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Color Options */}
            {availableColors.length > 0 && (
              <div style={{ marginBottom: "15px" }}>
                <label style={{ fontWeight: "bold", display: "block", marginBottom: "8px" }}>
                  Select Color:
                </label>
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                  {availableColors.map((color) => {
                    const isSelected = selectedColor === color;
                    return (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setSelectedColor(color)}
                        style={{
                          padding: "8px 16px",
                          border: isSelected ? "2px solid #000" : "1px solid #ccc",
                          backgroundColor: isSelected ? "#000" : "#fff",
                          color: isSelected ? "#fff" : "#000",
                          borderRadius: "6px",
                          cursor: "pointer",
                          fontWeight: isSelected ? "bold" : "normal",
                          transition: "all 0.2s ease",
                        }}
                      >
                        {color}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Dynamic Stock Indicator */}
        <p className="product-detail-stock" style={{ marginTop: "10px" }}>
          <strong>Stock:</strong>{" "}
          <span style={{ color: outOfStock ? "red" : "green", fontWeight: "bold" }}>
            {outOfStock ? "Out of Stock" : `${currentStock} available`}
          </span>
        </p>

        {/* Action Buttons */}
        {inCart ? (
          <div className="product-detail-cart-actions" style={{ marginTop: "20px" }}>
            <span className="product-detail-in-cart">In your cart</span>
            <Link to="/cart" className="btn-primary-rounded">
              View cart
            </Link>
          </div>
        ) : (
          <button
            className="btn-primary-rounded"
            disabled={outOfStock}
            onClick={handleAddToCart}
            style={{ marginTop: "20px" }}
          >
            {outOfStock ? "Out of stock" : "Add to cart"}
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;