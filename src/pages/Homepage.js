// src/pages/HomePage.js
import React from "react";
import { Link } from "react-router-dom";

function HomePage() {
  return (
    <div className="home">
      <h1>Spaces for Rent</h1>
      <p>Welcome to our rental platform</p>
      <Link to="/spaces">Browse Spaces</Link>
    </div>
  );
}

export default HomePage;
