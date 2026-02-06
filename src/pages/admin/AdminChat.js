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
