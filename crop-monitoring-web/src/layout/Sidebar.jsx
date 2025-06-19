import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Drawer, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  Collapse, 
  Divider,
  Box,
  Typography,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { 
  Dashboard, 
  Terrain, 
  Compare, 
  CloudDownload, 
  Settings, 
  ExpandLess, 
  ExpandMore,
  Opacity,
  LocalFlorist,
  Warning,
  Timeline,
  Tune,
  MonetizationOn
} from '@mui/icons-material';
import { useAuth } from '../hooks/useAuth';
import './Sidebar.css';

const Sidebar = ({ open, toggleSidebar }) => {
  const { user } = useAuth();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [monitoringOpen, setMonitoringOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  
  useEffect(() => {
    // Check if current path is under monitoring to expand that section
    if (location.pathname.includes('/monitoring')) {
      setMonitoringOpen(true);
    }
    
    // Check if current path is under settings to expand that section
    if (location.pathname.includes('/settings')) {
      setSettingsOpen(true);
    }
  }, [location.pathname]);
  
  const handleMonitoringClick = () => {
    setMonitoringOpen(!monitoringOpen);
  };
  
  const handleSettingsClick = () => {
    setSettingsOpen(!settingsOpen);
  };
  
  const isActive = (path) => {
    return location.pathname === path;
  };
  
  const drawerContent = (
    <>
      <Box className="sidebar-header">
        <img 
          src="/logo.png" 
          alt={i18n.language === 'ar' ? 'زرعي Logo' : 'Zr3i Logo'} 
          className="sidebar-logo"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = i18n.language === 'ar' ? 'https://via.placeholder.com/150x50?text=زرعي' : 'https://via.placeholder.com/150x50?text=Zr3i';
          }}
        />
        <Typography variant="h6" className="sidebar-title">
          {i18n.language === 'ar' ? 'زرعي' : 'Zr3i'}
        </Typography>
      </Box>
      
      <Divider />
      
      <Box className="sidebar-user-info">
        <Typography variant="subtitle1" className="user-name">
          {user?.name || 'User'}
        </Typography>
        <Typography variant="body2" className="user-role">
          {user?.role || 'Farmer'}
        </Typography>
      </Box>
      
      <Divider />
      
      <List component="nav" className="sidebar-nav">
        <ListItem 
          button 
          component={Link} 
          to="/" 
          className={isActive('/') ? 'active-link' : ''}
          onClick={isMobile ? toggleSidebar : undefined}
        >
          <ListItemIcon>
            <Dashboard />
          </ListItemIcon>
          <ListItemText primary="Smart Dashboard" />
        </ListItem>
        
        <ListItem 
          button 
          component={Link} 
          to="/fields" 
          className={isActive('/fields') ? 'active-link' : ''}
          onClick={isMobile ? toggleSidebar : undefined}
        >
          <ListItemIcon>
            <Terrain />
          </ListItemIcon>
          <ListItemText primary="Field Management" />
        </ListItem>
        
        <ListItem button onClick={handleMonitoringClick}>
          <ListItemIcon>
            <Timeline />
          </ListItemIcon>
          <ListItemText primary="Precision Monitoring" />
          {monitoringOpen ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        
        <Collapse in={monitoringOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem 
              button 
              component={Link} 
              to="/monitoring/satellite" 
              className={`nested-list-item ${isActive('/monitoring/satellite') ? 'active-link' : ''}`}
              onClick={isMobile ? toggleSidebar : undefined}
            >
              <ListItemIcon>
                <Timeline />
              </ListItemIcon>
              <ListItemText primary="Satellite Intelligence" />
            </ListItem>
            
            <ListItem 
              button 
              component={Link} 
              to="/monitoring/weather" 
              className={`nested-list-item ${isActive('/monitoring/weather') ? 'active-link' : ''}`}
              onClick={isMobile ? toggleSidebar : undefined}
            >
              <ListItemIcon>
                <Opacity />
              </ListItemIcon>
              <ListItemText primary="Weather Analytics" />
            </ListItem>
            
            <ListItem 
              button 
              component={Link} 
              to="/monitoring/vegetation-indices" 
              className={`nested-list-item ${isActive('/monitoring/vegetation-indices') ? 'active-link' : ''}`}
              onClick={isMobile ? toggleSidebar : undefined}
            >
              <ListItemIcon>
                <LocalFlorist />
              </ListItemIcon>
              <ListItemText primary="Vegetation Indices" />
            </ListItem>
            
            <ListItem 
              button 
              component={Link} 
              to="/monitoring/crop-health" 
              className={`nested-list-item ${isActive('/monitoring/crop-health') ? 'active-link' : ''}`}
              onClick={isMobile ? toggleSidebar : undefined}
            >
              <ListItemIcon>
                <LocalFlorist />
              </ListItemIcon>
              <ListItemText primary="Crop Health AI" />
            </ListItem>
            
            <ListItem 
              button 
              component={Link} 
              to="/monitoring/soil-water" 
              className={`nested-list-item ${isActive('/monitoring/soil-water') ? 'active-link' : ''}`}
              onClick={isMobile ? toggleSidebar : undefined}
            >
              <ListItemIcon>
                <Opacity />
              </ListItemIcon>
              <ListItemText primary="Soil & Water Insights" />
            </ListItem>
            
            <ListItem 
              button 
              component={Link} 
              to="/monitoring/risk-analysis" 
              className={`nested-list-item ${isActive('/monitoring/risk-analysis') ? 'active-link' : ''}`}
              onClick={isMobile ? toggleSidebar : undefined}
            >
              <ListItemIcon>
                <Warning />
              </ListItemIcon>
              <ListItemText primary="Risk Intelligence" />
            </ListItem>
            
            <ListItem 
              button 
              component={Link} 
              to="/monitoring/reports" 
              className={`nested-list-item ${isActive('/monitoring/reports') ? 'active-link' : ''}`}
              onClick={isMobile ? toggleSidebar : undefined}
            >
              <ListItemIcon>
                <Timeline />
              </ListItemIcon>
              <ListItemText primary="Analytics Reports" />
            </ListItem>
          </List>
        </Collapse>
        
        <ListItem 
          button 
          component={Link} 
          to="/comparative-analysis" 
          className={isActive('/comparative-analysis') ? 'active-link' : ''}
          onClick={isMobile ? toggleSidebar : undefined}
        >
          <ListItemIcon>
            <Compare />
          </ListItemIcon>
          <ListItemText primary="Performance Benchmarking" />
        </ListItem>
        
        <ListItem 
          button 
          component={Link} 
          to="/export" 
          className={isActive('/export') ? 'active-link' : ''}
          onClick={isMobile ? toggleSidebar : undefined}
        >
          <ListItemIcon>
            <CloudDownload />
          </ListItemIcon>
          <ListItemText primary="Professional Reports" />
        </ListItem>
        
        <ListItem 
          button 
          component={Link} 
          to="/dashboard-customization" 
          className={isActive('/dashboard-customization') ? 'active-link' : ''}
          onClick={isMobile ? toggleSidebar : undefined}
        >
          <ListItemIcon>
            <Tune />
          </ListItemIcon>
          <ListItemText primary="Dashboard Customization" />
        </ListItem>
        
        <Divider />
        
        <ListItem 
          button 
          component={Link} 
          to="/subscription/plans" 
          className={isActive('/subscription/plans') ? 'active-link' : ''}
          onClick={isMobile ? toggleSidebar : undefined}
        >
          <ListItemIcon>
            <MonetizationOn />
          </ListItemIcon>
          <ListItemText primary="Premium Plans" />
        </ListItem>
        
        <ListItem 
          button 
          component={Link} 
          to="/affiliate/register" 
          className={isActive('/affiliate/register') ? 'active-link' : ''}
          onClick={isMobile ? toggleSidebar : undefined}
        >
          <ListItemIcon>
            <MonetizationOn />
          </ListItemIcon>
          <ListItemText primary="Partner Program" />
        </ListItem>
        
        <ListItem button onClick={handleSettingsClick}>
          <ListItemIcon>
            <Settings />
          </ListItemIcon>
          <ListItemText primary="Settings" />
          {settingsOpen ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        
        <Collapse in={settingsOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem 
              button 
              component={Link} 
              to="/settings/profile" 
              className={`nested-list-item ${isActive('/settings/profile') ? 'active-link' : ''}`}
              onClick={isMobile ? toggleSidebar : undefined}
            >
              <ListItemText primary="Profile Settings" />
            </ListItem>
            
            <ListItem 
              button 
              component={Link} 
              to="/settings/notifications" 
              className={`nested-list-item ${isActive('/settings/notifications') ? 'active-link' : ''}`}
              onClick={isMobile ? toggleSidebar : undefined}
            >
              <ListItemText primary="Notification Settings" />
            </ListItem>
            
            <ListItem 
              button 
              component={Link} 
              to="/settings/appearance" 
              className={`nested-list-item ${isActive('/settings/appearance') ? 'active-link' : ''}`}
              onClick={isMobile ? toggleSidebar : undefined}
            >
              <ListItemText primary="Appearance" />
            </ListItem>
          </List>
        </Collapse>
      </List>
    </>
  );
  
  return (
    <nav className="sidebar">
      {isMobile ? (
        <Drawer
          variant="temporary"
          open={open}
          onClose={toggleSidebar}
          classes={{
            paper: 'sidebar-drawer',
          }}
          ModalProps={{
            keepMounted: true, // Better mobile performance
          }}
        >
          {drawerContent}
        </Drawer>
      ) : (
        <Drawer
          variant="permanent"
          open
          classes={{
            paper: 'sidebar-drawer',
          }}
        >
          {drawerContent}
        </Drawer>
      )}
    </nav>
  );
};

export default Sidebar;
