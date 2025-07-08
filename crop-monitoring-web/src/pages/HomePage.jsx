import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  Chip,
  Paper,
  Avatar,
  Divider,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Agriculture,
  Satellite,
  TrendingUp,
  Security,
  Speed,
  CloudQueue,
  Language,
  Login,
  PersonAdd,
  Dashboard,
  MonetizationOn,
  LocalFlorist,
  Timeline,
  Compare,
  MenuBook,
  Phone,
  Email,
  LocationOn,
  Facebook,
  Twitter,
  LinkedIn,
  Instagram
} from '@mui/icons-material';

const HomePage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [languageMenu, setLanguageMenu] = useState(null);

  const handleLanguageClick = (event) => {
    setLanguageMenu(event.currentTarget);
  };

  const handleLanguageClose = () => {
    setLanguageMenu(null);
  };

  const features = [
    {
      icon: <Satellite sx={{ fontSize: 40, color: '#2e7d32' }} />,
      title: 'Satellite Intelligence',
      description: 'Real-time satellite imagery and AI-powered crop monitoring with NDVI, EVI, and SAVI analysis.',
      link: '/vegetation-indices'
    },
    {
      icon: <TrendingUp sx={{ fontSize: 40, color: '#ff9800' }} />,
      title: 'Market Intelligence',
      description: 'Live commodity prices, market trends, and price forecasting to maximize your profits.',
      link: '/commodity-prices'
    },
    {
      icon: <Agriculture sx={{ fontSize: 40, color: '#4caf50' }} />,
      title: 'Precision Agriculture',
      description: 'Field management, crop health monitoring, and yield optimization tools.',
      link: '/register'
    },
    {
      icon: <CloudQueue sx={{ fontSize: 40, color: '#2196f3' }} />,
      title: 'Weather Analytics',
      description: 'Advanced weather forecasting, climate data, and risk assessment for your fields.',
      link: '/register'
    },
    {
      icon: <Timeline sx={{ fontSize: 40, color: '#9c27b0' }} />,
      title: 'Analytics & Reports',
      description: 'Comprehensive analytics, performance tracking, and professional reporting.',
      link: '/register'
    },
    {
      icon: <Security sx={{ fontSize: 40, color: '#f44336' }} />,
      title: 'Risk Management',
      description: 'Early warning systems for pests, diseases, and weather-related risks.',
      link: '/register'
    }
  ];

  const testimonials = [
    {
      name: 'Ahmed Al-Rashid',
      role: 'Farm Owner, Saudi Arabia',
      avatar: '👨‍🌾',
      text: 'Zr3i transformed our farm operations. The satellite monitoring helped us increase yield by 25% while reducing water usage.'
    },
    {
      name: 'Fatima Hassan',
      role: 'Agricultural Engineer, Egypt',
      avatar: '👩‍🔬',
      text: 'The market intelligence feature is incredible. We now time our sales perfectly and maximize profits every season.'
    },
    {
      name: 'Omar Khalil',
      role: 'Cooperative Manager, Jordan',
      avatar: '👨‍💼',
      text: 'Managing 50+ farms is now effortless with Zr3i. The analytics and reporting save us hours every week.'
    }
  ];

  const stats = [
    { number: '10,000+', label: 'Active Farmers' },
    { number: '500,000+', label: 'Hectares Monitored' },
    { number: '25%', label: 'Average Yield Increase' },
    { number: '30%', label: 'Water Savings' }
  ];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8f9fa' }}>
      {/* Header */}
      <AppBar position="static" sx={{ bgcolor: 'white', color: 'black', boxShadow: 1 }}>
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <img 
              src="/logo.png" 
              alt="Zr3i Logo" 
              style={{ height: 40, marginRight: 16 }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://via.placeholder.com/120x40?text=Zr3i';
              }}
            />
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#2e7d32' }}>
              Zr3i
            </Typography>
            <Typography variant="subtitle2" sx={{ ml: 1, color: '#666' }}>
              Agriculture Platform as a Service
            </Typography>
          </Box>

          {!isMobile && (
            <Box sx={{ display: 'flex', gap: 2, mr: 2 }}>
              <Button color="inherit" component={Link} to="/vegetation-indices">
                Features
              </Button>
              <Button color="inherit" component={Link} to="/commodity-prices">
                Market Data
              </Button>
              <Button color="inherit" href="#pricing">
                Pricing
              </Button>
              <Button color="inherit" href="#contact">
                Contact
              </Button>
            </Box>
          )}

          <IconButton onClick={handleLanguageClick} sx={{ mr: 1 }}>
            <Language />
          </IconButton>
          <Menu
            anchorEl={languageMenu}
            open={Boolean(languageMenu)}
            onClose={handleLanguageClose}
          >
            <MenuItem onClick={handleLanguageClose}>English</MenuItem>
            <MenuItem onClick={handleLanguageClose}>العربية</MenuItem>
          </Menu>

          <Button
            variant="outlined"
            startIcon={<Login />}
            component={Link}
            to="/login"
            sx={{ mr: 1 }}
          >
            Login
          </Button>
          <Button
            variant="contained"
            startIcon={<PersonAdd />}
            component={Link}
            to="/register"
            sx={{ bgcolor: '#2e7d32' }}
          >
            Get Started
          </Button>
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #2e7d32 0%, #4caf50 100%)',
          color: 'white',
          py: { xs: 8, md: 12 },
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography
                variant="h2"
                component="h1"
                gutterBottom
                sx={{
                  fontWeight: 'bold',
                  fontSize: { xs: '2.5rem', md: '3.5rem' },
                  lineHeight: 1.2
                }}
              >
                Smart Agriculture
                <br />
                <span style={{ color: '#81c784' }}>Powered by AI</span>
              </Typography>
              <Typography
                variant="h5"
                paragraph
                sx={{
                  mb: 4,
                  opacity: 0.9,
                  fontSize: { xs: '1.2rem', md: '1.5rem' }
                }}
              >
                Monitor your crops with satellite intelligence, optimize yields with precision agriculture, and maximize profits with market insights.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<PersonAdd />}
                  component={Link}
                  to="/register"
                  sx={{
                    bgcolor: 'white',
                    color: '#2e7d32',
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                    '&:hover': { bgcolor: '#f5f5f5' }
                  }}
                >
                  Start Free Trial
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  startIcon={<Dashboard />}
                  component={Link}
                  to="/vegetation-indices"
                  sx={{
                    borderColor: 'white',
                    color: 'white',
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                    '&:hover': { borderColor: '#81c784', bgcolor: 'rgba(255,255,255,0.1)' }
                  }}
                >
                  View Demo
                </Button>
              </Box>
              <Box sx={{ mt: 3, display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                <Chip
                  icon={<Satellite />}
                  label="Real-time Satellite Data"
                  sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
                />
                <Chip
                  icon={<TrendingUp />}
                  label="Market Intelligence"
                  sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
                />
                <Chip
                  icon={<Speed />}
                  label="AI-Powered Analytics"
                  sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  position: 'relative',
                  textAlign: 'center',
                  '& img': {
                    maxWidth: '100%',
                    height: 'auto',
                    borderRadius: 2,
                    boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
                  }
                }}
              >
                <img
                  src="https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Smart Agriculture Dashboard"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/600x400?text=Smart+Agriculture+Dashboard';
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Stats Section */}
      <Box sx={{ py: 6, bgcolor: 'white' }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            {stats.map((stat, index) => (
              <Grid item xs={6} md={3} key={index}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography
                    variant="h3"
                    sx={{ fontWeight: 'bold', color: '#2e7d32', mb: 1 }}
                  >
                    {stat.number}
                  </Typography>
                  <Typography variant="h6" color="text.secondary">
                    {stat.label}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Box sx={{ py: 8, bgcolor: '#f8f9fa' }}>
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            component="h2"
            textAlign="center"
            gutterBottom
            sx={{ fontWeight: 'bold', mb: 2 }}
          >
            Powerful Features for Modern Farming
          </Typography>
          <Typography
            variant="h6"
            textAlign="center"
            color="text.secondary"
            paragraph
            sx={{ mb: 6, maxWidth: 600, mx: 'auto' }}
          >
            Everything you need to optimize your agricultural operations and maximize profitability
          </Typography>

          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} md={6} lg={4} key={index}>
                <Card
                  sx={{
                    height: '100%',
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    cursor: 'pointer',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: 4
                    }
                  }}
                  onClick={() => navigate(feature.link)}
                >
                  <CardContent sx={{ p: 3, textAlign: 'center' }}>
                    <Box sx={{ mb: 2 }}>
                      {feature.icon}
                    </Box>
                    <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      {feature.description}
                    </Typography>
                    <Button
                      variant="outlined"
                      sx={{ mt: 2 }}
                      component={Link}
                      to={feature.link}
                    >
                      Learn More
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Testimonials Section */}
      <Box sx={{ py: 8, bgcolor: 'white' }}>
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            component="h2"
            textAlign="center"
            gutterBottom
            sx={{ fontWeight: 'bold', mb: 6 }}
          >
            Trusted by Farmers Across the Region
          </Typography>

          <Grid container spacing={4}>
            {testimonials.map((testimonial, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Paper
                  elevation={2}
                  sx={{
                    p: 3,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: 2
                  }}
                >
                  <Typography
                    variant="body1"
                    paragraph
                    sx={{ flexGrow: 1, fontStyle: 'italic', mb: 3 }}
                  >
                    "{testimonial.text}"
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{ mr: 2, bgcolor: '#2e7d32' }}>
                      {testimonial.avatar}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                        {testimonial.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {testimonial.role}
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box
        sx={{
          py: 8,
          background: 'linear-gradient(135deg, #1976d2 0%, #2e7d32 100%)',
          color: 'white',
          textAlign: 'center'
        }}
      >
        <Container maxWidth="md">
          <Typography
            variant="h3"
            component="h2"
            gutterBottom
            sx={{ fontWeight: 'bold', mb: 2 }}
          >
            Ready to Transform Your Farm?
          </Typography>
          <Typography
            variant="h6"
            paragraph
            sx={{ mb: 4, opacity: 0.9 }}
          >
            Join thousands of farmers who are already using Zr3i to optimize their operations and increase profitability.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              size="large"
              startIcon={<PersonAdd />}
              component={Link}
              to="/register"
              sx={{
                bgcolor: 'white',
                color: '#2e7d32',
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                '&:hover': { bgcolor: '#f5f5f5' }
              }}
            >
              Start Your Free Trial
            </Button>
            <Button
              variant="outlined"
              size="large"
              startIcon={<Phone />}
              sx={{
                borderColor: 'white',
                color: 'white',
                px: 4,
                py: 1.5,
                fontSize: '1.1rem'
              }}
            >
              Schedule Demo
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ bgcolor: '#263238', color: 'white', py: 6 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <img 
                  src="/logo.png" 
                  alt="Zr3i Logo" 
                  style={{ height: 32, marginRight: 12 }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/100x32?text=Zr3i';
                  }}
                />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Zr3i
                </Typography>
              </Box>
              <Typography variant="body2" paragraph sx={{ opacity: 0.8 }}>
                The leading Agriculture Platform as a Service, empowering farmers with AI-driven insights and precision agriculture tools.
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <IconButton sx={{ color: 'white' }}>
                  <Facebook />
                </IconButton>
                <IconButton sx={{ color: 'white' }}>
                  <Twitter />
                </IconButton>
                <IconButton sx={{ color: 'white' }}>
                  <LinkedIn />
                </IconButton>
                <IconButton sx={{ color: 'white' }}>
                  <Instagram />
                </IconButton>
              </Box>
            </Grid>
            <Grid item xs={12} md={2}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Platform
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Button color="inherit" component={Link} to="/vegetation-indices" sx={{ justifyContent: 'flex-start', p: 0 }}>
                  Features
                </Button>
                <Button color="inherit" component={Link} to="/commodity-prices" sx={{ justifyContent: 'flex-start', p: 0 }}>
                  Market Data
                </Button>
                <Button color="inherit" component={Link} to="/register" sx={{ justifyContent: 'flex-start', p: 0 }}>
                  Pricing
                </Button>
                <Button color="inherit" component={Link} to="/register" sx={{ justifyContent: 'flex-start', p: 0 }}>
                  API
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={2}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Company
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Button color="inherit" sx={{ justifyContent: 'flex-start', p: 0 }}>
                  About Us
                </Button>
                <Button color="inherit" sx={{ justifyContent: 'flex-start', p: 0 }}>
                  Careers
                </Button>
                <Button color="inherit" sx={{ justifyContent: 'flex-start', p: 0 }}>
                  Blog
                </Button>
                <Button color="inherit" sx={{ justifyContent: 'flex-start', p: 0 }}>
                  Press
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Contact Us
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Email sx={{ fontSize: 20 }} />
                  <Typography variant="body2">info@zr3i.com</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Phone sx={{ fontSize: 20 }} />
                  <Typography variant="body2">+966 11 123 4567</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LocationOn sx={{ fontSize: 20 }} />
                  <Typography variant="body2">Riyadh, Saudi Arabia</Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
          <Divider sx={{ my: 4, bgcolor: 'rgba(255,255,255,0.2)' }} />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              © 2025 Zr3i. All rights reserved.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button color="inherit" size="small">Privacy Policy</Button>
              <Button color="inherit" size="small">Terms of Service</Button>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;

