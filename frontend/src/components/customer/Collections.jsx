import React, { useEffect, useState } from "react";
import axios from "axios";
import API_URL from "../../api";
import "../../user.css";

import { useNavigate } from "react-router-dom";

const Collections = () => {
  const [collections, setCollections] = useState([]);

  const token = localStorage.getItem("token");

  const navigate = useNavigate();

  // =========================================
  // FETCH COLLECTIONS
  // =========================================
  const fetchCollections = async () => {
    try {
      const res = await axios.get(
        `${API_URL}/admin/collections`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(res.data);

      if (res.data.success) {
        setCollections(res.data.data);
      }

    } catch (error) {
      console.error(
        "Error fetching collections:",
        error
      );
    }
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  // =========================================
  // GO TO COLLECTION PRODUCTS PAGE
  // =========================================
  const handleCollectionClick = (collectionId) => {
    navigate(`/collection/${collectionId}`);
  };

  return (
    <div className="collections-wrapper">

      <div className="collections-grid">

        {collections.map((item, index) => (

          <div
            key={item._id}
            className={`collection-item item-${index}`}
            onClick={() =>
              handleCollectionClick(item._id)
            }
            style={{ cursor: "pointer" }}
          >
            {/* COLLECTION IMAGE */}
            <img
              src={
                item.images?.[0]?.url ||
                item.images?.[0] ||
                "https://via.placeholder.com/300"
              }
              alt={item.collectionTitle}
            />

            {/* OVERLAY */}
            <div className="overlay">
              <h3>{item.collectionTitle}</h3>

              <button>
                Shop Now
              </button>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};

export default Collections;