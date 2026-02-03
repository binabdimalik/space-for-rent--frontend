/**
 * ClientsContext.js - Client User Management
 * This context manages client (regular user) data including registration,
 * login validation, and profile management
 * Data is persisted to localStorage for demo purposes
 */

// Import React hooks for state management and side effects
import React, { createContext, useState, useEffect } 'react';

// Create the ClientsContext for sharing client data across components
export const ClientsContext = createContext();

