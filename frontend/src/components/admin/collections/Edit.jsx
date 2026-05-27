import React, { useEffect, useState } from "react";
import API_URL from "../../../api";

const EditCollection = ({ collection, onBack }) => {
  const [collectionTitle, setCollectionTitle] = useState(
    collection?.collectionTitle || ""
  );

  const [description, setDescription] = useState(
    collection?.description || ""
  );

  // PRODUCT IDS
  const [products, setProducts] = useState(
    collection?.products?.map((item) =>
      typeof item === "object" ? item._id : item
    ) || []
  );

  // IMAGE IDS
  const [images, setImages] = useState(
    collection?.imageObjects?.map((img) => img._id) || []
  );

  // IMAGE PREVIEW URLS
  const [imagePreviews, setImagePreviews] = useState(
    collection?.images || []
  );

  const [allProducts, setAllProducts] = useState([]);

  const [isActive, setIsActive] = useState(
    collection?.isActive ?? true
  );

  const [loading, setLoading] = useState(false);

  // ============================================
  // FETCH PRODUCTS
  // ============================================

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_URL}/admin/products`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      setAllProducts(data.data || []);
    } catch (error) {
      console.error("Error fetching products", error);
    }
  };

  // ============================================
  // HANDLE PRODUCT SELECT
  // ============================================

  const handleProductSelect = (productId) => {
    setProducts((prev) => {
      const exists = prev.includes(productId);

      if (exists) {
        return prev.filter((id) => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
  };

  // ============================================
  // HANDLE IMAGE UPLOAD
  // ============================================

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);

    for (let file of files) {
      const formData = new FormData();

      formData.append("image", file);

      try {
        const res = await fetch(`${API_URL}/upload`, {
          method: "POST",
          body: formData,
        });

        const data = await res.json();

        // SAVE IMAGE ID
        setImages((prev) => [...prev, data.id]);

        // SAVE IMAGE PREVIEW URL
        setImagePreviews((prev) => [
          ...prev,
          data.url ||
            `${API_URL.replace("/api", "")}/uploads/${data.filename}`,
        ]);
      } catch (error) {
        console.error("Image upload error", error);
        alert("Image upload failed");
      }
    }
  };

  // ============================================
  // REMOVE IMAGE
  // ============================================

  const handleRemoveImage = (indexToRemove) => {
    setImages((prev) =>
      prev.filter((_, index) => index !== indexToRemove)
    );

    setImagePreviews((prev) =>
      prev.filter((_, index) => index !== indexToRemove)
    );
  };

  // ============================================
  // HANDLE UPDATE
  // ============================================

  const handleUpdate = async () => {
    if (!collectionTitle) {
      alert("Collection title is required");
      return;
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      console.log({
        collectionTitle,
        description,
        images,
        products,
        isActive,
      });

      const res = await fetch(
        `${API_URL}/admin/collection/${collection._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            collectionTitle,
            description,
            images,
            products,
            isActive,
          }),
        }
      );

      const data = await res.json();

      console.log(data);

      if (!res.ok) {
        throw new Error(data.message || "Update failed");
      }

      alert("Collection updated successfully");

      onBack();
    } catch (error) {
      console.error(error);
      alert(error.message || "Error updating collection");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-card">
      <h2>Edit Collection</h2>

      {/* COLLECTION TITLE */}
      <div className="form-group">
        <label>Collection Title</label>

        <input
          type="text"
          value={collectionTitle}
          onChange={(e) => setCollectionTitle(e.target.value)}
        />
      </div>

      {/* DESCRIPTION */}
      <div className="form-group">
        <label>Description</label>

        <textarea
          rows="4"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      {/* ACTIVE */}
      <div className="form-group">
        <label>
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
          />

          Active
        </label>
      </div>

      {/* PRODUCTS */}
      <div className="form-group">
        <label>Select Products</label>

        <div
          style={{
            maxHeight: "250px",
            overflowY: "auto",
            border: "1px solid #ddd",
            padding: "10px",
            borderRadius: "8px",
          }}
        >
          {allProducts.map((product) => (
            <div key={product._id}>
              <label>
                <input
                  type="checkbox"
                  checked={products.includes(product._id)}
                  onChange={() => handleProductSelect(product._id)}
                />

                {product.name}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* IMAGES */}
      <div className="form-group">
        <label>Collection Images</label>

        <input
          type="file"
          multiple
          onChange={handleImageUpload}
        />

        <div
          style={{
            display: "flex",
            gap: "10px",
            flexWrap: "wrap",
            marginTop: "10px",
          }}
        >
          {imagePreviews.map((img, index) => (
            <div
              key={index}
              className="image-preview-item"
              style={{
                position: "relative",
              }}
            >
              <img
                src={img}
                alt="collection"
                style={{
                  width: 70,
                  height: 70,
                  objectFit: "cover",
                  borderRadius: "6px",
                  border: "1px solid #ddd",
                }}
              />

              <button
                type="button"
                onClick={() => handleRemoveImage(index)}
                style={{
                  position: "absolute",
                  top: "-5px",
                  right: "-5px",
                  background: "red",
                  color: "#fff",
                  border: "none",
                  borderRadius: "50%",
                  width: "20px",
                  height: "20px",
                  cursor: "pointer",
                }}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* ACTIONS */}
      <div className="form-actions">
        <button
          className="btn-secondary"
          onClick={onBack}
        >
          ⬅ Back
        </button>

        <button
          className="btn-primary"
          onClick={handleUpdate}
          disabled={loading}
        >
          {loading ? "Updating..." : "Update Collection"}
        </button>
      </div>
    </div>
  );
};

export default EditCollection;