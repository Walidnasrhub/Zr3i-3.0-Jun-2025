import React, { createContext, useContext, useState, useEffect } from 'react';
import { Appearance } from 'react-native';
import * as SecureStore from 'expo-secure-store';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

const lightTheme = {
  colors: {
    primary: '#22c55e',
    primaryDark: '#16a34a',
    secondary: '#3b82f6',
    background: '#ffffff',
    surface: '#f8fafc',
    card: '#ffffff',
    text: '#1f2937',
    textSecondary: '#6b7280',
    border: '#e5e7eb',
    error: '#ef4444',
    warning: '#f59e0b',
    success: '#10b981',
    info: '#3b82f6',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
  },
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },
};

const darkTheme = {
  ...lightTheme,
  colors: {
    ...lightTheme.colors,
    primary: '#22c55e',
    primaryDark: '#16a34a',
    secondary: '#3b82f6',
    background: '#111827',
    surface: '#1f2937',
    card: '#374151',
    text: '#f9fafb',
    textSecondary: '#d1d5db',
    border: '#4b5563',
    error: '#ef4444',
    warning: '#f59e0b',
    success: '#10b981',
    info: '#3b82f6',
  },
};

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(Appearance.getColorScheme() === 'dark');
  const [theme, setTheme] = useState(isDark ? darkTheme : lightTheme);

  useEffect(() => {
    loadThemePreference();
    
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setIsDark(colorScheme === 'dark');
      setTheme(colorScheme === 'dark' ? darkTheme : lightTheme);
    });

    return () => subscription?.remove();
  }, []);

  useEffect(() => {
    setTheme(isDark ? darkTheme : lightTheme);
  }, [isDark]);

  const loadThemePreference = async () => {
    try {
      const savedTheme = await SecureStore.getItemAsync('themePreference');
      if (savedTheme) {
        const isDarkMode = savedTheme === 'dark';
        setIsDark(isDarkMode);
        setTheme(isDarkMode ? darkTheme : lightTheme);
      }
    } catch (error) {
      console.error('Failed to load theme preference:', error);
    }
  };

  const toggleTheme = async () => {
    try {
      const newIsDark = !isDark;
      setIsDark(newIsDark);
      setTheme(newIsDark ? darkTheme : lightTheme);
      await SecureStore.setItemAsync('themePreference', newIsDark ? 'dark' : 'light');
    } catch (error) {
      console.error('Failed to save theme preference:', error);
    }
  };

  const value = {
    theme,
    isDark,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

