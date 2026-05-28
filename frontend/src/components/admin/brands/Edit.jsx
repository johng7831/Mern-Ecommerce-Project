import React, { useState } from "react";
import API_URL from "../../../api";

const BrandEdit = ({ brandData, onBack, onUpdated }) => {
  const [name, setName] = useState(brandData?.name || "");
  const [description, setDescription] = useState(
    brandData?.description || ""
  );

  // Existing image
  const [imageUrl, setImageUrl] = useState(
    brandData?.images?.[0]?.url || ""
  );

  // Uploaded image id
  const [imageId, setImageId] = useState(
    brandData?.images?.[0]?._id || ""
  );

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  // ================= IMAGE UPLOAD =================
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    try {
      setUploading(true);

      const formData = new FormData();
      formData.append("image", file);

      const token = localStorage.getItem("token");

      const res = await fetch(
        `${API_URL}/upload`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await res.json();

      console.log("Upload Response:", data);

      // Save new image id
      setImageId(data.id);

      // Save preview image url
      setImageUrl(data.url);

      alert("Image uploaded successfully");
    } catch (error) {
      console.error(error);
      alert("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  // ================= UPDATE BRAND =================
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

          body: JSON.stringify({
            name,
            description,
            images: imageId ? [imageId] : [],
            isActive: true,
          }),
        }
      );

      const data = await res.json();

      console.log("Update Response:", data);

      if (!res.ok) {
        throw new Error(
          data.message || "Update failed"
        );
      }

      alert("Brand updated successfully");

      if (onUpdated) {
        onUpdated();
      }

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

          {/* Brand Name */}
          <div className="form-group">
            <label>Brand Name</label>

            <input
              type="text"
              className="form-control"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              disabled={loading}
            />
          </div>

          {/* Description */}
          <div className="form-group">
            <label>Description</label>

            <textarea
              className="form-control"
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
              disabled={loading}
              rows={4}
              placeholder="Enter brand description"
            />
          </div>

          {/* Image Upload */}
          <div className="form-group">
            <label>Brand Image</label>

            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={uploading}
            />

            {uploading && (
              <p style={{ marginTop: 10 }}>
                Uploading image...
              </p>
            )}

            {/* Image Preview */}
            {imageUrl && (
              <div style={{ marginTop: 15 }}>
                <img
                  src={imageUrl}
                  alt={name}
                  width="120"
                  height="120"
                  style={{
                    objectFit: "cover",
                    borderRadius: "10px",
                    border: "1px solid #ddd",
                  }}
                />
              </div>
            )}
          </div>

          {/* Buttons */}
          <div
            className="form-actions"
            style={{ marginTop: 20 }}
          >
            <button
              className="btn-primary"
              onClick={handleUpdate}
              disabled={loading || uploading}
            >
              {loading
                ? "Updating..."
                : "Update Brand"}
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