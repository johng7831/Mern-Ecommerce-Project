import React, { useState } from "react";

const Collectionshow = ({ onBack }) => {
  const [name, setName] = useState("");

  const handleCreate = () => {
    console.log("Created:", name);
    onBack();
  };

  return (
    <div>
      <h2>Create Collection</h2>

      <input
        type="text"
        placeholder="Collection Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <br /><br />

      <button onClick={handleCreate}>Create</button>
      <button onClick={onBack} style={{ marginLeft: "10px" }}>
        Back
      </button>
    </div>
  );
};

export default Collectionshow;