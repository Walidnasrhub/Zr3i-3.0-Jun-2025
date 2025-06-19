import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
  Alert
} from '@mui/material';
import { EmailOutlined, Language, CheckCircleOutlined } from '@mui/icons-material';

const ForgotPasswordPage = ({ toggleLanguage, language }) => {
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [resetError, setResetError] = useState('');

  const handleChange = (e) => {
    setEmail(e.target.value);
    
    // Clear error when field is edited
    if (errors.email) {
      setErrors({});
    }
    
    // Clear reset error when user starts typing
    if (resetError) {
      setResetError('');
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!email) {
      newErrors.email = language === 'ar' ? 'البريد الإلكتروني مطلوب' : 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = language === 'ar' ? 'البريد الإلكتروني غير صحيح' : 'Email is invalid';
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
    setResetError('');
    
    try {
      // Simulate password reset request
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // For demo purposes, always succeed
      setIsEmailSent(true);
      toast.success(language === 'ar' ? 'تم إرسال رابط إعادة تعيين كلمة المرور' : 'Password reset link sent');
      
    } catch (error) {
      console.error('Password reset error:', error);
      setResetError(language === 'ar' ? 'حدث خطأ أثناء إرسال رابط إعادة التعيين' : 'An error occurred while sending reset link');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isEmailSent) {
    return (
      <Grid container className="auth-container" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        <Grid item xs={12} sm={8} md={6} lg={4} component={Paper} elevation={6} square className="auth-paper">
          <Box className="auth-form-container">
            <Box className="auth-header" sx={{ textAlign: 'center' }}>
              <CheckCircleOutlined sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
              <Typography component="h1" variant="h4" className="auth-title">
                {language === 'ar' ? 'تم الإرسال!' : 'Email Sent!'}
              </Typography>
              <Typography variant="body1" sx={{ mt: 2, mb: 3 }}>
                {language === 'ar' ? 
                  `تم إرسال رابط إعادة تعيين كلمة المرور إلى ${email}. يرجى التحقق من صندوق الوارد الخاص بك.` :
                  `A password reset link has been sent to ${email}. Please check your inbox.`
                }
              </Typography>
              
              <Button
                variant="contained"
                onClick={() => navigate('/login')}
                sx={{ mb: 2 }}
              >
                {language === 'ar' ? 'العودة لتسجيل الدخول' : 'Back to Login'}
              </Button>
              
              <Typography variant="body2" color="text.secondary">
                {language === 'ar' ? 
                  'لم تستلم الرسالة؟' :
                  "Didn't receive the email?"
                }
                <Button 
                  variant="text" 
                  onClick={() => setIsEmailSent(false)}
                  sx={{ ml: 1 }}
                >
                  {language === 'ar' ? 'إعادة الإرسال' : 'Resend'}
                </Button>
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
    );
  }

  return (
    <Grid container className="auth-container" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <Grid item xs={12} sm={8} md={6} lg={4} component={Paper} elevation={6} square className="auth-paper">
        <Box className="auth-form-container">
          <Box className="auth-header">
            <img src="/logo.png" alt={language === 'ar' ? 'زرعي Logo' : 'Zr3i Logo'} className="auth-logo" />
            <Typography component="h1" variant="h4" className="auth-title">
              {language === 'ar' ? 'نسيت كلمة المرور؟' : 'Forgot Password?'}
            </Typography>
            <Typography variant="subtitle1" className="auth-subtitle">
              {language === 'ar' ? 
                'أدخل بريدك الإلكتروني وسنرسل لك رابط إعادة تعيين كلمة المرور' :
                'Enter your email and we\'ll send you a password reset link'
              }
            </Typography>
          </Box>
          
          {resetError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {resetError}
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
                type="email"
                value={email}
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email}
                disabled={isSubmitting}
                autoComplete="email"
                autoFocus
              />
            </Box>
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              disabled={isSubmitting}
              className="submit-button"
            >
              {isSubmitting ? <CircularProgress size={24} color="inherit" /> : (language === 'ar' ? 'إرسال رابط إعادة التعيين' : 'Send Reset Link')}
            </Button>
          </Box>
          
          <Grid container className="auth-links" sx={{ mt: 2 }}>
            <Grid item xs>
              <Link to="/login" className="auth-link">
                {language === 'ar' ? 'تذكرت كلمة المرور؟ تسجيل الدخول' : 'Remember your password? Sign In'}
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

export default ForgotPasswordPage;

