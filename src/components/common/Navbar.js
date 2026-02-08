// src/components/common/Navbar.js
import React, { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { FiHome, FiUser, FiLogOut } from "react-icons/fi";

function Navbar() {
  const location = useLocation();
  const { user, logout } = useContext(AuthContext);

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <div className="navbar-logo-icon">
            <FiHome size={18} />
          </div>
          <span className="navbar-logo-text">Spaces for Rent</span>
        </Link>

        <div className="navbar-links">
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

        <div className="navbar-actions">
          {user ? (
            <>
              <Link to="/profile" className="btn btn-ghost btn-sm">
                <FiUser size={16} />
                {user.name || 'Profile'}
              </Link>
              {user.role === 'admin' && (
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
      </div>
    </nav>
  );
}

export default Navbar;
