import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "../../user.css";

const Header = () => {
  const { user, logout } = useContext(AuthContext);
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
          <Link to="/shop">Shop</Link>
          <Link to="/cart">Cart</Link>

          {isAdmin && <Link to="/admin/dashboard">Admin Dashboard</Link>}
        </nav>

        {/* AUTH BUTTONS */}
        <div className="auth">
          {user ? (
            <>
              <span className="username">Hi, {user.name}</span>
              <button onClick={handleLogout}>Logout</button>
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

