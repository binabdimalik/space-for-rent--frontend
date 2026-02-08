import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiHome, FiGrid, FiUsers, FiCalendar, FiDollarSign, FiSearch, FiDownload, FiMail, FiPhone, FiMessageCircle } from 'react-icons/fi';
import { AuthContext } from '../../context/AuthContext';
import { BookingsContext } from '../../context/BookingsContext';

const AdminPayments = () => {
    const { user } = useContext(AuthContext);
    const { bookings } = useContext(BookingsContext);
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('');

    useEffect(() => {
        const isAdmin = user?.role === 'admin' || user?.role === 'super_admin' || user?.email === 'superadmin@spacesforrent.com';
        if (!user || !isAdmin) {
            navigate('/login');
            return;
        }
    }, [user, navigate]);

    // Transform bookings to payments format (same data source as AdminBookings)
    const payments = bookings.map(b => ({
        id: b.id,
        booking_id: b.id,
        space_title: b.spaceTitle,
        user_name: b.clientName,
        user_email: b.clientEmail,
        user_phone: b.clientPhone,
        amount: b.totalAmount,
        status: b.paymentStatus,
        method: b.paymentMethod || 'Credit Card',
        card_last4: '****',
        date: b.createdAt,
        booking_date: b.startDate
    }));

    // Calculate stats from bookings
    const stats = {
        total: payments.reduce((sum, p) => sum + p.amount, 0),
        paid: payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0),
        pending: payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0)
    };

    const filteredPayments = payments.filter(payment => {
        const matchesSearch = 
            payment.space_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            payment.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            payment.user_email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = !filterStatus || payment.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="admin-layout">
            {/* Sidebar */}
            <aside className="admin-sidebar">
                <div className="admin-sidebar-title">Admin Panel</div>
                <nav>
                    <Link to="/admin" className="admin-nav-link">
                        <FiGrid size={18} />
                        Dashboard
                    </Link>
                    <Link to="/admin/spaces" className="admin-nav-link">
                        <FiHome size={18} />
                        Spaces
                    </Link>
                    <Link to="/admin/users" className="admin-nav-link">
                        <FiUsers size={18} />
                        Users
                    </Link>
                    <Link to="/admin/bookings" className="admin-nav-link">
                        <FiCalendar size={18} />
                        Bookings
                    </Link>
                    <Link to="/admin/payments" className="admin-nav-link active">
                        <FiDollarSign size={18} />
                        Payments
                    </Link>
                    <Link to="/admin/chat" className="admin-nav-link">
                        <FiMessageCircle size={18} />
                        Live Chat
                    </Link>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="admin-content">
                <div className="admin-header">
                    <h1 className="admin-title">Payments</h1>
                    <button className="btn btn-outline">
                        <FiDownload size={16} />
                        Export CSV
                    </button>
                </div>

                {/* Stats Cards */}
                <div className="admin-stats" style={{ marginBottom: '24px' }}>
                    <div className="stat-card">
                        <div className="stat-label">Total Revenue</div>
                        <div className="stat-value" style={{ color: '#2563eb' }}>${stats.total.toLocaleString()}</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-label">Paid</div>
                        <div className="stat-value" style={{ color: '#059669' }}>${stats.paid.toLocaleString()}</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-label">Pending</div>
                        <div className="stat-value" style={{ color: '#f97316' }}>${stats.pending.toLocaleString()}</div>
                    </div>
                </div>

                {/* Filters */}
                <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
                    <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
                        <FiSearch style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#6a7282' }} />
                        <input
                            type="text"
                            placeholder="Search by space, client name or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="form-input"
                            style={{ paddingLeft: '40px' }}
                        />
                    </div>
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="form-input"
                        style={{ width: '180px' }}
                    >
                        <option value="">All Status</option>
                        <option value="paid">Paid</option>
                        <option value="pending">Pending</option>
                    </select>
                </div>

                {/* Payments Table */}
                <div className="admin-table">
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Space</th>
                                <th>Client</th>
                                <th>Contact</th>
                                <th>Amount</th>
                                <th>Method</th>
                                <th>Payment Date</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredPayments.map(payment => (
                                <tr key={payment.id}>
                                    <td style={{ color: '#6a7282' }}>#{payment.booking_id}</td>
                                    <td style={{ fontWeight: 600 }}>{payment.space_title}</td>
                                    <td>{payment.user_name}</td>
                                    <td>
                                        <div style={{ fontSize: '12px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '2px' }}>
                                                <FiMail size={12} color="#6a7282" />
                                                <a href={`mailto:${payment.user_email}`} style={{ color: '#2563eb', textDecoration: 'none' }}>{payment.user_email}</a>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                <FiPhone size={12} color="#6a7282" />
                                                <a href={`tel:${payment.user_phone}`} style={{ color: '#1e3a8a', textDecoration: 'none' }}>{payment.user_phone}</a>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ fontWeight: 700, color: '#2563eb', fontSize: '16px' }}>${payment.amount}</td>
                                    <td>
                                        <div style={{ fontSize: '13px' }}>
                                            <div>{payment.method}</div>
                                            {payment.card_last4 !== '-' && (
                                                <div style={{ color: '#6a7282', fontSize: '11px' }}>****{payment.card_last4}</div>
                                            )}
                                        </div>
                                    </td>
                                    <td>{payment.date}</td>
                                    <td>
                                        <span className={`status-badge ${payment.status === 'paid' ? 'status-available' : 'status-pending'}`}>
                                            {payment.status === 'paid' ? '✓ Paid' : '⏳ Pending'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredPayments.length === 0 && (
                    <div className="empty-state">
                        <div className="empty-state-icon">💳</div>
                        <p>No payments found matching your criteria.</p>
                    </div>
                )}
            </main>
        </div>
    );
};

export default AdminPayments;
