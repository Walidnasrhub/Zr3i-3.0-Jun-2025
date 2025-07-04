import React from 'react';
import { Box, Typography, Container, Grid, Link, Divider } from '@mui/material';
import { useTranslation } from 'react-i18next';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { i18n } = useTranslation();
  
  return (
    <Box component="footer" className="footer">
      <Divider />
      <Container maxWidth="lg">
        <Grid container spacing={4} className="footer-content">
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" className="footer-heading">
              {i18n.language === 'ar' ? 'زرعي' : 'Zr3i'}
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
                <Link href="mailto:info@zr3i.com" color="inherit">
                  info@zr3i.com
                </Link>
              </li>
              <li>
                <Link href="tel:+201006055320" color="inherit">
                  +2-01006055320
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
            © {currentYear} {i18n.language === 'ar' ? 'زرعي' : 'Zr3i'}. All rights reserved.
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


