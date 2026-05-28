import React, { useState, useEffect } from "react";
import API_URL from "../../../api";

const ProductEdit = ({ product, onBack }) => {
  const [name, setName] = useState(product?.name || "");
  const [price, setPrice] = useState(product?.price || "");
  const [stock, setStock] = useState(product?.stock || "");

  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState(
    product?.category?._id || ""
  );

  const [selectedBrand, setSelectedBrand] = useState(
    product?.brand?._id || ""
  );

  const [images, setImages] = useState(
    product?.images?.map((img) => img._id) || []
  );

  const [imagePreviews, setImagePreviews] = useState(
    product?.images?.map((img) => img.url) || []
  );

  const [productType, setProductType] = useState(
    product?.productType ||
      (product?.isFeatured ? "featured" : "new")
  );

  const [loading, setLoading] = useState(false);

  // ================= FETCH CATEGORIES + BRANDS =================
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

        // ✅ FIX HERE
        setCategories(catData.data || []);
        setBrands(brandData.data || []);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchData();
  }, []);

  // ================= IMAGE UPLOAD =================
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

        setImages((prev) => [...prev, data.id]);
        setImagePreviews((prev) => [...prev, data.url]);
      } catch (err) {
        console.error(err);
        alert("Image upload failed");
      }
    }
  };

  // ================= REMOVE IMAGE =================
  const handleRemoveImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // ================= UPDATE PRODUCT =================
  const handleUpdate = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const res = await fetch(
        `${API_URL}/admin/product/${product._id}`,
        {
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
            brand: selectedBrand || null, // ✅ BRAND ADDED
            images,
            productType,
            isFeatured: productType === "featured",
            isActive: true,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

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

      {/* NAME */}
      <div className="form-group">
        <label>Product Name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      {/* PRICE */}
      <div className="form-group">
        <label>Price</label>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
      </div>

      {/* STOCK */}
      <div className="form-group">
        <label>Stock</label>
        <input
          type="number"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
        />
      </div>

      {/* CATEGORY */}
      <div className="form-group">
        <label>Category</label>
        <select
          value={selectedCategory}
          onChange={(e) =>
            setSelectedCategory(e.target.value)
          }
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* BRAND (FIXED) */}
      <div className="form-group">
        <label>Brand</label>
        <select
          value={selectedBrand}
          onChange={(e) =>
            setSelectedBrand(e.target.value)
          }
        >
          <option value="">Select Brand</option>
          {brands.map((b) => (
            <option key={b._id} value={b._id}>
              {b.name}
            </option>
          ))}
        </select>
      </div>

      {/* PRODUCT TYPE */}
      <div className="form-group">
        <label>Product Type</label>
        <select
          value={productType}
          onChange={(e) =>
            setProductType(e.target.value)
          }
        >
          <option value="featured">
            Featured Product
          </option>
          <option value="new">New Product</option>
        </select>
      </div>

      {/* IMAGES */}
      <div className="form-group">
        <label>Images</label>
        <input
          type="file"
          multiple
          onChange={handleImageUpload}
        />

        <div className="image-preview">
          {imagePreviews.map((url, index) => (
            <div key={index}>
              <img
                src={url}
                width={60}
                height={60}
              />
              <button
                onClick={() =>
                  handleRemoveImage(index)
                }
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* ACTIONS */}
      <div className="form-actions">
        <button onClick={onBack}>Back</button>
        <button
          onClick={handleUpdate}
          disabled={loading}
        >
          {loading
            ? "Updating..."
            : "Update Product"}
        </button>
      </div>
    </div>
  );
};

export default ProductEdit;