import React, { useEffect, useState } from "react";
import API_URL from "../../../api";

const ProductCreate = ({ onBack }) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [productType, setProductType] = useState("normal");
  const [images, setImages] = useState([]); // will store {id, url}
  const [loading, setLoading] = useState(false);

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

    for (let file of files) {
      const formData = new FormData();
      formData.append("image", file);

      try {
        const res = await fetch(`${API_URL}/upload`, {
          method: "POST",
          body: formData,
        });
        const data = await res.json();

        // Store full object for preview
        setImages((prev) => [...prev, data]);
      } catch (err) {
        console.error("Error uploading image", err);
        alert("Image upload failed");
      }
    }
  };

  const handleRemoveImage = (indexToRemove) => {
    setImages((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleCreate = async () => {
    if (!name || !price || !selectedCategory) {
      alert("Name, price, and category are required");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_URL}/admin/product`, {
        method: "POST",
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
          images: images.map((img) => img.id), // backend expects IDs
          productType,
          isFeatured: productType === "featured",
          isActive: true,
        }),
      });

      if (!res.ok) throw new Error("Create failed");

      alert("Product created successfully");
      onBack();
    } catch (error) {
      console.error(error);
      alert("Error creating product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-card">
      <h2>Create Product</h2>

      <div className="form-group">
        <label>Product Name</label>
        <input type="text" placeholder="Enter product name" value={name} onChange={(e) => setName(e.target.value)} />
      </div>

      <div className="form-group">
        <label>Price</label>
        <input type="number" placeholder="Enter price" value={price} onChange={(e) => setPrice(e.target.value)} />
      </div>

      <div className="form-group">
        <label>Stock</label>
        <input type="number" placeholder="Enter stock" value={stock} onChange={(e) => setStock(e.target.value)} />
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
        <label>Product Type</label>
        <select
          value={productType}
          onChange={(e) => setProductType(e.target.value)}
        >
          <option value="featured">Featured Product</option>
          <option value="new">New Arrival Product</option>
        </select>
      </div>
      <div className="form-group">
        <label>Images</label>
        <input type="file" multiple onChange={handleImageUpload} />
        <div className="image-preview">
          {images.map((img, index) => (
            <div key={img.id} className="image-preview-item">
              <img
                src={img.url}
                alt="preview"
                style={{ width: 60, height: 60, marginRight: 5, objectFit: "cover" }}
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
        <button className="btn-primary" onClick={handleCreate} disabled={loading}>
          {loading ? "Saving..." : "Save Product"}
        </button>
      </div>
    </div>
  );
};

export default ProductCreate;
