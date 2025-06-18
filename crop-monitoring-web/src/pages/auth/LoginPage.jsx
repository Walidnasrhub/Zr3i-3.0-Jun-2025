import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import './AuthPages.css';

// Components
import { TextField, Button, Checkbox, FormControlLabel, Paper, Typography, Box, Grid, CircularProgress } from '@mui/material';
import { LockOutlined, EmailOutlined } from '@mui/icons-material';

const LoginPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'rememberMe' ? checked : value
    });
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Email validation
    if (!formData.email) {
      newErrors.email = t('auth.errors.emailRequired');
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t('auth.errors.emailInvalid');
    }
    
    // Password validation
    if (!formData.password) {
      newErrors.password = t('auth.errors.passwordRequired');
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful login
      localStorage.setItem('isAuthenticated', 'true');
      if (formData.rememberMe) {
        localStorage.setItem('rememberedEmail', formData.email);
      } else {
        localStorage.removeItem('rememberedEmail');
      }
      
      toast.success(t('auth.loginSuccess'));
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      toast.error(t('auth.loginError'));
    } finally {
      setIsSubmitting(false);
      setIsLoading(false);
    }
  };

  // Load remembered email if exists
  useEffect(() => {
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (rememberedEmail) {
      setFormData(prev => ({
        ...prev,
        email: rememberedEmail,
        rememberMe: true
      }));
    }
  }, []);

  return (
    <Grid container className="auth-container">
      <Grid item xs={12} sm={8} md={6} lg={4} component={Paper} elevation={6} square className="auth-paper">
        <Box className="auth-form-container">
          <Typography component="h1" variant="h5" className="auth-title">
            {t('auth.login')}
          </Typography>
          
          <Box component="form" onSubmit={handleSubmit} className="auth-form">
            <Box className="form-field">
              <EmailOutlined className="field-icon" />
              <TextField
                fullWidth
                id="email"
                name="email"
                label={t('auth.email')}
                value={formData.email}
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email}
                disabled={isSubmitting}
                autoComplete="email"
                autoFocus
              />
            </Box>
            
            <Box className="form-field">
              <LockOutlined className="field-icon" />
              <TextField
                fullWidth
                id="password"
                name="password"
                label={t('auth.password')}
                type="password"
                value={formData.password}
                onChange={handleChange}
                error={!!errors.password}
                helperText={errors.password}
                disabled={isSubmitting}
                autoComplete="current-password"
              />
            </Box>
            
            <FormControlLabel
              control={
                <Checkbox
                  name="rememberMe"
                  color="primary"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
              }
              label={t('auth.rememberMe')}
              className="remember-me"
            />
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              disabled={isSubmitting}
              className="submit-button"
            >
              {isLoading ? <CircularProgress size={24} color="inherit" /> : t('auth.loginButton')}
            </Button>
            
            <Grid container className="auth-links">
              <Grid item xs>
                <Link to="/auth/forgot-password" className="auth-link">
                  {t('auth.forgotPassword')}
                </Link>
              </Grid>
              <Grid item>
                <Link to="/auth/register" className="auth-link">
                  {t('auth.noAccount')}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

export default LoginPage;
