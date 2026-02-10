import React, { useState } from "react";
import API_URL from "../../../api";

const BrandEdit = ({ brandData, onBack, onUpdated }) => {
  const [name, setName] = useState(brandData?.name || "");
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    if (!name.trim()) {
      alert("Brand name is required");
      return;
    }

    if (!brandData?._id) {
      alert("Invalid brand");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        `${API_URL}/admin/brand/${brandData._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ name }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Update failed");
      }

      alert("Brand updated successfully");

      if (onUpdated) onUpdated();
      onBack();
    } catch (error) {
      console.error("Update error:", error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h2 className="greeting">Edit Brand</h2>

      <div className="page-content-card">
        <div className="form-container">
          <div className="form-group">
            <label>Brand Name</label>
            <input
              type="text"
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="form-actions" style={{ marginTop: 20 }}>
            <button
              className="btn-primary"
              onClick={handleUpdate}
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Brand"}
            </button>

            <button
              className="btn-secondary"
              onClick={onBack}
              style={{ marginLeft: 10 }}
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default BrandEdit;
