import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  Container, 
  Typography, 
  Button, 
  Grid, 
  Card, 
  CardContent, 
  Box, 
  Chip,
  Avatar,
  Paper,
  Divider,
  IconButton
} from '@mui/material';
import {
  Agriculture,
  Satellite,
  WbSunny,
  LocalFlorist,
  Assessment,
  Water,
  TrendingUp,
  Facebook,
  LinkedIn,
  Twitter,
  YouTube,
  Star,
  CheckCircle,
  ArrowForward,
  PlayArrow,
  Language,
  Phone,
  Email,
  LocationOn
} from '@mui/icons-material';
import './HomePage.css';

const HomePage = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const toggleLanguage = () => {
    const newLanguage = i18n.language === 'en' ? 'ar' : 'en';
    i18n.changeLanguage(newLanguage);
    document.dir = newLanguage === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = newLanguage;
  };

  const features = [
    {
      icon: <Agriculture sx={{ fontSize: 40 }} />,
      title: t('homepage.fieldManagement'),
      description: t('homepage.fieldManagementDesc'),
      features: t('homepage.fieldManagementFeatures'),
      link: '/fields',
      linkText: t('homepage.manageFields')
    },
    {
      icon: <Satellite sx={{ fontSize: 40 }} />,
      title: t('homepage.satelliteImagery'),
      description: t('homepage.satelliteImageryDesc'),
      features: t('homepage.satelliteImageryFeatures'),
      link: '/monitoring/satellite',
      linkText: t('homepage.viewImagery')
    },
    {
      icon: <LocalFlorist sx={{ fontSize: 40 }} />,
      title: t('homepage.vegetationIndices'),
      description: t('homepage.vegetationIndicesDesc'),
      features: t('homepage.vegetationIndicesFeatures'),
      link: '/monitoring/vegetation-indices',
      linkText: t('homepage.viewIndices')
    },
    {
      icon: <WbSunny sx={{ fontSize: 40 }} />,
      title: t('homepage.weatherMonitoring'),
      description: t('homepage.weatherMonitoringDesc'),
      features: t('homepage.weatherMonitoringFeatures'),
      link: '/monitoring/weather',
      linkText: t('homepage.checkWeather')
    },
    {
      icon: <Assessment sx={{ fontSize: 40 }} />,
      title: t('homepage.cropHealthAnalysis'),
      description: t('homepage.cropHealthAnalysisDesc'),
      features: t('homepage.cropHealthAnalysisFeatures'),
      link: '/monitoring/crop-health',
      linkText: t('homepage.analyzeHealth')
    },
    {
      icon: <Water sx={{ fontSize: 40 }} />,
      title: t('homepage.soilWaterManagement'),
      description: t('homepage.soilWaterManagementDesc'),
      features: t('homepage.soilWaterManagementFeatures'),
      link: '/monitoring/soil-water',
      linkText: t('homepage.manageSoilWater')
    },
    {
      icon: <TrendingUp sx={{ fontSize: 40 }} />,
      title: t('homepage.yieldPrediction'),
      description: t('homepage.yieldPredictionDesc'),
      features: t('homepage.yieldPredictionFeatures'),
      link: '/monitoring/indicators',
      linkText: t('homepage.predictYield')
    }
  ];

  const stats = [
    { number: t('homepage.stat1Number'), label: t('homepage.stat1Label') },
    { number: t('homepage.stat2Number'), label: t('homepage.stat2Label') },
    { number: t('homepage.stat3Number'), label: t('homepage.stat3Label') },
    { number: t('homepage.stat4Number'), label: t('homepage.stat4Label') }
  ];

  const benefits = [
    {
      title: t('homepage.benefit1Title'),
      description: t('homepage.benefit1Desc'),
      icon: <TrendingUp sx={{ fontSize: 48, color: '#4caf50' }} />
    },
    {
      title: t('homepage.benefit2Title'),
      description: t('homepage.benefit2Desc'),
      icon: <Assessment sx={{ fontSize: 48, color: '#2196f3' }} />
    },
    {
      title: t('homepage.benefit3Title'),
      description: t('homepage.benefit3Desc'),
      icon: <LocalFlorist sx={{ fontSize: 48, color: '#8bc34a' }} />
    },
    {
      title: t('homepage.benefit4Title'),
      description: t('homepage.benefit4Desc'),
      icon: <CheckCircle sx={{ fontSize: 48, color: '#ff9800' }} />
    }
  ];

  const pricingPlans = [
    {
      name: t('homepage.basicPlan'),
      price: t('homepage.basicPrice'),
      description: t('homepage.basicDesc'),
      features: t('homepage.basicFeatures').split('•').filter(f => f.trim()),
      popular: false
    },
    {
      name: t('homepage.professionalPlan'),
      price: t('homepage.professionalPrice'),
      description: t('homepage.professionalDesc'),
      features: t('homepage.professionalFeatures').split('•').filter(f => f.trim()),
      popular: true
    },
    {
      name: t('homepage.enterprisePlan'),
      price: t('homepage.enterprisePrice'),
      description: t('homepage.enterpriseDesc'),
      features: t('homepage.enterpriseFeatures').split('•').filter(f => f.trim()),
      popular: false
    }
  ];

  const testimonials = [
    {
      text: t('homepage.testimonial1'),
      author: t('homepage.testimonial1Author'),
      role: t('homepage.testimonial1Role'),
      avatar: '/avatars/ahmed.jpg'
    },
    {
      text: t('homepage.testimonial2'),
      author: t('homepage.testimonial2Author'),
      role: t('homepage.testimonial2Role'),
      avatar: '/avatars/sarah.jpg'
    },
    {
      text: t('homepage.testimonial3'),
      author: t('homepage.testimonial3Author'),
      role: t('homepage.testimonial3Role'),
      avatar: '/avatars/maria.jpg'
    }
  ];

  return (
    <div className={`homepage ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Language Toggle */}
      <Box className="language-toggle">
        <Button
          onClick={toggleLanguage}
          startIcon={<Language />}
          className="language-button"
          variant="contained"
          size="small"
        >
          {i18n.language === 'en' ? 'العربية' : 'English'}
        </Button>
      </Box>

      {/* Hero Section */}
      <Box className="hero-section">
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box className="hero-content">
                <Typography variant="h1" className="hero-title">
                  {t('homepage.heroTitle')}
                </Typography>
                <Typography variant="h5" className="hero-subtitle">
                  {t('homepage.heroSubtitle')}
                </Typography>
                <Typography variant="body1" className="hero-description">
                  {t('homepage.heroDescription')}
                </Typography>
                <Box className="hero-actions">
                  <Button
                    component={Link}
                    to="/register"
                    variant="contained"
                    size="large"
                    className="cta-button primary"
                    endIcon={<ArrowForward />}
                  >
                    {t('homepage.getStarted')}
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    className="cta-button secondary"
                    startIcon={<PlayArrow />}
                  >
                    {t('homepage.watchDemo')}
                  </Button>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box className="hero-image">
                <img 
                  src="/images/hero-agriculture.jpg" 
                  alt="Smart Agriculture" 
                  className="hero-img"
                />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Stats Section */}
      <Box className="stats-section">
        <Container maxWidth="lg">
          <Typography variant="h3" className="section-title" textAlign="center">
            {t('homepage.statsTitle')}
          </Typography>
          <Grid container spacing={4}>
            {stats.map((stat, index) => (
              <Grid item xs={6} md={3} key={index}>
                <Box className="stat-item" textAlign="center">
                  <Typography variant="h2" className="stat-number">
                    {stat.number}
                  </Typography>
                  <Typography variant="h6" className="stat-label">
                    {stat.label}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Box className="features-section">
        <Container maxWidth="lg">
          <Box textAlign="center" mb={6}>
            <Typography variant="h3" className="section-title">
              {t('homepage.featuresTitle')}
            </Typography>
            <Typography variant="h6" className="section-subtitle">
              {t('homepage.featuresSubtitle')}
            </Typography>
          </Box>
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} md={6} lg={4} key={index}>
                <Card className="feature-card" elevation={3}>
                  <CardContent>
                    <Box className="feature-icon" mb={2}>
                      {feature.icon}
                    </Box>
                    <Typography variant="h5" className="feature-title" gutterBottom>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" className="feature-description" paragraph>
                      {feature.description}
                    </Typography>
                    <Typography variant="body2" className="feature-list" paragraph>
                      {feature.features}
                    </Typography>
                    <Button
                      component={Link}
                      to={feature.link}
                      className="feature-link"
                      endIcon={<ArrowForward />}
                    >
                      {feature.linkText}
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Benefits Section */}
      <Box className="benefits-section">
        <Container maxWidth="lg">
          <Box textAlign="center" mb={6}>
            <Typography variant="h3" className="section-title">
              {t('homepage.benefitsTitle')}
            </Typography>
            <Typography variant="h6" className="section-subtitle">
              {t('homepage.benefitsSubtitle')}
            </Typography>
          </Box>
          <Grid container spacing={4}>
            {benefits.map((benefit, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Box className="benefit-item">
                  <Box className="benefit-icon" mb={2}>
                    {benefit.icon}
                  </Box>
                  <Typography variant="h5" className="benefit-title" gutterBottom>
                    {benefit.title}
                  </Typography>
                  <Typography variant="body1" className="benefit-description">
                    {benefit.description}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Pricing Section */}
      <Box className="pricing-section">
        <Container maxWidth="lg">
          <Box textAlign="center" mb={6}>
            <Typography variant="h3" className="section-title">
              {t('homepage.pricingTitle')}
            </Typography>
            <Typography variant="h6" className="section-subtitle">
              {t('homepage.pricingSubtitle')}
            </Typography>
          </Box>
          <Grid container spacing={4} justifyContent="center">
            {pricingPlans.map((plan, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card className={`pricing-card ${plan.popular ? 'popular' : ''}`} elevation={plan.popular ? 8 : 3}>
                  {plan.popular && (
                    <Chip 
                      label="Most Popular" 
                      className="popular-badge"
                      color="primary"
                    />
                  )}
                  <CardContent>
                    <Typography variant="h4" className="plan-name" gutterBottom>
                      {plan.name}
                    </Typography>
                    <Typography variant="h3" className="plan-price" gutterBottom>
                      {plan.price}
                    </Typography>
                    <Typography variant="body1" className="plan-description" paragraph>
                      {plan.description}
                    </Typography>
                    <Box className="plan-features">
                      {plan.features.map((feature, idx) => (
                        <Box key={idx} className="feature-item">
                          <CheckCircle className="feature-check" />
                          <Typography variant="body2">{feature.trim()}</Typography>
                        </Box>
                      ))}
                    </Box>
                    <Button
                      variant={plan.popular ? "contained" : "outlined"}
                      size="large"
                      fullWidth
                      className="plan-button"
                    >
                      {t('homepage.getStarted')}
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Social Media Registration Section */}
      <Box className="social-registration-section">
        <Container maxWidth="md">
          <Paper className="social-registration-card" elevation={4}>
            <Typography variant="h4" className="section-title" textAlign="center" gutterBottom>
              {t('homepage.socialMediaRegistration')}
            </Typography>
            <Typography variant="body1" className="section-subtitle" textAlign="center" paragraph>
              {t('homepage.socialMediaRegistrationDesc')}
            </Typography>
            <Grid container spacing={2} justifyContent="center">
              <Grid item xs={12} sm={4}>
                <Button
                  variant="contained"
                  fullWidth
                  className="social-button facebook"
                  startIcon={<Facebook />}
                >
                  {t('homepage.registerWithFacebook')}
                </Button>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Button
                  variant="contained"
                  fullWidth
                  className="social-button google"
                >
                  {t('homepage.registerWithGoogle')}
                </Button>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Button
                  variant="contained"
                  fullWidth
                  className="social-button linkedin"
                  startIcon={<LinkedIn />}
                >
                  {t('homepage.registerWithLinkedIn')}
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Container>
      </Box>

      {/* Referral Program Section */}
      <Box className="referral-section">
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h3" className="section-title" gutterBottom>
                {t('homepage.referralProgram')}
              </Typography>
              <Typography variant="body1" className="section-subtitle" paragraph>
                {t('homepage.referralProgramDesc')}
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={6}>
                  <Box className="referral-benefit">
                    <Typography variant="h4" className="referral-amount">
                      {t('homepage.referralReward')}
                    </Typography>
                    <Typography variant="body2">
                      {t('homepage.referralRewardDesc')}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box className="referral-benefit">
                    <Typography variant="h4" className="referral-amount">
                      {t('homepage.referralDiscount')}
                    </Typography>
                    <Typography variant="body2">
                      {t('homepage.referralDiscountDesc')}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
              <Button
                variant="contained"
                size="large"
                className="referral-button"
                endIcon={<ArrowForward />}
              >
                {t('homepage.joinReferralProgram')}
              </Button>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box className="referral-image">
                <img 
                  src="/images/referral-program.jpg" 
                  alt="Referral Program" 
                  className="referral-img"
                />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Testimonials Section */}
      <Box className="testimonials-section">
        <Container maxWidth="lg">
          <Box textAlign="center" mb={6}>
            <Typography variant="h3" className="section-title">
              {t('homepage.testimonialsTitle')}
            </Typography>
            <Typography variant="h6" className="section-subtitle">
              {t('homepage.testimonialsSubtitle')}
            </Typography>
          </Box>
          <Grid container spacing={4}>
            {testimonials.map((testimonial, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card className="testimonial-card" elevation={3}>
                  <CardContent>
                    <Box className="testimonial-stars" mb={2}>
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="star-icon" />
                      ))}
                    </Box>
                    <Typography variant="body1" className="testimonial-text" paragraph>
                      "{testimonial.text}"
                    </Typography>
                    <Box className="testimonial-author">
                      <Avatar 
                        src={testimonial.avatar} 
                        alt={testimonial.author}
                        className="author-avatar"
                      />
                      <Box>
                        <Typography variant="subtitle1" className="author-name">
                          {testimonial.author}
                        </Typography>
                        <Typography variant="body2" className="author-role">
                          {testimonial.role}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Social Media Links Section */}
      <Box className="social-links-section">
        <Container maxWidth="lg">
          <Box textAlign="center" mb={4}>
            <Typography variant="h3" className="section-title">
              {t('homepage.socialMediaLinks')}
            </Typography>
            <Typography variant="h6" className="section-subtitle">
              {t('homepage.socialMediaLinksDesc')}
            </Typography>
          </Box>
          <Grid container spacing={4}>
            <Grid item xs={12} sm={6} md={3}>
              <Card className="social-link-card facebook-card">
                <CardContent>
                  <Facebook className="social-icon" />
                  <Typography variant="h6" gutterBottom>
                    {t('homepage.facebookCommunity')}
                  </Typography>
                  <Typography variant="body2">
                    {t('homepage.facebookDesc')}
                  </Typography>
                  <Button 
                    href="https://www.facebook.com/share/1FVLaECKp2/"
                    target="_blank"
                    className="social-link-button"
                  >
                    {t('common.learnMore')}
                  </Button>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card className="social-link-card linkedin-card">
                <CardContent>
                  <LinkedIn className="social-icon" />
                  <Typography variant="h6" gutterBottom>
                    {t('homepage.linkedinNetwork')}
                  </Typography>
                  <Typography variant="body2">
                    {t('homepage.linkedinDesc')}
                  </Typography>
                  <Button 
                    href="https://www.linkedin.com/company/zr3icom/"
                    target="_blank"
                    className="social-link-button"
                  >
                    {t('common.learnMore')}
                  </Button>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card className="social-link-card twitter-card">
                <CardContent>
                  <Twitter className="social-icon" />
                  <Typography variant="h6" gutterBottom>
                    {t('homepage.twitterUpdates')}
                  </Typography>
                  <Typography variant="body2">
                    {t('homepage.twitterDesc')}
                  </Typography>
                  <Button className="social-link-button">
                    {t('common.learnMore')}
                  </Button>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card className="social-link-card youtube-card">
                <CardContent>
                  <YouTube className="social-icon" />
                  <Typography variant="h6" gutterBottom>
                    {t('homepage.youtubeChannel')}
                  </Typography>
                  <Typography variant="body2">
                    {t('homepage.youtubeDesc')}
                  </Typography>
                  <Button className="social-link-button">
                    {t('common.learnMore')}
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box className="cta-section">
        <Container maxWidth="md">
          <Box textAlign="center">
            <Typography variant="h3" className="cta-title" gutterBottom>
              {t('homepage.ctaTitle')}
            </Typography>
            <Typography variant="h6" className="cta-subtitle" paragraph>
              {t('homepage.ctaSubtitle')}
            </Typography>
            <Typography variant="body1" className="cta-description" paragraph>
              {t('homepage.ctaDescription')}
            </Typography>
            <Box className="cta-actions">
              <Button
                component={Link}
                to="/register"
                variant="contained"
                size="large"
                className="cta-button primary"
                endIcon={<ArrowForward />}
              >
                {t('homepage.startFreeTrial')}
              </Button>
              <Button
                variant="outlined"
                size="large"
                className="cta-button secondary"
              >
                {t('homepage.scheduleDemo')}
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Footer */}
      <Box className="homepage-footer">
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" className="footer-title" gutterBottom>
                {t('homepage.footerAbout')}
              </Typography>
              <Typography variant="body2" className="footer-description" paragraph>
                {t('homepage.footerAboutDesc')}
              </Typography>
              <Box className="footer-social">
                <IconButton href="https://www.facebook.com/share/1FVLaECKp2/" target="_blank">
                  <Facebook />
                </IconButton>
                <IconButton href="https://www.linkedin.com/company/zr3icom/" target="_blank">
                  <LinkedIn />
                </IconButton>
                <IconButton>
                  <Twitter />
                </IconButton>
                <IconButton>
                  <YouTube />
                </IconButton>
              </Box>
            </Grid>
            <Grid item xs={12} md={2}>
              <Typography variant="h6" className="footer-title" gutterBottom>
                {t('homepage.footerQuickLinks')}
              </Typography>
              <Box className="footer-links">
                <Link to="/features">{t('common.features')}</Link>
                <Link to="/pricing">{t('common.pricing')}</Link>
                <Link to="/about">{t('common.about')}</Link>
                <Link to="/login">{t('auth.login')}</Link>
              </Box>
            </Grid>
            <Grid item xs={12} md={2}>
              <Typography variant="h6" className="footer-title" gutterBottom>
                {t('homepage.footerResources')}
              </Typography>
              <Box className="footer-links">
                <Link to="/documentation">Documentation</Link>
                <Link to="/api">API</Link>
                <Link to="/tutorials">Tutorials</Link>
                <Link to="/blog">Blog</Link>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" className="footer-title" gutterBottom>
                {t('homepage.footerContact')}
              </Typography>
              <Box className="footer-contact">
                <Box className="contact-item">
                  <Email className="contact-icon" />
                  <Typography variant="body2">{t('homepage.footerEmail')}</Typography>
                </Box>
                <Box className="contact-item">
                  <Phone className="contact-icon" />
                  <Typography variant="body2">{t('homepage.footerPhone')}</Typography>
                </Box>
                <Box className="contact-item">
                  <LocationOn className="contact-icon" />
                  <Typography variant="body2">{t('homepage.footerAddress')}</Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
          <Divider className="footer-divider" />
          <Box className="footer-bottom">
            <Typography variant="body2" textAlign="center">
              © 2024 {i18n.language === 'ar' ? 'زرعي' : 'Zr3i'}. All rights reserved.
            </Typography>
          </Box>
        </Container>
      </Box>
    </div>
  );
};

export default HomePage;

