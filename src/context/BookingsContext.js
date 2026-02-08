/**
 * BookingsContext.js - Booking Management System
 * This context manages space rental bookings including creation, updates, and queries
 * It tracks booking status, payment status, and provides revenue analytics
 * Data is persisted to localStorage for demo purposes
 */

// Import React hooks for state management and side effects
import React, { createContext, useState, useEffect } from 'react';

// Create the BookingsContext for sharing booking data across components
export const BookingsContext = createContext();

/**
 * Initial demo bookings data
 * These are sample bookings to demonstrate the booking system
 * In production, this data would come from a database
 */
const initialBookings = [
    {
        id: 1,                              // Unique booking identifier
        spaceId: 1,                         // Reference to the booked space
        spaceTitle: "Modern Meeting Room",  // Name of the space for display
        clientName: "John Smith",           // Client's full name
        clientEmail: "john@example.com",    // Client's email for identification
        clientPhone: "+1 555-0101",         // Client's contact number
        startDate: "2026-01-25",            // Booking start date
        endDate: "2026-01-25",              // Booking end date
        startTime: "09:00",                 // Start time (for hourly bookings)
        endTime: "17:00",                   // End time (for hourly bookings)
        bookingType: "hourly",              // Type: 'hourly' or 'daily'
        totalAmount: 400,                   // Total cost in dollars
        status: "confirmed",                // Booking status: pending/confirmed/cancelled
        paymentStatus: "paid",              // Payment status: pending/paid
        createdAt: "2026-01-20"             // When the booking was made
    },
    {
        id: 2,
        spaceId: 2,
        spaceTitle: "Creative Loft Space",
        clientName: "Sarah Johnson",
        clientEmail: "sarah@example.com",
        clientPhone: "+1 555-0102",
        startDate: "2026-01-28",
        endDate: "2026-01-30",
        bookingType: "daily",               // Daily booking (no specific times)
        totalAmount: 1920,
        status: "pending",                  // This booking is pending confirmation
        paymentStatus: "pending",
        createdAt: "2026-01-22"
    },
    {
        id: 3,
        spaceId: 3,
        spaceTitle: "Cozy Event Studio",
        clientName: "Mike Wilson",
        clientEmail: "mike@example.com",
        clientPhone: "+1 555-0103",
        startDate: "2026-02-01",
        endDate: "2026-02-01",
        startTime: "14:00",
        endTime: "20:00",
        bookingType: "hourly",
        totalAmount: 600,
        status: "confirmed",
        paymentStatus: "paid",
        createdAt: "2026-01-23"
    },
    {
        id: 4,
        spaceId: 4,
        spaceTitle: "Bright Work Lounge",
        clientName: "Emily Davis",
        clientEmail: "emily@example.com",
        clientPhone: "+1 555-0104",
        startDate: "2026-02-05",
        endDate: "2026-02-07",
        bookingType: "daily",
        totalAmount: 960,
        status: "confirmed",
        paymentStatus: "paid",
        createdAt: "2026-01-24"
    }
];

/**
 * BookingsProvider Component - Provides booking management functionality
 * Wraps the application to give child components access to booking operations
 * @param {Object} props - Component props
 * @param {ReactNode} props.children - Child components
 */
