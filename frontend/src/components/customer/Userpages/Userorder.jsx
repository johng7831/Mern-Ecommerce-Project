import React, { useEffect, useState } from "react";
import axios from "axios";
import API_URL from "../../../api";


/* ── Inline SVG Icons ── */
const IconPackage = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
    <polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>
  </svg>
);
const IconUser = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
);
const IconMail = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
);
const IconWallet = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/>
  </svg>
);
const IconHash = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="4" y1="9" x2="20" y2="9"/><line x1="4" y1="15" x2="20" y2="15"/>
    <line x1="10" y1="3" x2="8" y2="21"/><line x1="16" y1="3" x2="14" y2="21"/>
  </svg>
);
const IconShoppingBag = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
    <line x1="3" y1="6" x2="21" y2="6"/>
    <path d="M16 10a4 4 0 0 1-8 0"/>
  </svg>
);
const IconAlertCircle = () => (
  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);
const IconLoader = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="uo-spin">
    <line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/>
    <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/>
    <line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/>
    <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/>
  </svg>
);

/* ── Status helpers ── */
const STATUS_MAP = {
  pending:    { label: "Pending",    color: "#F59E0B", bg: "#FFFBEB" },
  processing: { label: "Processing", color: "#6366F1", bg: "#EEF2FF" },
  shipped:    { label: "Shipped",    color: "#3B82F6", bg: "#EFF6FF" },
  delivered:  { label: "Delivered",  color: "#10B981", bg: "#ECFDF5" },
  cancelled:  { label: "Cancelled",  color: "#EF4444", bg: "#FEF2F2" },
};

const getStatus = (raw = "") => {
  const key = raw.toLowerCase();
  return STATUS_MAP[key] ?? { label: raw, color: "#64748B", bg: "#F1F5F9" };
};

/* ── Component ── */
const Userorder = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState({});

  const toggleExpand = (id) =>
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_URL}/admin/myorders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data.orders || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load orders. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  /* ── Loading ── */
  if (loading) return (
    <div className="uo-state-wrap">
      <div className="uo-state-icon uo-state-icon--loading"><IconLoader /></div>
      <p className="uo-state-text">Loading your orders…</p>
    </div>
  );

  /* ── Error ── */
  if (error) return (
    <div className="uo-state-wrap">
      <div className="uo-state-icon uo-state-icon--error"><IconAlertCircle /></div>
      <p className="uo-state-title">Something went wrong</p>
      <p className="uo-state-text">{error}</p>
      <button className="uo-retry-btn" onClick={fetchOrders}>Try again</button>
    </div>
  );

  /* ── Empty ── */
  if (orders.length === 0) return (
    <div className="uo-state-wrap">
      <div className="uo-state-icon uo-state-icon--empty"><IconShoppingBag /></div>
      <p className="uo-state-title">No orders yet</p>
      <p className="uo-state-text">When you place an order, it will appear here.</p>
    </div>
  );

  /* ── Orders list ── */
  return (
    <div className="uo-root">
      <div className="uo-header">
        <h2 className="uo-title">My Orders</h2>
        <span className="uo-count">{orders.length} order{orders.length !== 1 ? "s" : ""}</span>
      </div>

      <div className="uo-list">
        {orders.map((order) => {
          const status = getStatus(order.status);
          const isOpen = !!expanded[order._id];

          return (
            <div
              key={order._id}
              className="uo-card"
              style={{ "--status-color": status.color }}
            >
              {/* Status strip */}
              <div className="uo-card-strip" />

              {/* Card header */}
              <div className="uo-card-head">
                <div className="uo-card-head-left">
                  <div className="uo-order-icon"><IconPackage /></div>
                  <div>
                    <p className="uo-order-id">
                      <IconHash />
                      <span>{order._id.slice(-8).toUpperCase()}</span>
                    </p>
                    <p className="uo-order-name">{order.fullName}</p>
                  </div>
                </div>

                <div className="uo-card-head-right">
                  <span
                    className="uo-status-badge"
                    style={{ color: status.color, background: status.bg }}
                  >
                    {status.label}
                  </span>
                  <p className="uo-order-total">₹{order.total?.toLocaleString("en-IN")}</p>
                </div>
              </div>

              {/* Meta row */}
              <div className="uo-meta-row">
                <span className="uo-meta-item">
                  <IconMail />
                  {order.email}
                </span>
                <span className="uo-meta-item">
                  <IconWallet />
                  {order.paymentMethod}
                </span>
                <span className="uo-meta-item">
                  <IconUser />
                  {order.items?.length ?? 0} item{order.items?.length !== 1 ? "s" : ""}
                </span>
              </div>

              {/* Toggle items */}
              <button
                className="uo-toggle-btn"
                onClick={() => toggleExpand(order._id)}
                aria-expanded={isOpen}
              >
                {isOpen ? "Hide items" : "View items"}
                <svg
                  className={`uo-chevron${isOpen ? " uo-chevron--open" : ""}`}
                  width="14" height="14" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" strokeWidth="2.5"
                  strokeLinecap="round" strokeLinejoin="round"
                >
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </button>

              {/* Items list */}
              {isOpen && (
                <div className="uo-items-wrap">
                  <div className="uo-items-list">
                    {order.items.map((item) => (
                      <div key={item._id} className="uo-item-row">
                        <div className="uo-item-dot" />
                        <span className="uo-item-name">{item.name}</span>
                        <span className="uo-item-qty">× {item.quantity}</span>
                        <span className="uo-item-price">₹{(item.price * item.quantity).toLocaleString("en-IN")}</span>
                      </div>
                    ))}
                  </div>

                  <div className="uo-items-footer">
                    <span className="uo-items-footer-label">Order Total</span>
                    <span className="uo-items-footer-total">₹{order.total?.toLocaleString("en-IN")}</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Userorder;
