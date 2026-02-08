/**
 * FloatingChat.js - Client-Side Live Chat Component
 * This component provides a floating chat widget for clients to communicate
 * with admin support in real-time. It appears as a button in the bottom-right
 * corner and expands into a full chat window when clicked.
 * 
 * Features:
 * - Real-time message polling every 2 seconds
 * - Unread message badge notification
 * - Minimize/maximize chat window
 * - End chat functionality to clear conversation
 * - Auto-scroll to latest messages
 */

// Import React hooks for state, effects, refs, and context
import React, { useState, useEffect, useRef, useContext } from 'react';

// Import icons from react-icons library for UI elements
import { FiMessageCircle, FiX, FiSend, FiMinimize2, FiTrash2 } from 'react-icons/fi';

// Import custom hooks and contexts
import { useChat } from '../../context/ChatContext';  // Chat functionality
import { AuthContext } from '../../context/AuthContext';  // User authentication

// Import component-specific styles
import './FloatingChat.css';

/**
 * FloatingChat Component
 * Renders a floating chat widget for client-admin communication
 * Only visible to logged-in clients (not admins)
 */
const FloatingChat = () => {
    // Get current user from AuthContext
    const { user } = useContext(AuthContext);
    
    // Destructure chat functions and state from ChatContext
    const { 
        conversations,          // All conversations data
        isChatOpen,            // Whether chat window is open
        setIsChatOpen,         // Function to open/close chat
        sendMessage,           // Function to send messages
        markAsRead,            // Function to mark messages as read
        refreshConversations,  // Function to refresh data from localStorage
        clearConversation,     // Function to delete conversation
    } = useChat();

    /**
     * Effect: Poll for new messages every 2 seconds
     * This enables real-time updates when admin replies
     * Only runs when chat window is open to save resources
     */
    useEffect(() => {
        // Don't poll if chat is closed
        if (!isChatOpen) return;
        
        // Set up interval to refresh conversations every 2 seconds
        const interval = setInterval(() => {
            refreshConversations();  // Fetch latest data from localStorage
        }, 2000);
        
        // Cleanup: clear interval when component unmounts or chat closes
        return () => clearInterval(interval);
    }, [isChatOpen, refreshConversations]);
    
    // State for the message input field
    const [message, setMessage] = useState('');
    
    // State to track if chat window is minimized
    const [isMinimized, setIsMinimized] = useState(false);
    
    // Ref to scroll to the bottom of messages
    const messagesEndRef = useRef(null);
    
    // Ref to focus on input field
    const inputRef = useRef(null);
    
    // Ref to track if messages have been marked as read (prevents infinite loops)
    const hasMarkedRead = useRef(false);

    // Create unique userId as string for consistent localStorage key matching
    // Falls back to email or 'guest' if id is not available
    const oderId = String(user?.id || user?.email || 'guest');
    
    // Get user's display name, default to 'Guest User'
    const userName = user?.name || 'Guest User';
    
    // Get this user's conversation from state, or create empty default
    const conversation = conversations[oderId] || { messages: [], status: 'active' };
    
    // Count unread messages from admin (messages with sender='admin' and read=false)
    const unreadCount = conversation.messages?.filter(msg => msg.sender === 'admin' && !msg.read).length || 0;

    /**
     * Effect: Auto-scroll to bottom when new messages arrive
     * Uses smooth scrolling for better UX
     */
    useEffect(() => {
        // Only scroll if chat is open and not minimized
        if (isChatOpen && !isMinimized) {
            // Scroll the messages container to show the latest message
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [conversation.messages?.length, isChatOpen, isMinimized]);

    /**
     * Effect: Mark messages as read when user opens chat
     * Uses ref to prevent marking as read multiple times
     */
    useEffect(() => {
        // Mark as read when chat opens and there are unread messages
        if (isChatOpen && !isMinimized && !hasMarkedRead.current && conversation.messages?.length > 0) {
            hasMarkedRead.current = true;  // Set flag to prevent re-running
            markAsRead(oderId, false);      // Mark admin messages as read (false = user is reading)
        }
        
        // Reset the flag when chat is closed
        if (!isChatOpen) {
            hasMarkedRead.current = false;
        }
    }, [isChatOpen, isMinimized, oderId, conversation.messages?.length, markAsRead]);

    /**
     * Effect: Auto-focus on input field when chat opens
     * Improves UX by allowing immediate typing
     */
    useEffect(() => {
        // Focus input when chat is open and not minimized
        if (isChatOpen && !isMinimized && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isChatOpen, isMinimized]);

    /**
     * Handle sending a message
     * @param {Event} e - Form submit event
     */
    const handleSend = (e) => {
        e.preventDefault();  // Prevent form from refreshing page
        
        // Get trimmed message and validate
        const trimmedMessage = message.trim();
        if (!trimmedMessage) return;  // Don't send empty messages
        
        // Clear input immediately for better UX (don't wait for send to complete)
        setMessage('');
        
        // Send the message through ChatContext
        // Parameters: userId, userName, message text, isAdmin (false for clients)
        sendMessage(oderId, userName, trimmedMessage, false);
    };

    /**
     * Format timestamp for display
     * Converts ISO timestamp to readable time format (e.g., "2:30 PM")
     * @param {string} timestamp - ISO timestamp string
     * @returns {string} - Formatted time string
     */
    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString('en-US', { 
            hour: 'numeric',      // Hour without leading zero
            minute: '2-digit',    // Minutes with leading zero
            hour12: true          // Use 12-hour format with AM/PM
        });
    };

    // Don't render chat for non-logged-in users or admins
    // Admins have their own chat interface in the admin panel
    if (!user || user.role === 'admin' || user.role === 'super_admin') {
        return null;
    }

    // Render the floating chat widget
    return (
        <div className="floating-chat-container">
            {/* Chat Window - only shown when isChatOpen is true */}
            {isChatOpen && (
                <div className={`chat-window ${isMinimized ? 'minimized' : ''}`}>
                    {/* Chat Header with title and action buttons */}
                    <div className="chat-header">
                        <div className="chat-header-info">
                            {/* Chat avatar icon */}
                            <div className="chat-avatar">
                                <FiMessageCircle size={20} />
                            </div>
                            <div>
                                <h4>Live Support</h4>
                                {/* Online status indicator */}
                                <span className="chat-status">
                                    <span className="status-dot"></span>
                                    Online
                                </span>
                            </div>
                        </div>
                        
                        {/* Header action buttons: minimize and close */}
                        <div className="chat-header-actions">
                            {/* Minimize/Expand button */}
                            <button 
                                onClick={() => setIsMinimized(!isMinimized)}
                                className="chat-header-btn"
                                title={isMinimized ? "Expand" : "Minimize"}
                            >
                                <FiMinimize2 size={16} />
                            </button>
                            
                            {/* Close button */}
                            <button 
                                onClick={() => setIsChatOpen(false)}
                                className="chat-header-btn"
                                title="Close"
                            >
                                <FiX size={18} />
                            </button>
                        </div>
                    </div>

                    {/* Chat body - hidden when minimized */}
                    {!isMinimized && (
                        <>
                            {/* Messages container */}
                            <div className="chat-messages">
                                {/* Show welcome message if no messages yet */}
                                {conversation.messages.length === 0 ? (
                                    <div className="chat-welcome">
                                        <div className="welcome-icon">👋</div>
                                        <h4>Welcome to SpaceHub Support!</h4>
                                        <p>Hi {userName}! How can we help you today? Send us a message and we'll respond as soon as possible.</p>
                                    </div>
                                ) : (
                                    // Map through and display all messages
                                    conversation.messages.map((msg) => (
                                        <div 
                                            key={msg.id} 
                                            // Different styling for sent (user) vs received (admin) messages
                                            className={`chat-message ${msg.sender === 'user' ? 'sent' : 'received'}`}
                                        >
                                            <div className="message-content">
                                                <p>{msg.text}</p>
                                                {/* Display formatted timestamp */}
                                                <span className="message-time">
                                                    {formatTime(msg.timestamp)}
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                )}
                                {/* Invisible element to scroll to for auto-scroll functionality */}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Message input form */}
                            <form onSubmit={handleSend} className="chat-input-form">
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Type your message..."
                                    className="chat-input"
                                />
                                {/* Send button - disabled when input is empty */}
                                <button 
                                    type="submit" 
                                    className="chat-send-btn"
                                    disabled={!message.trim()}
                                >
                                    <FiSend size={18} />
                                </button>
                            </form>

                            {/* End Chat Button - only visible when there are messages */}
                            {conversation.messages.length > 0 && (
                                <button 
                                    className="end-chat-btn"
                                    onClick={() => {
                                        // Confirm before clearing chat history
                                        if (window.confirm('Are you sure you want to end this chat? All messages will be cleared.')) {
                                            clearConversation(oderId);  // Delete conversation
                                            setIsChatOpen(false);        // Close chat window
                                        }
                                    }}
                                >
                                    <FiTrash2 size={14} />
                                    End Chat
                                </button>
                            )}
                        </>
                    )}
                </div>
            )}

            {/* Floating action button to open/close chat */}
            <button 
                className={`floating-chat-btn ${isChatOpen ? 'active' : ''}`}
                onClick={() => {
                    setIsChatOpen(!isChatOpen);  // Toggle chat open/closed
                    setIsMinimized(false);       // Always expand when opening
                }}
            >
                {/* Show X icon when open, message icon when closed */}
                {isChatOpen ? (
                    <FiX size={24} />
                ) : (
                    <>
                        <FiMessageCircle size={24} />
                        {/* Show unread badge if there are unread messages */}
                        {unreadCount > 0 && (
                            <span className="unread-badge">{unreadCount}</span>
                        )}
                    </>
                )}
            </button>
        </div>
    );
};

// Export component for use in App.js
export default FloatingChat;
