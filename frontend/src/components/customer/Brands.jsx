import React, { useEffect, useState } from "react";
import API_URL from "../../api";
import "../../user.css";

const Brand = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  // ================= FETCH ALL BRANDS =================
  const fetchBrands = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/admin/brands`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      console.log("Brands Response:", data);
      setBrands(data.data || []);
    } catch (error) {
      console.error("Error fetching brands:", error);
      setBrands([]);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchBrands();
  }, []);
  return (
    <div className="brands-section">
      {/* HEADING */}
      <div className="brands-header">
        <h2>All Brands</h2>
      </div>
      {/* LOADING */}
      {loading ? (
        <p className="brand-loading">Loading brands...</p>
      ) : (
        <div className="brands-grid">
          {brands.length === 0 ? (
            <p>No brands found</p>
          ) : (
            brands.map((brand) => (
              <div key={brand._id} className="brand-card-new">
                
                {/* IMAGE */}
                <div className="brand-image-wrapper">
                  {brand.images && brand.images.length > 0 ? (
                    <img
                      src={brand.images[0].url}
                      alt={brand.name}
                      className="brand-image"
                    />
                  ) : (
                    <div className="brand-no-image">
                      No Image
                    </div>
                  )}
                </div>
                {/* CONTENT */}
                <div className="brand-content">
                  <h3>{brand.name}</h3>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Brand;