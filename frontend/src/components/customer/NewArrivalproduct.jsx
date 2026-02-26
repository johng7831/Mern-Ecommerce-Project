import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import API_URL from "../../api";

const NewArrivals = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        const res = await axios.get(`${API_URL}/admin/new-arrivals`);
        setProducts(res.data.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchNewArrivals();
  }, []);

  return (
    <section className="home-section">
      <div className="home-section-inner">
        <div className="home-section-header">
          <h2 className="home-section-title">New Arrivals</h2>
          <span className="home-section-subtitle">Fresh drops just landed</span>
        </div>

        <div className="product-grid">
          {products.map((product) => (
            <Link
              key={product._id}
              to={`/product/${product._id}`}
              className="product-card-link"
            >
              <div className="product-card">
                <div className="product-card-image-wrapper">
                  <img
                    src={product.images[0]?.url}
                    alt={product.name}
                    className="product-card-image"
                  />
                </div>
                <div className="product-card-body">
                  <h4 className="product-card-name">{product.name}</h4>
                  <p className="product-card-brand">{product.brand?.name}</p>
                  <p className="product-card-price">₹ {product.price}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewArrivals;