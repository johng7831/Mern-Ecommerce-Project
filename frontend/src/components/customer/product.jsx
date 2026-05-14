import React, { useEffect, useState, useContext } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { CartContext } from "../../context/CartContext";
import API_URL from "../../api";
import { displayBrandName, displayCategoryName } from "../../utils/productDisplay";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const { addToCart, cartItems } = useContext(CartContext);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`${API_URL}/product/${id}`);
        setProduct(res.data.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProduct();
  }, [id]);

  if (!product)
    return <h2 className="product-detail-loading">Loading...</h2>;

  const inCart = cartItems.some((item) => item._id === product._id);
  const outOfStock = typeof product.stock === "number" && product.stock < 1;
  const imageUrl = product.images?.[0]?.url;

  return (
    <div className="product-detail">
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

      <div>
        <h1 className="product-detail-title">{product.name}</h1>
        <p className="product-detail-meta">
          Brand: {displayBrandName(product.brand) ?? "Not set"} · Category:{" "}
          {displayCategoryName(product.category) ?? "Not set"}
        </p>

        <p className="product-detail-price">₹ {product.price}</p>

        {product.description && (
          <p className="product-detail-description">{product.description}</p>
        )}

        <p className="product-detail-stock">
          <strong>Stock:</strong> {product.stock}
        </p>

        {inCart ? (
          <div className="product-detail-cart-actions">
            <span className="product-detail-in-cart">In your cart</span>
            <Link to="/cart" className="btn-primary-rounded">
              View cart
            </Link>
          </div>
        ) : (
          <button
            className="btn-primary-rounded"
            disabled={outOfStock}
            onClick={() => addToCart(product)}
          >
            {outOfStock ? "Out of stock" : "Add to cart"}
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
