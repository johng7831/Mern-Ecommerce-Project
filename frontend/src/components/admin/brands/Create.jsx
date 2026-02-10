import React, { useState } from "react";
import API_URL from "../../../api";

const BrandCreate = ({ onBack }) => {
  const [name, setName] = useState("");

  const handleSave = async () => {
    if (!name.trim()) {
      alert("Please enter a brand name");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/admin/brand`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ name }),
      });

      if (!res.ok) throw new Error("Failed to create brand");

      onBack();
    } catch (error) {
      alert("Error creating brand");
    }
  };

  return (
    <>
      <h2 className="greeting">Create New Brand</h2>

      <div className="page-content-card">
        <div className="form-container">
          <div className="form-group">
            <label>Brand Name</label>
            <input
              type="text"
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Nike, Apple"
            />
          </div>

          <div className="form-actions" style={{ marginTop: 20 }}>
            <button className="btn-primary" onClick={handleSave}>
              Save Brand
            </button>
            <button
              className="btn-secondary"
              onClick={onBack}
              style={{ marginLeft: 10 }}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default BrandCreate;
