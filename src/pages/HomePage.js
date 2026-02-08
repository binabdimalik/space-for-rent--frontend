import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiSearch, FiCalendar, FiCheckCircle, FiMapPin } from 'react-icons/fi';
import Footer from '../components/common/Footer';
import { SpacesContext } from '../context/SpacesContext';

// Hero slideshow images - rotating every 3 seconds
const heroImages = [
  {
    url: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800",
    alt: "Modern office space with natural light"
  },
  {
    url: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800",
    alt: "Professional meeting room"
  },
  {
    url: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800",
    alt: "Creative coworking space"
  },
  {
    url: "https://images.unsplash.com/photo-1462826303086-329426d1aef5?w=800",
    alt: "Executive conference room"
  },
  {
    url: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
    alt: "Stylish event venue"
  }
];

function HomePage() {
  const { getAvailableSpaces } = useContext(SpacesContext);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Auto-rotate hero images every 3 seconds with smooth crossfade
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === heroImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);
  
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
        <div className="hero-image-container" style={{ position: 'relative', overflow: 'hidden' }}>
          {/* Background image for crossfade effect */}
          {heroImages.map((image, index) => (
            <img 
              key={index}
              src={image.url} 
              alt={image.alt}
              className="hero-image"
              style={{
                position: index === 0 ? 'relative' : 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                opacity: index === currentImageIndex ? 1 : 0,
                transition: 'opacity 0.8s ease-in-out',
                zIndex: index === currentImageIndex ? 1 : 0
              }}
            />
          ))}
        </div>
      </section>

      {/* Featured Spaces Section */}
      <section className="section">
        <div className="section-header">
          <h2 className="section-title">Featured Spaces</h2>
          <p className="section-description">Explore some of our most popular listings.</p>
        </div>

        <div className="cards-grid">
          {spaces.map((space) => (
            <div key={space.id} className="card">
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
