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
  const [productType, setProductType] = useState("featured");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch categories and brands
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, brandRes] = await Promise.all([
          fetch(`${API_URL}/categories`),
          fetch(`${API_URL}/brands`),
        ]);

        const catData = await catRes.json();
        const brandData = await brandRes.json();

        setCategories(Array.isArray(catData) ? catData : catData.data || []);
        setBrands(Array.isArray(brandData) ? brandData : brandData.data || []);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  // Upload images
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);

    for (const file of files) {
      const formData = new FormData();
      formData.append("image", file);

      try {
        const res = await fetch(`${API_URL}/upload`, {
          method: "POST",
          body: formData,
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Image upload failed");
        }

        setImages((prev) => [...prev, data]);
      } catch (error) {
        console.error(error);
        alert(error.message);
      }
    }
  };

  // Remove image
  const handleRemoveImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Create Product
  const handleCreate = async () => {
    if (!name || !price || !selectedCategory) {
      alert("Name, price and category are required");
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
          price: Number(price),
          stock: Number(stock),
          category: selectedCategory,
          brand: selectedBrand || null,
          images: images.map((img) => img._id || img.id),
          productType,
          isFeatured: productType === "featured",
          isActive: true,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to create product");
      }

      alert("Product created successfully");

      setName("");
      setPrice("");
      setStock("");
      setSelectedCategory("");
      setSelectedBrand("");
      setImages([]);
      setProductType("featured");

      if (onBack) {
        onBack();
      }
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-card">
      <h2>Create Product</h2>

      <div className="form-group">
        <label>Product Name</label>
        <input
          type="text"
          placeholder="Enter product name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label>Price</label>
        <input
          type="number"
          placeholder="Enter price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label>Stock</label>
        <input
          type="number"
          placeholder="Enter stock"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label>Category</label>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">Select Category</option>

          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Brand</label>
        <select
          value={selectedBrand}
          onChange={(e) => setSelectedBrand(e.target.value)}
        >
          <option value="">Select Brand</option>

          {brands.map((brand) => (
            <option key={brand._id} value={brand._id}>
              {brand.name}
            </option>
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
        <label>Upload Images</label>

        <input
          type="file"
          multiple
          onChange={handleImageUpload}
        />

        <div
          style={{
            display: "flex",
            gap: "10px",
            marginTop: "10px",
            flexWrap: "wrap",
          }}
        >
          {images.map((img, index) => (
            <div key={index} style={{ position: "relative" }}>
              <img
                src={
                  img.url?.startsWith("http")
                    ? img.url
                    : `${API_URL.replace("/api", "")}${img.url}`
                }
                alt="preview"
                style={{
                  width: "80px",
                  height: "80px",
                  objectFit: "cover",
                  borderRadius: "5px",
                }}
              />

              <button
                type="button"
                onClick={() => handleRemoveImage(index)}
                style={{
                  position: "absolute",
                  top: "-5px",
                  right: "-5px",
                  border: "none",
                  background: "red",
                  color: "white",
                  borderRadius: "50%",
                  cursor: "pointer",
                  width: "20px",
                  height: "20px",
                }}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="form-actions">
        <button className="btn-secondary" onClick={onBack}>
          Back
        </button>

        <button
          className="btn-primary"
          onClick={handleCreate}
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Product"}
        </button>
      </div>
    </div>
  );
};

export default ProductCreate;