/**
 * ChatContext.js - Live Chat State Management
 * This context manages real-time chat functionality between clients and admin support
 * It handles message storage, retrieval, and synchronization using localStorage
 */

// Import necessary React hooks for state management and context creation
import React, { createContext, useContext, useState, useCallback } from 'react';

// Create the ChatContext - this will hold all chat-related state and functions
const ChatContext = createContext();

/**
 * Helper function to retrieve stored conversations from browser's localStorage
 * This ensures chat history persists even after page refresh
 * @returns {Object} - Object containing all conversations indexed by oderId
 */
const getStoredConversations = () => {
    try {
        // Attempt to get saved conversations from localStorage
        const saved = localStorage.getItem('chat_conversations');
        
        // If no saved data exists, return empty object
        if (!saved) return {};
        
        // Parse the JSON string back into JavaScript object
        const conversations = JSON.parse(saved);
        
        // Auto-fix mechanism: Correct any conversations where userName is incorrectly set to 'Admin'
        // This can happen due to race conditions when admin replies first
        let needsSave = false;
        
        // Loop through each conversation to check and fix userName
        Object.keys(conversations).forEach(oderId => {
            const conv = conversations[oderId];
            
            // Check if userName needs correction
            if (conv.userName === 'Admin' || !conv.userName) {
                // Find the first message sent by the user to get their real name
                const userMsg = conv.messages?.find(m => m.sender === 'user');
                
                // If we found a user message with a valid senderName, use it
                if (userMsg && userMsg.senderName && userMsg.senderName !== 'Admin') {
                    conv.userName = userMsg.senderName;
                    needsSave = true; // Flag that we need to save the corrected data
                }
            }
        });
        
        // If any corrections were made, save the fixed data back to localStorage
        if (needsSave) {
            localStorage.setItem('chat_conversations', JSON.stringify(conversations));
        }
        
        // Return the conversations object
        return conversations;
    } catch {
        // If any error occurs (e.g., corrupted data), return empty object
        return {};
    }
};

/**
 * Helper function to save conversations to localStorage
 * This persists chat data so it survives page refreshes
 * @param {Object} conversations - The conversations object to save
 */
const saveConversations = (conversations) => {
    try {
        // Convert conversations object to JSON string and save to localStorage
        localStorage.setItem('chat_conversations', JSON.stringify(conversations));
    } catch (e) {
        // Log any errors that occur during saving
        console.error('Failed to save conversations:', e);
    }
};

/**
 * Custom hook to access chat context
 * This provides an easy way for components to access chat functionality
 * @returns {Object} - The chat context value containing all state and functions
 */
export const useChat = () => {
    // Get the context value
    const context = useContext(ChatContext);
    
    // Throw error if hook is used outside of ChatProvider
    if (!context) {
        throw new Error('useChat must be used within a ChatProvider');
    }
    
    // Return the context for use in components
    return context;
};

/**
 * ChatProvider Component - Wraps the app to provide chat functionality
 * This component manages all chat state and provides functions to child components
 * @param {Object} props - Component props
 * @param {ReactNode} props.children - Child components that will have access to chat context
 */
