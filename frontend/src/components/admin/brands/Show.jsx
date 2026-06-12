import React, { useEffect, useState } from "react";
import API_URL from "../../../api";

const BrandShow = ({ onAdd, onEdit }) => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  // ================= FETCH BRANDS =================
  const fetchBrands = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/brands`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Failed to fetch brands");
      }
      console.log("Brands API Response:", result);
      setBrands(result.data || []);
    } catch (error) {
      console.error("Fetch Brand Error:", error);
      setBrands([]);
    } finally {
      setLoading(false);
    }
  };
  // ================= DELETE BRAND =================
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this brand?"
    );
    if (!confirmDelete) return;
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/admin/brand/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Delete failed");
      }
      alert("Brand deleted successfully");
      fetchBrands();
    } catch (error) {
      console.error("Delete Error:", error);
      alert(error.message || "Failed to delete brand");
    }
  };

  // ================= USE EFFECT =================
  useEffect(() => {
    fetchBrands();
  }, []);
  return (
    <div>
      <h2 className="greeting">Brand Management</h2>
      <div className="page-content-card">
        {/* Header */}
        <div className="card-header">
          <h3>All Brands</h3>
          <button className="btn-primary" onClick={onAdd}>
            + Add Brand
          </button>
        </div>
        {/* Table */}
        <div className="table-container">
          {loading ? (
            <p style={{ textAlign: "center" }}>Loading brands...</p>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Brand Name</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {brands.length > 0 ? (
                  brands.map((brand) => (
                    <tr key={brand._id}>
                      {/* Image */}
                      <td>
                        {brand.images?.length > 0 && brand.images[0] ? (
                          <img
                            src={brand.images[0].url || brand.images[0]}
                            alt={brand.name}
                            width="60"
                            height="60"
                            style={{
                              objectFit: "cover",
                              borderRadius: "8px",
                              border: "1px solid #ddd",
                            }}
                          />
                        ) : (
                          "No Image"
                        )}
                      </td>
                      {/* Name */}
                      <td>{brand.name}</td>
                      {/* Description */}
                      <td>{brand.description || "-"}</td>
                      {/* Status */}
                      <td>
                        {brand.isActive ? (
                          <span style={{ color: "green" }}>Active</span>
                        ) : (
                          <span style={{ color: "red" }}>Inactive</span>
                        )}
                      </td>
                      {/* Actions */}
                      <td>
                        <button
                          className="btn-edit"
                          onClick={() => onEdit(brand)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn-delete"
                          onClick={() => handleDelete(brand._id)}
                          style={{ marginLeft: "10px" }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" style={{ textAlign: "center" }}>
                      No brands found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default BrandShow;