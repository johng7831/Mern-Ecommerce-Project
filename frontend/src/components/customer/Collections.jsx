import React, { useEffect, useState } from "react";
import axios from "axios";
import API_URL from "../../api";
import "../../user.css";
import { useNavigate } from "react-router-dom";

const Collections = () => {
  const [collections, setCollections] = useState([]);
  const navigate = useNavigate();

  // =========================================
  // FETCH COLLECTIONS (PUBLIC API)
  // =========================================
  const fetchCollections = async () => {
    try {
      const res = await axios.get(`${API_URL}/collections`);

      console.log(res.data);

      // API format: { success, data }
      if (res.data?.success) {
        setCollections(res.data.data || []);
      } else {
        setCollections([]);
      }
    } catch (error) {
      console.error(
        "Error fetching collections:",
        error.response?.data || error.message
      );
    }
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  // =========================================
  // NAVIGATE TO COLLECTION PAGE
  // =========================================
  const handleCollectionClick = (collectionId) => {
    navigate(`/collection/${collectionId}`);
  };

  return (
    <div className="collections-wrapper">
      <div className="collections-grid">

        {collections.length > 0 ? (
          collections.map((item, index) => (
            <div
              key={item._id}
              className={`collection-item item-${index}`}
              onClick={() => handleCollectionClick(item._id)}
              style={{ cursor: "pointer" }}
            >
              {/* IMAGE */}
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
                <button>Shop Now</button>
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

export default Collections;