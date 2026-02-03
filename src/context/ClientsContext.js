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
