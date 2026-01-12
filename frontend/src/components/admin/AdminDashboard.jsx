import React, { useState } from "react";

const AdminDashboard = () => {
  const [activePage, setActivePage] = useState("dashboard");

  return (
    <div className="dashboard-container admin">
      {/* Sidebar */}
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
              onClick={() => setActivePage("categories")}
            >
              <span className="nav-icon">📁</span>
              <span className="nav-text">Categories</span>
            </li>
            <li 
              className={`nav-item ${activePage === "brands" ? "active" : ""}`}
              onClick={() => setActivePage("brands")}
            >
              <span className="nav-icon">🏷️</span>
              <span className="nav-text">Brands</span>
            </li>
            <li 
              className={`nav-item ${activePage === "products" ? "active" : ""}`}
              onClick={() => setActivePage("products")}
            >
              <span className="nav-icon">🛍️</span>
              <span className="nav-text">Products</span>
            </li>
            <li 
              className={`nav-item ${activePage === "users" ? "active" : ""}`}
              onClick={() => setActivePage("users")}
            >
              <span className="nav-icon">👥</span>
              <span className="nav-text">Users</span>
            </li>
            <li 
              className={`nav-item ${activePage === "orders" ? "active" : ""}`}
              onClick={() => setActivePage("orders")}
            >
              <span className="nav-icon">📦</span>
              <span className="nav-text">Orders</span>
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
              <h2 className="greeting">hello admin</h2>
              
              <div className="dashboard-stats">
                <div className="stat-card">
                  <div className="stat-icon">📁</div>
                  <div className="stat-info">
                    <h3>Categories</h3>
                    <p className="stat-number">12</p>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon">🏷️</div>
                  <div className="stat-info">
                    <h3>Brands</h3>
                    <p className="stat-number">8</p>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon">🛍️</div>
                  <div className="stat-info">
                    <h3>Products</h3>
                    <p className="stat-number">120</p>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon">👥</div>
                  <div className="stat-info">
                    <h3>Users</h3>
                    <p className="stat-number">350</p>
                  </div>
                </div>
              </div>
            </>
          )}

          {activePage === "categories" && (
            <>
              <h2 className="greeting">Categories Management</h2>
              
              <div className="page-content-card">
                <div className="card-header">
                  <h3>All Categories</h3>
                  <button className="btn-primary">+ Add Category</button>
                </div>
                
                <div className="table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Category Name</th>
                        <th>Products</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>1</td>
                        <td>Electronics</td>
                        <td>45</td>
                        <td><span className="badge-success">Active</span></td>
                        <td>
                          <button className="btn-edit">Edit</button>
                          <button className="btn-delete">Delete</button>
                        </td>
                      </tr>
                      <tr>
                        <td>2</td>
                        <td>Clothing</td>
                        <td>32</td>
                        <td><span className="badge-success">Active</span></td>
                        <td>
                          <button className="btn-edit">Edit</button>
                          <button className="btn-delete">Delete</button>
                        </td>
                      </tr>
                      <tr>
                        <td>3</td>
                        <td>Books</td>
                        <td>18</td>
                        <td><span className="badge-success">Active</span></td>
                        <td>
                          <button className="btn-edit">Edit</button>
                          <button className="btn-delete">Delete</button>
                        </td>
                      </tr>
                      <tr>
                        <td>4</td>
                        <td>Home & Kitchen</td>
                        <td>25</td>
                        <td><span className="badge-success">Active</span></td>
                        <td>
                          <button className="btn-edit">Edit</button>
                          <button className="btn-delete">Delete</button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {activePage === "brands" && (
            <>
              <h2 className="greeting">Brands Management</h2>
              
              <div className="page-content-card">
                <div className="card-header">
                  <h3>All Brands</h3>
                  <button className="btn-primary">+ Add Brand</button>
                </div>
                
                <div className="table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Brand Name</th>
                        <th>Products</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>1</td>
                        <td>Apple</td>
                        <td>25</td>
                        <td><span className="badge-success">Active</span></td>
                        <td>
                          <button className="btn-edit">Edit</button>
                          <button className="btn-delete">Delete</button>
                        </td>
                      </tr>
                      <tr>
                        <td>2</td>
                        <td>Samsung</td>
                        <td>20</td>
                        <td><span className="badge-success">Active</span></td>
                        <td>
                          <button className="btn-edit">Edit</button>
                          <button className="btn-delete">Delete</button>
                        </td>
                      </tr>
                      <tr>
                        <td>3</td>
                        <td>Nike</td>
                        <td>15</td>
                        <td><span className="badge-success">Active</span></td>
                        <td>
                          <button className="btn-edit">Edit</button>
                          <button className="btn-delete">Delete</button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {activePage === "products" && (
            <>
              <h2 className="greeting">Products Management</h2>
              
              <div className="page-content-card">
                <div className="card-header">
                  <h3>All Products</h3>
                  <button className="btn-primary">+ Add Product</button>
                </div>
                
                <div className="table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Product Name</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Stock</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>1</td>
                        <td>iPhone 15 Pro</td>
                        <td>Electronics</td>
                        <td>$999</td>
                        <td>50</td>
                        <td>
                          <button className="btn-edit">Edit</button>
                          <button className="btn-delete">Delete</button>
                        </td>
                      </tr>
                      <tr>
                        <td>2</td>
                        <td>Samsung Galaxy S24</td>
                        <td>Electronics</td>
                        <td>$899</td>
                        <td>30</td>
                        <td>
                          <button className="btn-edit">Edit</button>
                          <button className="btn-delete">Delete</button>
                        </td>
                      </tr>
                      <tr>
                        <td>3</td>
                        <td>Nike Air Max</td>
                        <td>Clothing</td>
                        <td>$120</td>
                        <td>100</td>
                        <td>
                          <button className="btn-edit">Edit</button>
                          <button className="btn-delete">Delete</button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {activePage === "users" && (
            <>
              <h2 className="greeting">Users Management</h2>
              
              <div className="page-content-card">
                <div className="card-header">
                  <h3>All Users</h3>
                  <button className="btn-primary">+ Add User</button>
                </div>
                
                <div className="table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>1</td>
                        <td>John Doe</td>
                        <td>john@example.com</td>
                        <td>User</td>
                        <td><span className="badge-success">Active</span></td>
                        <td>
                          <button className="btn-edit">Edit</button>
                          <button className="btn-delete">Delete</button>
                        </td>
                      </tr>
                      <tr>
                        <td>2</td>
                        <td>Jane Smith</td>
                        <td>jane@example.com</td>
                        <td>Admin</td>
                        <td><span className="badge-success">Active</span></td>
                        <td>
                          <button className="btn-edit">Edit</button>
                          <button className="btn-delete">Delete</button>
                        </td>
                      </tr>
                      <tr>
                        <td>3</td>
                        <td>Mike Johnson</td>
                        <td>mike@example.com</td>
                        <td>User</td>
                        <td><span className="badge-success">Active</span></td>
                        <td>
                          <button className="btn-edit">Edit</button>
                          <button className="btn-delete">Delete</button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {activePage === "orders" && (
            <>
              <h2 className="greeting">Orders Management</h2>
              
              <div className="page-content-card">
                <div className="card-header">
                  <h3>All Orders</h3>
                  <button className="btn-primary">View Reports</button>
                </div>
                
                <div className="table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Customer</th>
                        <th>Product</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Date</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>#ORD001</td>
                        <td>John Doe</td>
                        <td>iPhone 15 Pro</td>
                        <td>$999</td>
                        <td><span className="badge-warning">Pending</span></td>
                        <td>2024-01-15</td>
                        <td>
                          <button className="btn-edit">View</button>
                          <button className="btn-delete">Cancel</button>
                        </td>
                      </tr>
                      <tr>
                        <td>#ORD002</td>
                        <td>Jane Smith</td>
                        <td>Samsung Galaxy S24</td>
                        <td>$899</td>
                        <td><span className="badge-success">Completed</span></td>
                        <td>2024-01-14</td>
                        <td>
                          <button className="btn-edit">View</button>
                          <button className="btn-delete">Cancel</button>
                        </td>
                      </tr>
                      <tr>
                        <td>#ORD003</td>
                        <td>Mike Johnson</td>
                        <td>Nike Air Max</td>
                        <td>$120</td>
                        <td><span className="badge-info">Processing</span></td>
                        <td>2024-01-13</td>
                        <td>
                          <button className="btn-edit">View</button>
                          <button className="btn-delete">Cancel</button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
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

export default AdminDashboard;
