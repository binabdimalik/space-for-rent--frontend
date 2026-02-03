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
