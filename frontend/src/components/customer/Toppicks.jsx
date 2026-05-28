import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import API_URL from "../../api";
import "../../user.css";

const Toppicks = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${API_URL}/admin/categories`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const filtered = res.data.filter(
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

  // Fetch products
  const fetchProductsByCategory = async (id) => {
    try {
      const res = await axios.get(
        `${API_URL}/admin/products-by-category?category=${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setProducts(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Handle category click
  const handleCategoryClick = (cat) => {
    setSelectedCategory(cat._id);
    fetchProductsByCategory(cat._id);
  };

  // Navigate to product details
  const handleProductClick = (id) => {
    navigate(`/product/${id}`);
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
            <img
              src={product.images?.[0]?.url}
              alt={product.name}
            />

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