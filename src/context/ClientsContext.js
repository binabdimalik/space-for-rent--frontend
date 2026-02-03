/**
 * ClientsContext.js - Client User Management
 * This context manages client (regular user) data including registration,
 * login validation, and profile management
 * Data is persisted to localStorage for demo purposes
 */

// Import React hooks for state management and side effects
import React, { createContext, useState, useEffect } from "react";

// Create the ClientsContext for sharing client data across components
export const ClientsContext = createContext();

/**
 * Initial demo clients data
 * These are pre-defined users for testing the application
 * In production, this would come from a database
 */
const initialClients = [
  {
    id: 1, // Unique identifier
    name: "John Doe", // Client's full name
    email: "john@example.com", // Email address (used for login)
    password: "password123", // Password (in production, this would be hashed)
    phone: "+1 555-0101", // Contact phone number
    created_at: "2026-01-15", // Account creation date
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    password: "password123",
    phone: "+1 555-0102",
    created_at: "2026-01-18",
  },
];

/**
 * ClientsProvider Component - Provides client management functionality
 * Wraps the application to give child components access to client operations
 * @param {Object} props - Component props
 * @param {ReactNode} props.children - Child components
 */
export const ClientsProvider = ({ children }) => {
  // Initialize clients state from localStorage or use initial demo data
  // Uses lazy initialization to only run once on mount
  const [clients, setClients] = useState(() => {
    // Try to get saved clients from localStorage
    const saved = localStorage.getItem("sfr_clients");
    // Return saved data if exists, otherwise use initial demo clients
    return saved ? JSON.parse(saved) : initialClients;
  });

  // Effect to persist clients to localStorage whenever the data changes
  useEffect(() => {
    // Save clients array as JSON string to localStorage
    localStorage.setItem("sfr_clients", JSON.stringify(clients));
  }, [clients]); // Re-run when clients array changes

  /**
   * Register a new client account
   * Validates email uniqueness before creating the account
   * @param {Object} clientData - New client's registration data
   * @returns {Object} - Success status and client data or error message
   */
  const registerClient = (clientData) => {
    // Check if email is already registered to prevent duplicates
    const exists = clients.some((c) => c.email === clientData.email);

    // If email exists, return error
    if (exists) {
      return { success: false, message: "Email already registered" };
    }

    // Create new client object with all required fields
    const newClient = {
      id: Date.now(), // Generate unique ID using timestamp
      name: clientData.name, // Client's full name
      email: clientData.email, // Email address
      password: clientData.password, // Password (should be hashed in production)
      phone: clientData.phone || "", // Phone number (optional)
      created_at: new Date().toISOString().split("T")[0], // Today's date in YYYY-MM-DD format
    };

    // Add new client to the clients array
    setClients((prev) => [...prev, newClient]);

    // Return success with the new client data
    return { success: true, client: newClient };
  };

  /**
   * Validate client login credentials
   * Checks if email and password match an existing client
   * @param {string} email - Client's email address
   * @param {string} password - Client's password
   * @returns {Object|null} - Client data if valid, null if invalid
   */
  const validateClientLogin = (email, password) => {
    // Find client with matching email AND password
    const client = clients.find(
      (c) => c.email === email && c.password === password,
    );

    // If client found, return their data (excluding password for security)
    if (client) {
      return {
        id: client.id,
        name: client.name,
        email: client.email,
        phone: client.phone,
        role: "user", // Set role as 'user' (not admin)
      };
    }

    // Return null if credentials don't match
    return null;
  };

  /**
   * Find a client by their email address
   * @param {string} email - Email address to search for
   * @returns {Object|undefined} - Client object if found
   */
  const getClientByEmail = (email) => {
    // Use array find to locate client with matching email
    return clients.find((c) => c.email === email);
  };

  /**
   * Update a client's information
   * @param {number} id - Client's unique ID
   * @param {Object} updates - Object containing fields to update
   */
  const updateClient = (id, updates) => {
    // Map through clients and update the one with matching ID
    setClients((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c)),
    );
  };

  /**
   * Delete a client account
   * @param {number} id - Client's unique ID to delete
   */
  const deleteClient = (id) => {
    // Filter out the client with matching ID
    setClients((prev) => prev.filter((c) => c.id !== id));
  };

  /**
   * Reset a client's password
   * Used for forgot password functionality
   * @param {string} email - Client's email address
   * @param {string} newPassword - New password to set
   * @returns {Object} - Success status and message
   */
  const resetPassword = (email, newPassword) => {
    // First check if client with this email exists
    const client = clients.find((c) => c.email === email);

    // If no client found, return error
    if (!client) {
      return { success: false, message: "Email not found" };
    }

    // Update the client's password
    setClients((prev) =>
      prev.map((c) =>
        c.email === email ? { ...c, password: newPassword } : c,
      ),
    );

    // Return success message
    return { success: true, message: "Password updated successfully" };
  };

  // Render the context provider with all client management functions
  return (
    <ClientsContext.Provider
      value={{
        clients, // Array of all clients
        registerClient, // Function to register new clients
        validateClientLogin, // Function to validate login credentials
        getClientByEmail, // Function to find client by email
        updateClient, // Function to update client info
        deleteClient, // Function to delete a client
        resetPassword, // Function to reset password
      }}
    >
      {children}
    </ClientsContext.Provider>
  );
};
