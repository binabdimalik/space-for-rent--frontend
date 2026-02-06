import React, { useState, useEffect, useRef, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMessageCircle, FiSend, FiUser, FiClock, FiCheck, FiCheckCircle, FiHome, FiGrid, FiUsers, FiCalendar, FiDollarSign } from 'react-icons/fi';
import { useChat } from '../../context/ChatContext';
import { AuthContext } from '../../context/AuthContext';

const AdminChat = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const { 
        conversations: allConvs,
        getAllConversations, 
        sendMessage, 
        markAsRead,
        getUnreadCountForAdmin,
        refreshConversations
    } = useChat();
    
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [message, setMessage] = useState('');
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);
    const lastMarkedUserId = useRef(null);

    useEffect(() => {
        const isAdmin = user?.role === 'admin' || user?.role === 'super_admin' || user?.email === 'superadmin@spacesforrent.com';
        if (!user || !isAdmin) {
            navigate('/login');
            return;
        }
    }, [user, navigate]);

    // Poll for new messages every 2 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            refreshConversations();
        }, 2000);
        
        return () => clearInterval(interval);
    }, [refreshConversations]);

    const conversations = getAllConversations();
    const selectedConversation = selectedUserId ? (allConvs[selectedUserId] || { messages: [] }) : null;
    // Find the client name from the conversations list
    const selectedConvInfo = conversations.find(c => String(c.userId) === String(selectedUserId));
    const clientName = selectedConvInfo?.userName || selectedConversation?.userName || 'Unknown User';
    const totalUnread = getUnreadCountForAdmin();

    // Scroll to bottom when messages change
    useEffect(() => {
        if (selectedUserId) {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [selectedConversation?.messages?.length, selectedUserId]);

    // Mark as read only when selecting a new conversation
    useEffect(() => {
        if (selectedUserId && selectedUserId !== lastMarkedUserId.current) {
            lastMarkedUserId.current = selectedUserId;
            markAsRead(selectedUserId, true);
        }
    }, [selectedUserId, markAsRead]);

    useEffect(() => {
        if (selectedUserId && inputRef.current) {
            inputRef.current.focus();
        }
    }, [selectedUserId]);

    const handleSend = (e) => {
        e.preventDefault();
        if (!message.trim() || !selectedUserId) return;
        
        sendMessage(selectedUserId, 'Admin', message.trim(), true);
        setMessage('');
    };

    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0) {
            return date.toLocaleTimeString('en-US', { 
                hour: 'numeric', 
                minute: '2-digit',
                hour12: true 
            });
        } else if (diffDays === 1) {
            return 'Yesterday';
        } else {
            return date.toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric' 
            });
        }
    };

    const getUnreadForConversation = (conv) => {
        return conv.messages?.filter(msg => msg.sender === 'user' && !msg.read).length || 0;
    };

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
                    <Link to="/admin/payments" className="admin-nav-link">
                        <FiDollarSign size={18} />
                        Payments
                    </Link>
                    <Link to="/admin/chat" className="admin-nav-link active">
                        <FiMessageCircle size={18} />
                        Live Chat
                    </Link>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="admin-content">
                <div className="admin-header">
                    <div>
                        <h1 className="admin-title">
                            <FiMessageCircle style={{ marginRight: '12px' }} />
                            Live Support Chat
                        </h1>
                        <p className="admin-subtitle">
                            Manage customer conversations in real-time
                            {totalUnread > 0 && (
                                <span style={{
                                    background: '#f97316',
                                    color: 'white',
                                    padding: '2px 8px',
                                    borderRadius: '12px',
                                    fontSize: '12px',
                                    marginLeft: '12px'
                                }}>
                                    {totalUnread} unread
                                </span>
                            )}
                        </p>
                    </div>
                </div>
                v style={{
                display: 'grid',
                gridTemplateColumns: '320px 1fr',
                gap: '24px',
                height: 'calc(100vh - 220px)',
                minHeight: '500px'
            }}>
                {/* Conversations List */}
                <div style={{
                    background: 'white',
                    borderRadius: '12px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                    <div style={{
                        padding: '16px 20px',
                        borderBottom: '1px solid #e5e7eb',
                        fontWeight: 600,
                        color: '#1e3a8a'
                    }}>
                        Conversations ({conversations.length})
                    </div>
                    <div style={{
                        flex: 1,
                        overflowY: 'auto'
                    }}>
                        {conversations.length === 0 ? (
                            <div style={{
                                padding: '40px 20px',
                                textAlign: 'center',
                                color: '#6a7282'
                            }}>
                                <FiMessageCircle size={40} style={{ opacity: 0.3, marginBottom: '12px' }} />
                                <p>No conversations yet</p>
                            </div>
                        ) : (
                            conversations.map((conv) => {
                                const unread = getUnreadForConversation(conv);
                                return (
                                    <div
                                        key={conv.userId}
                                        onClick={() => setSelectedUserId(conv.userId)}
                                        style={{
                                            padding: '16px 20px',
                                            borderBottom: '1px solid #f3f4f6',
                                            cursor: 'pointer',
                                            background: selectedUserId === conv.userId ? '#eff6ff' : 'white',
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            marginBottom: '4px'
                                        }}>
                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '10px'
                                            }}>
                                                <div style={{
                                                    width: '36px',
                                                    height: '36px',
                                                    background: '#eff6ff',
                                                    borderRadius: '50%',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    color: '#2563eb'
                                                }}>
                                                    <FiUser size={16} />
                                                </div>
                                                <span style={{
                                                    fontWeight: 600,
                                                    color: '#1e3a8a',
                                                    fontSize: '14px'
                                                }}>
                                                    {conv.userName || 'Unknown User'}
                                                </span>
                                            </div>
                                            {unread > 0 && (
                                                <span style={{
                                                    background: '#f97316',
                                                    color: 'white',
                                                    fontSize: '11px',
                                                    fontWeight: 700,
                                                    padding: '2px 8px',
                                                    borderRadius: '10px'
                                                }}>
                                                    {unread}
                                                </span>
                                            )}
                                        </div>
                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            marginLeft: '46px'
                                        }}>
                                            <p style={{
                                                margin: 0,
                                                fontSize: '13px',
                                                color: '#6a7282',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap',
                                                maxWidth: '160px'
                                            }}>
                                                {conv.lastMessage || 'No messages'}
                                            </p>
                                            <span style={{
                                                fontSize: '11px',
                                                color: '#9ca3af'
                                            }}>
                                                {conv.lastMessageAt ? formatTime(conv.lastMessageAt) : ''}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

