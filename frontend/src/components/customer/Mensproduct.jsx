import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

import API_URL from "../../api";

const Mensproduct = () => {
  const { id } = useParams();

  const [collection, setCollection] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  // =========================================
  // FETCH SINGLE COLLECTION
  // =========================================
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

      console.log("Collection Response:", res.data);

      if (res.data.success) {
        setCollection(res.data.data);
      }

    } catch (error) {
      console.log(error);

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollection();
  }, [id]);

  // =========================================
  // LOADING
  // =========================================
  if (loading) {
    return <h2>Loading...</h2>;
  }

  // =========================================
  // NO DATA
  // =========================================
  if (!collection) {
    return <h2>No Collection Found</h2>;
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
          gridTemplateColumns:
            "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "20px",
          marginTop: "30px",
        }}
      >
        {collection.products?.map((product) => {

          const imageUrl =
            product.images?.[0]?.url ||
            "https://via.placeholder.com/300";

          return (
            <div
              key={product._id}
              style={{
                border: "1px solid #ddd",
                borderRadius: "10px",
                padding: "15px",
              }}
            >
              {/* PRODUCT IMAGE */}
              <img
                src={imageUrl}
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

              <p>${product.price}</p>

              {/* BRAND */}
              <p>
                Brand:
                {" "}
                {product.brand?.name || "N/A"}
              </p>

              {/* CATEGORY */}
              <p>
                Category:
                {" "}
                {product.category?.name || "N/A"}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Mensproduct;