import React, { createContext, useContext, useState, useEffect } from 'react';

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
  const [loading, setLoading] = useState(true);

  // Demo users for testing
  const demoUsers = [
    {
      id: 1,
      email: 'demo@zr3i.com',
      password: 'demo123',
      name: 'John Smith',
      role: 'Farm Manager',
      profileImage: null,
      subscription: 'Premium',
      fields: [
        { id: 1, name: 'North Field', area: '25 hectares', crop: 'Wheat', status: 'Healthy' },
        { id: 2, name: 'South Field', area: '18 hectares', crop: 'Corn', status: 'Monitoring Required' },
        { id: 3, name: 'East Field', area: '32 hectares', crop: 'Soybeans', status: 'Excellent' }
      ],
      lastLogin: new Date().toISOString(),
      joinDate: '2023-01-15'
    },
    {
      id: 2,
      email: 'farmer@zr3i.com',
      password: 'farmer123',
      name: 'Sarah Johnson',
      role: 'Farmer',
      profileImage: null,
      subscription: 'Basic',
      fields: [
        { id: 4, name: 'Main Field', area: '45 hectares', crop: 'Rice', status: 'Good' },
        { id: 5, name: 'West Field', area: '22 hectares', crop: 'Barley', status: 'Needs Attention' }
      ],
      lastLogin: new Date().toISOString(),
      joinDate: '2023-03-20'
    },
    {
      id: 3,
      email: 'agronomist@zr3i.com',
      password: 'agro123',
      name: 'Dr. Ahmed Hassan',
      role: 'Agronomist',
      profileImage: null,
      subscription: 'Professional',
      fields: [
        { id: 6, name: 'Research Plot A', area: '5 hectares', crop: 'Experimental Wheat', status: 'Under Study' },
        { id: 7, name: 'Research Plot B', area: '5 hectares', crop: 'Hybrid Corn', status: 'Promising Results' }
      ],
      lastLogin: new Date().toISOString(),
      joinDate: '2022-11-10'
    }
  ];

  useEffect(() => {
    // Check for existing session
    const checkAuthStatus = () => {
      try {
        const storedUser = localStorage.getItem('zr3i_user');
        const storedToken = localStorage.getItem('zr3i_token');
        
        if (storedUser && storedToken) {
          const userData = JSON.parse(storedUser);
          setUser(userData);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
        // Clear invalid data
        localStorage.removeItem('zr3i_user');
        localStorage.removeItem('zr3i_token');
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true);
      
      // Find demo user
      const demoUser = demoUsers.find(
        user => user.email === email && user.password === password
      );

      if (demoUser) {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Create user session
        const userSession = {
          ...demoUser,
          lastLogin: new Date().toISOString()
        };
        
        // Remove password from stored data
        const { password: _, ...userWithoutPassword } = userSession;
        
        // Store in localStorage
        localStorage.setItem('zr3i_user', JSON.stringify(userWithoutPassword));
        localStorage.setItem('zr3i_token', `demo_token_${demoUser.id}_${Date.now()}`);
        
        setUser(userWithoutPassword);
        setIsAuthenticated(true);
        
        return { success: true, user: userWithoutPassword };
      } else {
        // Check for regular login (this would be replaced with actual API call)
        throw new Error('Invalid credentials. Use demo accounts: demo@zr3i.com/demo123, farmer@zr3i.com/farmer123, or agronomist@zr3i.com/agro123');
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Check if email already exists in demo users
      const existingUser = demoUsers.find(user => user.email === userData.email);
      if (existingUser) {
        throw new Error('Email already exists. Please use a different email or try logging in.');
      }
      
      // Create new user (in real app, this would be sent to backend)
      const newUser = {
        id: Date.now(),
        email: userData.email,
        name: userData.name,
        role: userData.role || 'Farmer',
        profileImage: null,
        subscription: 'Basic',
        fields: [],
        lastLogin: new Date().toISOString(),
        joinDate: new Date().toISOString()
      };
      
      // Remove password from stored data
      const { password: _, ...userWithoutPassword } = newUser;
      
      // Store in localStorage
      localStorage.setItem('zr3i_user', JSON.stringify(userWithoutPassword));
      localStorage.setItem('zr3i_token', `token_${newUser.id}_${Date.now()}`);
      
      setUser(userWithoutPassword);
      setIsAuthenticated(true);
      
      return { success: true, user: userWithoutPassword };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('zr3i_user');
    localStorage.removeItem('zr3i_token');
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateUser = (updatedUserData) => {
    const updatedUser = { ...user, ...updatedUserData };
    setUser(updatedUser);
    localStorage.setItem('zr3i_user', JSON.stringify(updatedUser));
  };

  const getDemoCredentials = () => {
    return demoUsers.map(user => ({
      email: user.email,
      password: user.password,
      name: user.name,
      role: user.role,
      subscription: user.subscription
    }));
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
    updateUser,
    getDemoCredentials
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

