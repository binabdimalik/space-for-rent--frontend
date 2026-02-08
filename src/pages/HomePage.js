<<<<<<< HEAD
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { FiSearch, FiCalendar, FiCheckCircle, FiMapPin } from 'react-icons/fi';
import Footer from '../components/common/Footer';
import { SpacesContext } from '../context/SpacesContext';

// Placeholder images - replace with actual images or API data
const heroImage = "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800";

function HomePage() {
  const { getAvailableSpaces } = useContext(SpacesContext);
  
=======
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { FiSearch, FiCalendar, FiCheckCircle, FiMapPin } from "react-icons/fi";
import Footer from "../components/common/Footer";
import { SpacesContext } from "../context/SpacesContext";

// Placeholder images - replace with actual images or API data
const heroImage =
  "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800";

function HomePage() {
  const { getAvailableSpaces } = useContext(SpacesContext);

>>>>>>> 00dcceae84ca72d17a50aa7de251aa69aa7f416f
  // Get first 4 available spaces for featured section
  const spaces = getAvailableSpaces().slice(0, 4);

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Find and Rent the Perfect Space</h1>
          <p className="hero-subtitle">Anytime, Anywhere</p>
          <div className="hero-description">
            <p>Browse affordable spaces for meetings, events, or work.</p>
            <p>List your space and earn effortlessly.</p>
          </div>
          <div className="hero-buttons">
            <Link to="/spaces" className="btn btn-primary btn-lg">
              Find a Space
            </Link>
            <Link to="/list-space" className="btn btn-secondary btn-lg">
              List Your Space
            </Link>
          </div>
        </div>
<<<<<<< HEAD
        <img 
          src={heroImage} 
          alt="People working in a coworking space" 
=======
        <img
          src={heroImage}
          alt="People working in a coworking space"
>>>>>>> 00dcceae84ca72d17a50aa7de251aa69aa7f416f
          className="hero-image"
        />
      </section>

      {/* Featured Spaces Section */}
      <section className="section">
        <div className="section-header">
          <h2 className="section-title">Featured Spaces</h2>
<<<<<<< HEAD
          <p className="section-description">Explore some of our most popular listings.</p>
=======
          <p className="section-description">
            Explore some of our most popular listings.
          </p>
>>>>>>> 00dcceae84ca72d17a50aa7de251aa69aa7f416f
        </div>

        <div className="cards-grid">
          {spaces.map((space) => (
            <div key={space.id} className="card">
<<<<<<< HEAD
              <img 
                src={space.image_url || 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400'} 
                alt={space.title} 
                className="card-image"
              />
                <div className="card-content">
                  <h3 className="card-title">{space.title}</h3>
                  <p className="card-location">
                    <FiMapPin size={14} />
                    {space.location}
                  </p>
                  <div className="card-price">
                    <span className="card-price-amount">${space.price_per_hour || space.price_per_night}</span>
                    <span className="card-price-unit">/hr</span>
                  </div>
                  <Link to={`/spaces/${space.id}`} className="btn btn-primary card-button">
                    View Details
                  </Link>
                </div>
              </div>
            ))}
=======
              <img
                src={
                  space.image_url ||
                  "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400"
                }
                alt={space.title}
                className="card-image"
              />
              <div className="card-content">
                <h3 className="card-title">{space.title}</h3>
                <p className="card-location">
                  <FiMapPin size={14} />
                  {space.location}
                </p>
                <div className="card-price">
                  <span className="card-price-amount">
                    ${space.price_per_hour || space.price_per_night}
                  </span>
                  <span className="card-price-unit">/hr</span>
                </div>
                <Link
                  to={`/spaces/${space.id}`}
                  className="btn btn-primary card-button"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
>>>>>>> 00dcceae84ca72d17a50aa7de251aa69aa7f416f
        </div>
      </section>

      {/* How It Works Section */}
      <section className="section how-it-works">
        <h2 className="section-title section-title-center">How It Works</h2>
        <div className="how-it-works-grid">
          <div className="how-it-works-card">
            <div className="how-it-works-icon">
              <FiSearch size={28} />
            </div>
            <h3 className="how-it-works-title">Discover</h3>
            <p className="how-it-works-description">
              Search and browse available spaces.
            </p>
          </div>
          <div className="how-it-works-card">
            <div className="how-it-works-icon">
              <FiCalendar size={28} />
            </div>
            <h3 className="how-it-works-title">Book</h3>
            <p className="how-it-works-description">
              Reserve your space for the desired time.
            </p>
          </div>
          <div className="how-it-works-card">
            <div className="how-it-works-icon">
              <FiCheckCircle size={28} />
            </div>
            <h3 className="how-it-works-title">Enjoy</h3>
            <p className="how-it-works-description">
              Show up and enjoy your booked space.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default HomePage;
