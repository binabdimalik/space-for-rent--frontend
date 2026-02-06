// src/components/common/Footer.js
import React from "react";
import { Link } from "react-router-dom";
import { FiHome } from "react-icons/fi";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-top">
          <div className="footer-brand">
            <div className="navbar-logo-icon">
              <FiHome size={16} />
            </div>
            <div>
              <div className="footer-brand-name">SpaceHub</div>
              <div className="footer-brand-tagline">Find Your Perfect Space</div>
            </div>
          </div>
          
          <div className="footer-links">
            <Link to="/" className="footer-link">Home</Link>
            <Link to="/spaces" className="footer-link">Browse Spaces</Link>
            <Link to="/how-it-works" className="footer-link">How It Works</Link>
            <Link to="/contact" className="footer-link">Contact</Link>
            <Link to="/faq" className="footer-link">FAQ</Link>
            <Link to="/privacy" className="footer-link">Privacy Policy</Link>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p className="footer-copyright">© 2026 SpaceHub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;