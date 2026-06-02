import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API_URL from "../../api";
import "../../user.css";

const Brand = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const fetchBrands = async () => {
    try {
      const res = await fetch(`${API_URL}/brands`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();
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

  const handleBrandClick = (brandId) => {
    navigate(`/brand/${brandId}`);
  };

  return (
    <div className="brands-section">
      <div className="brands-header">
        <h2>All Brands</h2>
      </div>

      {loading ? (
        <p className="brand-loading">Loading brands...</p>
      ) : (
        <div className="brands-grid">
          {brands.length === 0 ? (
            <p>No brands found</p>
          ) : (
            brands.map((brand) => (
              <div
                key={brand._id}
                className="brand-card-new"
                onClick={() => handleBrandClick(brand._id)}
                style={{ cursor: "pointer" }}
              >
                <div className="brand-image-wrapper">
                  {brand.images?.length > 0 ? (
                    <img
                      src={brand.images[0].url}
                      alt={brand.name}
                      className="brand-image"
                    />
                  ) : (
                    <div className="brand-no-image">No Image</div>
                  )}
                </div>

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