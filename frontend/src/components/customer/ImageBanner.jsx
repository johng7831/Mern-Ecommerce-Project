import React from "react";
import bannerImage from "../../assets/banner.jpg";
import "../../user.css";

const ImageBanner = () => {
  return (
    <div className="image-banner">
      <img src={bannerImage} alt="Banner" />
      <div className="banner-overlay">
        <div className="banner-content">
          <h1>Welcome to ShopEasy</h1>
          <p>Your One-Stop Shop for Everything You Need</p>
        </div>
      </div>
    </div>
  );
};

export default ImageBanner;

