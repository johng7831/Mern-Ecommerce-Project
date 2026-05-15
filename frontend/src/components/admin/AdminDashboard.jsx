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

import Ordershow from "./Orders/Show";
import OrderEdit from "./Orders/Edit";

const AdminDashboard = () => {
  const [activePage, setActivePage] = useState("dashboard");

  // Category state
  const [categoryView, setCategoryView] = useState("show");
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Brand state
  const [brandView, setBrandView] = useState("show");
  const [selectedBrand, setSelectedBrand] = useState(null);

  // Product state
  const [productView, setProductView] = useState("show");
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Order state
  const [orderView, setOrderView] = useState("show");
  const [selectedOrder, setSelectedOrder] = useState(null);


  // -------- CATEGORY RENDER --------
  const renderCategoryContent = () => {
    switch (categoryView) {
      case "edit":
        return (
          <CategoryEdit
            category={selectedCategory}
            onBack={() => {
              setCategoryView("show");
              setSelectedCategory(null);
            }}
          />
        );

      case "create":
        return <CategoryCreate onBack={() => setCategoryView("show")} />;

      default:
        return (
          <CategoryShow
            onAdd={() => setCategoryView("create")}
            onEdit={(cat) => {
              setSelectedCategory(cat);
              setCategoryView("edit");
            }}
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
            onBack={() => {
              setBrandView("show");
              setSelectedBrand(null);
            }}
          />
        );

      case "create":
        return <BrandCreate onBack={() => setBrandView("show")} />;

      default:
        return (
          <BrandShow
            onAdd={() => setBrandView("create")}
            onEdit={(brand) => {
              setSelectedBrand(brand);
              setBrandView("edit");
            }}
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
            onBack={() => {
              setProductView("show");
              setSelectedProduct(null);
            }}
          />
        );

      case "create":
        return <ProductCreate onBack={() => setProductView("show")} />;

      default:
        return (
          <ProductShow
            onAdd={() => setProductView("create")}
            onEdit={(product) => {
              setSelectedProduct(product);
              setProductView("edit");
            }}
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
          onBack={() => {
            setOrderView("show");
            setSelectedOrder(null);
          }}
        />
      );

    default:
      return (
        <Ordershow
          onEdit={(order) => {
            setSelectedOrder(order);
            setOrderView("edit");
          }}
        />
      );
  }
};















  return (
    <div className="dashboard-container admin">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="brand-icon">🛍️</div>
          <span className="brand-text">E-Commerce Admin</span>
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
              className={`nav-item ${activePage === "categories" ? "active" : ""}`}
              onClick={() => {
                setActivePage("categories");
                setCategoryView("show");
                setSelectedCategory(null);
              }}
            >
              <span className="nav-icon">📁</span>
              <span className="nav-text">Categories</span>
            </li>

            <li
              className={`nav-item ${activePage === "brands" ? "active" : ""}`}
              onClick={() => {
                setActivePage("brands");
                setBrandView("show");
                setSelectedBrand(null);
              }}
            >
              <span className="nav-icon">🏷️</span>
              <span className="nav-text">Brands</span>
            </li>

            {/* ✅ PRODUCTS ADDED */}
            <li
              className={`nav-item ${activePage === "products" ? "active" : ""}`}
              onClick={() => {
                setActivePage("products");
                setProductView("show");
                setSelectedProduct(null);
              }}
            >
              <span className="nav-icon">📦</span>
              <span className="nav-text">Products</span>
            </li>

                {/* ✅ ORDERS ADDED */}
           <li
            className={`nav-item ${activePage === "orders" ? "active" : ""}`}
            onClick={() => {
              setActivePage("orders");
              setOrderView("show");
              setSelectedOrder(null);
            }}
          >
            <span className="nav-icon">🧾</span>
            <span className="nav-text">Orders</span>
          </li>



          </ul>
        </nav>
      </aside>

      {/* MAIN */}
      <main className="main-content">
        <div className="content-header">
          <div className="breadcrumbs">
            <span>Pages</span>
            <span className="breadcrumb-separator">/</span>
            <span style={{ textTransform: "capitalize" }}>
              {activePage}
            </span>
          </div>
        </div>

        <div className="content-body">
          {activePage === "dashboard" && (
            <h2 className="greeting">Hello Admin 👋</h2>
          )}

          {activePage === "categories" && renderCategoryContent()}
          {activePage === "brands" && renderBrandContent()}
          {activePage === "products" && renderProductContent()}
           {activePage === "orders" && renderOrderContent()}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
