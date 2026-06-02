import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API_URL from "../../api";
import "../../user.css";

const BrandProducts = () => {
  const { brandId } = useParams();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBrandProducts = async () => {
    try {
      const res = await fetch(
        `${API_URL}/products-by-brand?brand=${brandId}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await res.json();

      if (data.success) {
        setProducts(data.data);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrandProducts();
  }, [brandId]);

  return (
    <div className="brand-products-page">
      <div className="brand-products-header">
        <h2>Brand Products</h2>
        <p>{products.length} Products Found</p>
      </div>

      {loading ? (
        <div className="loading-wrapper">
          <p>Loading products...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="empty-wrapper">
          <p>No products found.</p>
        </div>
      ) : (
        <div className="brand-products-grid">
          {products.map((product) => (
            <div
              key={product._id}
              className="brand-product-card"
              onClick={() => navigate(`/product/${product._id}`)}
            >
              <div className="brand-product-image">
                <img
                  src={product.images?.[0]?.url}
                  alt={product.name}
                />
              </div>

              <div className="brand-product-content">
                <h3>{product.name}</h3>

                <p className="brand-name">
                  {product.brand?.name}
                </p>

                <p className="category-name">
                  {product.category?.name}
                </p>

                <div className="price-row">
                  <span className="price">
                    ₹{product.price}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BrandProducts;