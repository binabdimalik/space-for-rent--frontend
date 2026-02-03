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
