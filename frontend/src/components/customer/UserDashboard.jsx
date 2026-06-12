import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Userorder from "./Userpages/Userorder";
import Userprofile from "./Userpages/Userprofile";
import Usersetting from "./Userpages/Usersettings";
import { AuthContext } from "../../context/AuthContext";
import "../../user.css";

/* ── Inline SVG Icons ── */
const IconDashboard = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
  </svg>
);
const IconProfile = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
  </svg>
);
const IconOrders = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" />
    <path d="M16 10a4 4 0 0 1-8 0" />
  </svg>
);
const IconSettings = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);
const IconLogout = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);
const IconStore = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" />
    <path d="M16 10a4 4 0 0 1-8 0" />
  </svg>
);
const IconBox = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    <polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" />
  </svg>
);
const IconWallet = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" />
  </svg>
);
const IconStar = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

/* ── Nav items config ── */
const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", Icon: IconDashboard },
  { id: "profile",   label: "My Profile", Icon: IconProfile },
  { id: "orders",    label: "My Orders",  Icon: IconOrders },
  { id: "settings",  label: "Settings",   Icon: IconSettings },
];

/* ── Stat cards config ── */
const STATS = [
  { label: "Total Orders",  value: "24",    Icon: IconBox,    color: "#6366F1" },
  { label: "Total Spent",   value: "$1,240", Icon: IconWallet, color: "#10B981" },
  { label: "Wishlist Items",value: "12",    Icon: IconStar,   color: "#F59E0B" },
];

/* ── Component ── */
const UserDashboard = () => {
  const [activePage, setActivePage] = useState("dashboard");
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  const handleLogout = () => { logout(); navigate("/"); };

  const pageLabel = NAV_ITEMS.find(n => n.id === activePage)?.label ?? activePage;

  return (
    <div className="ud-shell">

      {/* ── Sidebar ── */}
      <aside className="ud-sidebar">
        <div className="ud-brand">
          <div className="ud-brand-icon"><IconStore /></div>
          <span className="ud-brand-name">E-Commerce</span>
        </div>

        <nav className="ud-nav">
          <p className="ud-nav-section-label">Main Menu</p>
          <ul className="ud-nav-list">
            {NAV_ITEMS.map(({ id, label, Icon }) => (
              <li
                key={id}
                className={`ud-nav-item${activePage === id ? " ud-nav-item--active" : ""}`}
                onClick={() => setActivePage(id)}
              >
                <span className="ud-nav-item-indicator" />
                <span className="ud-nav-item-icon"><Icon /></span>
                <span className="ud-nav-item-label">{label}</span>
              </li>
            ))}
          </ul>
        </nav>

        <div className="ud-sidebar-footer">
          <button className="ud-logout-btn" onClick={handleLogout}>
            <IconLogout />
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="ud-main">

        {/* Top bar */}
        <header className="ud-topbar">
          <div className="ud-breadcrumbs">
            <span className="ud-breadcrumb-root">Pages</span>
            <span className="ud-breadcrumb-sep">/</span>
            <span className="ud-breadcrumb-current">{pageLabel}</span>
          </div>
          <h1 className="ud-page-title">{pageLabel}</h1>
        </header>

        {/* Body */}
        <div className="ud-body">

          {/* ── Dashboard ── */}
          {activePage === "dashboard" && (
            <div className="ud-section">
              <div className="ud-section-header">
                <h2 className="ud-section-title">Welcome back, User</h2>
                <p className="ud-section-sub">Here's what's happening with your account today.</p>
              </div>

              <div className="ud-stats-grid">
                {STATS.map(({ label, value, Icon, color }) => (
                  <div className="ud-stat-card" key={label}>
                    <div className="ud-stat-icon-wrap" style={{ "--stat-color": color }}>
                      <Icon />
                    </div>
                    <div className="ud-stat-info">
                      <p className="ud-stat-label">{label}</p>
                      <p className="ud-stat-value">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Profile ── */}
          {activePage === "profile" && (
            <div className="ud-section">
              <div className="ud-section-header">
                <h2 className="ud-section-title">My Profile</h2>
                <p className="ud-section-sub">Manage your personal information.</p>
              </div>
              <div className="ud-card">
                {/* Profile form fields go here */}
                <p className="ud-placeholder-text">Profile fields will appear here.</p>
              </div>
            </div>
          )}

          {/* ── all tabs ── */}
          {activePage === "profile" && <Userprofile />}
          {activePage === "orders" && <Userorder />}
          {activePage === "settings" && <Usersetting />}
         

        </div>

        {/* Footer */}
        <footer className="ud-footer">
          <p className="ud-footer-copy">© 2024 E-Commerce. All rights reserved.</p>
          <div className="ud-footer-links">
            <a href="#about">About Us</a>
            <a href="#blog">Blog</a>
            <a href="#license">License</a>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default UserDashboard;
