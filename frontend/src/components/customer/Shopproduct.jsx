import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import API_URL from "../../api";
import { displayBrandName } from "../../utils/productDisplay";

const Shopproduct = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const fetchProducts = async () => {
      setLoading(true);
      setFetchError(null);
      try {
        const res = await axios.get(`${API_URL}/products`);

        const data = res.data;

        const normalizedProducts = Array.isArray(data)
          ? data
          : Array.isArray(data?.data)
          ? data.data
          : [];

        if (!cancelled) {
          setProducts(normalizedProducts);
        }
      } catch (error) {
        console.error("Fetch Products Error:", error);
        if (!cancelled) {
          setProducts([]);
          const status = error?.response?.status;
          setFetchError(
            status
              ? `Could not load products (HTTP ${status}). Check the API URL and that the server is running.`
              : "Could not load products. Check that the API is running and try again."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchProducts();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="shop-page">
      <section className="home-section home-section--muted">
        <div className="home-section-inner">
          <div className="home-section-header">
            <h1 className="home-section-title">Shop</h1>
            <span className="home-section-subtitle">
              Browse our full catalog
            </span>
          </div>

          {loading && (
            <p className="home-section-subtitle" style={{ marginTop: "1rem" }}>
              Loading products…
            </p>
          )}

          {fetchError && (
            <p
              className="home-section-subtitle"
              style={{ marginTop: "1rem", color: "#b91c1c" }}
            >
              {fetchError}
            </p>
          )}

          <div className="product-grid">
            {!loading &&
              products.map((product) => (
              <Link
                key={product._id}
                to={`/product/${product._id}`}
                className="product-card-link"
              >
                <div className="product-card">
                  <div className="product-card-image-wrapper">
                    <img
                      src={product.images?.[0]?.url}
                      alt={product.name}
                      className="product-card-image"
                    />
                  </div>

                  <div className="product-card-body">
                    <h4 className="product-card-name">
                      {product.name}
                    </h4>

                    <p className="product-card-brand">
                      {displayBrandName(product.brand) || "No brand"}
                    </p>

                    <p className="product-card-price">
                      ₹ {product.price}
                    </p>
                  </div>
                </div>
              </Link>
              ))}
          </div>

          {!loading && !fetchError && products.length === 0 && (
            <p
              className="home-section-subtitle"
              style={{ marginTop: "1rem" }}
            >
              No products available yet.
            </p>
          )}
        </div>
      </section>
    </div>
  );
};

export default Shopproduct;