/**
 * AuthContext.js - Authentication State Management
 * This context handles user authentication including login, logout, and registration
 * It persists user sessions using localStorage so users stay logged in after page refresh
 */

// Import React hooks for state management and side effects
import React, { createContext, useState, useEffect } from 'react';

// Import API functions for authentication endpoints
import * as api from '../services/api';

// Create the AuthContext - this will be used to share auth state across components
export const AuthContext = createContext();

/**
 * AuthProvider Component - Wraps the application to provide authentication functionality
 * This component manages user state and provides login/logout functions to all child components
 * @param {Object} props - Component props
 * @param {ReactNode} props.children - Child components that will have access to auth context
 */
export const AuthProvider = ({ children }) => {
	// Initialize user state from localStorage to persist login across page refreshes
	// Uses a function initializer for lazy evaluation (only runs once on mount)
	const [user, setUser] = useState(() => {
		try {
			// Attempt to parse stored user data from localStorage
			return JSON.parse(localStorage.getItem('sfr_user')) || null;
		} catch (e) {
			// If parsing fails (corrupted data), return null (logged out state)
			return null;
		}
	});

	// Initialize token state from localStorage for API authentication
	const [token, setToken] = useState(() => localStorage.getItem('sfr_token') || null);

	// Effect to set up API authorization header when token changes
	useEffect(() => {
		if (token) {
			// When we have a token, set it as the default Authorization header for all API requests
			// This ensures authenticated requests are automatically authorized
			try {
				// Get the axios API instance and modify its default headers
				const API = require('../services/api').default;
				if (API && API.defaults) {
					// Set Bearer token format for JWT authentication
					API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
				}
			} catch (e) {
				// Silently handle any errors (API might not be available)
			}
		}
	}, [token]); // Re-run effect when token changes

	/**
	 * Register a new user account
	 * Calls the registration API endpoint with user details
	 * @param {Object} payload - Registration data (name, email, password)
	 * @returns {Object} - API response data
	 */
	const register = async (payload) => {
		// Call the register API endpoint
		const res = await api.register(payload);
		// Return the response data
		return res.data;
	};

	/**
	 * Log in a user - supports both API login and direct login
	 * Direct login is used for demo purposes with pre-defined users
	 * @param {Object} payload - Login credentials or user object
	 * @param {string|null} directToken - Token for direct login (bypasses API)
	 * @returns {Object} - User data and token
	 */
	const login = async (payload, directToken = null) => {
		// Check if this is a direct login (for demo/testing with predefined users)
		if (directToken && typeof payload === 'object' && payload.id) {
			// Set the user state directly without API call
			setUser(payload);
			setToken(directToken);
			
			// Persist to localStorage for session persistence
			localStorage.setItem('sfr_user', JSON.stringify(payload));
			localStorage.setItem('sfr_token', directToken);
			
			// Return the user and token
			return { user: payload, token: directToken };
		}
		
		// Normal API login - call the login endpoint
		const res = await api.login(payload);
		
		// If login successful, update state and localStorage
		if (res && res.data) {
			setUser(res.data.user);
			setToken(res.data.token);
			
			// Persist to localStorage
			localStorage.setItem('sfr_user', JSON.stringify(res.data.user));
			localStorage.setItem('sfr_token', res.data.token);
		}
		
		// Return the response data
		return res.data;
	};

	/**
	 * Log out the current user
	 * Clears all authentication state and localStorage data
	 */
	const logout = () => {
		// Clear user state
		setUser(null);
		// Clear token state
		setToken(null);
		// Remove persisted data from localStorage
		localStorage.removeItem('sfr_user');
		localStorage.removeItem('sfr_token');
	};

	// Render the context provider with authentication values and functions
	return (
		<AuthContext.Provider value={{ 
			user,      // Current logged-in user object (null if not logged in)
			token,     // Authentication token for API requests
			register,  // Function to register new users
			login,     // Function to log in users
			logout     // Function to log out users
		}}>
			{children}
		</AuthContext.Provider>
	);
};
