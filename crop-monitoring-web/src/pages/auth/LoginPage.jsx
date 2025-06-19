import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../hooks/useAuth';
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
  Accordion, 
  AccordionSummary, 
  AccordionDetails, 
  Card, 
  CardContent,
  Alert
} from '@mui/material';
import { LockOutlined, EmailOutlined, ExpandMore, AccountCircle, Language } from '@mui/icons-material';

const LoginPage = ({ toggleLanguage, language }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login, getDemoCredentials } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

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
    
    // Clear login error when user starts typing
    if (loginError) {
      setLoginError('');
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Email validation
    if (!formData.email) {
      newErrors.email = language === 'ar' ? 'البريد الإلكتروني مطلوب' : 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = language === 'ar' ? 'البريد الإلكتروني غير صحيح' : 'Email is invalid';
    }
    
    // Password validation
    if (!formData.password) {
      newErrors.password = language === 'ar' ? 'كلمة المرور مطلوبة' : 'Password is required';
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
    setLoginError('');
    
    try {
      const result = await login(formData.email, formData.password);
      
      if (result.success) {
        if (formData.rememberMe) {
          localStorage.setItem('rememberedEmail', formData.email);
        } else {
          localStorage.removeItem('rememberedEmail');
        }
        
        toast.success(`${language === 'ar' ? 'أهلاً وسهلاً' : 'Welcome'}, ${result.user.name}!`);
        navigate('/');
      } else {
        setLoginError(language === 'ar' ? 'البريد الإلكتروني أو كلمة المرور غير صحيحة' : 'Invalid email or password');
      }
    } catch (error) {
      console.error('Login error:', error);
      setLoginError(language === 'ar' ? 'حدث خطأ أثناء تسجيل الدخول' : 'An error occurred during login');
    } finally {
      setIsSubmitting(false);
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async (demoEmail, demoPassword) => {
    setIsLoading(true);
    setLoginError('');
    
    try {
      const result = await login(demoEmail, demoPassword);
      
      if (result.success) {
        toast.success(`${language === 'ar' ? 'أهلاً وسهلاً' : 'Welcome'}, ${result.user.name}!`);
        navigate('/');
      } else {
        setLoginError(language === 'ar' ? 'فشل في تسجيل الدخول بالحساب التجريبي' : 'Failed to login with demo account');
      }
    } catch (error) {
      setLoginError(language === 'ar' ? 'حدث خطأ أثناء تسجيل الدخول' : 'An error occurred during login');
    } finally {
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

  const demoCredentials = getDemoCredentials();

  return (
    <Grid container className="auth-container" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <Grid item xs={12} sm={8} md={6} lg={4} component={Paper} elevation={6} square className="auth-paper">
        <Box className="auth-form-container">
          <Box className="auth-header">
            <img src="/logo.png" alt={language === 'ar' ? 'زرعي Logo' : 'Zr3i Logo'} className="auth-logo" />
            <Typography component="h1" variant="h4" className="auth-title">
              {language === 'ar' ? 'أهلاً بك في زرعي' : 'Welcome to Zr3i'}
            </Typography>
            <Typography variant="subtitle1" className="auth-subtitle">
              {language === 'ar' ? 'منصة الزراعة الذكية' : 'Smart Agriculture Platform'}
            </Typography>
          </Box>
          
          {loginError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {loginError}
            </Alert>
          )}
          
          <Box component="form" onSubmit={handleSubmit} className="auth-form">
            <Box className="form-field">
              <EmailOutlined className="field-icon" />
              <TextField
                fullWidth
                id="email"
                name="email"
                label={language === 'ar' ? 'البريد الإلكتروني' : 'Email'}
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
                label={language === 'ar' ? 'كلمة المرور' : 'Password'}
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
              label={language === 'ar' ? 'تذكرني' : 'Remember me'}
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
              {isLoading ? <CircularProgress size={24} color="inherit" /> : (language === 'ar' ? 'تسجيل الدخول' : 'Sign In')}
            </Button>
          </Box>

          {/* Demo Accounts Section */}
          <Box className="demo-section" sx={{ mt: 3 }}>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMore />}
                aria-controls="demo-content"
                id="demo-header"
              >
                <Typography variant="h6" color="primary">
                  {language === 'ar' ? 'جرب زرعي بحسابات تجريبية' : 'Try Zr3i with Demo Accounts'}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  {language === 'ar' ? 
                    'اختبر منصتنا بحسابات تجريبية مُعدة مسبقاً تحتوي على حقول وبيانات نموذجية:' :
                    'Experience our platform with pre-configured demo accounts featuring sample fields and data:'
                  }
                </Typography>
                
                <Grid container spacing={2}>
                  {demoCredentials.map((demo, index) => (
                    <Grid item xs={12} key={index}>
                      <Card variant="outlined" className="demo-account-card">
                        <CardContent>
                          <Box display="flex" alignItems="center" justifyContent="space-between">
                            <Box display="flex" alignItems="center" gap={1}>
                              <AccountCircle color="primary" />
                              <Box>
                                <Typography variant="subtitle2" fontWeight="bold">
                                  {demo.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  {demo.role} • {demo.subscription} {language === 'ar' ? 'خطة' : 'Plan'}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {demo.email}
                                </Typography>
                              </Box>
                            </Box>
                            <Button
                              variant="outlined"
                              size="small"
                              onClick={() => handleDemoLogin(demo.email, demo.password)}
                              disabled={isLoading}
                            >
                              {language === 'ar' ? `دخول كـ ${demo.role}` : `Login as ${demo.role}`}
                            </Button>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
                
                <Box sx={{ mt: 2, p: 2, bgcolor: 'info.light', borderRadius: 1 }}>
                  <Typography variant="body2" color="info.contrastText">
                    <strong>{language === 'ar' ? 'ملاحظة:' : 'Note:'}</strong> {language === 'ar' ? 
                      'الحسابات التجريبية تشمل حقولاً مُعدة مسبقاً وبيانات أقمار صناعية ورؤى مراقبة لعرض جميع إمكانيات زرعي.' :
                      "Demo accounts include pre-configured fields, satellite data, and monitoring insights to showcase Zr3i's full capabilities."
                    }
                  </Typography>
                </Box>
              </AccordionDetails>
            </Accordion>
          </Box>
          
          <Grid container className="auth-links" sx={{ mt: 2 }}>
            <Grid item xs>
              <Link to="/forgot-password" className="auth-link">
                {language === 'ar' ? 'نسيت كلمة المرور؟' : 'Forgot Password?'}
              </Link>
            </Grid>
            <Grid item>
              <Link to="/register" className="auth-link">
                {language === 'ar' ? 'إنشاء حساب جديد' : 'Create Account'}
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

export default LoginPage;

