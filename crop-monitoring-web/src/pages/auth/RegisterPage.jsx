import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import './AuthPages.css';

// Components
import { 
  TextField, 
  Button, 
  Checkbox, 
  FormControlLabel, 
  Paper, 
  Typography, 
  Box, 
  Grid, 
  CircularProgress,
  Stepper,
  Step,
  StepLabel
} from '@mui/material';
import { 
  LockOutlined, 
  EmailOutlined, 
  PersonOutline, 
  BusinessOutlined, 
  PhoneOutlined 
} from '@mui/icons-material';

const RegisterPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const [activeStep, setActiveStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    
    // Farm Information
    farmName: '',
    farmSize: '',
    cropTypes: '',
    location: '',
    
    // Account Information
    password: '',
    confirmPassword: '',
    agreeTerms: false
  });
  
  const [errors, setErrors] = useState({});

  const steps = [
    t('auth.register.steps.personal'),
    t('auth.register.steps.farm'),
    t('auth.register.steps.account')
  ];

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'agreeTerms' ? checked : value
    });
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateStep = (step) => {
    const newErrors = {};
    
    if (step === 0) {
      // Validate personal information
      if (!formData.firstName) {
        newErrors.firstName = t('auth.errors.firstNameRequired');
      }
      
      if (!formData.lastName) {
        newErrors.lastName = t('auth.errors.lastNameRequired');
      }
      
      if (!formData.email) {
        newErrors.email = t('auth.errors.emailRequired');
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = t('auth.errors.emailInvalid');
      }
      
      if (!formData.phone) {
        newErrors.phone = t('auth.errors.phoneRequired');
      }
    } else if (step === 1) {
      // Validate farm information
      if (!formData.farmName) {
        newErrors.farmName = t('auth.errors.farmNameRequired');
      }
      
      if (!formData.farmSize) {
        newErrors.farmSize = t('auth.errors.farmSizeRequired');
      }
      
      if (!formData.location) {
        newErrors.location = t('auth.errors.locationRequired');
      }
    } else if (step === 2) {
      // Validate account information
      if (!formData.password) {
        newErrors.password = t('auth.errors.passwordRequired');
      } else if (formData.password.length < 8) {
        newErrors.password = t('auth.errors.passwordLength');
      }
      
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = t('auth.errors.confirmPasswordRequired');
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = t('auth.errors.passwordsNotMatch');
      }
      
      if (!formData.agreeTerms) {
        newErrors.agreeTerms = t('auth.errors.termsRequired');
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep(activeStep)) {
      return;
    }
    
    setIsSubmitting(true);
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock successful registration
      toast.success(t('auth.registerSuccess'));
      navigate('/auth/login');
    } catch (error) {
      console.error('Registration error:', error);
      toast.error(t('auth.registerError'));
    } finally {
      setIsSubmitting(false);
      setIsLoading(false);
    }
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <>
            <Box className="form-field">
              <PersonOutline className="field-icon" />
              <TextField
                fullWidth
                id="firstName"
                name="firstName"
                label={t('auth.firstName')}
                value={formData.firstName}
                onChange={handleChange}
                error={!!errors.firstName}
                helperText={errors.firstName}
                disabled={isSubmitting}
                autoFocus
              />
            </Box>
            
            <Box className="form-field">
              <PersonOutline className="field-icon" />
              <TextField
                fullWidth
                id="lastName"
                name="lastName"
                label={t('auth.lastName')}
                value={formData.lastName}
                onChange={handleChange}
                error={!!errors.lastName}
                helperText={errors.lastName}
                disabled={isSubmitting}
              />
            </Box>
            
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
              />
            </Box>
            
            <Box className="form-field">
              <PhoneOutlined className="field-icon" />
              <TextField
                fullWidth
                id="phone"
                name="phone"
                label={t('auth.phone')}
                value={formData.phone}
                onChange={handleChange}
                error={!!errors.phone}
                helperText={errors.phone}
                disabled={isSubmitting}
              />
            </Box>
          </>
        );
      case 1:
        return (
          <>
            <Box className="form-field">
              <BusinessOutlined className="field-icon" />
              <TextField
                fullWidth
                id="farmName"
                name="farmName"
                label={t('auth.farmName')}
                value={formData.farmName}
                onChange={handleChange}
                error={!!errors.farmName}
                helperText={errors.farmName}
                disabled={isSubmitting}
                autoFocus
              />
            </Box>
            
            <Box className="form-field">
              <TextField
                fullWidth
                id="farmSize"
                name="farmSize"
                label={t('auth.farmSize')}
                value={formData.farmSize}
                onChange={handleChange}
                error={!!errors.farmSize}
                helperText={errors.farmSize}
                disabled={isSubmitting}
              />
            </Box>
            
            <Box className="form-field">
              <TextField
                fullWidth
                id="cropTypes"
                name="cropTypes"
                label={t('auth.cropTypes')}
                value={formData.cropTypes}
                onChange={handleChange}
                error={!!errors.cropTypes}
                helperText={errors.cropTypes}
                disabled={isSubmitting}
              />
            </Box>
            
            <Box className="form-field">
              <TextField
                fullWidth
                id="location"
                name="location"
                label={t('auth.location')}
                value={formData.location}
                onChange={handleChange}
                error={!!errors.location}
                helperText={errors.location}
                disabled={isSubmitting}
              />
            </Box>
          </>
        );
      case 2:
        return (
          <>
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
                autoFocus
              />
            </Box>
            
            <Box className="form-field">
              <LockOutlined className="field-icon" />
              <TextField
                fullWidth
                id="confirmPassword"
                name="confirmPassword"
                label={t('auth.confirmPassword')}
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword}
                disabled={isSubmitting}
              />
            </Box>
            
            <FormControlLabel
              control={
                <Checkbox
                  name="agreeTerms"
                  color="primary"
                  checked={formData.agreeTerms}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
              }
              label={
                <span>
                  {t('auth.agreeTerms')} 
                  <Link to="/terms" className="terms-link">
                    {t('auth.termsLink')}
                  </Link>
                </span>
              }
              className="agree-terms"
              error={!!errors.agreeTerms}
            />
            {errors.agreeTerms && (
              <Typography color="error" variant="caption" className="terms-error">
                {errors.agreeTerms}
              </Typography>
            )}
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Grid container className="auth-container">
      <Grid item xs={12} sm={10} md={8} lg={6} component={Paper} elevation={6} square className="auth-paper register-paper">
        <Box className="auth-form-container">
          <Typography component="h1" variant="h5" className="auth-title">
            {t('auth.register.title')}
          </Typography>
          
          <Stepper activeStep={activeStep} className="register-stepper">
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          
          <Box component="form" onSubmit={handleSubmit} className="auth-form">
            {renderStepContent(activeStep)}
            
            <Box className="stepper-buttons">
              <Button
                disabled={activeStep === 0 || isSubmitting}
                onClick={handleBack}
                className="back-button"
              >
                {t('auth.back')}
              </Button>
              
              {activeStep === steps.length - 1 ? (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="submit-button"
                >
                  {isLoading ? <CircularProgress size={24} color="inherit" /> : t('auth.register.submit')}
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleNext}
                  disabled={isSubmitting}
                  className="next-button"
                >
                  {t('auth.next')}
                </Button>
              )}
            </Box>
            
            <Grid container justifyContent="flex-end" className="auth-links">
              <Grid item>
                <Link to="/auth/login" className="auth-link">
                  {t('auth.haveAccount')}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

export default RegisterPage;
