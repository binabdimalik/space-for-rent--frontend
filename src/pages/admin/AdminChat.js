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