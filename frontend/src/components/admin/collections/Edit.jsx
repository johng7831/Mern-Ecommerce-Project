import React, { useState, useEffect } from "react";
import API_URL from "../../../api";

const UpdateCollection = ({ collectionId, token }) => {
  const [formData, setFormData] = useState({
    collectionTitle: "",
    description: "",
    products: [],
    images: [],
    isActive: true,
  });

  // Load existing data
  useEffect(() => {
    const fetchCollection = async () => {
      try {
        const res = await fetch(
          `${API_URL}/admin/collection/${collectionId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();

        if (data.success) {
          setFormData({
            collectionTitle: data.data.collectionTitle || "",
            description: data.data.description || "",
            products: data.data.products?.map((p) => p._id) || [],
            images: data.data.images?.map((img) => img._id || img) || [],
            isActive: data.data.isActive,
          });
        }
      } catch (error) {
        console.error("Error fetching collection:", error);
      }
    };

    if (collectionId) fetchCollection();
  }, [collectionId, token]);

  // Handle input change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Submit update
  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(
        `${API_URL}/admin/collection/${collectionId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await res.json();

      if (data.success) {
        alert("Collection updated successfully ✅");
        console.log(data.data);
      } else {
        alert(data.message || "Update failed ❌");
      }
    } catch (error) {
      console.error("Update error:", error);
      alert("Something went wrong ❌");
    }
  };

  return (
    <form onSubmit={handleUpdate}>
      <h2>Update Collection</h2>

      <input
        type="text"
        name="collectionTitle"
        value={formData.collectionTitle}
        onChange={handleChange}
        placeholder="Collection Title"
      />

      <textarea
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="Description"
      />

      <input
        type="text"
        name="products"
        value={formData.products.join(",")}
        onChange={(e) =>
          setFormData({
            ...formData,
            products: e.target.value.split(","),
          })
        }
        placeholder="Product IDs (comma separated)"
      />

      <label>
        Active:
        <input
          type="checkbox"
          checked={formData.isActive}
          onChange={(e) =>
            setFormData({
              ...formData,
              isActive: e.target.checked,
            })
          }
        />
      </label>

      <button type="submit">Update Collection</button>
    </form>
  );
};

export default UpdateCollection;