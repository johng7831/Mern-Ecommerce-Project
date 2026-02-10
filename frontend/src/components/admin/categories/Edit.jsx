import React, { useEffect, useState } from "react";
import API_URL from "../../../api";

const CategoryEdit = ({ category, onBack }) => {
  const [name, setName] = useState(category?.name || "");

  useEffect(() => {
    setName(category?.name || "");
  }, [category]);

  const handleSave = async () => {
    if (!category?._id) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/admin/category/${category._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name }),
      });

      if (!res.ok) {
        throw new Error("Failed to update category");
      }

      onBack();
    } catch (error) {
      alert(error.message || "Error updating category");
    }
  };

  if (!category) {
    return (
      <div className="page-content-card">
        <p>No category selected.</p>
        <button className="btn-secondary" onClick={onBack}>
          Back
        </button>
      </div>
    );
  }

  return (
    <>
      <h2 className="greeting">Edit Category</h2>
      <div className="page-content-card">
        <div className="card-header">
          <h3>Modify Category Details</h3>
        </div>

        <div className="form-container">
          <div className="form-group">
            <label>Category Name</label>
            <input
              type="text"
              placeholder="Enter name..."
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="form-actions" style={{ marginTop: "20px" }}>
            <button className="btn-primary" onClick={handleSave}>
              Update Category
            </button>
            <button
              className="btn-secondary"
              onClick={onBack}
              style={{ marginLeft: "10px" }}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CategoryEdit;