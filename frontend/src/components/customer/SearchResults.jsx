import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import API_URL from "../../api";
import { displayBrandName } from "../../utils/productDisplay";

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const queryParam = searchParams.get("query")?.trim() || "";

  const [inputValue, setInputValue] = useState(queryParam);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    setInputValue(queryParam);
  }, [queryParam]);

  useEffect(() => {
    if (!queryParam) {
      setProducts([]);
      setFetchError(null);
      setLoading(false);
      return;
    }

    let cancelled = false;

    const fetchResults = async () => {
      setLoading(true);
      setFetchError(null);

      try {
        const res = await axios.get(`${API_URL}/search-products`, {
          params: { query: queryParam },
        });

        if (!cancelled) {
          setProducts(Array.isArray(res.data?.data) ? res.data.data : []);
        }
      } catch (error) {
        console.error("Search error:", error);
        if (!cancelled) {
          setProducts([]);
          const message =
            error?.response?.data?.message ||
            "Could not search products. Please try again.";
          setFetchError(message);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchResults();
    return () => {
      cancelled = true;
    };
  }, [queryParam]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const trimmed = inputValue.trim();
    if (trimmed) {
      navigate(`/search?query=${encodeURIComponent(trimmed)}`);
    }
  };

  return (
    <div className="search-page">
      <section className="home-section home-section--muted">
        <div className="home-section-inner">
          <div className="search-page-header">
            <div className="home-section-header">
              <h1 className="home-section-title">Search Products</h1>
              <span className="home-section-subtitle">
                Find items by name, brand, or category
              </span>
            </div>

            <form onSubmit={handleSearchSubmit} className="search-page-form">
              <div className="search-page-input-wrapper">
                <FaSearch className="search-page-icon" aria-hidden="true" />
                <input
                  type="search"
                  placeholder="Search products..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="search-page-input"
                  aria-label="Search products"
                />
              </div>
              <button type="submit" className="search-page-submit">
                Search
              </button>
            </form>
          </div>

          {queryParam && !loading && !fetchError && (
            <p className="search-results-meta">
              {products.length === 0
                ? `No products found for "${queryParam}"`
                : `${products.length} product${products.length === 1 ? "" : "s"} found for "${queryParam}"`}
            </p>
          )}

          {loading && (
            <p className="home-section-subtitle" style={{ marginTop: "1rem" }}>
              Searching products…
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

          {!queryParam && !loading && (
            <p className="search-empty-hint">
              Enter a product name, brand, or category to start searching.
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
                      <h4 className="product-card-name">{product.name}</h4>
                      <p className="product-card-brand">
                        {displayBrandName(product.brand) || "No brand"}
                      </p>
                      <p className="product-card-price">₹ {product.price}</p>
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default SearchResults;
