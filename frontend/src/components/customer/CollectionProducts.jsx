import React, { useEffect, useState } from "react";
import axios from "axios";
import API_URL from "../../api";
import { useParams, useNavigate } from "react-router-dom";

const CollectionProducts = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [collection, setCollection] = useState(null);
  const token = localStorage.getItem("token");

  // FETCH SINGLE COLLECTION
  const fetchCollection = async () => {
    try {
      const res = await axios.get(
        `${API_URL}/admin/collection/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(res.data);

      if (res.data.success) {
        setCollection(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCollection();
  }, [id]);

  // 👉 NAVIGATE TO PRODUCT PAGE
  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  if (!collection) {
    return <h2>Loading...</h2>;
  }

  return (
    <div style={{ padding: "20px" }}>

      {/* COLLECTION TITLE */}
      <h1>{collection.collectionTitle}</h1>
      <p>{collection.description}</p>

      {/* PRODUCTS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "20px",
          marginTop: "30px",
        }}
      >
        {collection.products?.map((product) => (
          <div
            key={product._id}
            onClick={() => handleProductClick(product._id)}
            style={{
              border: "1px solid #ddd",
              borderRadius: "10px",
              padding: "15px",
              cursor: "pointer",
            }}
          >
            {/* PRODUCT IMAGE */}
            <img
              src={
                product.images?.[0]?.url ||
                "https://via.placeholder.com/300"
              }
              alt={product.name}
              style={{
                width: "100%",
                height: "250px",
                objectFit: "cover",
                borderRadius: "10px",
              }}
            />

            {/* PRODUCT INFO */}
            <h3>{product.name}</h3>
            <p>£{product.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CollectionProducts;