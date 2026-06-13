import React, { useEffect, useState } from "react";
import axios from "axios";
import API_URL from "../../../api";

const CollectionPage = () => {
  // =========================================
  // STATES
  // =========================================
  const [collections, setCollections] = useState([]);
  const [products, setProducts] = useState([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [selectedImage, setSelectedImage] = useState(null);

  // selected product ids
  const [selectedProducts, setSelectedProducts] = useState([]);

  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  // =========================================
  // FETCH COLLECTIONS
  // =========================================
  const fetchCollections = async () => {
    try {
      const res = await axios.get(
        `${API_URL}/admin/collection`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Collections:", res.data);

      setCollections(
        res.data.data ||
        res.data.collections ||
        res.data ||
        []
      );

    } catch (error) {
      console.log(error);
    }
  };

  // =========================================
  // FETCH PRODUCTS
  // =========================================
  const fetchProducts = async () => {
    try {
      const res = await axios.get(
        `${API_URL}/products`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Products:", res.data);

      setProducts(
        res.data.data ||
        res.data.products ||
        res.data ||
        []
      );

    } catch (error) {
      console.log(error);
    }
  };

  // =========================================
  // LOAD DATA
  // =========================================
  useEffect(() => {
    fetchCollections();
    fetchProducts();
  }, []);

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

      console.log("Upload:", response.data);

      return response.data.id;

    } catch (error) {
      console.log(error);
      return null;
    }
  };

  // =========================================
  // SELECT PRODUCT
  // =========================================
  const handleProductSelect = (productId) => {
    if (selectedProducts.includes(productId)) {

      setSelectedProducts(
        selectedProducts.filter(
          (id) => id !== productId
        )
      );

    } else {

      setSelectedProducts([
        ...selectedProducts,
        productId,
      ]);

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

      // upload image first
      if (selectedImage) {
        imageId = await uploadImage(selectedImage);
      }

      // payload
      const payload = {
        collectionTitle: title,
        description,
        images: imageId ? [imageId] : [],
        products: selectedProducts,
        isActive: true,
      };

      console.log("Payload:", payload);

      const res = await axios.post(
        `${API_URL}/admin/collection`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Create Collection:", res.data);

      alert("Collection Created Successfully");

      // reset form
      setTitle("");
      setDescription("");
      setSelectedImage(null);
      setSelectedProducts([]);

      // refresh collections
      fetchCollections();

    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        padding: "20px",
        fontFamily: "Arial",
      }}
    >
      {/* ========================================= */}
      {/* CREATE COLLECTION */}
      {/* ========================================= */}

      <h1>Create Collection</h1>

      <form onSubmit={handleSubmit}>

        {/* TITLE */}
        <div style={{ marginBottom: "15px" }}>
          <input
            type="text"
            placeholder="Collection Title"
            value={title}
            onChange={(e) =>
              setTitle(e.target.value)
            }
            required
            style={{
              width: "400px",
              padding: "10px",
            }}
          />
        </div>

        {/* DESCRIPTION */}
        <div style={{ marginBottom: "15px" }}>
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) =>
              setDescription(e.target.value)
            }
            rows="4"
            style={{
              width: "400px",
              padding: "10px",
            }}
          />
        </div>

        {/* IMAGE */}
        <div style={{ marginBottom: "15px" }}>
          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setSelectedImage(e.target.files[0])
            }
          />
        </div>

        {/* ========================================= */}
        {/* PRODUCTS DROPDOWN */}
        {/* ========================================= */}

        <div style={{ marginBottom: "20px" }}>
          <h3>Select Products</h3>

          <div
            style={{
              width: "500px",
              border: "1px solid #ccc",
              borderRadius: "8px",
              padding: "10px",
              maxHeight: "350px",
              overflowY: "auto",
              background: "#fff",
            }}
          >
            {products.length > 0 ? (
              products.map((product) => (
                <div
                  key={product._id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "10px",
                    borderBottom: "1px solid #eee",
                  }}
                >
                  {/* CHECKBOX */}
                  <input
                    type="checkbox"
                    checked={selectedProducts.includes(
                      product._id
                    )}
                    onChange={() =>
                      handleProductSelect(
                        product._id
                      )
                    }
                  />

                  {/* PRODUCT IMAGE */}
                  <img
                    src={
                      product.images?.[0]?.url ||
                      "https://via.placeholder.com/50"
                    }
                    alt={product.name}
                    style={{
                      width: "60px",
                      height: "60px",
                      objectFit: "cover",
                      borderRadius: "6px",
                      border: "1px solid #ddd",
                    }}
                  />

                  {/* PRODUCT INFO */}
                  <div>
                    <h4
                      style={{
                        margin: 0,
                        fontSize: "15px",
                      }}
                    >
                      {product.name}
                    </h4>

                    <p
                      style={{
                        margin: "5px 0 0",
                        color: "#666",
                      }}
                    >
                      Price: ${product.price}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p>No products found</p>
            )}
          </div>
        </div>

        {/* SUBMIT BUTTON */}
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "12px 20px",
            background: "black",
            color: "white",
            border: "none",
            cursor: "pointer",
            borderRadius: "5px",
          }}
        >
          {loading
            ? "Creating..."
            : "Create Collection"}
        </button>
      </form>

      {/* ========================================= */}
      {/* COLLECTION LIST */}
      {/* ========================================= */}

      <div style={{ marginTop: "50px" }}>
        <h2>Collections</h2>

        {collections.length > 0 ? (
          collections.map((collection) => (
            <div
              key={collection._id}
              style={{
                border: "1px solid #ddd",
                borderRadius: "10px",
                padding: "20px",
                marginBottom: "20px",
              }}
            >
              <h3>
                {collection.collectionTitle}
              </h3>

              <p>{collection.description}</p>

              {/* COLLECTION PRODUCTS */}
              <div>
                <h4>Products</h4>

                {collection.products?.length > 0 ? (
                  collection.products.map(
                    (product) => (
                      <div
                        key={product._id}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                          marginBottom: "10px",
                        }}
                      >
                        <img
                          src={
                            product.images?.[0]
                              ?.url ||
                            "https://via.placeholder.com/50"
                          }
                          alt={product.name}
                          style={{
                            width: "50px",
                            height: "50px",
                            objectFit: "cover",
                            borderRadius: "5px",
                          }}
                        />

                        <div>
                          <p
                            style={{
                              margin: 0,
                              fontWeight: "bold",
                            }}
                          >
                            {product.name}
                          </p>

                          <small>
                            ${product.price}
                          </small>
                        </div>
                      </div>
                    )
                  )
                ) : (
                  <p>No products in collection</p>
                )}
              </div>
            </div>
          ))
        ) : (
          <p>No collections found</p>
        )}
      </div>
    </div>
  );
};

export default CollectionPage;