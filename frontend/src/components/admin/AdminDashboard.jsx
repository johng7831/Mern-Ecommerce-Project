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

  // -------- COLLECTION RENDER --------
  const renderCollectionsContent = () => {
    switch (collectionView) {
      case "edit":
        return (
          <CollectionEdit
            collection={selectedCollection}
            onBack={() => {
              setCollectionView("show");
              setSelectedCollection(null);
            }}
          />
        );

      case "create":
        return (
          <CollectionCreate
            onBack={() => setCollectionView("show")}
          />
        );

      default:
        return (
          <CollectionShow
            onAdd={() => setCollectionView("create")}
            onEdit={(col) => {
              setSelectedCollection(col);
              setCollectionView("edit");
            }}
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
            onBack={() => {
              setCategoryView("show");
              setSelectedCategory(null);
            }}
          />
        );

      case "create":
        return (
          <CategoryCreate
            onBack={() => setCategoryView("show")}
          />
        );

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
        return (
          <BrandCreate
            onBack={() => setBrandView("show")}
          />
        );

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
        return (
          <ProductCreate
            onBack={() => setProductView("show")}
          />
        );

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
          <OrderShow
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
              📊 Dashboard
            </li>

            <li
              className={`nav-item ${activePage === "collections" ? "active" : ""}`}
              onClick={() => {
                setActivePage("collections");
                setCollectionView("show");
                setSelectedCollection(null);
              }}
            >
              📚 Collections
            </li>

            <li
              className={`nav-item ${activePage === "categories" ? "active" : ""}`}
              onClick={() => {
                setActivePage("categories");
                setCategoryView("show");
                setSelectedCategory(null);
              }}
            >
              📁 Categories
            </li>

            <li
              className={`nav-item ${activePage === "brands" ? "active" : ""}`}
              onClick={() => {
                setActivePage("brands");
                setBrandView("show");
                setSelectedBrand(null);
              }}
            >
              🏷️ Brands
            </li>

            <li
              className={`nav-item ${activePage === "products" ? "active" : ""}`}
              onClick={() => {
                setActivePage("products");
                setProductView("show");
                setSelectedProduct(null);
              }}
            >
              📦 Products
            </li>

            <li
              className={`nav-item ${activePage === "orders" ? "active" : ""}`}
              onClick={() => {
                setActivePage("orders");
                setOrderView("show");
                setSelectedOrder(null);
              }}
            >
              🧾 Orders
            </li>

          </ul>
        </nav>
      </aside>

      {/* MAIN */}
      <main className="main-content">
        <div className="content-header">
          <h2 style={{ textTransform: "capitalize" }}>{activePage}</h2>
        </div>

        <div className="content-body">
          {activePage === "dashboard" && <h2>Hello Admin 👋</h2>}
          {activePage === "collections" && renderCollectionsContent()}
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