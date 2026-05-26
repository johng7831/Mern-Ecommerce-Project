import React from "react";
import NewbannerImage from "../../assets/Promobanner.jpg";
import "../../user.css";

const Promobanner = () => {
  return (
    <div className="Promobanner-image">
      <img src={NewbannerImage} alt="Banner" />
    </div>
  );
};

export default Promobanner;