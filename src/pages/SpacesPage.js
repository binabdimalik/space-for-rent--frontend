import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { SpacesContext } from '../context/SpacesContext';
import { FiMapPin, FiGrid, FiMap, FiSearch } from 'react-icons/fi';
import Footer from '../components/common/Footer';

// Fix for default marker icon in Leaflet with Webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const placeholderImages = [
    "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=400",
    "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400",
    "https://images.unsplash.com/photo-1497215842964-222b430dc094?w=400",
    "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=400"
];

const SpacesPage = () => {
    const { getVerifiedSpaces } = useContext(SpacesContext);
    const [viewMode, setViewMode] = useState('list');
    const [searchTerm, setSearchTerm] = useState('');
    const [filterLocation, setFilterLocation] = useState('');
    
    // Get verified and available spaces from context (only show approved spaces to clients)
    const allVerifiedSpaces = getVerifiedSpaces();
    const spaces = allVerifiedSpaces.filter(s => s.status === 'available');

    // Extract unique locations from all spaces for the filter dropdown
    const uniqueLocations = [...new Set(spaces.map(space => {
        // Extract city/area name from the location string
        const location = space.location || '';
        // Try to get the main city/area (last part after comma, or full string)
        const parts = location.split(',').map(p => p.trim());
        return parts[parts.length - 1] || parts[0] || location;
    }).filter(loc => loc))].sort();

    const filteredSpaces = spaces.filter(space => {
        const matchesSearch = space.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            space.description?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesLocation = !filterLocation || space.location.toLowerCase().includes(filterLocation.toLowerCase());
        return matchesSearch && matchesLocation;
    });

    const defaultCenter = [39.8283, -98.5795];
    const center = filteredSpaces.length > 0 && filteredSpaces[0].latitude
        ? [filteredSpaces[0].latitude, filteredSpaces[0].longitude]
        : defaultCenter;

    return (
        <div className="spaces-page-wrapper">
            <div className="spaces-page">
                <div className="spaces-header">
                    <h1 className="spaces-title">Browse Spaces</h1>
                    <div className="view-toggle">
                        <button
                            onClick={() => setViewMode('list')}
                            className={`btn btn-sm ${viewMode === 'list' ? 'btn-primary' : 'btn-ghost'}`}
                        >
                            <FiGrid size={16} />
                            Grid
                        </button>
                        <button
                            onClick={() => setViewMode('map')}
                            className={`btn btn-sm ${viewMode === 'map' ? 'btn-primary' : 'btn-ghost'}`}
                        >
                            <FiMap size={16} />
                            Map
                        </button>
                    </div>
                </div>

                {/* Search and Filter */}
                <div className="spaces-filters" style={{ display: 'flex', gap: '16px', marginBottom: '32px' }}>
                    <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                        <div style={{ position: 'relative' }}>
                            <FiSearch style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#6a7282' }} />
                            <input
                                type="text"
                                placeholder="Search spaces..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="form-input"
                                style={{ paddingLeft: '40px' }}
                            />
                        </div>
                    </div>
                    <div className="form-group" style={{ width: '200px', marginBottom: 0 }}>
                        <select
                            value={filterLocation}
                            onChange={(e) => setFilterLocation(e.target.value)}
                            className="form-input"
                        >
                            <option value="">All Locations</option>
                            {uniqueLocations.map(location => (
                                <option key={location} value={location}>
                                    {location}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {viewMode === 'list' ? (
                    <div className="spaces-grid">
                        {filteredSpaces.length === 0 ? (
                            <div className="empty-state" style={{ gridColumn: '1 / -1' }}>
                                <div className="empty-state-icon">🔍</div>
                                <p>No spaces found matching your criteria.</p>
                            </div>
                        ) : (
                            filteredSpaces.map((space, index) => (
                                <div key={space.id} className="space-card">
                                    <img 
                                        src={space.image_url || placeholderImages[index % 4]} 
                                        alt={space.title} 
                                        className="space-card-image"
                                    />
                                    <div className="space-card-content">
                                        <h2 className="space-card-title">{space.title}</h2>
                                        <p className="space-card-location">
                                            <FiMapPin size={14} />
                                            {space.location}
                                        </p>
                                        <p className="space-card-price">
                                            ${space.price_per_hour || space.price_per_night}
                                            <span>/hr</span>
                                        </p>
                                        <Link to={`/spaces/${space.id}`} className="btn btn-primary w-full">
                                            View Details
                                        </Link>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                ) : (
                    <div style={{ height: '600px', borderRadius: '12px', overflow: 'hidden', border: '1px solid #e5e7eb' }}>
                        <MapContainer center={center} zoom={4} style={{ height: '600px', width: '100%' }}>
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            />
                            {filteredSpaces.map(space => (
                                space.latitude && space.longitude && (
                                    <Marker key={space.id} position={[space.latitude, space.longitude]}>
                                        <Popup>
                                            <div style={{ fontFamily: 'Open Sans, sans-serif' }}>
                                                <strong style={{ display: 'block', fontSize: '16px', marginBottom: '4px' }}>{space.title}</strong>
                                                <span style={{ display: 'block', color: '#2563eb', fontWeight: 'bold' }}>
                                                    ${space.price_per_hour || space.price_per_night}/hr
                                                </span>
                                                <Link to={`/spaces/${space.id}`} style={{ color: '#2563eb', textDecoration: 'underline', marginTop: '8px', display: 'inline-block' }}>
                                                    View Details
                                                </Link>
                                            </div>
                                        </Popup>
                                    </Marker>
                                )
                            ))}
                        </MapContainer>
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default SpacesPage;
