import React, { useEffect, useState } from "react";
import API_URL from "../../../api";

const Collectionshow = ({ onBack }) => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCollections = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_URL}/admin/collections`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch collections");
      }

      const data = await res.json();
      console.log("API Response:", data);

      // ✅ Your API clearly returns { success, data }
      setCollections(data.data || []);
    } catch (error) {
      alert(error.message || "Error fetching collections");
      setCollections([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  return (
    <div>
      <h2>Collections</h2>

      <button onClick={onBack}>Back</button>

      {loading ? (
        <p>Loading...</p>
      ) : collections.length === 0 ? (
        <p>No collections found</p>
      ) : (
        <ul>
          {collections.map((item) => (
            <li key={item._id || item.id} style={{ marginBottom: "10px" }}>
              <strong>{item.collectionTitle || "No Title"}</strong>
              <br />
              <span>{item.description || "No Description"}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Collectionshow;