import React, { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { authService } from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = await SecureStore.getItemAsync('authToken');
      if (token) {
        // Validate token with backend
        const userData = await authService.validateToken(token);
        if (userData) {
          setUser(userData);
          setIsAuthenticated(true);
        } else {
          await SecureStore.deleteItemAsync('authToken');
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      await SecureStore.deleteItemAsync('authToken');
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await authService.login(email, password);
      if (response.success) {
        await SecureStore.setItemAsync('authToken', response.token);
        setUser(response.user);
        setIsAuthenticated(true);
        return { success: true };
      } else {
        return { success: false, error: response.error };
      }
    } catch (error) {
      console.error('Login failed:', error);
      return { success: false, error: 'Login failed. Please try again.' };
    }
  };

  const register = async (userData) => {
    try {
      const response = await authService.register(userData);
      if (response.success) {
        await SecureStore.setItemAsync('authToken', response.token);
        setUser(response.user);
        setIsAuthenticated(true);
        return { success: true };
      } else {
        return { success: false, error: response.error };
      }
    } catch (error) {
      console.error('Registration failed:', error);
      return { success: false, error: 'Registration failed. Please try again.' };
    }
  };

  const logout = async () => {
    try {
      await SecureStore.deleteItemAsync('authToken');
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const updateUser = (userData) => {
    setUser(userData);
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

