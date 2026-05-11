import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5001/api";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`${API_URL}/product/${id}`);
        setProduct(res.data.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProduct();
  }, [id]);

  if (!product)
    return <h2 className="product-detail-loading">Loading...</h2>;

  return (
    <div className="product-detail">
      <div className="product-detail-image-wrapper">
        <img
          src={product.images[0]?.url}
          alt={product.name}
          className="product-detail-image"
        />
      </div>

      <div>
        <h1 className="product-detail-title">{product.name}</h1>
        <p className="product-detail-meta">
          Brand: {product.brand?.name} · Category: {product.category?.name}
        </p>

        <p className="product-detail-price">₹ {product.price}</p>

        {product.description && (
          <p className="product-detail-description">{product.description}</p>
        )}

        <p className="product-detail-stock">
          <strong>Stock:</strong> {product.stock}
        </p>

        <button className="btn-primary-rounded">Add to Cart</button>
      </div>
    </div>
  );
};

export default ProductDetails;