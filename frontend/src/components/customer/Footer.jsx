import React from "react";
import "../../user.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">

        {/* TOP SECTION */}
        <div className="footer-top">

          {/* APP DOWNLOAD */}
          <div className="footer-col">
            <h3 className="footer-title">Get the App</h3>
            <div className="app-buttons">
              <img
                src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
                alt="App Store"
              />
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                alt="Google Play"
              />
            </div>
          </div>

          {/* NEWSLETTER */}
          <div className="footer-col">
            <h3 className="footer-title">Sign up & get 10% off</h3>
            <div className="newsletter">
              <input type="email" placeholder="Enter your email" />
              <button>➜</button>
            </div>
            <p className="small-text">
              By signing up you agree to receive emails & offers.
            </p>
          </div>

          {/* SUPPORT */}
          <div className="footer-col">
            <h3 className="footer-title">Support</h3>
            <ul>
              <li>Help Center</li>
              <li>Delivery Info</li>
              <li>Returns</li>
              <li>Track Order</li>
            </ul>
          </div>

          {/* COMPANY */}
          <div className="footer-col">
            <h3 className="footer-title">Company</h3>
            <ul>
              <li>About Us</li>
              <li>Careers</li>
              <li>Affiliate</li>
              <li>Contact</li>
            </ul>
          </div>
        </div>

        {/* SOCIAL */}
        <div className="footer-social">
          <i className="fa-brands fa-instagram"></i>
          <i className="fa-brands fa-facebook"></i>
          <i className="fa-brands fa-x-twitter"></i>
          <i className="fa-brands fa-youtube"></i>
          <i className="fa-brands fa-tiktok"></i>
        </div>

        {/* COUNTRY */}
        <div className="footer-country">
          <select>
            <option>🇬🇧 United Kingdom</option>
            <option>🇺🇸 United States</option>
            <option>🇮🇳 India</option>
          </select>
        </div>

        {/* BOTTOM */}
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} ShopEasy. All rights reserved.</p>
          <div className="footer-links">
            <span>Privacy</span>
            <span>Terms</span>
            <span>Cookies</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;