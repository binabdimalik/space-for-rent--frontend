// src/components/common/Navbar.js
import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav>
      <Link to="/">Home</Link>
      <Link to="/spaces">Spaces</Link>
      <Link to="/login">Login</Link>
      <Link to="/profile">Profile</Link>
    </nav>
  );
}

export default Navbar;
