import React, { useState } from "react";


// Categories
import CategoryShow from "./categories/Show";
import CategoryEdit from "./categories/Edit";
import CategoryCreate from "./categories/Create";

// Brands
import BrandShow from "./brands/Show";
import BrandEdit from "./brands/Edit";
import BrandCreate from "./brands/Create";

// Products
import ProductShow from "./products/Show";
import ProductEdit from "./products/Edit";
import ProductCreate from "./products/Create";

// Orders
import OrderShow from "./Orders/Show";
import OrderEdit from "./Orders/Edit";

// Collections
import CollectionShow from "./collections/Show";
import CollectionEdit from "./collections/Edit";
import CollectionCreate from "./collections/Create";

// ── SVG Icons ──
const Icons = {
  dashboard: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1"/>
      <rect x="14" y="3" width="7" height="7" rx="1"/>
      <rect x="3" y="14" width="7" height="7" rx="1"/>
      <rect x="14" y="14" width="7" height="7" rx="1"/>
    </svg>
  ),
  collections: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
    </svg>
  ),
  categories: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
    </svg>
  ),
  brands: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
      <line x1="7" y1="7" x2="7.01" y2="7"/>
    </svg>
  ),
  products: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
      <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
      <line x1="12" y1="22.08" x2="12" y2="12"/>
    </svg>
  ),
  orders: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="16" y1="13" x2="8" y2="13"/>
      <line x1="16" y1="17" x2="8" y2="17"/>
      <polyline points="10 9 9 9 8 9"/>
    </svg>
  ),
};

const NAV_ITEMS = [
  { key: "dashboard",   label: "Dashboard" },
  { key: "collections", label: "Collections" },
  { key: "categories",  label: "Categories" },
  { key: "brands",      label: "Brands" },
  { key: "products",    label: "Products" },
  { key: "orders",      label: "Orders" },
];

const AdminDashboard = () => {
  const [activePage, setActivePage] = useState("dashboard");

  // -------- COLLECTION STATE --------
  const [collectionView, setCollectionView] = useState("show");
  const [selectedCollection, setSelectedCollection] = useState(null);

  // -------- CATEGORY STATE --------
  const [categoryView, setCategoryView] = useState("show");
  const [selectedCategory, setSelectedCategory] = useState(null);

  // -------- BRAND STATE --------
  const [brandView, setBrandView] = useState("show");
  const [selectedBrand, setSelectedBrand] = useState(null);

  // -------- PRODUCT STATE --------
  const [productView, setProductView] = useState("show");
  const [selectedProduct, setSelectedProduct] = useState(null);

  // -------- ORDER STATE --------
  const [orderView, setOrderView] = useState("show");
  const [selectedOrder, setSelectedOrder] = useState(null);

  // -------- NAV HANDLER --------
  const handleNav = (key) => {
    setActivePage(key);
    if (key === "collections") { setCollectionView("show"); setSelectedCollection(null); }
    if (key === "categories")  { setCategoryView("show");   setSelectedCategory(null); }
    if (key === "brands")      { setBrandView("show");      setSelectedBrand(null); }
    if (key === "products")    { setProductView("show");    setSelectedProduct(null); }
    if (key === "orders")      { setOrderView("show");      setSelectedOrder(null); }
  };

  // -------- COLLECTION RENDER --------
  const renderCollectionsContent = () => {
    switch (collectionView) {
      case "edit":
        return (
          <CollectionEdit
            collection={selectedCollection}
            onBack={() => { setCollectionView("show"); setSelectedCollection(null); }}
          />
        );
      case "create":
        return <CollectionCreate onBack={() => setCollectionView("show")} />;
      default:
        return (
          <CollectionShow
            onAdd={() => setCollectionView("create")}
            onEdit={(col) => { setSelectedCollection(col); setCollectionView("edit"); }}
          />
        );
    }
  };

  // -------- CATEGORY RENDER --------
  const renderCategoryContent = () => {
    switch (categoryView) {
      case "edit":
        return (
          <CategoryEdit
            category={selectedCategory}
            onBack={() => { setCategoryView("show"); setSelectedCategory(null); }}
          />
        );
      case "create":
        return <CategoryCreate onBack={() => setCategoryView("show")} />;
      default:
        return (
          <CategoryShow
            onAdd={() => setCategoryView("create")}
            onEdit={(cat) => { setSelectedCategory(cat); setCategoryView("edit"); }}
          />
        );
    }
  };

  // -------- BRAND RENDER --------
  const renderBrandContent = () => {
    switch (brandView) {
      case "edit":
        return (
          <BrandEdit
            brandData={selectedBrand}
            onBack={() => { setBrandView("show"); setSelectedBrand(null); }}
          />
        );
      case "create":
        return <BrandCreate onBack={() => setBrandView("show")} />;
      default:
        return (
          <BrandShow
            onAdd={() => setBrandView("create")}
            onEdit={(brand) => { setSelectedBrand(brand); setBrandView("edit"); }}
          />
        );
    }
  };

  // -------- PRODUCT RENDER --------
  const renderProductContent = () => {
    switch (productView) {
      case "edit":
        return (
          <ProductEdit
            product={selectedProduct}
            onBack={() => { setProductView("show"); setSelectedProduct(null); }}
          />
        );
      case "create":
        return <ProductCreate onBack={() => setProductView("show")} />;
      default:
        return (
          <ProductShow
            onAdd={() => setProductView("create")}
            onEdit={(product) => { setSelectedProduct(product); setProductView("edit"); }}
          />
        );
    }
  };

  // -------- ORDER RENDER --------
  const renderOrderContent = () => {
    switch (orderView) {
      case "edit":
        return (
          <OrderEdit
            order={selectedOrder}
            onBack={() => { setOrderView("show"); setSelectedOrder(null); }}
          />
        );
      default:
        return (
          <OrderShow
            onEdit={(order) => { setSelectedOrder(order); setOrderView("edit"); }}
          />
        );
    }
  };

  return (
    <div className="dashboard-container admin">

      {/* ── SIDEBAR ── */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="brand-logo">EC</div>
          <span className="brand-text">E-Commerce Admin</span>
        </div>

        <nav className="sidebar-nav">
          <p className="nav-section-label">Main Menu</p>
          <ul className="nav-list">
            {NAV_ITEMS.map(({ key, label }) => (
              <li
                key={key}
                className={`nav-item ${activePage === key ? "active" : ""}`}
                onClick={() => handleNav(key)}
              >
                <span className="nav-icon">{Icons[key]}</span>
                <span className="nav-label">{label}</span>
              </li>
            ))}
          </ul>
        </nav>

        <div className="sidebar-footer">
          v1.0.0
        </div>
      </aside>

      {/* ── MAIN ── */}
      <main className="main-content">
        <div className="content-header">
          <h2>{activePage}</h2>
        </div>

        <div className="content-body">
          {activePage === "dashboard" && (
            <div>
              <h2>Hello, Admin</h2>
              <p style={{ color: "var(--color-text-muted)", marginTop: 4, fontSize: 14 }}>
                Welcome back. Here's what's happening today.
              </p>
            </div>
          )}
          {activePage === "collections" && renderCollectionsContent()}
          {activePage === "categories"  && renderCategoryContent()}
          {activePage === "brands"      && renderBrandContent()}
          {activePage === "products"    && renderProductContent()}
          {activePage === "orders"      && renderOrderContent()}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
