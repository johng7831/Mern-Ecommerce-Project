import React from "react";

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <div className="site-footer-top">
          <div>
            <div className="site-footer-brand">ShopEasy</div>
            <p className="site-footer-text">
              Your one-stop shop for the latest trends and everyday essentials.
            </p>
          </div>

          <div>
            <div className="site-footer-heading">Support</div>
            <ul className="site-footer-list">
              <li>Help Center</li>
              <li>Shipping &amp; Returns</li>
              <li>Order Tracking</li>
            </ul>
          </div>

          <div>
            <div className="site-footer-heading">Company</div>
            <ul className="site-footer-list">
              <li>About Us</li>
              <li>Careers</li>
              <li>Contact</li>
            </ul>
          </div>
        </div>

        <div className="site-footer-bottom">
          © {new Date().getFullYear()} ShopEasy. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;