export const BookingsProvider = ({ children }) => {
    // Initialize bookings state from localStorage or use initial demo data
    const [bookings, setBookings] = useState(() => {
        // Try to get saved bookings from localStorage
        const saved = localStorage.getItem('sfr_bookings');
        // Return saved data if exists, otherwise use initial demo bookings
        return saved ? JSON.parse(saved) : initialBookings;
    });

    // Effect to persist bookings to localStorage whenever the data changes
    useEffect(() => {
        // Save bookings array as JSON string to localStorage
        localStorage.setItem('sfr_bookings', JSON.stringify(bookings));
    }, [bookings]); // Re-run when bookings array changes

    /**
     * Create a new booking
     * Called when a client completes the payment process
     * @param {Object} bookingData - Booking details from the payment form
     * @returns {Object} - The newly created booking object
     */
    const addBooking = (bookingData) => {
        // Create new booking object with system-generated fields
        const newBooking = {
            ...bookingData,                                    // Spread the provided booking data
            id: Date.now(),                                    // Generate unique ID using timestamp
            status: 'confirmed',                               // Auto-confirm after payment
            paymentStatus: 'paid',                             // Mark as paid
            createdAt: new Date().toISOString().split('T')[0]  // Today's date
        };
        
        // Add new booking to the bookings array
        setBookings(prev => [...prev, newBooking]);
        
        // Return the created booking
        return newBooking;
    };

    /**
     * Update an existing booking's information
     * @param {number} id - Booking's unique ID
     * @param {Object} updates - Object containing fields to update
     */
    const updateBooking = (id, updates) => {
        // Map through bookings and update the one with matching ID
        setBookings(prev => prev.map(b => 
            b.id === id ? { ...b, ...updates } : b  // Merge updates with existing data
        ));
    };

    /**
     * Update only the status of a booking
     * Useful for admin to confirm, cancel, or complete bookings
     * @param {number} id - Booking's unique ID
     * @param {string} status - New status: 'pending', 'confirmed', 'cancelled', 'completed'
     */
    const updateBookingStatus = (id, status) => {
        // Map through bookings and update status for matching ID
        setBookings(prev => prev.map(b => 
            b.id === id ? { ...b, status } : b
        ));
    };

    /**
     * Delete a booking
     * @param {number} id - Booking's unique ID to delete
     */
    const deleteBooking = (id) => {
        // Filter out the booking with matching ID
        setBookings(prev => prev.filter(b => b.id !== id));
    };

    /**
     * Get all bookings for a specific space
     * Used to check availability and show booking history for a space
     * @param {number|string} spaceId - Space ID to filter by
     * @returns {Array} - Array of bookings for that space
     */
    const getBookingsBySpace = (spaceId) => {
        // Filter bookings by spaceId (convert to int for comparison)
        return bookings.filter(b => b.spaceId === parseInt(spaceId));
    };

    /**
     * Get all bookings for a specific client by email
     * Used to show client's booking history on their profile
     * @param {string} email - Client's email address
     * @returns {Array} - Array of bookings for that client
     */
    const getBookingsByClient = (email) => {
        // Filter bookings by client email (case-insensitive)
        return bookings.filter(b => b.clientEmail?.toLowerCase() === email?.toLowerCase());
    };

    /**
     * Get all bookings for a specific client by user ID
     * Alternative to email-based filtering
     * @param {number} userId - Client's user ID
     * @returns {Array} - Array of bookings for that client
     */
    const getBookingsByUserId = (userId) => {
        // Filter bookings by clientId
        return bookings.filter(b => b.clientId === userId);
    };

    /**
     * Calculate total revenue from paid bookings
     * Used for admin dashboard analytics
     * @returns {number} - Total revenue amount
     */
    const getTotalRevenue = () => {
        return bookings
            // Only include bookings that have been paid
            .filter(b => b.paymentStatus === 'paid')
            // Sum up all the totalAmount values
            .reduce((sum, b) => sum + b.totalAmount, 0);
    };

    /**
     * Calculate total pending payments
     * Shows how much revenue is expected but not yet collected
     * @returns {number} - Total pending amount
     */
    const getPendingAmount = () => {
        return bookings
            // Only include bookings with pending payment
            .filter(b => b.paymentStatus === 'pending')
            // Sum up all the totalAmount values
            .reduce((sum, b) => sum + b.totalAmount, 0);
    };

    /**
     * Check if a space is already booked for the given dates/times
     * Prevents double booking by checking for conflicts
     * @param {number} spaceId - Space ID to check
     * @param {string} startDate - Requested start date (YYYY-MM-DD)
     * @param {string} endDate - Requested end date (YYYY-MM-DD)
     * @param {string} startTime - Requested start time (HH:MM) - optional for hourly
     * @param {string} endTime - Requested end time (HH:MM) - optional for hourly
     * @param {string} bookingType - 'hourly' or 'daily'
     * @returns {Object} - { hasConflict: boolean, conflictingBooking: Object|null }
     */
    const checkBookingConflict = (spaceId, startDate, endDate, startTime, endTime, bookingType) => {
        // Get all confirmed/pending bookings for this space (exclude cancelled)
        const spaceBookings = bookings.filter(b => 
            b.spaceId === parseInt(spaceId) && 
            b.status !== 'cancelled'
        );

        // Check each existing booking for date/time overlap
        for (const booking of spaceBookings) {
            const bookingStart = new Date(booking.startDate);
            const bookingEnd = new Date(booking.endDate);
            const requestStart = new Date(startDate);
            const requestEnd = new Date(endDate);

            // Check if dates overlap
            const datesOverlap = requestStart <= bookingEnd && requestEnd >= bookingStart;

            if (datesOverlap) {
                // For daily bookings, any date overlap is a conflict
                if (bookingType === 'daily' || booking.bookingType === 'daily') {
                    return { 
                        hasConflict: true, 
                        conflictingBooking: booking,
                        message: `This space is already booked from ${booking.startDate} to ${booking.endDate}`
                    };
                }

                // For hourly bookings on the same day, check time overlap
                if (startDate === booking.startDate) {
                    const reqStartTime = startTime ? parseInt(startTime.replace(':', '')) : 0;
                    const reqEndTime = endTime ? parseInt(endTime.replace(':', '')) : 2359;
                    const bookStartTime = booking.startTime ? parseInt(booking.startTime.replace(':', '')) : 0;
                    const bookEndTime = booking.endTime ? parseInt(booking.endTime.replace(':', '')) : 2359;

                    // Check if time ranges overlap
                    const timesOverlap = reqStartTime < bookEndTime && reqEndTime > bookStartTime;

                    if (timesOverlap) {
                        return { 
                            hasConflict: true, 
                            conflictingBooking: booking,
                            message: `This space is already booked on ${booking.startDate} from ${booking.startTime} to ${booking.endTime}`
                        };
                    }
                }
            }
        }

        // No conflict found
        return { hasConflict: false, conflictingBooking: null, message: null };
    };

    /**
     * Get all booked dates for a space
     * Used to disable dates in the date picker
     * @param {number} spaceId - Space ID to check
     * @returns {Array} - Array of booked date strings (YYYY-MM-DD)
     */
    const getBookedDates = (spaceId) => {
        const spaceBookings = bookings.filter(b => 
            b.spaceId === parseInt(spaceId) && 
            b.status !== 'cancelled'
        );

        const bookedDates = [];
        spaceBookings.forEach(booking => {
            const start = new Date(booking.startDate);
            const end = new Date(booking.endDate);
            
            // Add all dates in the range
            for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
                bookedDates.push(d.toISOString().split('T')[0]);
            }
        });

        return [...new Set(bookedDates)]; // Remove duplicates
    };

    // Render the context provider with all booking management functions
    return (
        <BookingsContext.Provider value={{
            bookings,              // Array of all bookings
            addBooking,            // Function to create new booking
            updateBooking,         // Function to update booking details
            updateBookingStatus,   // Function to update booking status
            deleteBooking,         // Function to delete a booking
            getBookingsBySpace,    // Function to get bookings for a space
            getBookingsByClient,   // Function to get bookings by client email
            getBookingsByUserId,   // Function to get bookings by client ID
            getTotalRevenue,       // Function to calculate total revenue
            getPendingAmount,      // Function to calculate pending payments
            checkBookingConflict,  // Function to check for double booking
            getBookedDates         // Function to get booked dates for a space
        }}>
            {children}
        </BookingsContext.Provider>
    );
};
