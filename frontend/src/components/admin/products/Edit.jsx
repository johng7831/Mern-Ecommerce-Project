import React, { useState, useEffect } from "react";
import API_URL from "../../../api";

const ProductEdit = ({ product, onBack }) => {
  const [name, setName] = useState(product?.name || "");
  const [price, setPrice] = useState(product?.price || "");
  const [stock, setStock] = useState(product?.stock || "");
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(product?.category?._id || "");
  const [selectedBrand, setSelectedBrand] = useState(product?.brand?._id || "");
  // IDs to send to backend
  const [images, setImages] = useState(product?.images?.map((img) => img._id) || []);
  // URLs to show as preview
  const [imagePreviews, setImagePreviews] = useState(
    product?.images?.map((img) =>
      img.url || `${API_URL.replace("/api", "")}/uploads/${img.filename}`
    ) || []
  );
  const [loading, setLoading] = useState(false);

  const handleRemoveImage = (indexToRemove) => {
    setImages((prev) => prev.filter((_, index) => index !== indexToRemove));
    setImagePreviews((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  // Fetch categories and brands
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        const [catRes, brandRes] = await Promise.all([
          fetch(`${API_URL}/admin/categories`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${API_URL}/admin/brands`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const catData = await catRes.json();
        const brandData = await brandRes.json();

        setCategories(catData);
        setBrands(brandData);
      } catch (error) {
        console.error("Error fetching categories or brands", error);
      }
    };
    fetchData();
  }, []);

  // Handle image upload
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    const token = localStorage.getItem("token");

    for (let file of files) {
      const formData = new FormData();
      formData.append("image", file);

      try {
        const res = await fetch(`${API_URL}/upload`, {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        // store ID for backend
        setImages((prev) => [...prev, data.id]);
        // store URL for preview
        setImagePreviews((prev) => [
          ...prev,
          data.url || `${API_URL.replace("/api", "")}/uploads/${data.filename}`,
        ]);
      } catch (err) {
        console.error("Error uploading image", err);
        alert("Image upload failed");
      }
    }
  };

  const handleUpdate = async () => {
    if (!name || !price || !selectedCategory) {
      alert("Name, price, and category are required");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_URL}/admin/product/${product._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          price,
          stock,
          category: selectedCategory,
          brand: selectedBrand,
          images,
        }),
      });

      if (!res.ok) throw new Error("Update failed");

      alert("Product updated successfully");
      onBack();
    } catch (error) {
      console.error(error);
      alert("Error updating product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-card">
      <h2>Edit Product</h2>

      <div className="form-group">
        <label>Product Name</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
      </div>

      <div className="form-group">
        <label>Price</label>
        <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
      </div>

      <div className="form-group">
        <label>Stock</label>
        <input type="number" value={stock} onChange={(e) => setStock(e.target.value)} />
      </div>

      <div className="form-group">
        <label>Category</label>
        <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>{cat.name}</option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Brand</label>
        <select value={selectedBrand} onChange={(e) => setSelectedBrand(e.target.value)}>
          <option value="">Select Brand</option>
          {brands.map((b) => (
            <option key={b._id} value={b._id}>{b.name}</option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Images</label>
        <input type="file" multiple onChange={handleImageUpload} />
        <div className="image-preview">
          {imagePreviews.map((url, index) => (
            <div key={index} className="image-preview-item">
              <img
                src={url}
                alt="preview"
                style={{ width: 60, height: 60, marginRight: 5 }}
              />
              <button
                type="button"
                className="image-remove-btn"
                onClick={() => handleRemoveImage(index)}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="form-actions">
        <button className="btn-secondary" onClick={onBack}>⬅ Back</button>
        <button className="btn-primary" onClick={handleUpdate} disabled={loading}>
          {loading ? "Updating..." : "Update Product"}
        </button>
      </div>
    </div>
  );
};

export default ProductEdit;
