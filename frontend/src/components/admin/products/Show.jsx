import React, { useEffect, useState } from "react";
import API_URL from "../../../api";

const ProductShow = ({ onAdd, onEdit }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // =========================================
  // FETCH PRODUCTS (PUBLIC API)
  // =========================================
  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_URL}/products`);
      const data = await res.json();

      const normalizedProducts = Array.isArray(data)
        ? data
        : Array.isArray(data?.data)
        ? data.data
        : [];

      setProducts(normalizedProducts);
    } catch (error) {
      console.error("Error fetching products", error);
    } finally {
      setLoading(false);
    }
  };

  // =========================================
  // DELETE PRODUCT (⚠️ still admin operation)
  // =========================================
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;

    try {
      const res = await fetch(`${API_URL}/product/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setProducts(products.filter((p) => p._id !== id));
      } else {
        alert("Failed to delete product");
      }
    } catch (error) {
      console.error("Error deleting product", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <>
      <h2 className="greeting">Product Management</h2>

      <div className="page-content-card">
        <div className="card-header">
          <h3>All Products</h3>
          <button className="btn-primary" onClick={onAdd}>
            + Add Product
          </button>
        </div>

        <div className="table-container">
          {loading ? (
            <p style={{ textAlign: "center" }}>Loading products...</p>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Brand</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Type</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {products.length > 0 ? (
                  products.map((product) => {
                    const firstImage =
                      product.images && product.images.length > 0
                        ? product.images[0]
                        : null;

                    const imageUrl = firstImage
                      ? firstImage.url ||
                        `${API_URL.replace("/api", "")}/uploads/${firstImage.filename}`
                      : "https://via.placeholder.com/60x60?text=No+Image";

                    const type =
                      product.productType ||
                      (product.isFeatured ? "featured" : "normal");

                    return (
                      <tr key={product._id}>
                        <td>
                          <img
                            src={imageUrl}
                            alt={product.name}
                            style={{
                              width: "56px",
                              height: "56px",
                              objectFit: "cover",
                              borderRadius: "8px",
                            }}
                          />
                        </td>

                        <td>{product.name}</td>
                        <td>{product.category?.name || "—"}</td>
                        <td>{product.brand?.name || "—"}</td>
                        <td>₹{Number(product.price || 0).toLocaleString()}</td>
                        <td>{product.stock}</td>

                        <td>
                          {type === "featured"
                            ? "Featured"
                            : type === "new"
                            ? "New Arrival"
                            : "Normal"}
                        </td>

                        <td>
                          <button
                            className="btn-edit"
                            onClick={() => onEdit(product)}
                          >
                            Edit
                          </button>

                          <button
                            className="btn-delete"
                            onClick={() => handleDelete(product._id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="8" style={{ textAlign: "center" }}>
                      No products available. Click "Add Product" to get
                      started.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
};

export default ProductShow;