import React, { useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaShoppingCart, FaRegUser } from "react-icons/fa";
import { AuthContext } from "../../context/AuthContext";
import { CartContext } from "../../context/CartContext";
import "../../user.css";

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const { cartItems } = useContext(CartContext);
  const navigate = useNavigate();
  const location = useLocation();

  const cartCount = cartItems.reduce(
    (n, item) => n + (item.quantity || 1),
    0
  );

  const isAdmin = user?.role === "admin";

  // 🔑 Detect dashboard pages
  const isDashboardPage =
    location.pathname.startsWith("/admin") ||
    location.pathname.startsWith("/user");

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

        {/* ❌ Hide BOTH nav + cart on dashboards */}
        {!isDashboardPage && (
          <>
            <nav className="nav">
              <Link to="/">Home</Link>
              <Link to="/shop-product">Shop</Link>

              {isAdmin && (
                <Link to="/admin/dashboard">Admin Dashboard</Link>
              )}
            </nav>

            {/* CART */}
            <Link
              to="/cart"
              className="cart-link"
              aria-label={`Shopping cart${
                cartCount ? `, ${cartCount} items` : ", empty"
              }`}
            >
              <span className="cart-wrapper">
                <FaShoppingCart className="nav-icon cart-nav-icon" />
                {cartCount > 0 && (
                  <span className="cart-count">
                    {cartCount > 99 ? "99+" : cartCount}
                  </span>
                )}
              </span>
            </Link>
          </>
        )}

        {/* AUTH (still visible everywhere unless you also want to hide it) */}
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
        </div>

      </div>
    </header>
  );
};

export default Header;