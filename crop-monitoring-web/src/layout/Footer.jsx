import React from 'react';
import { Box, Typography, Container, Grid, Link, Divider } from '@mui/material';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <Box component="footer" className="footer">
      <Divider />
      <Container maxWidth="lg">
        <Grid container spacing={4} className="footer-content">
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" className="footer-heading">
              Zr3i
            </Typography>
            <Typography variant="body2" className="footer-description">
              Advanced crop monitoring and management platform leveraging satellite imagery and remote sensing technology.
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" className="footer-heading">
              Quick Links
            </Typography>
            <ul className="footer-links">
              <li>
                <Link href="/" color="inherit">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/monitoring/satellite" color="inherit">
                  Satellite Data
                </Link>
              </li>
              <li>
                <Link href="/monitoring/weather" color="inherit">
                  Weather Monitoring
                </Link>
              </li>
              <li>
                <Link href="/comparative-analysis" color="inherit">
                  Comparative Analysis
                </Link>
              </li>
            </ul>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" className="footer-heading">
              Resources
            </Typography>
            <ul className="footer-links">
              <li>
                <Link href="/help" color="inherit">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/documentation" color="inherit">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="/api" color="inherit">
                  API Reference
                </Link>
              </li>
              <li>
                <Link href="/affiliate" color="inherit">
                  Affiliate Program
                </Link>
              </li>
            </ul>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" className="footer-heading">
              Contact
            </Typography>
            <ul className="footer-links">
              <li>
                <Link href="mailto:support@zr3i.com" color="inherit">
                  support@zr3i.com
                </Link>
              </li>
              <li>
                <Link href="tel:+1234567890" color="inherit">
                  +1 (234) 567-890
                </Link>
              </li>
              <li>
                <Link href="/contact" color="inherit">
                  Contact Form
                </Link>
              </li>
            </ul>
          </Grid>
        </Grid>
        
        <Divider className="footer-divider" />
        
        <Box className="footer-bottom">
          <Typography variant="body2" className="copyright">
            © {currentYear} Zr3i. All rights reserved.
          </Typography>
          <Box className="footer-legal-links">
            <Link href="/terms" color="inherit" className="legal-link">
              Terms of Service
            </Link>
            <Link href="/privacy" color="inherit" className="legal-link">
              Privacy Policy
            </Link>
            <Link href="/cookies" color="inherit" className="legal-link">
              Cookie Policy
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