export const ChatProvider = ({ children }) => {
    // State for storing all conversations - initialized from localStorage
    const [conversations, setConversationsState] = useState(getStoredConversations);
    
    // State to track if chat window is open or closed
    const [isChatOpen, setIsChatOpen] = useState(false);
    
    // State to track the currently active conversation
    const [activeConversation, setActiveConversation] = useState(null);

    /**
     * Custom setter function that saves to localStorage whenever conversations change
     * Uses useCallback to prevent unnecessary re-renders
     */
    const setConversations = useCallback((updater) => {
        setConversationsState(prev => {
            // Handle both function updates and direct value updates
            const newConversations = typeof updater === 'function' ? updater(prev) : updater;
            // Save to localStorage for persistence
            saveConversations(newConversations);
            return newConversations;
        });
    }, []);

    /**
     * Refresh conversations from localStorage
     * Used for real-time updates - admin can see new messages from clients
     */
    const refreshConversations = useCallback(() => {
        // Read fresh data from localStorage
        const stored = getStoredConversations();
        // Update state with the fresh data
        setConversationsState(stored);
    }, []);

    /**
     * Get a specific conversation by user ID
     * @param {string} oderId - The user ID to get conversation for
     * @returns {Object} - The conversation object or default empty conversation
     */
    const getConversation = useCallback((userId) => {
        // Read fresh from localStorage to ensure we have latest data
        const stored = getStoredConversations();
        // Return the conversation or a default empty conversation
        return stored[userId] || { messages: [], status: 'active' };
    }, []);

    /**
     * Send a new message in a conversation
     * @param {string} oderId - The user ID for the conversation
     * @param {string} userName - Name of the message sender
     * @param {string} message - The message text content
     * @param {boolean} isAdmin - Whether the sender is an admin
     */
    const sendMessage = useCallback((userId, userName, message, isAdmin = false) => {
        // Convert oderId to string for consistent key matching
        const oderId = String(userId);
        
        // Create the new message object with all required fields
        const newMessage = {
            id: Date.now() + Math.random(), // Unique ID using timestamp + random number
            text: message,                   // The actual message content
            sender: isAdmin ? 'admin' : 'user', // Identify who sent the message
            senderName: isAdmin ? 'Support Agent' : userName, // Display name
            timestamp: new Date().toISOString(), // When the message was sent
            read: false                      // Message starts as unread
        };

        // Read current state from localStorage to avoid race conditions
        // This ensures we don't overwrite messages sent by others
        const currentConversations = getStoredConversations();
        
        // Check if conversation already exists for this user
        const existingConv = currentConversations[oderId];
        
        // Use existing conversation or create new one with default values
        const conversation = existingConv || { 
            messages: [],                    // Empty messages array for new conversation
            status: 'active',                // Conversation is active
            oderId: oderId,                   // Store the user ID
            oderId: oderId,                   // Store the user ID (duplicate for safety)
            userName,                        // Store the client's name
            startedAt: new Date().toISOString() // When conversation started
        };
        
        // Determine the final userName to store
        // If client is sending, always use their name
        // If admin is sending, preserve the existing client's name
        const finalUserName = isAdmin 
            ? (existingConv?.userName || userName)
            : userName;
        
        // Build the updated conversations object with the new message
        const updatedConversations = {
            ...currentConversations,         // Keep all existing conversations
            [oderId]: {                       // Update this specific conversation
                ...conversation,             // Keep existing conversation data
                oderId: oderId,               // Ensure oderId is set
                oderId: oderId,               // Duplicate for safety
                userName: finalUserName,     // Set the correct userName
                messages: [...conversation.messages, newMessage], // Add new message
                lastMessage: message,        // Store last message for preview
                lastMessageAt: new Date().toISOString() // Timestamp for sorting
            }
        };

        // Save to localStorage first to ensure data persistence
        saveConversations(updatedConversations);
        // Then update React state to trigger re-render
        setConversationsState(updatedConversations);
    }, []);

    /**
     * Mark messages as read in a conversation
     * @param {string} oderId - The user ID for the conversation
     * @param {boolean} isAdmin - Whether the reader is an admin
     */
    const markAsRead = useCallback((userId, isAdmin = false) => {
        // Get current conversations from localStorage
        const currentConversations = getStoredConversations();
        const conversation = currentConversations[userId];
        
        // If conversation doesn't exist, do nothing
        if (!conversation) return;

        // Create updated conversations with messages marked as read
        const updatedConversations = {
            ...currentConversations,
            [userId]: {
                ...conversation,
                // Map through messages and mark appropriate ones as read
                messages: conversation.messages.map(msg => ({
                    ...msg,
                    // Admin marks user messages as read, user marks admin messages as read
                    read: isAdmin 
                        ? (msg.sender === 'user' ? true : msg.read) 
                        : (msg.sender === 'admin' ? true : msg.read)
                }))
            }
        };

        // Save updated data to localStorage
        saveConversations(updatedConversations);
        // Update React state
        setConversationsState(updatedConversations);
    }, []);

    /**
     * Get count of unread messages for a specific user
     * Used to show notification badge on client's chat
     * @param {string} oderId - The user ID to check
     * @returns {number} - Count of unread admin messages
     */
    const getUnreadCountForUser = useCallback((userId) => {
        // Get conversations from localStorage
        const stored = getStoredConversations();
        const conversation = stored[userId];
        
        // Return 0 if no conversation exists
        if (!conversation) return 0;
        
        // Count messages from admin that haven't been read
        return conversation.messages.filter(msg => msg.sender === 'admin' && !msg.read).length;
    }, []);

    /**
     * Get total count of unread messages across all conversations for admin
     * Used to show notification badge on admin's chat page
     * @returns {number} - Total count of unread user messages
     */
    const getUnreadCountForAdmin = useCallback(() => {
        // Get all conversations from localStorage
        const stored = getStoredConversations();
        let total = 0;
        
        // Loop through each conversation and count unread user messages
        Object.values(stored).forEach(conv => {
            total += conv.messages.filter(msg => msg.sender === 'user' && !msg.read).length;
        });
        
        return total;
    }, []);

    /**
     * Get all conversations for admin view
     * Returns array of conversations sorted by most recent activity
     * @returns {Array} - Array of conversation objects
     */
    const getAllConversations = useCallback(() => {
        // Get conversations from localStorage
        const stored = getStoredConversations();
        
        // Convert object to array and add oderId/userId to each conversation
        return Object.entries(stored).map(([oderId, conv]) => ({
            ...conv,
            oderId: oderId,
            oderId,
            oderId: oderId
        }))
        // Sort by last message time, most recent first
        .sort((a, b) => new Date(b.lastMessageAt || 0) - new Date(a.lastMessageAt || 0));
    }, []);

    /**
     * Close a conversation (mark as closed but keep history)
     * @param {string} oderId - The user ID of conversation to close
     */
    const closeConversation = useCallback((userId) => {
        // Get current conversations
        const currentConversations = getStoredConversations();
        
        // Update the conversation status to closed
        const updatedConversations = {
            ...currentConversations,
            [userId]: {
                ...currentConversations[userId],
                status: 'closed'
            }
        };
        
        // Save and update state
        saveConversations(updatedConversations);
        setConversationsState(updatedConversations);
    }, []);

    /**
     * Clear/delete a conversation completely
     * Used when client wants to end chat and start fresh
     * @param {string} oderId - The user ID of conversation to delete
     */
    const clearConversation = useCallback((userId) => {
        // Convert to string for consistent key
        const oderId = String(userId);
        
        // Get current conversations
        const currentConversations = getStoredConversations();
        
        // Use destructuring to remove the conversation from the object
        // 'removed' contains the deleted conversation, 'remaining' has the rest
        const { [oderId]: removed, ...remaining } = currentConversations;
        
        // Save the remaining conversations (without the deleted one)
        saveConversations(remaining);
        setConversationsState(remaining);
    }, []);

    // Render the context provider with all values and functions
    return (
        <ChatContext.Provider value={{
            conversations,           // All conversations data
            isChatOpen,             // Whether chat window is open
            setIsChatOpen,          // Function to open/close chat
            activeConversation,     // Currently selected conversation
            setActiveConversation,  // Function to select a conversation
            getConversation,        // Get specific conversation by ID
            sendMessage,            // Send a new message
            markAsRead,             // Mark messages as read
            getUnreadCountForUser,  // Get unread count for a user
            getUnreadCountForAdmin, // Get total unread count for admin
            getAllConversations,    // Get all conversations for admin
            closeConversation,      // Close a conversation
            clearConversation,      // Delete a conversation completely
            refreshConversations    // Refresh data from localStorage
        }}>
            {children}
        </ChatContext.Provider>
    );
};

// Export the context as default for use in other components
export default ChatContext;
