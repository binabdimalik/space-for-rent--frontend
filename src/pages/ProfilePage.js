import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiUser, FiMail, FiCalendar, FiMapPin, FiClock, FiEdit2, FiHome, FiPlus, FiX, FiCreditCard, FiCheck, FiDollarSign, FiTrendingUp } from 'react-icons/fi';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { AuthContext } from '../context/AuthContext';
import { BookingsContext } from '../context/BookingsContext';
import { SpacesContext } from '../context/SpacesContext';
import Footer from '../components/common/Footer';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const ProfilePage = () => {
    const { user, logout } = useContext(AuthContext);
    const { bookings: allBookings, getBookingsByClient, getBookingsBySpace } = useContext(BookingsContext);
    const { getSpaceById, getSpacesByOwner, spaces } = useContext(SpacesContext);
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('bookings');
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [mySpaces, setMySpaces] = useState([]);
    const [spaceBookings, setSpaceBookings] = useState([]);
    
    // Company fee percentage (10%)
    const COMPANY_FEE_PERCENT = 10;
    
    // Location coordinates for common locations
    const getLocationCoordinates = (location) => {
        const locationMap = {
            // Kenya
            'nairobi': [-1.2921, 36.8219],
            'parkland': [-1.2634, 36.8126],
            'westlands': [-1.2673, 36.8111],
            'kilimani': [-1.2892, 36.7873],
            'karen': [-1.3189, 36.7126],
            'mombasa': [-4.0435, 39.6682],
            'kisumu': [-0.1022, 34.7617],
            'upperhill': [-1.2950, 36.8150],
            'upper hill': [-1.2950, 36.8150],
            'cbd': [-1.2864, 36.8172],
            'lavington': [-1.2756, 36.7680],
            // US Cities
            'nyc': [40.7128, -74.0060],
            'new york': [40.7128, -74.0060],
            'los angeles': [34.0522, -118.2437],
            'miami': [25.7617, -80.1918],
            'chicago': [41.8781, -87.6298],
            'san francisco': [37.7749, -122.4194],
            'seattle': [47.6062, -122.3321],
            'boston': [42.3601, -71.0589],
            'denver': [39.7392, -104.9903],
            'austin': [30.2672, -97.7431],
            // Default
            'default': [-1.2921, 36.8219]
        };
        
        if (!location) return locationMap.default;
        const loc = location.toLowerCase();
        for (const [key, coords] of Object.entries(locationMap)) {
            if (key !== 'default' && loc.includes(key)) return coords;
        }
        return locationMap.default;
    };

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        // Redirect admins to admin dashboard - profile is for clients only
        const isAdmin = user?.role === 'admin' || user?.role === 'super_admin' || user?.email === 'superadmin@spacesforrent.com';
        if (isAdmin) {
            navigate('/admin');
            return;
        }

        // Get bookings for the current user by their email
        const userBookings = getBookingsByClient(user.email);
        setBookings(userBookings.map(b => {
            // Try to get location from booking, or fetch from space if available
            let spaceLocation = b.location;
            let spaceImage = b.spaceImage;
            
            // If location is missing, try to get it from the space
            if (!spaceLocation && b.spaceId && getSpaceById) {
                const space = getSpaceById(b.spaceId);
                if (space) {
                    spaceLocation = space.location;
                    spaceImage = spaceImage || space.image_url;
                }
            }
            
            return {
                id: b.id,
                space_title: b.spaceTitle,
                space_location: spaceLocation || 'Location not available',
                space_image: spaceImage || 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400',
                start_date: b.startDate,
                end_date: b.endDate || b.startDate,
                start_time: b.startTime || '09:00',
                end_time: b.endTime || '17:00',
                total_amount: b.totalAmount,
                status: b.status,
                paymentStatus: b.paymentStatus || 'paid',
                bookingType: b.bookingType || 'hourly',
                createdAt: b.createdAt || new Date().toISOString().split('T')[0],
                spaceId: b.spaceId
            };
        }));
        setLoading(false);
    }, [user, navigate, getBookingsByClient, allBookings, getSpaceById]);

    // Fetch owner's spaces and bookings on those spaces
    useEffect(() => {
        if (!user) return;
        
        // Get spaces owned by this user
        const ownerSpaces = getSpacesByOwner(user.id, user.email);
        setMySpaces(ownerSpaces);
        
        // Get all bookings for owner's spaces
        let allSpaceBookings = [];
        ownerSpaces.forEach(space => {
            const bookingsForSpace = getBookingsBySpace(space.id);
            bookingsForSpace.forEach(booking => {
                allSpaceBookings.push({
                    ...booking,
                    spaceName: space.title,
                    spaceLocation: space.location,
                    spaceImage: space.image_url
                });
            });
        });
        setSpaceBookings(allSpaceBookings);
    }, [user, spaces, getSpacesByOwner, getBookingsBySpace]);

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'confirmed': return 'status-available';
            case 'pending': return 'status-pending';
            case 'completed': return 'status-available';
            case 'cancelled': return 'status-booked';
            default: return 'status-pending';
        }
    };

    if (!user) {
        return null;
    }

    return (
        <div className="profile-page">
            <div className="profile-container">
                {/* Profile Header */}
                <div className="profile-header-card">
                    <div className="profile-header-content">
                        <div className="profile-avatar">
                            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <div className="profile-info">
                            <h1 className="profile-name">
                                {user.name || 'User'}
                            </h1>
                            <p className="profile-email">
                                <FiMail size={14} />
                                {user.email}
                            </p>
                            {user.role === 'admin' && (
                                <span className="status-badge status-pending" style={{ marginTop: '8px', display: 'inline-block' }}>
                                    Admin
                                </span>
                            )}
                        </div>
                        <button className="btn btn-outline btn-sm profile-edit-btn">
                            <FiEdit2 size={14} />
                            <span className="btn-text-desktop">Edit Profile</span>
                        </button>
                    </div>
                </div>

                {/* List Your Space Card */}
                <div className="profile-list-space-card">
                    <div className="profile-list-space-content">
                        <div className="profile-list-space-icon">
                            <FiHome size={24} color="white" />
                        </div>
                        <div className="profile-list-space-text">
                            <h3>Own a Space?</h3>
                            <p>List your property and start earning from rentals</p>
                        </div>
                    </div>
                    <Link to="/list-space" className="btn" style={{ 
                        background: 'white', 
                        color: '#2563eb', 
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}>
                        <FiPlus size={16} />
                        List Your Space
                    </Link>
                </div>

                {/* Tabs */}
                <div style={{ 
                    display: 'flex', 
                    gap: '8px', 
                    marginBottom: '24px',
                    borderBottom: '1px solid #e5e7eb',
                    paddingBottom: '16px'
                }}>
                    <button 
                        className={`btn ${activeTab === 'bookings' ? 'btn-primary' : 'btn-ghost'}`}
                        onClick={() => setActiveTab('bookings')}
                    >
                        My Bookings
                    </button>
                    {mySpaces.length > 0 && (
                        <button 
                            className={`btn ${activeTab === 'myspaces' ? 'btn-primary' : 'btn-ghost'}`}
                            onClick={() => setActiveTab('myspaces')}
                        >
                            <FiHome size={14} style={{ marginRight: '6px' }} />
                            My Spaces ({mySpaces.length})
                        </button>
                    )}
                    <button 
                        className={`btn ${activeTab === 'settings' ? 'btn-primary' : 'btn-ghost'}`}
                        onClick={() => setActiveTab('settings')}
                    >
                        Settings
                    </button>
                </div>

                {/* Content */}
                {activeTab === 'bookings' && (
                    <div>
                        <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#1e3a8a', marginBottom: '16px' }}>
                            Your Bookings
                        </h2>
                        
                        {loading ? (
                            <div className="loading">
                                <div className="spinner"></div>
                            </div>
                        ) : bookings.length === 0 ? (
                            <div className="empty-state" style={{ background: 'white', borderRadius: '12px' }}>
                                <div className="empty-state-icon">📅</div>
                                <p>You haven't made any bookings yet.</p>
                                <button 
                                    className="btn btn-primary" 
                                    style={{ marginTop: '16px' }}
                                    onClick={() => navigate('/spaces')}
                                >
                                    Browse Spaces
                                </button>
                            </div>
                        ) : (
                            <div className="profile-bookings-list">
                                {bookings.map(booking => (
                                    <div key={booking.id} className="profile-booking-card">
                                        <div className="profile-booking-info">
                                            <h3 className="profile-booking-title">
                                                {booking.space_title}
                                            </h3>
                                            <div className="profile-booking-meta">
                                                <span>
                                                    <FiMapPin size={14} />
                                                    {booking.space_location}
                                                </span>
                                                <span>
                                                    <FiCalendar size={14} />
                                                    {booking.start_date}
                                                </span>
                                                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                    <FiClock size={14} />
                                                    {booking.start_time} - {booking.end_time}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="profile-booking-actions">
                                            <div className="profile-booking-price">
                                                ${booking.total_amount}
                                            </div>
                                            <span className={`status-badge ${getStatusBadgeClass(booking.status)}`}>
                                                {booking.status}
                                            </span>
                                            <button 
                                                className="btn btn-outline btn-sm"
                                                onClick={() => setSelectedTicket(booking)}
                                            >
                                                View Ticket
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'myspaces' && (
                    <div>
                        {/* Income Summary */}
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                            gap: '16px',
                            marginBottom: '24px'
                        }}>
                            <div style={{
                                background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
                                borderRadius: '12px',
                                padding: '20px',
                                color: 'white'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                    <FiDollarSign size={20} />
                                    <span style={{ fontSize: '14px', opacity: 0.9 }}>Total Earnings</span>
                                </div>
                                <div style={{ fontSize: '28px', fontWeight: 700 }}>
                                    ${spaceBookings.filter(b => b.status === 'confirmed' || b.status === 'completed').reduce((sum, b) => sum + (b.totalAmount || 0), 0).toFixed(2)}
                                </div>
                            </div>
                            <div style={{
                                background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                                borderRadius: '12px',
                                padding: '20px',
                                color: 'white'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                    <FiTrendingUp size={20} />
                                    <span style={{ fontSize: '14px', opacity: 0.9 }}>Your Income (after {COMPANY_FEE_PERCENT}% fee)</span>
                                </div>
                                <div style={{ fontSize: '28px', fontWeight: 700 }}>
                                    ${(spaceBookings.filter(b => b.status === 'confirmed' || b.status === 'completed').reduce((sum, b) => sum + (b.totalAmount || 0), 0) * (1 - COMPANY_FEE_PERCENT / 100)).toFixed(2)}
                                </div>
                            </div>
                            <div style={{
                                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                                borderRadius: '12px',
                                padding: '20px',
                                color: 'white'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                    <FiCalendar size={20} />
                                    <span style={{ fontSize: '14px', opacity: 0.9 }}>Total Bookings</span>
                                </div>
                                <div style={{ fontSize: '28px', fontWeight: 700 }}>
                                    {spaceBookings.length}
                                </div>
                            </div>
                        </div>

                        {/* My Listed Spaces */}
                        <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#1e3a8a', marginBottom: '16px' }}>
                            Your Listed Spaces
                        </h2>
                        <div style={{ display: 'grid', gap: '16px', marginBottom: '32px' }}>
                            {mySpaces.map(space => (
                                <div key={space.id} style={{
                                    background: 'white',
                                    borderRadius: '12px',
                                    padding: '16px',
                                    display: 'flex',
                                    gap: '16px',
                                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                                    alignItems: 'center'
                                }}>
                                    <img 
                                        src={space.image_url} 
                                        alt={space.title}
                                        style={{
                                            width: '80px',
                                            height: '80px',
                                            borderRadius: '8px',
                                            objectFit: 'cover'
                                        }}
                                    />
                                    <div style={{ flex: 1 }}>
                                        <h3 style={{ fontWeight: 600, color: '#1e3a8a', marginBottom: '4px' }}>
                                            {space.title}
                                        </h3>
                                        <p style={{ color: '#6b7280', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            <FiMapPin size={14} />
                                            {space.location}
                                        </p>
                                        <p style={{ color: '#2563eb', fontWeight: 600, marginTop: '4px' }}>
                                            ${space.price_per_hour}/hour
                                        </p>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <span className={`status-badge status-${space.status || 'available'}`}>
                                            {space.status || 'Available'}
                                        </span>
                                        <p style={{ color: '#6b7280', fontSize: '12px', marginTop: '8px' }}>
                                            {spaceBookings.filter(b => b.spaceId === space.id).length} bookings
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Bookings on My Spaces */}
                        <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#1e3a8a', marginBottom: '16px' }}>
                            Bookings on Your Spaces
                        </h2>
                        {spaceBookings.length === 0 ? (
                            <div className="empty-state" style={{ background: 'white', borderRadius: '12px' }}>
                                <div className="empty-state-icon">📅</div>
                                <p>No bookings on your spaces yet.</p>
                            </div>
                        ) : (
                            <div style={{
                                background: 'white',
                                borderRadius: '12px',
                                overflow: 'hidden',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                            }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e5e7eb' }}>
                                            <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '13px', fontWeight: 600, color: '#64748b' }}>Space</th>
                                            <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '13px', fontWeight: 600, color: '#64748b' }}>Client</th>
                                            <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '13px', fontWeight: 600, color: '#64748b' }}>Date</th>
                                            <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '13px', fontWeight: 600, color: '#64748b' }}>Amount</th>
                                            <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '13px', fontWeight: 600, color: '#64748b' }}>Your Earnings</th>
                                            <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '13px', fontWeight: 600, color: '#64748b' }}>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {spaceBookings.map(booking => (
                                            <tr key={booking.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                                                <td style={{ padding: '12px 16px', fontSize: '14px', fontWeight: 500 }}>{booking.spaceName}</td>
                                                <td style={{ padding: '12px 16px', fontSize: '14px', color: '#6b7280' }}>{booking.clientName || booking.clientEmail}</td>
                                                <td style={{ padding: '12px 16px', fontSize: '14px', color: '#6b7280' }}>{booking.startDate}</td>
                                                <td style={{ padding: '12px 16px', fontSize: '14px', fontWeight: 600 }}>${booking.totalAmount}</td>
                                                <td style={{ padding: '12px 16px', fontSize: '14px', fontWeight: 600, color: '#059669' }}>
                                                    ${(booking.totalAmount * (1 - COMPANY_FEE_PERCENT / 100)).toFixed(2)}
                                                </td>
                                                <td style={{ padding: '12px 16px' }}>
                                                    <span className={`status-badge ${getStatusBadgeClass(booking.status)}`}>
                                                        {booking.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'settings' && (
                    <div style={{ 
                        background: 'white', 
                        borderRadius: '12px', 
                        padding: '32px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                    }}>
                        <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#1e3a8a', marginBottom: '24px' }}>
                            Account Settings
                        </h2>
                        
                        <div className="form-group">
                            <label className="form-label">
                                <FiUser size={16} />
                                Full Name
                            </label>
                            <input 
                                type="text" 
                                className="form-input" 
                                defaultValue={user.name}
                            />
                        </div>
                        
                        <div className="form-group">
                            <label className="form-label">
                                <FiMail size={16} />
                                Email Address
                            </label>
                            <input 
                                type="email" 
                                className="form-input" 
                                defaultValue={user.email}
                                disabled
                            />
                        </div>

                        <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                            <button className="btn btn-primary">
                                Save Changes
                            </button>
                            <button className="btn btn-outline" onClick={logout} style={{ color: '#dc2626', borderColor: '#dc2626' }}>
                                Logout
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Ticket Modal */}
            {selectedTicket && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                    padding: '20px'
                }} onClick={() => setSelectedTicket(null)}>
                    <div style={{
                        background: 'white',
                        borderRadius: '16px',
                        maxWidth: '550px',
                        width: '100%',
                        maxHeight: '90vh',
                        overflow: 'auto',
                        boxShadow: '0 25px 50px rgba(0,0,0,0.25)'
                    }} onClick={(e) => e.stopPropagation()}>
                        {/* Space Image Header */}
                        <div style={{ position: 'relative' }}>
                            <img 
                                src={selectedTicket.space_image} 
                                alt={selectedTicket.space_title}
                                style={{
                                    width: '100%',
                                    height: '180px',
                                    objectFit: 'cover',
                                    borderRadius: '16px 16px 0 0'
                                }}
                            />
                            <button 
                                onClick={() => setSelectedTicket(null)}
                                style={{
                                    position: 'absolute',
                                    top: '12px',
                                    right: '12px',
                                    background: 'rgba(0,0,0,0.5)',
                                    border: 'none',
                                    borderRadius: '50%',
                                    width: '32px',
                                    height: '32px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white'
                                }}
                            >
                                <FiX size={18} />
                            </button>
                            <div style={{
                                position: 'absolute',
                                bottom: 0,
                                left: 0,
                                right: 0,
                                background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
                                padding: '40px 20px 16px',
                                color: 'white'
                            }}>
                                <h3 style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '2px', opacity: 0.8, marginBottom: '4px' }}>
                                    Reservation Ticket
                                </h3>
                                <h2 style={{ fontSize: '20px', fontWeight: 700 }}>
                                    {selectedTicket.space_title}
                                </h2>
                                <p style={{ opacity: 0.9, marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px' }}>
                                    <FiMapPin size={14} />
                                    {selectedTicket.space_location}
                                </p>
                            </div>
                        </div>

                        {/* Modal Body */}
                        <div style={{ padding: '24px' }}>
                            {/* Confirmation Number */}
                            <div style={{
                                background: '#f0f9ff',
                                borderRadius: '8px',
                                padding: '16px',
                                textAlign: 'center',
                                marginBottom: '24px'
                            }}>
                                <p style={{ fontSize: '12px', color: '#6a7282', marginBottom: '4px' }}>Confirmation Number</p>
                                <p style={{ fontSize: '20px', fontWeight: 700, color: '#2563eb', letterSpacing: '2px' }}>
                                    SFR-{String(selectedTicket.id).padStart(8, '0')}
                                </p>
                            </div>

                            {/* Ticket Details Grid */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                <div style={{ padding: '14px', background: '#f5f5f4', borderRadius: '8px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#6a7282', marginBottom: '4px' }}>
                                        <FiCalendar size={14} />
                                        <span style={{ fontSize: '11px', textTransform: 'uppercase' }}>Date</span>
                                    </div>
                                    <p style={{ fontWeight: 700, fontSize: '14px', color: '#1e3a8a' }}>
                                        {selectedTicket.start_date}
                                        {selectedTicket.start_date !== selectedTicket.end_date && ` - ${selectedTicket.end_date}`}
                                    </p>
                                </div>

                                <div style={{ padding: '14px', background: '#f5f5f4', borderRadius: '8px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#6a7282', marginBottom: '4px' }}>
                                        <FiClock size={14} />
                                        <span style={{ fontSize: '11px', textTransform: 'uppercase' }}>Time</span>
                                    </div>
                                    <p style={{ fontWeight: 700, fontSize: '14px', color: '#1e3a8a' }}>
                                        {selectedTicket.bookingType === 'hourly' 
                                            ? `${selectedTicket.start_time} - ${selectedTicket.end_time}`
                                            : 'Full Day Access'
                                        }
                                    </p>
                                </div>

                                <div style={{ padding: '14px', background: '#f5f5f4', borderRadius: '8px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#6a7282', marginBottom: '4px' }}>
                                        <FiUser size={14} />
                                        <span style={{ fontSize: '11px', textTransform: 'uppercase' }}>Guest</span>
                                    </div>
                                    <p style={{ fontWeight: 700, fontSize: '14px', color: '#1e3a8a' }}>
                                        {user?.name || 'Guest'}
                                    </p>
                                </div>

                                <div style={{ padding: '14px', background: '#f5f5f4', borderRadius: '8px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#6a7282', marginBottom: '4px' }}>
                                        <FiCreditCard size={14} />
                                        <span style={{ fontSize: '11px', textTransform: 'uppercase' }}>Amount Paid</span>
                                    </div>
                                    <p style={{ fontWeight: 700, fontSize: '14px', color: '#10b981' }}>
                                        ${selectedTicket.total_amount}
                                    </p>
                                </div>
                            </div>

                            {/* Status Badge */}
                            <div style={{ textAlign: 'center', marginTop: '20px' }}>
                                <span style={{
                                    background: selectedTicket.status === 'confirmed' ? '#dcfce7' : '#fef3c7',
                                    color: selectedTicket.status === 'confirmed' ? '#16a34a' : '#d97706',
                                    padding: '8px 20px',
                                    borderRadius: '20px',
                                    fontWeight: 600,
                                    fontSize: '13px',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '6px'
                                }}>
                                    <FiCheck size={14} />
                                    {selectedTicket.status?.toUpperCase()} & {selectedTicket.paymentStatus?.toUpperCase()}
                                </span>
                            </div>

                            {/* Location Map */}
                            <div style={{ marginTop: '20px' }}>
                                <h4 style={{ fontSize: '13px', fontWeight: 600, color: '#1e3a8a', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <FiMapPin size={14} />
                                    Location Map
                                </h4>
                                <div style={{ borderRadius: '8px', overflow: 'hidden', height: '150px' }}>
                                    <MapContainer 
                                        center={getLocationCoordinates(selectedTicket.space_location)} 
                                        zoom={14} 
                                        style={{ height: '100%', width: '100%' }}
                                        scrollWheelZoom={false}
                                    >
                                        <TileLayer
                                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                            attribution='&copy; OpenStreetMap'
                                        />
                                        <Marker position={getLocationCoordinates(selectedTicket.space_location)}>
                                            <Popup>
                                                <strong>{selectedTicket.space_title}</strong><br />
                                                {selectedTicket.space_location}
                                            </Popup>
                                        </Marker>
                                    </MapContainer>
                                </div>
                            </div>

                            {/* Note */}
                            <p style={{ 
                                textAlign: 'center', 
                                marginTop: '20px', 
                                fontSize: '13px', 
                                color: '#6a7282',
                                padding: '14px',
                                background: '#fefce8',
                                borderRadius: '8px'
                            }}>
                                📧 Booked on: <strong>{selectedTicket.createdAt}</strong>
                                <br />
                                <span style={{ fontSize: '11px' }}>Please show this ticket upon arrival</span>
                            </p>
                        </div>

                        {/* Modal Footer */}
                        <div style={{
                            borderTop: '1px solid #e5e7eb',
                            padding: '16px 24px',
                            display: 'flex',
                            justifyContent: 'center'
                        }}>
                            <button 
                                className="btn btn-primary"
                                onClick={() => setSelectedTicket(null)}
                            >
                                Close Ticket
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
};

export default ProfilePage;
