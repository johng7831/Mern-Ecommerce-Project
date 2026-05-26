import React, { useState } from "react";
import API_URL from "../../../api";

const CollectionCreate = ({ onBack }) => {
  const [name, setName] = useState("");

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_URL}/admin/collection`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name }),
      });

      if (!res.ok) {
        throw new Error("Failed to create collection");
      }

      onBack(); // go back after success
    } catch (error) {
      alert(error.message || "Error creating collection");
    }
  };

  return (
    <div>
      <h2>Create Collection</h2>

      <input
        type="text"
        placeholder="Enter collection name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <br /><br />

      <button onClick={handleSave}>Save</button>
      <button onClick={onBack}>Back</button>
    </div>
  );
};

export default CollectionCreate;