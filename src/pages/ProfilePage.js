import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiUser, FiMail, FiCalendar, FiMapPin, FiClock, FiEdit2, FiHome, FiPlus } from 'react-icons/fi';
import { AuthContext } from '../context/AuthContext';
import { BookingsContext } from '../context/BookingsContext';
import Footer from '../components/common/Footer';

const ProfilePage = () => {
    const { user, logout } = useContext(AuthContext);
    const { getBookingsByClient } = useContext(BookingsContext);
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('bookings');

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        const isAdmin = user?.role === 'admin' || user?.role === 'super_admin' || user?.email === 'superadmin@spacesforrent.com';
        if (isAdmin) {
            navigate('/admin');
            return;
        }

        const userBookings = getBookingsByClient(user.email);
        setBookings(userBookings.map(b => ({
            id: b.id,
            space_title: b.spaceTitle,
            space_location: b.location || 'N/A',
            start_date: b.startDate,
            start_time: b.startTime || '09:00',
            end_time: b.endTime || '17:00',
            total_amount: b.totalAmount,
            status: b.status
        })));
        setLoading(false);
    }, [user, navigate, getBookingsByClient]);

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
        <div style={{ background: '#f5f5f4', minHeight: 'calc(100vh - 65px)' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' }}>
                {/* Profile Header */}
                <div style={{ 
                    background: 'white', 
                    borderRadius: '12px', 
                    padding: '32px', 
                    marginBottom: '24px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                        <div style={{ 
                            width: '80px', 
                            height: '80px', 
                            borderRadius: '50%', 
                            background: 'linear-gradient(135deg, #2563eb, #3b5bdb)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontSize: '32px',
                            fontWeight: 'bold'
                        }}>
                            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <div style={{ flex: 1 }}>
                            <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#1e3a8a', marginBottom: '4px' }}>
                                {user.name || 'User'}
                            </h1>
                            <p style={{ color: '#6a7282', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <FiMail size={14} />
                                {user.email}
                            </p>
                            {user.role === 'admin' && (
                                <span className="status-badge status-pending" style={{ marginTop: '8px', display: 'inline-block' }}>
                                    Admin
                                </span>
                            )}
                        </div>
                        <button className="btn btn-outline btn-sm">
                            <FiEdit2 size={14} />
                            Edit Profile
                        </button>
                    </div>
                </div>
