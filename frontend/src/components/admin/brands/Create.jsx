import React, { useState } from "react";
import API_URL from "../../../api";

const BrandCreate = ({ onBack }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageId, setImageId] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);

  // Upload Image
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      setLoading(true);

      const res = await fetch("http://localhost:5001/api/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      const data = await res.json();

      console.log("Upload Response:", data);

      // Save image id
      setImageId(data.id);

      // Save image url for preview
      setImageUrl(data.url);

      setLoading(false);
    } catch (error) {
      console.error(error);
      alert("Image upload failed");
      setLoading(false);
    }
  };

  // Create Brand
  const handleSave = async () => {
    if (!name.trim()) {
      alert("Please enter a brand name");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/admin/brand`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          name,
          description,
          images: imageId ? [imageId] : [],
          isActive: true,
        }),
      });

      const data = await res.json();

      console.log("Brand Created:", data);

      if (!res.ok) {
        throw new Error("Failed to create brand");
      }

      alert("Brand created successfully");

      onBack();
    } catch (error) {
      console.error(error);
      alert("Error creating brand");
    }
  };

  return (
    <>
      <h2 className="greeting">Create New Brand</h2>

      <div className="page-content-card">
        <div className="form-container">

          {/* Brand Name */}
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

          {/* Description */}
          <div className="form-group">
            <label>Description</label>
            <textarea
              className="form-control"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brand description"
            />
          </div>

          {/* Image Upload */}
          <div className="form-group">
            <label>Brand Image</label>

            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
            />

            {loading && <p>Uploading...</p>}

            {/* Preview Image */}
            {imageUrl && (
              <div style={{ marginTop: 10 }}>
                <img
                  src={imageUrl}
                  alt="Brand"
                  width="120"
                  style={{
                    borderRadius: 8,
                    border: "1px solid #ddd",
                  }}
                />
              </div>
            )}
          </div>

          {/* Buttons */}
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