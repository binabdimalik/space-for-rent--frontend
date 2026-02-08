import React, { useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiMapPin, FiUsers, FiStar, FiWifi, FiSun, FiMusic, FiCoffee, FiCalendar, FiClock, FiMail, FiPhone, FiUser, FiAlertCircle } from 'react-icons/fi';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { AuthContext } from '../context/AuthContext';
import { SpacesContext } from '../context/SpacesContext';
import { BookingsContext } from '../context/BookingsContext';
import Footer from '../components/common/Footer';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const placeholderImage = "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800";

const SpaceDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const { getSpaceById } = useContext(SpacesContext);
    const { checkBookingConflict, getBookedDates } = useContext(BookingsContext);
    const [bookingType, setBookingType] = useState('hourly');
    const [bookingError, setBookingError] = useState('');
    const [bookingData, setBookingData] = useState({
        fullName: '',
        email: '',
        phone: '',
        startDate: '',
        endDate: '',
        startTime: '',
        endTime: ''
    });

    // Get space from context
    const space = getSpaceById(id) || {
        id: id,
        title: "Space Not Found",
        location: "Unknown",
        price_per_hour: 0,
        capacity: 0,
        rating: 0,
        reviews: 0,
        description: "This space could not be found.",
        amenities: "",
        status: "unavailable",
        image_url: placeholderImage
    };

    const handleBookingChange = (e) => {
        setBookingData({
            ...bookingData,
            [e.target.name]: e.target.value
        });
    };

    const handleBooking = () => {
        setBookingError(''); // Clear previous errors
        
        if (!user) {
            navigate('/login');
            return;
        }
        
        // Validate required fields
        if (!bookingData.fullName || !bookingData.email || !bookingData.phone) {
            setBookingError('Please fill in your contact information (name, email, phone)');
            return;
        }
        if (!bookingData.startDate || !bookingData.endDate) {
            setBookingError('Please select booking dates');
            return;
        }
        if (bookingType === 'hourly' && (!bookingData.startTime || !bookingData.endTime)) {
            setBookingError('Please select booking times');
            return;
        }

        // Check for double booking conflicts
        const conflict = checkBookingConflict(
            space.id,
            bookingData.startDate,
            bookingData.endDate,
            bookingData.startTime,
            bookingData.endTime,
            bookingType
        );

        if (conflict.hasConflict) {
            setBookingError(`This space is currently unavailable for your selected dates. It has been booked from ${conflict.conflictingBooking.startDate} to ${conflict.conflictingBooking.endDate}. Please explore other available spaces or select different dates.`);
            return;
        }

        // Calculate total amount
        let totalAmount = 0;
        const startDateObj = new Date(bookingData.startDate);
        const endDateObj = new Date(bookingData.endDate);
        const numberOfDays = Math.ceil((endDateObj - startDateObj) / (1000 * 60 * 60 * 24)) + 1;
        
        if (bookingType === 'hourly' && bookingData.startTime && bookingData.endTime) {
            const startTime = new Date(`2000-01-01T${bookingData.startTime}`);
            const endTime = new Date(`2000-01-01T${bookingData.endTime}`);
            let hoursPerDay = (endTime - startTime) / (1000 * 60 * 60);
            
            // If end time is before or equal to start time, assume full day (8 hours)
            if (hoursPerDay <= 0) {
                hoursPerDay = 8;
            }
            
            // For multi-day hourly bookings, multiply hours by number of days
            const totalHours = hoursPerDay * numberOfDays;
            totalAmount = totalHours * (space.price_per_hour || 50);
        } else {
            // Daily booking - charge per day
            totalAmount = numberOfDays * (space.price_per_night || space.price_per_hour * 8 || 400);
        }

        // Ensure minimum charge of one hour
        totalAmount = Math.max(totalAmount, space.price_per_hour || 50);

        // Navigate to payment page with booking details
        navigate('/payment', {
            state: {
                booking: {
                    spaceId: space.id,
                    spaceTitle: space.title,
                    spaceImage: space.image_url,
                    location: space.location,
                    ...bookingData,
                    bookingType,
                    totalAmount
                }
            }
        });
    };

    const getAmenityIcon = (amenity) => {
        const icons = {
            'WiFi': <FiWifi size={12} />,
            'Natural Light': <FiSun size={12} />,
            'Sound System': <FiMusic size={12} />,
            'Kitchen': <FiCoffee size={12} />
        };
        return icons[amenity] || <FiStar size={12} />;
    };

    const amenitiesList = space.amenities ? space.amenities.split(',').map(a => a.trim()) : [];

    return (
        <div className="space-details-page">
            <div className="space-details-container">
                {/* Main Content */}
                <div className="space-main-content">
                    {/* Image with Badge */}
                    <div style={{ position: 'relative' }}>
                        <img 
                            src={space.image_url || placeholderImage} 
                            alt={space.title} 
                            className="space-main-image"
                            style={{ width: '100%', height: '400px', objectFit: 'cover' }}
                        />
                        <span className={`space-badge ${bookingError ? 'space-badge-unavailable' : ''}`}>
                            {bookingError ? '✗ Unavailable' : `✓ ${space.status || 'Available'}`}
                        </span>
                    </div>

                    {/* Space Info */}
                    <div className="space-info">
                        <div className="space-info-header">
                            <h1 className="space-info-title">{space.title}</h1>
                            <div className="space-info-price">
                                ${space.price_per_hour || space.price_per_night}<span>/hour</span>
                            </div>
                        </div>

                        {/* Meta Info */}
                        <div className="space-meta">
                            <div className="space-meta-item">
                                <FiMapPin size={16} />
                                <span>{space.location}</span>
                            </div>
                            <div className="space-meta-item">
                                <FiUsers size={16} />
                                <span>Up to {space.capacity || 20} people</span>
                            </div>
                            <div className="space-meta-item">
                                <FiStar size={16} />
                                <span>{space.rating || 4.9}</span>
                                <span style={{ color: '#6a7282' }}>({space.reviews || 38} reviews)</span>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="space-section">
                            <h3 className="space-section-title">Description</h3>
                            <p className="space-description">{space.description}</p>
                        </div>

                        {/* Amenities */}
                        <div className="space-section">
                            <h3 className="space-section-title">Amenities</h3>
                            <div className="amenities-list">
                                {amenitiesList.map((amenity, idx) => (
                                    <span key={idx} className="amenity-badge">
                                        {getAmenityIcon(amenity)}
                                        {amenity}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Host */}
                        <div className="space-section">
                            <h3 className="space-section-title">Host</h3>
                            <p className="space-description">
                                Hosted by <strong>{space.host_name || 'Michael Chen'}</strong>
                            </p>
                        </div>

                        {/* Location Map */}
                        <div className="space-section">
                            <h3 className="space-section-title">
                                <FiMapPin size={18} style={{ marginRight: '8px' }} />
                                Location
                            </h3>
                            <div className="space-map-container" style={{ 
                                height: '300px', 
                                borderRadius: '12px', 
                                overflow: 'hidden',
                                border: '1px solid #e5e7eb'
                            }}>
                                {space.latitude && space.longitude ? (
                                    <MapContainer 
                                        center={[space.latitude, space.longitude]} 
                                        zoom={14} 
                                        style={{ height: '100%', width: '100%' }}
                                    >
                                        <TileLayer
                                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                                        />
                                        <Marker position={[space.latitude, space.longitude]}>
                                            <Popup>
                                                <strong>{space.title}</strong><br />
                                                {space.location}
                                            </Popup>
                                        </Marker>
                                    </MapContainer>
                                ) : (
                                    <div style={{ 
                                        height: '100%', 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        justifyContent: 'center',
                                        background: '#f3f4f6',
                                        color: '#6b7280'
                                    }}>
                                        <FiMapPin size={24} style={{ marginRight: '8px' }} />
                                        Map location not available
                                    </div>
                                )}
                            </div>
                            <p style={{ marginTop: '12px', color: '#6a7282', fontSize: '14px' }}>
                                <FiMapPin size={14} style={{ marginRight: '6px' }} />
                                {space.location}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Booking Card */}
                <div className="booking-card">
                    <h3 className="booking-card-title">Book This Space</h3>
                    <p className="booking-card-subtitle">Select your preferred dates and time</p>

                    {/* Contact Information */}
                    <div className="form-group">
                        <label className="form-label">
                            <FiUser size={16} />
                            Full Name *
                        </label>
                        <input 
                            type="text" 
                            name="fullName"
                            value={bookingData.fullName}
                            onChange={handleBookingChange}
                            className="form-input"
                            placeholder="Enter your full name"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">
                            <FiMail size={16} />
                            Email Address *
                        </label>
                        <input 
                            type="email" 
                            name="email"
                            value={bookingData.email}
                            onChange={handleBookingChange}
                            className="form-input"
                            placeholder="your@email.com"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">
                            <FiPhone size={16} />
                            Phone Number *
                        </label>
                        <input 
                            type="tel" 
                            name="phone"
                            value={bookingData.phone}
                            onChange={handleBookingChange}
                            className="form-input"
                            placeholder="+1 (555) 000-0000"
                            required
                        />
                    </div>

                    <hr style={{ margin: '16px 0', borderColor: '#e5e7eb' }} />

                    {/* Booking Type Toggle */}
                    <div className="booking-type-toggle">
                        <button 
                            className={`booking-type-btn ${bookingType === 'hourly' ? 'active' : ''}`}
                            onClick={() => setBookingType('hourly')}
                        >
                            Hourly
                        </button>
                        <button 
                            className={`booking-type-btn ${bookingType === 'daily' ? 'active' : ''}`}
                            onClick={() => setBookingType('daily')}
                        >
                            Daily
                        </button>
                    </div>

                    {/* Booking Form */}
                    <div className="form-group">
                        <label className="form-label">
                            <FiCalendar size={16} />
                            Start Date
                        </label>
                        <input 
                            type="date" 
                            name="startDate"
                            value={bookingData.startDate}
                            onChange={handleBookingChange}
                            className="form-input"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">
                            <FiCalendar size={16} />
                            End Date
                        </label>
                        <input 
                            type="date" 
                            name="endDate"
                            value={bookingData.endDate}
                            onChange={handleBookingChange}
                            className="form-input"
                        />
                    </div>

                    {bookingType === 'hourly' && (
                        <>
                            <div className="form-group">
                                <label className="form-label">
                                    <FiClock size={16} />
                                    Start Time
                                </label>
                                <input 
                                    type="time" 
                                    name="startTime"
                                    value={bookingData.startTime}
                                    onChange={handleBookingChange}
                                    className="form-input"
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">
                                    <FiClock size={16} />
                                    End Time
                                </label>
                                <input 
                                    type="time" 
                                    name="endTime"
                                    value={bookingData.endTime}
                                    onChange={handleBookingChange}
                                    className="form-input"
                                />
                            </div>
                        </>
                    )}

                    {/* Rate Display */}
                    <div className="booking-rate">
                        <span>Rate:</span>
                        <span style={{ fontWeight: 600 }}>
                            ${bookingType === 'hourly' 
                                ? (space.price_per_hour || 50) 
                                : (space.price_per_night || (space.price_per_hour * 8) || 400)
                            }/{bookingType === 'hourly' ? 'hour' : 'day'}
                        </span>
                    </div>

                    {/* Booking Unavailable Notification */}
                    {bookingError && (
                        <div style={{
                            background: '#fff7ed',
                            border: '1px solid #fed7aa',
                            borderRadius: '12px',
                            padding: '16px',
                            marginBottom: '16px'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                                <FiAlertCircle size={22} color="#ea580c" />
                                <span style={{ color: '#c2410c', fontSize: '16px', fontWeight: 600 }}>
                                    Space Unavailable
                                </span>
                            </div>
                            <p style={{ color: '#9a3412', fontSize: '14px', margin: '0 0 12px 0', lineHeight: '1.5' }}>
                                {bookingError}
                            </p>
                            <button 
                                onClick={() => navigate('/spaces')}
                                style={{
                                    background: '#2563eb',
                                    color: 'white',
                                    border: 'none',
                                    padding: '8px 16px',
                                    borderRadius: '6px',
                                    fontSize: '14px',
                                    fontWeight: 500,
                                    cursor: 'pointer'
                                }}
                            >
                                Browse Other Spaces
                            </button>
                        </div>
                    )}

                    {/* Book Button */}
                    <button 
                        className="btn btn-primary booking-btn"
                        onClick={handleBooking}
                    >
                        {user ? 'Book Now' : 'Login to Book'}
                    </button>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default SpaceDetailsPage;
