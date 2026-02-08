import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiHome, FiMapPin, FiDollarSign, FiUsers, FiImage, FiList, FiCheck, FiArrowLeft } from 'react-icons/fi';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { AuthContext } from '../context/AuthContext';
import { SpacesContext } from '../context/SpacesContext';
import Footer from '../components/common/Footer';

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Map click handler component
const LocationPicker = ({ position, setPosition }) => {
    useMapEvents({
        click(e) {
            setPosition([e.latlng.lat, e.latlng.lng]);
        },
    });
    return position ? <Marker position={position} /> : null;
};

const ListSpacePage = () => {
    const { user } = useContext(AuthContext);
    const { addSpace } = useContext(SpacesContext);
    const navigate = useNavigate();
    const [submitted, setSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        location: '',
        price_per_hour: '',
        capacity: '',
        amenities: '',
        image_url: ''
    });
    const [mapPosition, setMapPosition] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        // Only clients can list spaces
        const isAdmin = user?.role === 'admin' || user?.role === 'super_admin';
        if (isAdmin) {
            navigate('/admin/spaces');
            return;
        }
    }, [user, navigate]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        // Validation
        if (!formData.title || !formData.description || !formData.location || !formData.price_per_hour || !formData.capacity) {
            setError('Please fill in all required fields.');
            return;
        }

        if (parseFloat(formData.price_per_hour) <= 0) {
            setError('Price must be greater than 0.');
            return;
        }

        if (parseInt(formData.capacity) <= 0) {
            setError('Capacity must be at least 1.');
            return;
        }

        // Add space with pending status
        addSpace({
            title: formData.title,
            description: formData.description,
            location: formData.location,
            price_per_hour: parseFloat(formData.price_per_hour),
            capacity: parseInt(formData.capacity),
            amenities: formData.amenities,
            image_url: formData.image_url || 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800',
            latitude: mapPosition ? mapPosition[0] : 0,
            longitude: mapPosition ? mapPosition[1] : 0,
            submitted_by: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        }, false); // false = not admin, so it will be pending

        setSubmitted(true);
    };

    if (!user) return null;

    // Success message after submission
    if (submitted) {
        return (
            <div style={{ minHeight: 'calc(100vh - 65px)', background: '#f5f5f4' }}>
                <div style={{ maxWidth: '600px', margin: '0 auto', padding: '60px 24px', textAlign: 'center' }}>
                    <div style={{ 
                        width: '100px', 
                        height: '100px', 
                        background: '#dcfce7', 
                        borderRadius: '50%', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        margin: '0 auto 24px'
                    }}>
                        <FiCheck size={50} color="#059669" />
                    </div>
                    <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#1e3a8a', marginBottom: '16px' }}>
                        Space Submitted Successfully!
                    </h1>
                    <p style={{ color: '#6a7282', fontSize: '16px', marginBottom: '32px', lineHeight: 1.6 }}>
                        Your space listing has been submitted for review. Our admin team will verify your space and once approved, it will be visible to all clients for booking.
                    </p>
                    <div style={{ 
                        background: '#eff6ff', 
                        border: '1px solid #bfdbfe', 
                        borderRadius: '12px', 
                        padding: '20px',
                        marginBottom: '32px'
                    }}>
                        <h3 style={{ fontWeight: 600, color: '#1e3a8a', marginBottom: '8px' }}>What happens next?</h3>
                        <ul style={{ textAlign: 'left', color: '#4a5565', fontSize: '14px', paddingLeft: '20px' }}>
                            <li style={{ marginBottom: '8px' }}>Our team will review your space details</li>
                            <li style={{ marginBottom: '8px' }}>We may contact you for additional information</li>
                            <li>Once verified, your space will appear in the listings</li>
                        </ul>
                    </div>
                    <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
                        <button 
                            onClick={() => navigate('/profile')}
                            className="btn btn-outline"
                        >
                            Go to Profile
                        </button>
                        <button 
                            onClick={() => {
                                setSubmitted(false);
                                setMapPosition(null);
                                setFormData({
                                    title: '',
                                    description: '',
                                    location: '',
                                    price_per_hour: '',
                                    capacity: '',
                                    amenities: '',
                                    image_url: ''
                                });
                            }}
                            className="btn btn-primary"
                        >
                            List Another Space
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div style={{ minHeight: 'calc(100vh - 65px)', background: '#f5f5f4' }}>
            <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 24px' }}>
                {/* Header */}
                <button 
                    onClick={() => navigate('/profile')}
                    style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '6px', 
                        background: 'none', 
                        border: 'none', 
                        color: '#6a7282',
                        cursor: 'pointer',
                        marginBottom: '24px',
                        fontSize: '14px'
                    }}
                >
                    <FiArrowLeft size={16} />
                    Back to Profile
                </button>

                <div style={{ 
                    background: 'white', 
                    borderRadius: '16px', 
                    padding: '40px',
                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
                }}>
                    <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                        <div style={{ 
                            width: '64px', 
                            height: '64px', 
                            background: '#eff6ff', 
                            borderRadius: '50%', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            margin: '0 auto 16px'
                        }}>
                            <FiHome size={28} color="#2563eb" />
                        </div>
                        <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#1e3a8a', marginBottom: '8px' }}>
                            List Your Space
                        </h1>
                        <p style={{ color: '#6a7282', fontSize: '14px' }}>
                            Share your space with renters across the country. Fill in the details below to get started.
                        </p>
                    </div>

                    {error && (
                        <div style={{ 
                            background: '#fee2e2', 
                            color: '#991b1b', 
                            padding: '12px', 
                            borderRadius: '6px', 
                            marginBottom: '20px',
                            fontSize: '14px'
                        }}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        {/* Space Title */}
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '6px', 
                                marginBottom: '8px',
                                fontWeight: 600,
                                color: '#1e3a8a',
                                fontSize: '14px'
                            }}>
                                <FiHome size={16} />
                                Space Title *
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                className="form-input"
                                placeholder="e.g., Modern Conference Room"
                                required
                            />
                        </div>

                        {/* Description */}
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '6px', 
                                marginBottom: '8px',
                                fontWeight: 600,
                                color: '#1e3a8a',
                                fontSize: '14px'
                            }}>
                                <FiList size={16} />
                                Description *
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                className="form-input"
                                placeholder="Describe your space, its features, and what makes it unique..."
                                rows={4}
                                style={{ resize: 'vertical' }}
                                required
                            />
                        </div>

                        {/* Location */}
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '6px', 
                                marginBottom: '8px',
                                fontWeight: 600,
                                color: '#1e3a8a',
                                fontSize: '14px'
                            }}>
                                <FiMapPin size={16} />
                                Location *
                            </label>
                            <input
                                type="text"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                className="form-input"
                                placeholder="e.g., 123 Main St, New York, NY"
                                required
                            />
                        </div>

                        {/* Map Location Picker */}
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '6px', 
                                marginBottom: '8px',
                                fontWeight: 600,
                                color: '#1e3a8a',
                                fontSize: '14px'
                            }}>
                                <FiMapPin size={16} />
                                Pin Location on Map (click to set)
                            </label>
                            <div style={{ height: '250px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #e5e7eb' }}>
                                <MapContainer 
                                    center={mapPosition || [39.8283, -98.5795]} 
                                    zoom={mapPosition ? 13 : 4} 
                                    style={{ height: '250px', width: '100%' }}
                                >
                                    <TileLayer
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                        attribution='&copy; OpenStreetMap'
                                    />
                                    <LocationPicker position={mapPosition} setPosition={setMapPosition} />
                                </MapContainer>
                            </div>
                            {mapPosition ? (
                                <p style={{ fontSize: '12px', color: '#059669', marginTop: '6px' }}>
                                    📍 Location set: {mapPosition[0].toFixed(4)}, {mapPosition[1].toFixed(4)}
                                </p>
                            ) : (
                                <p style={{ fontSize: '12px', color: '#6a7282', marginTop: '6px' }}>
                                    Click on the map to set your space's exact location
                                </p>
                            )}
                        </div>

                        {/* Price and Capacity Row */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                            <div>
                                <label style={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    gap: '6px', 
                                    marginBottom: '8px',
                                    fontWeight: 600,
                                    color: '#1e3a8a',
                                    fontSize: '14px'
                                }}>
                                    <FiDollarSign size={16} />
                                    Price per Hour ($) *
                                </label>
                                <input
                                    type="number"
                                    name="price_per_hour"
                                    value={formData.price_per_hour}
                                    onChange={handleChange}
                                    className="form-input"
                                    placeholder="e.g., 50"
                                    min="1"
                                    required
                                />
                            </div>
                            <div>
                                <label style={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    gap: '6px', 
                                    marginBottom: '8px',
                                    fontWeight: 600,
                                    color: '#1e3a8a',
                                    fontSize: '14px'
                                }}>
                                    <FiUsers size={16} />
                                    Capacity (people) *
                                </label>
                                <input
                                    type="number"
                                    name="capacity"
                                    value={formData.capacity}
                                    onChange={handleChange}
                                    className="form-input"
                                    placeholder="e.g., 20"
                                    min="1"
                                    required
                                />
                            </div>
                        </div>

                        {/* Amenities */}
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '6px', 
                                marginBottom: '8px',
                                fontWeight: 600,
                                color: '#1e3a8a',
                                fontSize: '14px'
                            }}>
                                <FiList size={16} />
                                Amenities
                            </label>
                            <input
                                type="text"
                                name="amenities"
                                value={formData.amenities}
                                onChange={handleChange}
                                className="form-input"
                                placeholder="e.g., WiFi, Projector, Whiteboard, Coffee Machine"
                            />
                            <p style={{ fontSize: '12px', color: '#6a7282', marginTop: '4px' }}>
                                Separate amenities with commas
                            </p>
                        </div>

                        {/* Image URL */}
                        <div style={{ marginBottom: '32px' }}>
                            <label style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '6px', 
                                marginBottom: '8px',
                                fontWeight: 600,
                                color: '#1e3a8a',
                                fontSize: '14px'
                            }}>
                                <FiImage size={16} />
                                Image URL
                            </label>
                            <input
                                type="url"
                                name="image_url"
                                value={formData.image_url}
                                onChange={handleChange}
                                className="form-input"
                                placeholder="https://example.com/image.jpg"
                            />
                            <p style={{ fontSize: '12px', color: '#6a7282', marginTop: '4px' }}>
                                Provide a URL to an image of your space. A default image will be used if not provided.
                            </p>
                        </div>

                        {/* Submit Button */}
                        <button type="submit" className="btn btn-primary w-full" style={{ padding: '14px' }}>
                            Submit Space for Review
                        </button>

                        <p style={{ 
                            textAlign: 'center', 
                            fontSize: '12px', 
                            color: '#6a7282', 
                            marginTop: '16px' 
                        }}>
                            By submitting, you agree that your space will be reviewed by our admin team before being listed.
                        </p>
                    </form>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default ListSpacePage;
