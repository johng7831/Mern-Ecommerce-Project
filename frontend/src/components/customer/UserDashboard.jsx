import React, { useState } from "react";
import Userorder from "./Userpages/Userorder";

const UserDashboard = () => {
  const [activePage, setActivePage] = useState("dashboard");

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="brand-icon">🛍️</div>
          <span className="brand-text">E-Commerce</span>
        </div>

        <nav className="sidebar-nav">
          <ul className="nav-list">
            <li 
              className={`nav-item ${activePage === "dashboard" ? "active" : ""}`}
              onClick={() => setActivePage("dashboard")}
            >
              <span className="nav-icon">📊</span>
              <span className="nav-text">Dashboard</span>
            </li>
            <li 
              className={`nav-item ${activePage === "profile" ? "active" : ""}`}
              onClick={() => setActivePage("profile")}
            >
              <span className="nav-icon">👤</span>
              <span className="nav-text">My Profile</span>
            </li>
            <li 
              className={`nav-item ${activePage === "orders" ? "active" : ""}`}
              onClick={() => setActivePage("orders")}
            >
              <span className="nav-icon">📦</span>
              <span className="nav-text">My Orders</span>
            </li>
            <li 
              className={`nav-item ${activePage === "settings" ? "active" : ""}`}
              onClick={() => setActivePage("settings")}
            >
              <span className="nav-icon">⚙️</span>
              <span className="nav-text">Settings</span>
            </li>
          </ul>
        </nav>

        <div className="sidebar-footer">
          <button className="upgrade-btn">UPGRADE TO PRO</button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <div className="content-header">
          <div className="breadcrumbs">
            <span>Pages</span>
            <span className="breadcrumb-separator">/</span>
            <span>{activePage.charAt(0).toUpperCase() + activePage.slice(1)}</span>
          </div>
          <h1 className="page-title">{activePage.charAt(0).toUpperCase() + activePage.slice(1)}</h1>
        </div>

        <div className="content-body">
          {activePage === "dashboard" && (
            <>
              <h2 className="greeting">Hello User</h2>
              
              <div className="dashboard-stats">
                <div className="stat-card">
                  <div className="stat-icon">📦</div>
                  <div className="stat-info">
                    <h3>Orders</h3>
                    <p className="stat-number">24</p>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon">💰</div>
                  <div className="stat-info">
                    <h3>Total Spent</h3>
                    <p className="stat-number">$1,240</p>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon">⭐</div>
                  <div className="stat-info">
                    <h3>Wishlist</h3>
                    <p className="stat-number">12</p>
                  </div>
                </div>
              </div>
            </>
          )}

          {activePage === "profile" && (
            <>
              <h2 className="greeting">My Profile</h2>
              
              <div className="page-content-card">
                <div className="profile-form">
                  <div className="form-group">
                    <label>Full Name</label>
                    <input type="text" className="form-input" placeholder="Enter your name" defaultValue="John Doe" />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input type="email" className="form-input" placeholder="Enter your email" defaultValue="john@example.com" />
                  </div>
                  <div className="form-group">
                    <label>Phone</label>
                    <input type="tel" className="form-input" placeholder="Enter your phone" defaultValue="+1 234 567 8900" />
                  </div>
                  <div className="form-group">
                    <label>Address</label>
                    <textarea className="form-input" rows="3" placeholder="Enter your address">123 Main St, City, State 12345</textarea>
                  </div>
                  <button className="btn-primary">Update Profile</button>
                </div>
              </div>
            </>
          )}

           {activePage === "orders" && <Userorder />}
            

          {activePage === "settings" && (
            <>
              <h2 className="greeting">Settings</h2>
              
              <div className="page-content-card">
                <div className="card-header">
                  <h3>Change Password</h3>
                </div>
                <div className="profile-form">
                  <div className="form-group">
                    <label>Current Password</label>
                    <input type="password" className="form-input" placeholder="Enter current password" />
                  </div>
                  <div className="form-group">
                    <label>New Password</label>
                    <input type="password" className="form-input" placeholder="Enter new password" />
                  </div>
                  <div className="form-group">
                    <label>Confirm New Password</label>
                    <input type="password" className="form-input" placeholder="Confirm new password" />
                  </div>
                  <button className="btn-primary">Update Password</button>
                </div>
              </div>
            </>
          )}
        </div>

        <footer className="content-footer">
          <div className="footer-content">
            <p>© 2024, made with ❤️ for a better web.</p>
            <div className="footer-links">
              <a href="#about">About Us</a>
              <a href="#blog">Blog</a>
              <a href="#license">License</a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default UserDashboard;
