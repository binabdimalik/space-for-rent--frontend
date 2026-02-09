/**
 * SpacesContext.js - Rental Space Management
 * This context manages all rental spaces in the platform including:
 * - Space listings (CRUD operations)
 * - Verification workflow for user-submitted spaces
 * - Availability status management
 * Data is persisted to localStorage for demo purposes
 */

// Import React hooks for state management and side effects
import React, { createContext, useState, useEffect } from 'react';

// Create the SpacesContext for sharing space data across components
export const SpacesContext = createContext();

/**
 * Initial demo spaces data
 * These are sample rental spaces to populate the platform
 * Each space includes location data for map display
 * In production, this data would come from a database
 */
const initialSpaces = [
    { 
        id: 1,                              // Unique space identifier
        title: "Modern Meeting Room",       // Display name for the space
        description: "A sleek, professional meeting room with state-of-the-art technology. Perfect for business meetings, presentations, and workshops.",
        location: "123 Main St, NYC",       // Physical address
        price_per_hour: 50,                 // Hourly rental rate in dollars
        price_per_night: 400,               // Daily rental rate (8 hours)
        capacity: 10,                       // Maximum number of people
        status: "available",                // Availability: 'available' or 'rented'
        latitude: 40.7128,                  // GPS latitude for map marker
        longitude: -74.0060,                // GPS longitude for map marker
        image_url: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800",  // Space photo
        amenities: "WiFi, Projector, Whiteboard, Coffee Machine"  // Available facilities
    },
    { 
        id: 2, 
        title: "Creative Loft Space", 
        description: "An inspiring open loft with natural light and creative atmosphere. Ideal for photo shoots, workshops, and creative events.",
        location: "456 Art Ave, Los Angeles", 
        price_per_hour: 80, 
        price_per_night: 640,
        capacity: 20, 
        status: "available", 
        latitude: 34.0522,                  // Los Angeles coordinates
        longitude: -118.2437, 
        image_url: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800",
        amenities: "WiFi, Natural Light, Sound System, Kitchen"
    },
    { 
        id: 3, 
        title: "Cozy Event Studio", 
        description: "A warm and inviting studio space perfect for intimate events, classes, and small gatherings.",
        location: "789 Beach Rd, Miami", 
        price_per_hour: 100, 
        price_per_night: 800,
        capacity: 50,                       // Larger capacity for events
        status: "available", 
        latitude: 25.7617,                  // Miami coordinates
        longitude: -80.1918, 
        image_url: "https://images.unsplash.com/photo-1497215842964-222b430dc094?w=800",
        amenities: "WiFi, Stage, Lighting, Parking, Catering Kitchen"
    },
    { 
        id: 4, 
        title: "Bright Work Lounge", 
        description: "A comfortable co-working space with plenty of natural light and modern amenities for productive work sessions.",
        location: "321 Lake St, Chicago", 
        price_per_hour: 40,                 // More affordable option
        price_per_night: 320,
        capacity: 15, 
        status: "available", 
        latitude: 41.8781,                  // Chicago coordinates
        longitude: -87.6298, 
        image_url: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800",
        amenities: "WiFi, Standing Desks, Phone Booths, Coffee Bar"
    }
];

/**
 * SpacesProvider Component - Provides space management functionality
 * Wraps the application to give child components access to space operations
 * @param {Object} props - Component props
 * @param {ReactNode} props.children - Child components
 */
