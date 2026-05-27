import React, { useState } from "react";
import axios from "axios";
import API_URL from "../../../api";

const CollectionPage = () => {
  const [collections, setCollections] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  // =========================================
  // FETCH COLLECTIONS (FIXED: added function)
  // =========================================
  const fetchCollections = async () => {
    try {
      const res = await axios.get(`${API_URL}/admin/collection`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCollections(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  // =========================================
// UPLOAD IMAGE
// =========================================
const uploadImage = async (file) => {
  try {
    const formData = new FormData();
    formData.append("image", file);

    const response = await axios.post(
      `${API_URL}/upload`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data.id;
  } catch (error) {
    console.log(error);
    return null;
  }
};

  // =========================================
  // CREATE COLLECTION
  // =========================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      let imageId = null;

      // Upload image first
      if (selectedImage) {
        imageId = await uploadImage(selectedImage);
      }

      const payload = {
        collectionTitle: title,
        description,
        images: imageId ? [imageId] : [],
        isActive: true,
      };

      const res = await axios.post(
        `${API_URL}/admin/collection`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(res.data); // FIXED (was response.data)

      alert("Collection Created Successfully");

      // Reset form
      setTitle("");
      setDescription("");
      setSelectedImage(null);

      // Refresh collections
      fetchCollections();

    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Create Collection</h1>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "15px" }}>
          <input
            type="text"
            placeholder="Collection Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={{
              width: "300px",
              padding: "10px",
            }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="4"
            style={{
              width: "300px",
              padding: "10px",
            }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setSelectedImage(e.target.files[0])}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "10px 20px",
            cursor: "pointer",
          }}
        >
          {loading ? "Creating..." : "Create Collection"}
        </button>
      </form>
    </div>
  );
};

export default CollectionPage;