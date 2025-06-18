import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import './AuthPages.css';

// Components
import { 
  TextField, 
  Button, 
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
  EmailOutlined,
  LockOutlined
} from '@mui/icons-material';

const ForgotPasswordPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const [activeStep, setActiveStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    email: '',
    verificationCode: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [errors, setErrors] = useState({});

  const steps = [
    t('auth.forgotPassword.steps.requestReset'),
    t('auth.forgotPassword.steps.verifyCode'),
    t('auth.forgotPassword.steps.resetPassword')
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
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
      // Validate email
      if (!formData.email) {
        newErrors.email = t('auth.errors.emailRequired');
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = t('auth.errors.emailInvalid');
      }
    } else if (step === 1) {
      // Validate verification code
      if (!formData.verificationCode) {
        newErrors.verificationCode = t('auth.errors.verificationCodeRequired');
      } else if (formData.verificationCode.length !== 6) {
        newErrors.verificationCode = t('auth.errors.verificationCodeInvalid');
      }
    } else if (step === 2) {
      // Validate new password
      if (!formData.newPassword) {
        newErrors.newPassword = t('auth.errors.passwordRequired');
      } else if (formData.newPassword.length < 8) {
        newErrors.newPassword = t('auth.errors.passwordLength');
      }
      
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = t('auth.errors.confirmPasswordRequired');
      } else if (formData.newPassword !== formData.confirmPassword) {
        newErrors.confirmPassword = t('auth.errors.passwordsNotMatch');
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = async () => {
    if (!validateStep(activeStep)) {
      return;
    }
    
    if (activeStep === 0) {
      // Request password reset
      setIsSubmitting(true);
      setIsLoading(true);
      
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        toast.success(t('auth.forgotPassword.emailSent'));
        setActiveStep(1);
      } catch (error) {
        console.error('Password reset request error:', error);
        toast.error(t('auth.forgotPassword.emailError'));
      } finally {
        setIsSubmitting(false);
        setIsLoading(false);
      }
    } else if (activeStep === 1) {
      // Verify code
      setIsSubmitting(true);
      setIsLoading(true);
      
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        toast.success(t('auth.forgotPassword.codeVerified'));
        setActiveStep(2);
      } catch (error) {
        console.error('Verification code error:', error);
        toast.error(t('auth.forgotPassword.codeError'));
      } finally {
        setIsSubmitting(false);
        setIsLoading(false);
      }
    }
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
      
      // Mock successful password reset
      toast.success(t('auth.forgotPassword.resetSuccess'));
      navigate('/auth/login');
    } catch (error) {
      console.error('Password reset error:', error);
      toast.error(t('auth.forgotPassword.resetError'));
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
            <Typography variant="body2" className="step-description">
              {t('auth.forgotPassword.emailInstructions')}
            </Typography>
            
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
            
            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={handleNext}
              disabled={isSubmitting}
              className="submit-button"
            >
              {isLoading ? <CircularProgress size={24} color="inherit" /> : t('auth.forgotPassword.sendCode')}
            </Button>
          </>
        );
      case 1:
        return (
          <>
            <Typography variant="body2" className="step-description">
              {t('auth.forgotPassword.codeInstructions')}
            </Typography>
            
            <Box className="form-field">
              <TextField
                fullWidth
                id="verificationCode"
                name="verificationCode"
                label={t('auth.verificationCode')}
                value={formData.verificationCode}
                onChange={handleChange}
                error={!!errors.verificationCode}
                helperText={errors.verificationCode}
                disabled={isSubmitting}
                autoFocus
              />
            </Box>
            
            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={handleNext}
              disabled={isSubmitting}
              className="submit-button"
            >
              {isLoading ? <CircularProgress size={24} color="inherit" /> : t('auth.forgotPassword.verifyCode')}
            </Button>
          </>
        );
      case 2:
        return (
          <>
            <Typography variant="body2" className="step-description">
              {t('auth.forgotPassword.newPasswordInstructions')}
            </Typography>
            
            <Box className="form-field">
              <LockOutlined className="field-icon" />
              <TextField
                fullWidth
                id="newPassword"
                name="newPassword"
                label={t('auth.newPassword')}
                type="password"
                value={formData.newPassword}
                onChange={handleChange}
                error={!!errors.newPassword}
                helperText={errors.newPassword}
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
            
            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="submit-button"
            >
              {isLoading ? <CircularProgress size={24} color="inherit" /> : t('auth.forgotPassword.resetPassword')}
            </Button>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Grid container className="auth-container">
      <Grid item xs={12} sm={8} md={6} lg={4} component={Paper} elevation={6} square className="auth-paper">
        <Box className="auth-form-container">
          <Typography component="h1" variant="h5" className="auth-title">
            {t('auth.forgotPassword.title')}
          </Typography>
          
          <Stepper activeStep={activeStep} className="reset-stepper">
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          
          <Box component="form" onSubmit={handleSubmit} className="auth-form">
            {renderStepContent(activeStep)}
            
            <Grid container className="auth-links">
              <Grid item>
                <Link to="/auth/login" className="auth-link">
                  {t('auth.backToLogin')}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

export default ForgotPasswordPage;
