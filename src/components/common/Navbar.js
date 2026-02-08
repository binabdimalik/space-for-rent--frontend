// src/components/common/Navbar.js
import React, { useContext, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { FiHome, FiUser, FiLogOut, FiMenu, FiX } from "react-icons/fi";

function Navbar() {
  const location = useLocation();
  const { user, logout } = useContext(AuthContext);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;
  
  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" onClick={closeMobileMenu}>
          <div className="navbar-logo-icon">
            <FiHome size={18} />
          </div>
          <span className="navbar-logo-text">Spaces for Rent</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="navbar-links navbar-desktop-only">
          <Link 
            to="/" 
            className={`navbar-link ${isActive('/') ? 'active' : ''}`}
          >
            Home
          </Link>
          <Link 
            to="/spaces" 
            className={`navbar-link ${isActive('/spaces') ? 'active' : ''}`}
          >
            Browse Spaces
          </Link>
        </div>

        {/* Desktop Actions */}
        <div className="navbar-actions navbar-desktop-only">
          {user ? (
            <>
              <Link to="/profile" className="btn btn-ghost btn-sm">
                <FiUser size={16} />
                {user.name || 'Profile'}
              </Link>
              {(user.role === 'admin' || user.role === 'super_admin') && (
                <Link to="/admin" className="btn btn-ghost btn-sm">
                  Admin
                </Link>
              )}
              <button onClick={logout} className="btn btn-outline btn-sm">
                <FiLogOut size={16} />
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="btn btn-primary btn-sm">
              <FiUser size={16} />
              Login
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="navbar-mobile-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="navbar-mobile-menu">
          <div className="navbar-mobile-links">
            <Link 
              to="/" 
              className={`navbar-mobile-link ${isActive('/') ? 'active' : ''}`}
              onClick={closeMobileMenu}
            >
              <FiHome size={20} />
              Home
            </Link>
            <Link 
              to="/spaces" 
              className={`navbar-mobile-link ${isActive('/spaces') ? 'active' : ''}`}
              onClick={closeMobileMenu}
            >
              Browse Spaces
            </Link>
            {user ? (
              <>
                <Link 
                  to="/profile" 
                  className={`navbar-mobile-link ${isActive('/profile') ? 'active' : ''}`}
                  onClick={closeMobileMenu}
                >
                  <FiUser size={20} />
                  My Profile
                </Link>
                {(user.role === 'admin' || user.role === 'super_admin') && (
                  <Link 
                    to="/admin" 
                    className="navbar-mobile-link"
                    onClick={closeMobileMenu}
                  >
                    Admin Dashboard
                  </Link>
                )}
                <button 
                  onClick={() => { logout(); closeMobileMenu(); }} 
                  className="navbar-mobile-link navbar-mobile-logout"
                >
                  <FiLogOut size={20} />
                  Logout
                </button>
              </>
            ) : (
              <Link 
                to="/login" 
                className="navbar-mobile-link navbar-mobile-login"
                onClick={closeMobileMenu}
              >
                <FiUser size={20} />
                Login / Sign Up
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
