import React, { useEffect, useState } from "react";
import axios from "axios";
import API_URL from "../../api";
import "../../user.css";

const Collections = () => {
  const [collections, setCollections] = useState([]);
  const token = localStorage.getItem("token");

  const fetchCollections = async () => {
    try {
      const res = await axios.get(`${API_URL}/admin/collections`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        setCollections(res.data.data);
      }
    } catch (error) {
      console.error("Error fetching collections:", error);
    }
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  return (
    <div className="collections-wrapper">
     

      <div className="collections-grid">
        {collections.map((item, index) => (
          <div
            key={item._id}
            className={`collection-item item-${index}`}
          >
            <img src={item.images[0]} alt={item.collectionTitle} />

            <div className="overlay">
              <h3>{item.collectionTitle}</h3>
              <button>Shop Now</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Collections;