import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "./AdminLogin.css";
import API_URL from "../../api";

const AdminLogin = () => {
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
        // Fallback for non-JSON or raw text errors from server
      }

      if (!res.ok) {
        setError(data?.message || "Invalid credentials. Please try again.");
        setLoading(false); // Make sure to turn off loading on error
        return;
      }

      // Role authorization check
      if (data?.user?.role !== "admin") {
        setError("Access denied. Admin credentials required.");
        setLoading(false); 
        return;
      }

      // Success path
      localStorage.setItem("token", data.token);
      login(data.user);
      navigate("/admin/dashboard");
    } catch (err) {
      setError(err.message || "Unable to connect to server. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-card">
        <div className="admin-login-header">
          <div className="admin-logo-badge">Secure Console</div>
          <h1>Admin Portal</h1>
          <p>Provide your administrator credentials to access the management network.</p>
        </div>

        <form onSubmit={handleSubmit} className="admin-login-form">
          {error && (
            <div className="error-message">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
              <span>{error}</span>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              autoComplete="current-password"
            />
          </div>

          <button type="submit" className="admin-login-btn" disabled={loading}>
            {loading ? (
              <span className="spinner-container">
                <span className="btn-spinner"></span>
                Processing...
              </span>
            ) : (
              "Authenticate"
            )}
          </button>
        </form>

        <div className="admin-login-footer">
          <p>
            Standard User? <Link to="/login" className="footer-link">Return to User Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;