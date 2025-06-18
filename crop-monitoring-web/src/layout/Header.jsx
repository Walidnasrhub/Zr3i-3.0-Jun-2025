import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, IconButton, Menu, MenuItem, Avatar, Badge, Box, useMediaQuery, useTheme } from '@mui/material';
import { Menu as MenuIcon, Notifications, AccountCircle, Settings, ExitToApp } from '@mui/icons-material';
import { useAuth } from '../hooks/useAuth';
import './Header.css';

const Header = ({ toggleSidebar }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]);
  
  useEffect(() => {
    // Fetch notifications from API
    const fetchNotifications = async () => {
      try {
        // This would be replaced with an actual API call
        const mockNotifications = [
          { id: 1, message: 'Weather Alert: Heavy rainfall expected in North Field - Consider drainage preparations', read: false },
          { id: 2, message: 'Crop Health Alert: Early disease symptoms detected in East Field - Immediate inspection recommended', read: false },
          { id: 3, message: 'Satellite Update: New high-resolution imagery available for your fields', read: false },
          { id: 4, message: 'Irrigation Reminder: Soil moisture levels dropping in South Field', read: true },
          { id: 5, message: 'System Update: Enhanced AI analytics now available in your dashboard', read: true }
        ];
        setNotifications(mockNotifications);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };
    
    fetchNotifications();
  }, []);
  
  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  
  const handleNotificationMenuOpen = (event) => {
    setNotificationAnchorEl(event.currentTarget);
  };
  
  const handleNotificationMenuClose = () => {
    setNotificationAnchorEl(null);
  };
  
  const handleLogout = () => {
    logout();
    handleMenuClose();
  };
  
  const unreadNotificationsCount = notifications.filter(notification => !notification.read).length;
  
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/') return 'Zr3i Dashboard - Smart Crop Monitoring';
    if (path === '/home') return 'Zr3i - Advanced Agricultural Intelligence';
    if (path.includes('/dashboard')) return 'Farm Dashboard - Real-time Insights';
    if (path.includes('/fields')) return 'Field Management - Precision Agriculture';
    if (path.includes('/monitoring/satellite')) return 'Satellite Imagery - Sentinel-2 Analysis';
    if (path.includes('/monitoring/weather')) return 'Weather Intelligence - Environmental Data';
    if (path.includes('/monitoring/crop-health')) return 'Crop Health Analytics - AI-Powered Insights';
    if (path.includes('/monitoring/soil-water')) return 'Soil & Water Monitoring - Smart Irrigation';
    if (path.includes('/monitoring/risk-analysis')) return 'Risk Assessment - Predictive Analytics';
    if (path.includes('/monitoring')) return 'Field Monitoring - Comprehensive Analysis';
    if (path.includes('/comparative-analysis')) return 'Comparative Analysis - Performance Benchmarking';
    if (path.includes('/export')) return 'Data Export - Professional Reports';
    if (path.includes('/affiliate')) return 'Partner Program - Grow Together';
    if (path.includes('/subscription')) return 'Subscription Management - Premium Features';
    return 'Zr3i - Smart Agriculture Platform';
  };
  
  return (
    <AppBar position="fixed" className="header">
      <Toolbar>
        {isMobile && (
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={toggleSidebar}
            className="menu-button"
          >
            <MenuIcon />
          </IconButton>
        )}
        
        <Typography variant="h6" component="div" className="title">
          {getPageTitle()}
        </Typography>
        
        <Box sx={{ flexGrow: 1 }} />
        
        <div className="header-actions">
          <IconButton 
            color="inherit" 
            onClick={handleNotificationMenuOpen}
            aria-label="show notifications"
          >
            <Badge badgeContent={unreadNotificationsCount} color="error">
              <Notifications />
            </Badge>
          </IconButton>
          
          <IconButton
            edge="end"
            aria-label="account of current user"
            aria-haspopup="true"
            onClick={handleProfileMenuOpen}
            color="inherit"
          >
            {user?.profileImage ? (
              <Avatar src={user.profileImage} alt={user.name} className="user-avatar" />
            ) : (
              <AccountCircle />
            )}
          </IconButton>
        </div>
      </Toolbar>
      
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        keepMounted
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem component={Link} to="/profile" onClick={handleMenuClose}>
          <AccountCircle fontSize="small" style={{ marginRight: 8 }} />
          Profile
        </MenuItem>
        <MenuItem component={Link} to="/settings" onClick={handleMenuClose}>
          <Settings fontSize="small" style={{ marginRight: 8 }} />
          Settings
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <ExitToApp fontSize="small" style={{ marginRight: 8 }} />
          Logout
        </MenuItem>
      </Menu>
      
      <Menu
        anchorEl={notificationAnchorEl}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        keepMounted
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={Boolean(notificationAnchorEl)}
        onClose={handleNotificationMenuClose}
        PaperProps={{
          style: {
            maxHeight: 300,
            width: 320,
          },
        }}
      >
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <MenuItem 
              key={notification.id} 
              onClick={handleNotificationMenuClose}
              style={{ 
                backgroundColor: notification.read ? 'inherit' : 'rgba(25, 118, 210, 0.08)',
                whiteSpace: 'normal'
              }}
            >
              <Typography variant="body2">{notification.message}</Typography>
            </MenuItem>
          ))
        ) : (
          <MenuItem onClick={handleNotificationMenuClose}>
            <Typography variant="body2">No notifications</Typography>
          </MenuItem>
        )}
        {notifications.length > 0 && (
          <MenuItem 
            component={Link} 
            to="/notifications" 
            onClick={handleNotificationMenuClose}
            style={{ justifyContent: 'center' }}
          >
            <Typography variant="body2" color="primary">View All</Typography>
          </MenuItem>
        )}
      </Menu>
    </AppBar>
  );
};

export default Header;
