import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaShoppingCart, FaRegUser, FaSearch } from "react-icons/fa";
import axios from "axios";
import API_URL from "../../api";

import { AuthContext } from "../../context/AuthContext";
import { CartContext } from "../../context/CartContext";
import "../../user.css";

const Header = () => {
  const { user } = useContext(AuthContext);
  const { cartItems = [] } = useContext(CartContext);

  const [collections, setCollections] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // Search state

  const navigate = useNavigate();
  const location = useLocation();

  const cartCount = cartItems.reduce(
    (n, item) => n + (item.quantity || 1),
    0
  );

  const isDashboardPage =
    location.pathname.startsWith("/admin") ||
    location.pathname.startsWith("/user");

  // FETCH COLLECTIONS
  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const res = await axios.get(`${API_URL}/collections`);

        if (res.data?.success) {
          setCollections(res.data.data || []);
        }
      } catch (err) {
        console.error("Failed to fetch collections:", err);
      }
    };

    fetchCollections();
  }, []);

  // Sync header search with URL on search page
  useEffect(() => {
    if (location.pathname === "/search") {
      const params = new URLSearchParams(location.search);
      setSearchQuery(params.get("query") || "");
    }
  }, [location.pathname, location.search]);

  // HANDLE SEARCH SUBMIT
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="header">
      <div className="header-container">
        {/* LOGO */}
        <Link to="/" className="logo">
          ShopEasy
        </Link>

        {!isDashboardPage && (
          <>
            {/* NAV */}
            <nav className="nav">
              <Link to="/">New In</Link>

              {/* DYNAMIC COLLECTION LINKS */}
              {collections.map((col) => (
                <Link key={col._id} to={`/collection/${col._id}`}>
                  {col.collectionTitle}
                </Link>
              ))}
            </nav>

            {/* SEARCH BAR */}
            <form onSubmit={handleSearchSubmit} className="search-form">
              <FaSearch className="search-form-icon" aria-hidden="true" />
              <input
                type="search"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
                aria-label="Search products"
              />
              <button type="submit" className="search-btn" aria-label="Search">
                Search
              </button>
            </form>

            {/* USER ICON */}
            <div className="auth">
              <Link
                to={user ? "/user" : "/login"}
                className="login-link"
                aria-label="User Account"
              >
                <FaRegUser className="nav-icon" />
              </Link>
            </div>

            {/* CART */}
            <Link
              to="/cart"
              className="cart-link"
              aria-label={`Shopping cart${
                cartCount ? `, ${cartCount} items` : ", empty"
              }`}
            >
              <span className="cart-wrapper">
                <FaShoppingCart
                  className="nav-icon cart-nav-icon"
                  style={{ color: "white" }}
                />
                {cartCount > 0 && (
                  <span className="cart-count">
                    {cartCount > 99 ? "99+" : cartCount}
                  </span>
                )}
              </span>
            </Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;