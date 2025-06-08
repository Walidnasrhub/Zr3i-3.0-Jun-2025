import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../lib/api';

// Create auth context
const AuthContext = createContext(null);

// Auth provider component
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is logged in on initial load
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUserProfile();
    } else {
      setLoading(false);
    }
  }, []);

  // Fetch user profile
  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const response = await authAPI.getProfile();
      setUser(response.data.user);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch user profile:', err);
      setError('Session expired. Please login again.');
      logout();
    } finally {
      setLoading(false);
    }
  };

  // Login function
  const login = async (credentials) => {
    try {
      setLoading(true);
      const response = await authAPI.login(credentials);
      const { user, access_token } = response.data;
      
      // Save token to localStorage
      localStorage.setItem('token', access_token);
      
      // Set user in state
      setUser(user);
      setError(null);
      return true;
    } catch (err) {
      console.error('Login failed:', err);
      setError(err.response?.data?.error || 'Login failed. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      setLoading(true);
      const response = await authAPI.register(userData);
      const { user, access_token } = response.data;
      
      // Save token to localStorage
      localStorage.setItem('token', access_token);
      
      // Set user in state
      setUser(user);
      setError(null);
      return true;
    } catch (err) {
      console.error('Registration failed:', err);
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  // Context value
  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

