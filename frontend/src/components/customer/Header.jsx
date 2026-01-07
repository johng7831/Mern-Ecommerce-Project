import React from "react";
import { Link } from "react-router-dom";
import "../../user.css";

const Header = () => {
  // TEMP: baad me context / redux se aayega
  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user?.role === "admin";

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
          <Link to="/shop">Shop</Link>
          <Link to="/cart">Cart</Link>

          {isAdmin && <Link to="/admin/dashboard">Admin</Link>}
        </nav>

        {/* AUTH BUTTONS */}
        <div className="auth">
          {user ? (
            <>
              <span className="username">Hi, {user.name}</span>
              <button
                onClick={() => {
                  localStorage.removeItem("user");
                  localStorage.removeItem("token");
                  window.location.reload();
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <Link to="/login">Login</Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;

