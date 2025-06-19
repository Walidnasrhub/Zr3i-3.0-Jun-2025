import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
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
  Alert,
  Stepper,
  Step,
  StepLabel
} from '@mui/material';
import { 
  PersonOutlined, 
  EmailOutlined, 
  LockOutlined, 
  PhoneOutlined,
  BusinessOutlined,
  Language 
} from '@mui/icons-material';

const RegisterPage = ({ toggleLanguage, language }) => {
  const navigate = useNavigate();
  const { register } = useAuth();
  
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    // Personal Info
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    
    // Account Info
    password: '',
    confirmPassword: '',
    
    // Professional Info
    organization: '',
    role: '',
    farmSize: '',
    cropTypes: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registerError, setRegisterError] = useState('');

  const steps = language === 'ar' ? 
    ['المعلومات الشخصية', 'معلومات الحساب', 'المعلومات المهنية'] :
    ['Personal Info', 'Account Info', 'Professional Info'];

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
    
    // Clear register error when user starts typing
    if (registerError) {
      setRegisterError('');
    }
  };

  const validateStep = (step) => {
    const newErrors = {};
    
    if (step === 0) {
      // Personal Info validation
      if (!formData.firstName) {
        newErrors.firstName = language === 'ar' ? 'الاسم الأول مطلوب' : 'First name is required';
      }
      if (!formData.lastName) {
        newErrors.lastName = language === 'ar' ? 'اسم العائلة مطلوب' : 'Last name is required';
      }
      if (!formData.email) {
        newErrors.email = language === 'ar' ? 'البريد الإلكتروني مطلوب' : 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = language === 'ar' ? 'البريد الإلكتروني غير صحيح' : 'Email is invalid';
      }
      if (!formData.phone) {
        newErrors.phone = language === 'ar' ? 'رقم الهاتف مطلوب' : 'Phone number is required';
      }
    } else if (step === 1) {
      // Account Info validation
      if (!formData.password) {
        newErrors.password = language === 'ar' ? 'كلمة المرور مطلوبة' : 'Password is required';
      } else if (formData.password.length < 6) {
        newErrors.password = language === 'ar' ? 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' : 'Password must be at least 6 characters';
      }
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = language === 'ar' ? 'تأكيد كلمة المرور مطلوب' : 'Confirm password is required';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = language === 'ar' ? 'كلمات المرور غير متطابقة' : 'Passwords do not match';
      }
    } else if (step === 2) {
      // Professional Info validation
      if (!formData.organization) {
        newErrors.organization = language === 'ar' ? 'اسم المؤسسة مطلوب' : 'Organization is required';
      }
      if (!formData.role) {
        newErrors.role = language === 'ar' ? 'المسمى الوظيفي مطلوب' : 'Role is required';
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
    
    if (!validateStep(2)) {
      return;
    }
    
    setIsSubmitting(true);
    setRegisterError('');
    
    try {
      const result = await register({
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        organization: formData.organization,
        role: formData.role,
        farmSize: formData.farmSize,
        cropTypes: formData.cropTypes
      });
      
      if (result.success) {
        toast.success(language === 'ar' ? 'تم إنشاء الحساب بنجاح!' : 'Account created successfully!');
        navigate('/login');
      } else {
        setRegisterError(result.error || (language === 'ar' ? 'فشل في إنشاء الحساب' : 'Failed to create account'));
      }
    } catch (error) {
      console.error('Registration error:', error);
      setRegisterError(language === 'ar' ? 'حدث خطأ أثناء إنشاء الحساب' : 'An error occurred during registration');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Box className="form-field">
                  <PersonOutlined className="field-icon" />
                  <TextField
                    fullWidth
                    name="firstName"
                    label={language === 'ar' ? 'الاسم الأول' : 'First Name'}
                    value={formData.firstName}
                    onChange={handleChange}
                    error={!!errors.firstName}
                    helperText={errors.firstName}
                    disabled={isSubmitting}
                  />
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box className="form-field">
                  <PersonOutlined className="field-icon" />
                  <TextField
                    fullWidth
                    name="lastName"
                    label={language === 'ar' ? 'اسم العائلة' : 'Last Name'}
                    value={formData.lastName}
                    onChange={handleChange}
                    error={!!errors.lastName}
                    helperText={errors.lastName}
                    disabled={isSubmitting}
                  />
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Box className="form-field">
                  <EmailOutlined className="field-icon" />
                  <TextField
                    fullWidth
                    name="email"
                    label={language === 'ar' ? 'البريد الإلكتروني' : 'Email'}
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    error={!!errors.email}
                    helperText={errors.email}
                    disabled={isSubmitting}
                  />
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Box className="form-field">
                  <PhoneOutlined className="field-icon" />
                  <TextField
                    fullWidth
                    name="phone"
                    label={language === 'ar' ? 'رقم الهاتف' : 'Phone Number'}
                    value={formData.phone}
                    onChange={handleChange}
                    error={!!errors.phone}
                    helperText={errors.phone}
                    disabled={isSubmitting}
                  />
                </Box>
              </Grid>
            </Grid>
          </Box>
        );
      case 1:
        return (
          <Box>
            <Box className="form-field">
              <LockOutlined className="field-icon" />
              <TextField
                fullWidth
                name="password"
                label={language === 'ar' ? 'كلمة المرور' : 'Password'}
                type="password"
                value={formData.password}
                onChange={handleChange}
                error={!!errors.password}
                helperText={errors.password}
                disabled={isSubmitting}
              />
            </Box>
            <Box className="form-field">
              <LockOutlined className="field-icon" />
              <TextField
                fullWidth
                name="confirmPassword"
                label={language === 'ar' ? 'تأكيد كلمة المرور' : 'Confirm Password'}
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword}
                disabled={isSubmitting}
              />
            </Box>
          </Box>
        );
      case 2:
        return (
          <Box>
            <Box className="form-field">
              <BusinessOutlined className="field-icon" />
              <TextField
                fullWidth
                name="organization"
                label={language === 'ar' ? 'اسم المؤسسة/المزرعة' : 'Organization/Farm Name'}
                value={formData.organization}
                onChange={handleChange}
                error={!!errors.organization}
                helperText={errors.organization}
                disabled={isSubmitting}
              />
            </Box>
            <Box className="form-field">
              <TextField
                fullWidth
                name="role"
                label={language === 'ar' ? 'المسمى الوظيفي' : 'Role/Position'}
                value={formData.role}
                onChange={handleChange}
                error={!!errors.role}
                helperText={errors.role}
                disabled={isSubmitting}
              />
            </Box>
            <Box className="form-field">
              <TextField
                fullWidth
                name="farmSize"
                label={language === 'ar' ? 'مساحة المزرعة (هكتار)' : 'Farm Size (hectares)'}
                value={formData.farmSize}
                onChange={handleChange}
                disabled={isSubmitting}
              />
            </Box>
            <Box className="form-field">
              <TextField
                fullWidth
                name="cropTypes"
                label={language === 'ar' ? 'أنواع المحاصيل' : 'Crop Types'}
                multiline
                rows={3}
                value={formData.cropTypes}
                onChange={handleChange}
                disabled={isSubmitting}
                placeholder={language === 'ar' ? 'مثال: قمح، ذرة، طماطم' : 'e.g., Wheat, Corn, Tomatoes'}
              />
            </Box>
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Grid container className="auth-container" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <Grid item xs={12} sm={10} md={8} lg={6} component={Paper} elevation={6} square className="auth-paper">
        <Box className="auth-form-container">
          <Box className="auth-header">
            <img src="/logo.png" alt={language === 'ar' ? 'زرعي Logo' : 'Zr3i Logo'} className="auth-logo" />
            <Typography component="h1" variant="h4" className="auth-title">
              {language === 'ar' ? 'إنشاء حساب جديد' : 'Create Account'}
            </Typography>
            <Typography variant="subtitle1" className="auth-subtitle">
              {language === 'ar' ? 'انضم إلى منصة الزراعة الذكية' : 'Join the Smart Agriculture Platform'}
            </Typography>
          </Box>
          
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          
          {registerError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {registerError}
            </Alert>
          )}
          
          <Box component="form" onSubmit={handleSubmit} className="auth-form">
            {renderStepContent(activeStep)}
            
            <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
              <Button
                color="inherit"
                disabled={activeStep === 0}
                onClick={handleBack}
                sx={{ mr: 1 }}
              >
                {language === 'ar' ? 'السابق' : 'Back'}
              </Button>
              <Box sx={{ flex: '1 1 auto' }} />
              {activeStep === steps.length - 1 ? (
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? <CircularProgress size={24} color="inherit" /> : (language === 'ar' ? 'إنشاء الحساب' : 'Create Account')}
                </Button>
              ) : (
                <Button onClick={handleNext} variant="contained">
                  {language === 'ar' ? 'التالي' : 'Next'}
                </Button>
              )}
            </Box>
          </Box>
          
          <Grid container className="auth-links" sx={{ mt: 2 }}>
            <Grid item xs>
              <Link to="/login" className="auth-link">
                {language === 'ar' ? 'لديك حساب بالفعل؟ تسجيل الدخول' : 'Already have an account? Sign In'}
              </Link>
            </Grid>
          </Grid>

          <Box className="auth-footer" sx={{ mt: 3, textAlign: 'center' }}>
            <Link to="/home" className="home-link">
              {language === 'ar' ? 'العودة للصفحة الرئيسية' : 'Back to Home'}
            </Link>
            <Button
              onClick={toggleLanguage}
              startIcon={<Language />}
              className="language-button"
              sx={{ mt: 2 }}
            >
              {language === 'en' ? 'العربية' : 'English'}
            </Button>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

export default RegisterPage;

