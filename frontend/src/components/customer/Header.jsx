import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import { FaRegUser } from "react-icons/fa";
import { AuthContext } from "../../context/AuthContext";
import { CartContext } from "../../context/CartContext";
import "../../user.css";

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const { cartItems } = useContext(CartContext);
  const cartCount = cartItems.reduce((n, item) => n + (item.quantity || 1), 0);
  const navigate = useNavigate();
  const isAdmin = user?.role === "admin";

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="header">
      <div className="header-container">

        {/* LOGO */}
        <Link to="/" className="logo">
          ShopEasy
        </Link>

        {/* NAV LINKS */}

      <nav className="nav">
        <Link to="/">Home</Link>
        <Link to="/shop-product">Shop</Link>
        {isAdmin && (
          <Link to="/admin/dashboard">Admin Dashboard</Link>
        )}
      </nav>



        {/* AUTH BUTTONS */}
        <div className="auth">
          {user ? (
            <>
              <span className="username">Hi, {user.name}</span>
              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="login-link">
              <FaRegUser className="nav-icon" />
            </Link>
          )}

          {/* Cart always visible */}
          <Link
            to="/cart"
            className="cart-link"
            aria-label={`Shopping cart${cartCount ? `, ${cartCount} items` : ", empty"}`}
          >
            <span className="cart-wrapper">
              <FaShoppingCart className="nav-icon cart-nav-icon" aria-hidden />
              {cartCount > 0 ? (
                <span className="cart-count" aria-hidden="true">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              ) : null}
            </span>
          </Link>
        </div>

      </div>
    </header>
  );
};

export default Header;