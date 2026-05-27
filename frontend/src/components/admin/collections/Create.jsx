import React, { useState } from "react";
import API_URL from "../../../api";

const CollectionCreate = ({ onBack }) => {
  const [collectionTitle, setCollectionTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  // =========================
  // HANDLE IMAGE SELECT
  // =========================
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
  };

  // =========================
  // SAVE COLLECTION
  // =========================
  const handleSave = async () => {
    if (!collectionTitle.trim()) {
      alert("Collection title is required");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const formData = new FormData();
      formData.append("collectionTitle", collectionTitle);
      formData.append("description", description);
      formData.append("isActive", isActive);

      // append images if selected
      images.forEach((img) => {
        formData.append("images", img);
      });

      const res = await fetch(`${API_URL}/admin/collection`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to create collection");
      }

      alert("Collection created successfully");

      // reset form
      setCollectionTitle("");
      setDescription("");
      setImages([]);
      setIsActive(true);

      onBack();
    } catch (error) {
      alert(error.message || "Error creating collection");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Create Collection</h2>

      {/* TITLE */}
      <input
        type="text"
        placeholder="Enter collection title"
        value={collectionTitle}
        onChange={(e) => setCollectionTitle(e.target.value)}
        style={{ display: "block", marginBottom: "10px", padding: "8px" }}
      />

      {/* DESCRIPTION */}
      <textarea
        placeholder="Enter description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={4}
        cols={40}
        style={{ display: "block", marginBottom: "10px", padding: "8px" }}
      />

      {/* ACTIVE */}
      <label style={{ display: "block", marginBottom: "10px" }}>
        <input
          type="checkbox"
          checked={isActive}
          onChange={(e) => setIsActive(e.target.checked)}
        />
        {" "}Active
      </label>

      {/* IMAGE UPLOAD */}
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleImageChange}
        style={{ display: "block", marginBottom: "10px" }}
      />

      {/* IMAGE PREVIEW */}
      {images.length > 0 && (
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          {images.map((img, index) => (
            <img
              key={index}
              src={URL.createObjectURL(img)}
              alt="preview"
              style={{
                width: "60px",
                height: "60px",
                objectFit: "cover",
                borderRadius: "6px",
                border: "1px solid #ccc",
              }}
            />
          ))}
        </div>
      )}

      <br />

      {/* BUTTONS */}
      <button onClick={handleSave} disabled={loading}>
        {loading ? "Saving..." : "Save"}
      </button>

      <button onClick={onBack} style={{ marginLeft: "10px" }}>
        Back
      </button>
    </div>
  );
};

export default CollectionCreate;