import React, { useState } from "react";
import API_URL from "../../../api";

const CollectionCreate = ({ onBack }) => {
  const [collectionTitle, setCollectionTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(true);

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_URL}/admin/collection`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          collectionTitle,
          description,
          images: [],
          isActive,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to create collection");
      }

      alert("Collection created successfully");

      onBack();
    } catch (error) {
      alert(error.message || "Error creating collection");
    }
  };

  return (
    <div>
      <h2>Create Collection</h2>

      <input
        type="text"
        placeholder="Enter collection title"
        value={collectionTitle}
        onChange={(e) => setCollectionTitle(e.target.value)}
      />

      <br />
      <br />

      <textarea
        placeholder="Enter description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={4}
        cols={40}
      />

      <br />
      <br />

      <label>
        Active:
        <input
          type="checkbox"
          checked={isActive}
          onChange={(e) => setIsActive(e.target.checked)}
        />
      </label>

      <br />
      <br />

      <button onClick={handleSave}>Save</button>
      <button onClick={onBack}>Back</button>
    </div>
  );
};

export default CollectionCreate;