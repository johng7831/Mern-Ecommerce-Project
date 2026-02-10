import React, { useEffect, useState } from "react";
import API_URL from "../../../api";

const ProductShow = ({ onAdd, onEdit }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/admin/products`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products", error);
    } finally {
      setLoading(false);
    }
  };

  // DELETE PRODUCT
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/admin/product/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        setProducts(products.filter((p) => p._id !== id));
      } else {
        alert("Failed to delete product");
      }
    } catch (error) {
      console.error("Error deleting product", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Fetching inventory...</p>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <header className="admin-header">
        <div className="header-text">
          <h1>Product Management</h1>
          <p>View and manage your store inventory</p>
        </div>
        <button className="btn-add" onClick={onAdd}>
          <span className="plus-icon">+</span> Add Product
        </button>
      </header>

      <div className="table-wrapper">
        {products.length === 0 ? (
          <div className="empty-state">
            <p>No products available. Click "Add Product" to get started.</p>
          </div>
        ) : (
          <table className="custom-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Product</th>
                <th>Category</th>
                <th>Brand</th>
                <th>Price</th>
                <th>Stock</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {products.map((product) => {
                const imageUrl =
                  product.images?.length > 0
                    ? `${API_URL.replace("/api", "")}/${product.images[0].path}`
                    : "https://via.placeholder.com/60x60?text=No+Image";

                return (
                  <tr key={product._id}>
                    {/* IMAGE */}
                    <td>
                      <img
                        src={imageUrl}
                        alt={product.name}
                        style={{
                          width: "60px",
                          height: "60px",
                          objectFit: "cover",
                          borderRadius: "6px",
                        }}
                      />
                    </td>

                    {/* NAME */}
                    <td className="product-name-cell">{product.name}</td>

                    {/* CATEGORY */}
                    <td>
                      {product.category?.name || (
                        <span style={{ color: "#999" }}>—</span>
                      )}
                    </td>

                    {/* BRAND */}
                    <td>
                      {product.brand?.name || (
                        <span style={{ color: "#999" }}>—</span>
                      )}
                    </td>

                    {/* PRICE */}
                    <td className="price-cell">
                      ₹{product.price.toLocaleString()}
                    </td>

                    {/* STOCK */}
                    <td>
                      <span
                        className={`badge ${
                          product.stock <= 5 ? "badge-low" : "badge-good"
                        }`}
                      >
                        {product.stock} Units
                      </span>
                    </td>

                    {/* ACTIONS */}
                    <td className="text-right">
                      <button
                        className="btn-edit-outline"
                        onClick={() => onEdit(product)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn-delete-outline"
                        onClick={() => handleDelete(product._id)}
                        style={{
                          color: "red",
                          marginLeft: "10px",
                          cursor: "pointer",
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ProductShow;
