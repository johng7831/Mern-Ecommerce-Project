import React, { useState, useEffect } from "react";
import API_URL from "../../../api";

const CategoryShow = ({ onAdd, onEdit }) => {
  const [categories, setCategories] = useState([]);

  // Fetch Categories from API
  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/admin/categories`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to load categories");
      }

      const data = await res.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure?")) {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_URL}/admin/category/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Failed to delete");
        }

        fetchCategories(); // Refresh list
      } catch (error) {
        alert(error.message || "Delete failed");
      }
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
              {categories.map((cat) => (
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
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default CategoryShow;