import React, { useEffect, useState } from "react";

// Make sure API_URL ends with a slash
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5001/api/";

const BrandShow = ({ onAdd, onEdit }) => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all brands
  const fetchBrands = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found. Please login first.");
      setBrands([]);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_URL}admin/brands`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to fetch brands");
      }

      const data = await res.json();
      console.log("API response:", data);

      // Adjust this if your backend wraps data
      setBrands(data.data || data); 
    } catch (error) {
      console.error("Error fetching brands:", error);
      setBrands([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  // Delete a brand
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this brand?")) return;

    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to delete a brand");
      return;
    }

    try {
      const res = await fetch(`${API_URL}admin/brand/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Delete failed");
      }

      alert("Brand deleted successfully");
      fetchBrands(); // Refresh list
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete brand");
    }
  };

  return (
    <>
      <h2 className="greeting">Brand Management</h2>

      <div className="page-content-card">
        <div className="card-header">
          <h3>All Brands</h3>
          <button className="btn-primary" onClick={onAdd}>
            + Add Brand
          </button>
        </div>

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
    </>
  );
};

export default BrandShow;
