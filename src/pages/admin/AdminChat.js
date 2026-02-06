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

                {/* Chat Area */}
                <div style={{
                    background: 'white',
                    borderRadius: '12px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                    {selectedUserId && selectedConversation ? (
                        <>
                            {/* Chat Header */}
                            <div style={{
                                padding: '16px 24px',
                                borderBottom: '1px solid #e5e7eb',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between'
                            }}>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px'
                                }}>
                                    <div style={{
                                        width: '44px',
                                        height: '44px',
                                        background: 'linear-gradient(135deg, #2563eb, #3b5bdb)',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'white'
                                    }}>
                                        <FiUser size={20} />
                                    </div>
                                    <div>
                                        <h3 style={{
                                            margin: 0,
                                            fontSize: '16px',
                                            fontWeight: 600,
                                            color: '#1e3a8a'
                                        }}>
                                            {clientName}
                                        </h3>
                                        <span style={{
                                            fontSize: '12px',
                                            color: '#22c55e',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '4px'
                                        }}>
                                            <span style={{
                                                width: '6px',
                                                height: '6px',
                                                background: '#22c55e',
                                                borderRadius: '50%'
                                            }}></span>
                                            Active now
                                        </span>
                                    </div>
                                </div>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    color: '#6a7282',
                                    fontSize: '13px'
                                }}>
                                    <FiClock size={14} />
                                    Started {selectedConversation.startedAt ? 
                                        new Date(selectedConversation.startedAt).toLocaleDateString() : 
                                        'Today'}
                                </div>
                            </div>

                            {/* Messages */}
                            <div style={{
                                flex: 1,
                                overflowY: 'auto',
                                padding: '20px 24px',
                                background: '#f9fafb',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '12px'
                            }}>
                                {selectedConversation.messages?.map((msg) => (
                                    <div
                                        key={msg.id}
                                        style={{
                                            display: 'flex',
                                            justifyContent: msg.sender === 'admin' ? 'flex-end' : 'flex-start',
                                            maxWidth: '70%',
                                            alignSelf: msg.sender === 'admin' ? 'flex-end' : 'flex-start'
                                        }}
                                    >
                                        <div style={{
                                            padding: '12px 16px',
                                            borderRadius: '16px',
                                            borderBottomRightRadius: msg.sender === 'admin' ? '4px' : '16px',
                                            borderBottomLeftRadius: msg.sender === 'user' ? '4px' : '16px',
                                            background: msg.sender === 'admin' 
                                                ? 'linear-gradient(135deg, #2563eb, #3b5bdb)' 
                                                : 'white',
                                            color: msg.sender === 'admin' ? 'white' : '#364153',
                                            boxShadow: msg.sender === 'user' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
                                        }}>
                                            <p style={{
                                                margin: 0,
                                                fontSize: '14px',
                                                lineHeight: 1.5
                                            }}>
                                                {msg.text}
                                            </p>
                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'flex-end',
                                                gap: '4px',
                                                marginTop: '4px',
                                                opacity: 0.7,
                                                fontSize: '10px'
                                            }}>
                                                {formatTime(msg.timestamp)}
                                                {msg.sender === 'admin' && (
                                                    msg.read ? 
                                                        <FiCheckCircle size={12} /> : 
                                                        <FiCheck size={12} />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input */}
                            <form onSubmit={handleSend} style={{
                                padding: '16px 24px',
                                borderTop: '1px solid #e5e7eb',
                                display: 'flex',
                                gap: '12px'
                            }}>
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Type your reply..."
                                    style={{
                                        flex: 1,
                                        padding: '12px 20px',
                                        border: '2px solid #e5e7eb',
                                        borderRadius: '24px',
                                        fontSize: '14px',
                                        outline: 'none',
                                        transition: 'border-color 0.2s'
                                    }}
                                    onFocus={(e) => e.target.style.borderColor = '#2563eb'}
                                    onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                                />
                                <button
                                    type="submit"
                                    disabled={!message.trim()}
                                    style={{
                                        width: '48px',
                                        height: '48px',
                                        borderRadius: '50%',
                                        background: message.trim() 
                                            ? 'linear-gradient(135deg, #2563eb, #3b5bdb)' 
                                            : '#e5e7eb',
                                        border: 'none',
                                        cursor: message.trim() ? 'pointer' : 'not-allowed',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'white',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    <FiSend size={18} />
                                </button>
                            </form>
                        </>
                    ) : (
                        <div style={{
                            flex: 1,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#6a7282'
                        }}>
                            <FiMessageCircle size={64} style={{ opacity: 0.2, marginBottom: '16px' }} />
                            <h3 style={{ margin: '0 0 8px', color: '#1e3a8a' }}>
                                Select a Conversation
                            </h3>
                            <p style={{ margin: 0, fontSize: '14px' }}>
                                Choose a conversation from the list to start replying
                            </p>
                        </div>
                    )}
                </div>
            </div>
            </main>
        </div>
    );
};

export default AdminChat;

