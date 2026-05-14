import React, { useEffect, useState } from "react";

const API_URL = "http://localhost:5001/api";

const BrandShow = ({ onAdd, onEdit }) => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  // ================= FETCH BRANDS =================
  const fetchBrands = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/admin/brands`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      // Check response first
      if (!response.ok) {
        throw new Error("Failed to fetch brands");
      }

      const data = await response.json();

      console.log("Brands API Response:", data);

      // Set brands
      setBrands(Array.isArray(data) ? data : []);
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

      if (!response.ok) {
        throw new Error("Delete failed");
      }

      alert("Brand deleted successfully");

      // Refresh list
      fetchBrands();
    } catch (error) {
      console.error("Delete Error:", error);
      alert("Failed to delete brand");
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
                  <th>Brand Name</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {brands.length > 0 ? (
                  brands.map((brand) => (
                    <tr key={brand._id}>
                      <td>{brand.name}</td>

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
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="2" style={{ textAlign: "center" }}>
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