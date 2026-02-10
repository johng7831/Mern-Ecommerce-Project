import React, { useState } from "react";
import API_URL from "../../../api";

const CategoryCreate = ({ onBack }) => {
  const [name, setName] = useState("");

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/admin/category`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name }),
      });

      if (!res.ok) {
        throw new Error("Failed to create category");
      }

      onBack(); // Go back to list
    } catch (error) {
      alert(error.message || "Error creating category");
    }
  };

  return (
    <>
      <h2 className="greeting">Create New Category</h2>
      <div className="page-content-card">
        <div className="card-header">
          <h3>Add Category</h3>
          <p className="card-subtitle">
            Create a category to better organize your products.
          </p>
        </div>

        <div className="form-container">
          <div className="form-group">
            <label>Category Name</label>
            <input
              type="text"
              placeholder="Enter category name..."
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="form-actions" style={{ marginTop: "20px" }}>
            <button className="btn-primary" onClick={handleSave}>
              Save Category
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

export default CategoryCreate;