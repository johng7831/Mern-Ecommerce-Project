import React, { useEffect, useState } from "react";
import axios from "axios";
import API_URL from "../../api";
import "../../user.css";
import { useNavigate } from "react-router-dom";

const Toppicks = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const navigate = useNavigate();

  // =========================
  // Fetch categories (PUBLIC)
  // =========================
  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${API_URL}/categories`);

      const data = res.data.data || res.data; // safety for API response format

      const filtered = data.filter(
        (cat) => cat.name === "Men" || cat.name === "Women's"
      );

      setCategories(filtered);

      // Auto select MEN
      const men = filtered.find((c) => c.name === "Men");
      if (men) {
        setSelectedCategory(men._id);
        fetchProductsByCategory(men._id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // =========================
  // Fetch products by category (PUBLIC)
  // =========================
  const fetchProductsByCategory = async (id) => {
    try {
      const res = await axios.get(
        `${API_URL}/products-by-category?category=${id}`
      );

      setProducts(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCategoryClick = (cat) => {
    setSelectedCategory(cat._id);
    fetchProductsByCategory(cat._id);
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="toppicks">
      {/* HEADER */}
      <div className="toppicks-header">
        <h2>Top Picks</h2>

        <div className="tabs">
          {categories.map((cat) => (
            <button
              key={cat._id}
              className={`tab ${
                selectedCategory === cat._id ? "active" : ""
              }`}
              onClick={() => handleCategoryClick(cat)}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* PRODUCTS */}
      <div className="products-row">
        {products.map((product) => (
          <div
            key={product._id}
            className="product-card"
            onClick={() => handleProductClick(product._id)}
            style={{ cursor: "pointer" }}
          >
            <img src={product.images?.[0]?.url} alt={product.name} />
            <p className="price">£{product.price}</p>
            <p className="brand">{product.brand?.name}</p>
            <p className="name">{product.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Toppicks;