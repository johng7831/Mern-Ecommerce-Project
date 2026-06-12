import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "./Login.css";
import API_URL from "../../api";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      let data = null;
      try {
        data = await res.json();
      } catch {
        // Fallback for non-JSON responses
      }

      if (!res.ok) {
        setError(data?.message || "Login failed");
        return;
      }

      if (data.user.role === "admin") {
        setError("Admin login not allowed here. Please use Admin Login page.");
        setLoading(false);
        return;
      }

      localStorage.setItem("token", data.token);
      login(data.user);
      navigate("/user");
    } catch (err) {
      setError(err.message || "Unable to connect to server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fullscreen-page-wrapper">
      {/* Top Header Section */}
      <header className="page-header-section">
        <nav className="breadcrumb">
          <Link to="/">Home</Link> <span>·</span> 
          <Link to="/account">My Account</Link> <span>·</span> 
          <span className="current">Login</span>
        </nav>
        <h1 className="page-title">Login</h1>
        <hr className="title-divider" />
      </header>

      {/* Main Two-Column Viewport Area */}
      <div className="login-main-container">
        
        {/* Left Column: Existing Customers */}
        <div className="login-column-left">
          <h2 className="section-heading">Existing Customers</h2>
          
          <div className="login-card-visual">
            <form onSubmit={handleSubmit} className="login-form">
              {error && <div className="error-message">{error}</div>}

              {/* Updated class names for row-based alignment */}
              <div className="form-row-inline">
                <label htmlFor="email" className="form-label-left">Email address *</label>
                <input
                  id="email"
                  type="email"
                  className="form-input-right"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-row-inline">
                <label htmlFor="password" className="form-label-left">Password *</label>
                <input
                  id="password"
                  type="password"
                  className="form-input-right"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              {/* Action container to push button/link to the right */}
              <div className="form-actions-wrapper">
                <button type="submit" className="primary-green-btn" disabled={loading}>
                  {loading ? "Signing in..." : "Sign In"}
                </button>
                <div className="forgotten-password-link">
                  <Link to="/forgot-password">Forgotten your password?</Link>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column: New Customer Box */}
        <div className="login-column-right">
          <div className="new-customer-box">
            <h2 className="section-heading">New to us?</h2>
            <ul className="benefits-list">
              <li>Get our latest product recommendations for you.</li>
              <li>Personalise your experience on mobile, tablet and desktop.</li>
              <li>Manage your orders and preferences.</li>
              <li>Access your saved items.</li>
              <li>Create and share gift lists.</li>
            </ul>
            <Link to="/register" className="primary-green-btn register-btn-link">
              Register for an account
            </Link>
          </div>
        </div>

      </div>

      {/* Footer Area */}
      <footer className="page-footer-section">
        <p className="privacy-notice">
          We will use your information in accordance with our <Link to="/privacy">Privacy Policy</Link>.
        </p>
      </footer>
    </div>
  );
};

export default Login;