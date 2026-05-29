import React, { useEffect, useState, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import API_URL from "../../api";
import { AuthContext } from "../../context/AuthContext";
import { CartContext } from "../../context/CartContext";

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const { cartItems } = useContext(CartContext);
  const [collections, setCollections] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");
  // FETCH ALL COLLECTIONS
  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const res = await axios.get(
          `${API_URL}/admin/collections`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (res.data.success) {
          setCollections(res.data.data);
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchCollections();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };
  const isDashboardPage =
    location.pathname.startsWith("/admin") ||
    location.pathname.startsWith("/user");
  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          ShopEasy
        </Link>
        {!isDashboardPage && (
          <>
            {/* NAV DYNAMIC */}
            <nav className="nav">
              <Link to="/">New In</Link>
              {collections.map((col) => (
                <Link key={col._id} to={`/collection/${col._id}`}>
                  {col.collectionTitle}
                </Link>
              ))}
            </nav>

            {/* AUTH */}
            <div className="auth">
              {user ? (
                <>
                  <span>Hi, {user.name}</span>
                  <button onClick={handleLogout}>Logout</button>
                </>
              ) : (
                <Link to="/login">Login</Link>
              )}
            </div>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;