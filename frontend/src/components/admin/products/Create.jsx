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

  // =============================
  // VARIANTS
  // =============================
  const [variants, setVariants] = useState([]);
  const [variantSize, setVariantSize] = useState("");
  const [variantColor, setVariantColor] = useState("");
  const [variantPrice, setVariantPrice] = useState("");
  const [variantStock, setVariantStock] = useState("");

  // Fetch categories and brands on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, brandRes] = await Promise.all([
          fetch(`${API_URL}/categories`),
          fetch(`${API_URL}/brands`),
        ]);

        const catData = await catRes.json();
        const brandData = await brandRes.json();

        setCategories(
          Array.isArray(catData) ? catData : catData.data || []
        );
        setBrands(
          Array.isArray(brandData) ? brandData : brandData.data || []
        );
      } catch (error) {
        console.error("Error fetching initial data:", error);
      }
    };

    fetchData();
  }, []);

  // =============================
  // IMAGE UPLOAD HANDLERS
  // =============================
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
          throw new Error(data.message || "Failed to upload image");
        }

        setImages((prev) => [...prev, data]);
      } catch (error) {
        alert(error.message);
      }
    }
  };

  const handleRemoveImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  // =============================
  // VARIANT HANDLERS
  // =============================
  const handleAddVariant = () => {
    if (!variantSize || !variantColor || !variantPrice || !variantStock) {
      alert("Size, color, price, and stock are all required.");
      return;
    }

    const newVariant = {
      size: variantSize,
      color: variantColor,
      price: Number(variantPrice),
      stock: Number(variantStock),
    };

    setVariants((prev) => [...prev, newVariant]);

    // Reset variant input fields
    setVariantSize("");
    setVariantColor("");
    setVariantPrice("");
    setVariantStock("");
  };

  const handleRemoveVariant = (index) => {
    setVariants((prev) => prev.filter((_, i) => i !== index));
  };

  // =============================
  // CREATE PRODUCT HANDLER
  // =============================
  const handleCreate = async () => {
    if (!name || !price || !selectedCategory) {
      alert("Name, price, and category are required.");
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
          variants,
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

      // Reset Form
      setName("");
      setPrice("");
      setStock("");
      setVariants([]);
      setImages([]);
      setSelectedCategory("");
      setSelectedBrand("");
      setProductType("featured");

      if (onBack) {
        onBack();
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-card">
      <h2>Create Product</h2>

      {/* Product Basic Info */}
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
          placeholder="Enter stock total"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
        />
      </div>

      {/* Dropdowns */}
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

      {/* Variants Section */}
      <div className="form-group">
        <h3>Add Variants</h3>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "10px" }}>
          <input
            placeholder="Size (S, M, L)"
            value={variantSize}
            onChange={(e) => setVariantSize(e.target.value)}
          />
          <input
            placeholder="Color"
            value={variantColor}
            onChange={(e) => setVariantColor(e.target.value)}
          />
          <input
            type="number"
            placeholder="Variant Price"
            value={variantPrice}
            onChange={(e) => setVariantPrice(e.target.value)}
          />
          <input
            type="number"
            placeholder="Variant Stock"
            value={variantStock}
            onChange={(e) => setVariantStock(e.target.value)}
          />
          <button type="button" onClick={handleAddVariant}>
            Add Variant
          </button>
        </div>

        {/* List Added Variants */}
        {variants.map((item, index) => (
          <div
            key={index}
            style={{
              border: "1px solid #ddd",
              padding: "10px",
              marginBottom: "10px",
              borderRadius: "4px",
            }}
          >
            <p><strong>Size:</strong> {item.size}</p>
            <p><strong>Color:</strong> {item.color}</p>
            <p><strong>Price:</strong> ₹{item.price}</p>
            <p><strong>Stock:</strong> {item.stock}</p>
            <button type="button" onClick={() => handleRemoveVariant(index)}>
              Remove
            </button>
          </div>
        ))}
      </div>

      {/* Product Type Selection */}
      <div className="form-group">
        <label>Product Type</label>
        <select
          value={productType}
          onChange={(e) => setProductType(e.target.value)}
        >
          <option value="featured">Featured Product</option>
          <option value="new">New Arrival</option>
        </select>
      </div>

      {/* Image Upload Section */}
      <div className="form-group">
        <label>Upload Images</label>
        <input type="file" multiple onChange={handleImageUpload} />

        <div style={{ display: "flex", gap: "10px", marginTop: "10px", flexWrap: "wrap" }}>
          {images.map((img, index) => (
            <div key={index} style={{ position: "relative" }}>
              <img
                src={
                  img.url?.startsWith("http")
                    ? img.url
                    : `${API_URL.replace("/api", "")}${img.url}`
                }
                alt={`preview-${index}`}
                style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "4px" }}
              />
              <button
                type="button"
                onClick={() => handleRemoveImage(index)}
                style={{
                  position: "absolute",
                  top: "2px",
                  right: "2px",
                  background: "rgba(255,0,0,0.8)",
                  color: "#fff",
                  border: "none",
                  borderRadius: "50%",
                  cursor: "pointer",
                  width: "20px",
                  height: "20px",
                  lineHeight: "18px",
                  textAlign: "center",
                  padding: 0
                }}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Form Action Buttons */}
      <div className="form-actions" style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
        <button type="button" className="btn-secondary" onClick={onBack}>
          Back
        </button>
        <button
          type="button"
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