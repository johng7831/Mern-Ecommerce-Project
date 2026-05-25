import React from "react";
import bannerImage from "../../assets/banner.jpg";
import "../../user.css";

const ImageBanner = () => {
  return (
    <div className="image-banner">
      <img src={bannerImage} alt="Banner" />
    </div>
  );
};

export default ImageBanner;

