import React from 'react';
import { Box } from '@mui/material';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';
import './Layout.css';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  console.log("Layout component rendering...");
  console.log("Layout children:", children);

  return (
    <Box className="layout-container">
      <Header toggleSidebar={toggleSidebar} />
      <Sidebar open={sidebarOpen} toggleSidebar={toggleSidebar} />
      <Box component="main" className="main-content">
        <Box className="content-wrapper">
          {children}
        </Box>
        <Footer />
      </Box>
    </Box>
  );
};

export default Layout;


