import React, { useEffect, useState } from "react";
import API_URL from "../../../api";


const CollectionShow = ({ onBack, onAdd, onEdit }) => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);

  // =========================
  // FETCH COLLECTIONS
  // =========================
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

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch collections");
      }

      setCollections(data.data || []);
    } catch (error) {
      alert(error.message || "Error fetching collections");
      setCollections([]);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // DELETE COLLECTION
  // =========================
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this collection?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_URL}/admin/collection/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to delete collection");
      }

      alert("Collection deleted successfully");

      // refresh list after delete
      fetchCollections();
    } catch (error) {
      alert(error.message || "Error deleting collection");
    }
  };

  // =========================
  // LOAD DATA
  // =========================
  useEffect(() => {
    fetchCollections();
  }, []);

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return <p>Loading collections...</p>;
  }

  // =========================
  // UI
  // =========================
  return (
    <>
      <h2 className="greeting">Collections Management</h2>

      <div className="page-content-card">
        <div className="card-header">
          <h3>All Collections</h3>

          <button className="btn-primary" onClick={onAdd}>
            + Add Collection
          </button>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Collection Title</th>
                <th>Description</th>
                <th>Status</th>
                <th>Images</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {collections.length > 0 ? (
                collections.map((col) => (
                  <tr key={col._id}>
                    <td>{col.collectionTitle}</td>

                    <td>{col.description}</td>

                    <td>{col.isActive ? "Active" : "Inactive"}</td>

                    {/* ================= IMAGE FIX ================= */}
                    <td>
                      {col.images && col.images.length > 0 ? (
                        <div
                          style={{
                            display: "flex",
                            gap: "6px",
                            flexWrap: "wrap",
                          }}
                        >
                          {col.images.map((img, index) => (
                            <img
                              key={index}
                              src={img}
                              alt="collection"
                              onClick={() => window.open(img, "_blank")}
                              style={{
                                width: "50px",
                                height: "50px",
                                objectFit: "cover",
                                borderRadius: "6px",
                                border: "1px solid #ddd",
                                cursor: "pointer",
                              }}
                            />
                          ))}
                        </div>
                      ) : (
                        "No Images"
                      )}
                    </td>

                    <td>
                      <button
                        className="btn-edit"
                        onClick={() => onEdit(col)}
                      >
                        Edit
                      </button>

                      <button
                        className="btn-delete"
                        onClick={() => handleDelete(col._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">No collections found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <br />

        <button className="btn-secondary" onClick={onBack}>
          Back
        </button>
      </div>
    </>
  );
};

export default CollectionShow;