export const SpacesProvider = ({ children }) => {
    // Initialize spaces state from localStorage or use initial demo data
    const [spaces, setSpaces] = useState(() => {
        // Try to load saved spaces from localStorage
        const saved = localStorage.getItem('sfr_spaces');
        // Return saved data if exists, otherwise use initial demo spaces
        return saved ? JSON.parse(saved) : initialSpaces;
    });
    
    // Loading state for async operations (future API integration)
    const [loading, setLoading] = useState(false);

    // Effect to persist spaces to localStorage whenever the data changes
    useEffect(() => {
        // Save spaces array as JSON string to localStorage
        localStorage.setItem('sfr_spaces', JSON.stringify(spaces));
    }, [spaces]); // Re-run when spaces array changes

    /**
     * Add a new rental space to the platform
     * Admin-added spaces are auto-verified, client-submitted spaces need approval
     * @param {Object} spaceData - Space details (title, location, price, etc.)
     * @param {boolean} isAdmin - Whether the submitter is an admin
     * @returns {Object} - The newly created space object
     */
    const addSpace = (spaceData, isAdmin = false) => {
        // Create new space object with system-generated fields
        const newSpace = {
            ...spaceData,                                      // Spread provided space data
            id: Date.now(),                                    // Generate unique ID
            price_per_night: spaceData.price_per_hour * 8,    // Calculate daily rate (8 hours)
            status: spaceData.status || 'available',           // Default to available
            verification_status: isAdmin ? 'verified' : 'pending', // Admin spaces auto-verified
            submitted_by: spaceData.submitted_by || null,      // Track who submitted
            submitted_at: new Date().toISOString().split('T')[0] // Submission date
        };
        
        // Add new space to the spaces array
        setSpaces(prev => [...prev, newSpace]);
        
        // Return the created space
        return newSpace;
    };

    /**
     * Verify a pending space submission (admin only)
     * Makes the space visible to clients for booking
     * @param {number} id - Space ID to verify
     */
    const verifySpace = (id) => {
        // Map through spaces and update verification status
        setSpaces(prev => prev.map(s => 
            s.id === id ? { ...s, verification_status: 'verified' } : s
        ));
    };

    /**
     * Reject a pending space submission (admin only)
     * Space will not be shown to clients
     * @param {number} id - Space ID to reject
     */
    const rejectSpace = (id) => {
        // Map through spaces and set status to rejected
        setSpaces(prev => prev.map(s => 
            s.id === id ? { ...s, verification_status: 'rejected' } : s
        ));
    };

    /**
     * Get all spaces pending verification
     * Used in admin panel to review new submissions
     * @returns {Array} - Array of pending spaces
     */
    const getPendingSpaces = () => {
        // Filter spaces with pending verification status
        return spaces.filter(s => s.verification_status === 'pending');
    };

    /**
     * Get only verified spaces
     * Used to display spaces to clients (excludes pending/rejected)
     * @returns {Array} - Array of verified spaces
     */
    const getVerifiedSpaces = () => {
        // Include spaces that are verified OR have no verification status (initial spaces)
        return spaces.filter(s => s.verification_status === 'verified' || !s.verification_status);
    };

    /**
     * Update an existing space's information
     * @param {number} id - Space's unique ID
     * @param {Object} spaceData - Object containing fields to update
     */
    const updateSpace = (id, spaceData) => {
        // Map through spaces and update the one with matching ID
        setSpaces(prev => prev.map(s => 
            s.id === id ? { ...s, ...spaceData } : s  // Merge updates with existing data
        ));
    };

    /**
     * Delete a space from the platform
     * @param {number} id - Space's unique ID to delete
     */
    const deleteSpace = (id) => {
        // Filter out the space with matching ID
        setSpaces(prev => prev.filter(s => s.id !== id));
    };

    /**
     * Toggle a space's availability status
     * Switches between 'available' and 'rented'
     * @param {number} id - Space's unique ID
     */
    const toggleStatus = (id) => {
        // Map through spaces and toggle status for matching ID
        setSpaces(prev => prev.map(s => 
            s.id === id 
                ? { ...s, status: s.status === 'available' ? 'rented' : 'available' } 
                : s
        ));
    };

    /**
     * Get only available spaces for booking
     * Filters out rented spaces
     * @returns {Array} - Array of available spaces
     */
    const getAvailableSpaces = () => {
        // Filter spaces with 'available' status
        return spaces.filter(s => s.status === 'available');
    };

    /**
     * Find a specific space by its ID
     * Used to display space details page
     * @param {number|string} id - Space ID to find
     * @returns {Object|undefined} - Space object if found
     */
    const getSpaceById = (id) => {
        // Find space with matching ID (convert to int for comparison)
        return spaces.find(s => s.id === parseInt(id));
    };

    /**
     * Get spaces owned by a specific user
     * Used for owner dashboard in profile page
     * @param {number|string} userId - User ID or email
     * @returns {Array} - Array of spaces owned by the user
     */
    const getSpacesByOwner = (userId, userEmail) => {
        return spaces.filter(s => 
            s.submitted_by && 
            (s.submitted_by.id === userId || s.submitted_by.email === userEmail) &&
            s.verification_status === 'verified'
        );
    };

    // Render the context provider with all space management functions
    return (
        <SpacesContext.Provider value={{
            spaces,              // Array of all spaces
            loading,             // Loading state for async operations
            addSpace,            // Function to add new space
            updateSpace,         // Function to update space details
            deleteSpace,         // Function to delete a space
            toggleStatus,        // Function to toggle availability
            getAvailableSpaces,  // Function to get available spaces
            getSpaceById,        // Function to find space by ID
            verifySpace,         // Function to verify pending space
            rejectSpace,         // Function to reject pending space
            getPendingSpaces,    // Function to get pending spaces
            getVerifiedSpaces,   // Function to get verified spaces
            getSpacesByOwner     // Function to get spaces by owner
        }}>
            {children}
        </SpacesContext.Provider>
    );
};
