import React, { useState, useEffect } from "react";
import API_URL from "../../../api";

const CategoryShow = ({ onAdd, onEdit }) => {
  const [categories, setCategories] = useState([]);

  // =========================================
  // FETCH CATEGORIES (PUBLIC API)
  // =========================================
  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API_URL}/categories`);

      if (!res.ok) {
        throw new Error("Failed to load categories");
      }

      const data = await res.json();

      // normalize response (array or {data})
      const normalized = Array.isArray(data)
        ? data
        : Array.isArray(data?.data)
        ? data.data
        : [];

      setCategories(normalized);
    } catch (error) {
      console.error("Error fetching categories", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // =========================================
  // DELETE CATEGORY (⚠️ should still be admin)
  // =========================================
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;

    try {
      const res = await fetch(`${API_URL}/category/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete");
      }

      // refresh list
      fetchCategories();
    } catch (error) {
      alert(error.message || "Delete failed");
    }
  };

  return (
    <>
      <h2 className="greeting">Categories Management</h2>

      <div className="page-content-card">
        <div className="card-header">
          <h3>All Categories</h3>
          <button className="btn-primary" onClick={onAdd}>
            + Add Category
          </button>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Category Name</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {categories.length > 0 ? (
                categories.map((cat) => (
                  <tr key={cat._id}>
                    <td>{cat.name}</td>

                    <td>
                      <button
                        className="btn-edit"
                        onClick={() => onEdit(cat)}
                      >
                        Edit
                      </button>

                      <button
                        className="btn-delete"
                        onClick={() => handleDelete(cat._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="2" style={{ textAlign: "center" }}>
                    No categories found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default CategoryShow;