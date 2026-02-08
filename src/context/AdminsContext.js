/**
 * AdminsContext.js - Admin User Management
 * This context manages administrator accounts including the super admin
 * It handles admin creation, authentication, and role-based access control
 * Data is persisted to localStorage for demo purposes
 */

// Import React hooks for state management and side effects
import React, { createContext, useState, useEffect } from 'react';

// Create the AdminsContext for sharing admin data across components
export const AdminsContext = createContext();

/**
 * Initial admin data - includes the default super admin account
 * The super admin has full access to all admin features
 * In production, this would come from a secure database
 */
const initialAdmins = [
    {
        id: 1,                                    // Unique identifier
        name: "Super Admin",                      // Admin's display name
        email: "superadmin@spacesforrent.com",   // Login email
        password: "admin123",                     // Password (would be hashed in production)
        role: "super_admin",                      // Role: super_admin has all permissions
        created_at: "2026-01-01"                  // Account creation date
    }
];

/**
 * AdminsProvider Component - Provides admin management functionality
 * Wraps the application to give child components access to admin operations
 * @param {Object} props - Component props
 * @param {ReactNode} props.children - Child components
 */
export const AdminsProvider = ({ children }) => {
    // Initialize admins state from localStorage or use initial data
    // Ensures the super admin always exists for system access
    const [admins, setAdmins] = useState(() => {
        // Try to get saved admins from localStorage
        const saved = localStorage.getItem('sfr_admins');
        
        if (saved) {
            // Parse the saved JSON data
            const parsed = JSON.parse(saved);
            
            // Security check: Always ensure super admin exists in the system
            // This prevents lockout if super admin is accidentally deleted
            const hasSuperAdmin = parsed.some(a => a.email === 'superadmin@spacesforrent.com');
            
            // If super admin is missing, add them back
            if (!hasSuperAdmin) {
                return [...parsed, initialAdmins[0]];
            }
            
            return parsed;
        }
        
        // If no saved data, use initial admins (just super admin)
        return initialAdmins;
    });

    // Effect to persist admins to localStorage whenever the data changes
    useEffect(() => {
        // Save admins array as JSON string to localStorage
        localStorage.setItem('sfr_admins', JSON.stringify(admins));
    }, [admins]); // Re-run when admins array changes

    /**
     * Add a new admin account
     * Only the super admin can add new admins
     * @param {Object} adminData - New admin's data (name, email, password)
     * @returns {Object} - The newly created admin object
     */
    const addAdmin = (adminData) => {
        // Create new admin object with required fields
        const newAdmin = {
            ...adminData,                                      // Spread the provided data
            id: Date.now(),                                    // Generate unique ID
            role: 'admin',                                     // Set role as regular admin (not super_admin)
            created_at: new Date().toISOString().split('T')[0] // Today's date
        };
        
        // Add new admin to the admins array
        setAdmins(prev => [...prev, newAdmin]);
        
        // Return the created admin
        return newAdmin;
    };

    /**
     * Update an existing admin's information
     * @param {number} id - Admin's unique ID
     * @param {Object} updates - Object containing fields to update
     */
    const updateAdmin = (id, updates) => {
        // Map through admins and update the one with matching ID
        setAdmins(prev => prev.map(a => 
            a.id === id ? { ...a, ...updates } : a  // Merge updates with existing data
        ));
    };

    /**
     * Delete an admin account
     * Note: Super admin cannot be deleted (protected)
     * @param {number} id - Admin's unique ID to delete
     */
    const deleteAdmin = (id) => {
        // Filter out the admin, but protect super_admin from deletion
        setAdmins(prev => prev.filter(a => a.id !== id && a.role !== 'super_admin'));
    };

    /**
     * Validate admin login credentials
     * Checks if email and password match an existing admin
     * @param {string} email - Admin's email address
     * @param {string} password - Admin's password
     * @returns {Object|null} - Admin data if valid, null if invalid
     */
    const validateAdminLogin = (email, password) => {
        // Find admin with matching email AND password
        const admin = admins.find(a => a.email === email && a.password === password);
        
        // If admin found, return their data (excluding password for security)
        if (admin) {
            return {
                id: admin.id,
                name: admin.name,
                email: admin.email,
                role: admin.role  // Include role for permission checking
            };
        }
        
        // Return null if credentials don't match
        return null;
    };

    /**
     * Find an admin by their email address
     * @param {string} email - Email address to search for
     * @returns {Object|undefined} - Admin object if found
     */
    const getAdminByEmail = (email) => {
        // Use array find to locate admin with matching email
        return admins.find(a => a.email === email);
    };

    /**
     * Check if a user is a super admin
     * Super admins have elevated permissions (can manage other admins)
     * @param {string} email - Email address to check
     * @returns {boolean} - True if user is super admin
     */
    const isSuperAdmin = (email) => {
        // Find admin by email and check their role
        const admin = admins.find(a => a.email === email);
        // Return true if role is super_admin, false otherwise
        return admin?.role === 'super_admin';
    };

    // Render the context provider with all admin management functions
    return (
        <AdminsContext.Provider value={{
            admins,              // Array of all admins
            addAdmin,            // Function to add new admin
            updateAdmin,         // Function to update admin info
            deleteAdmin,         // Function to delete an admin
            validateAdminLogin,  // Function to validate login credentials
            getAdminByEmail,     // Function to find admin by email
            isSuperAdmin         // Function to check super admin status
        }}>
            {children}
        </AdminsContext.Provider>
    );
};
