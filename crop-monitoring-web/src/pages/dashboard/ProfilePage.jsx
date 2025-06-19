import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Avatar,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Switch,
  FormControlLabel,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  Person,
  Email,
  Phone,
  Business,
  Edit,
  Security,
  Notifications,
  Language,
  Save,
  PhotoCamera
} from '@mui/icons-material';

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const { i18n } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    organization: user?.organization || '',
    role: user?.role || ''
  });
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    weatherAlerts: true,
    cropAlerts: true,
    language: i18n.language
  });
  const [passwordDialog, setPasswordDialog] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleEditChange = (e) => {
    setEditData({
      ...editData,
      [e.target.name]: e.target.value
    });
  };

  const handleSaveProfile = () => {
    updateUser(editData);
    setIsEditing(false);
    toast.success(i18n.language === 'ar' ? 'تم حفظ الملف الشخصي' : 'Profile saved successfully');
  };

  const handleSettingChange = (setting) => (event) => {
    setSettings({
      ...settings,
      [setting]: event.target.checked
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
  };

  const handlePasswordSubmit = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error(i18n.language === 'ar' ? 'كلمات المرور غير متطابقة' : 'Passwords do not match');
      return;
    }
    
    // Simulate password change
    toast.success(i18n.language === 'ar' ? 'تم تغيير كلمة المرور' : 'Password changed successfully');
    setPasswordDialog(false);
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        {i18n.language === 'ar' ? 'الملف الشخصي' : 'Profile'}
      </Typography>

      <Grid container spacing={3}>
        {/* Profile Information */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="between" alignItems="center" sx={{ mb: 3 }}>
                <Typography variant="h6">
                  {i18n.language === 'ar' ? 'المعلومات الشخصية' : 'Personal Information'}
                </Typography>
                <Button
                  startIcon={isEditing ? <Save /> : <Edit />}
                  onClick={isEditing ? handleSaveProfile : () => setIsEditing(true)}
                  variant={isEditing ? "contained" : "outlined"}
                >
                  {isEditing ? 
                    (i18n.language === 'ar' ? 'حفظ' : 'Save') : 
                    (i18n.language === 'ar' ? 'تعديل' : 'Edit')
                  }
                </Button>
              </Box>

              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label={i18n.language === 'ar' ? 'الاسم' : 'Name'}
                    name="name"
                    value={isEditing ? editData.name : user?.name || ''}
                    onChange={handleEditChange}
                    disabled={!isEditing}
                    InputProps={{
                      startAdornment: <Person sx={{ mr: 1, color: 'text.secondary' }} />
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label={i18n.language === 'ar' ? 'البريد الإلكتروني' : 'Email'}
                    name="email"
                    value={isEditing ? editData.email : user?.email || ''}
                    onChange={handleEditChange}
                    disabled={!isEditing}
                    InputProps={{
                      startAdornment: <Email sx={{ mr: 1, color: 'text.secondary' }} />
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label={i18n.language === 'ar' ? 'رقم الهاتف' : 'Phone'}
                    name="phone"
                    value={isEditing ? editData.phone : user?.phone || ''}
                    onChange={handleEditChange}
                    disabled={!isEditing}
                    InputProps={{
                      startAdornment: <Phone sx={{ mr: 1, color: 'text.secondary' }} />
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label={i18n.language === 'ar' ? 'المسمى الوظيفي' : 'Role'}
                    name="role"
                    value={isEditing ? editData.role : user?.role || ''}
                    onChange={handleEditChange}
                    disabled={!isEditing}
                    InputProps={{
                      startAdornment: <Business sx={{ mr: 1, color: 'text.secondary' }} />
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label={i18n.language === 'ar' ? 'المؤسسة' : 'Organization'}
                    name="organization"
                    value={isEditing ? editData.organization : user?.organization || ''}
                    onChange={handleEditChange}
                    disabled={!isEditing}
                    InputProps={{
                      startAdornment: <Business sx={{ mr: 1, color: 'text.secondary' }} />
                    }}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Account Settings */}
          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {i18n.language === 'ar' ? 'إعدادات الحساب' : 'Account Settings'}
              </Typography>
              
              <List>
                <ListItem>
                  <ListItemText 
                    primary={i18n.language === 'ar' ? 'تنبيهات البريد الإلكتروني' : 'Email Notifications'}
                    secondary={i18n.language === 'ar' ? 'استقبال التنبيهات عبر البريد الإلكتروني' : 'Receive notifications via email'}
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={settings.emailNotifications}
                      onChange={handleSettingChange('emailNotifications')}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                
                <ListItem>
                  <ListItemText 
                    primary={i18n.language === 'ar' ? 'التنبيهات الفورية' : 'Push Notifications'}
                    secondary={i18n.language === 'ar' ? 'استقبال التنبيهات الفورية' : 'Receive push notifications'}
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={settings.pushNotifications}
                      onChange={handleSettingChange('pushNotifications')}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                
                <ListItem>
                  <ListItemText 
                    primary={i18n.language === 'ar' ? 'تنبيهات الطقس' : 'Weather Alerts'}
                    secondary={i18n.language === 'ar' ? 'تنبيهات حول الأحوال الجوية' : 'Alerts about weather conditions'}
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={settings.weatherAlerts}
                      onChange={handleSettingChange('weatherAlerts')}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                
                <ListItem>
                  <ListItemText 
                    primary={i18n.language === 'ar' ? 'تنبيهات المحاصيل' : 'Crop Alerts'}
                    secondary={i18n.language === 'ar' ? 'تنبيهات حول صحة المحاصيل' : 'Alerts about crop health'}
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={settings.cropAlerts}
                      onChange={handleSettingChange('cropAlerts')}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
              </List>
              
              <Divider sx={{ my: 2 }} />
              
              <Button
                startIcon={<Security />}
                onClick={() => setPasswordDialog(true)}
                variant="outlined"
                fullWidth
              >
                {i18n.language === 'ar' ? 'تغيير كلمة المرور' : 'Change Password'}
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Profile Summary */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Box position="relative" display="inline-block">
                <Avatar
                  sx={{ width: 120, height: 120, mx: 'auto', mb: 2 }}
                  src={user?.profileImage}
                >
                  {user?.name?.charAt(0)}
                </Avatar>
                <IconButton
                  sx={{
                    position: 'absolute',
                    bottom: 16,
                    right: -8,
                    backgroundColor: 'primary.main',
                    color: 'white',
                    '&:hover': { backgroundColor: 'primary.dark' }
                  }}
                  size="small"
                >
                  <PhotoCamera fontSize="small" />
                </IconButton>
              </Box>
              
              <Typography variant="h5" gutterBottom>
                {user?.name}
              </Typography>
              
              <Chip 
                label={user?.role} 
                color="primary" 
                sx={{ mb: 2 }}
              />
              
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {user?.email}
              </Typography>
              
              <Divider sx={{ my: 2 }} />
              
              <Box textAlign="left">
                <Typography variant="subtitle2" gutterBottom>
                  {i18n.language === 'ar' ? 'معلومات الحساب' : 'Account Information'}
                </Typography>
                
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>{i18n.language === 'ar' ? 'نوع الاشتراك:' : 'Subscription:'}</strong> {user?.subscription}
                </Typography>
                
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>{i18n.language === 'ar' ? 'تاريخ الانضمام:' : 'Member Since:'}</strong> {
                    user?.joinDate ? new Date(user.joinDate).toLocaleDateString() : 'N/A'
                  }
                </Typography>
                
                <Typography variant="body2">
                  <strong>{i18n.language === 'ar' ? 'آخر دخول:' : 'Last Login:'}</strong> {
                    user?.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'N/A'
                  }
                </Typography>
              </Box>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {i18n.language === 'ar' ? 'إحصائيات سريعة' : 'Quick Stats'}
              </Typography>
              
              <Box display="flex" justifyContent="space-between" sx={{ mb: 2 }}>
                <Typography variant="body2">
                  {i18n.language === 'ar' ? 'عدد الحقول:' : 'Total Fields:'}
                </Typography>
                <Typography variant="body2" fontWeight="bold">
                  {user?.fields?.length || 0}
                </Typography>
              </Box>
              
              <Box display="flex" justifyContent="space-between" sx={{ mb: 2 }}>
                <Typography variant="body2">
                  {i18n.language === 'ar' ? 'الحقول الصحية:' : 'Healthy Fields:'}
                </Typography>
                <Typography variant="body2" fontWeight="bold" color="success.main">
                  {user?.fields?.filter(f => f.status === 'Healthy' || f.status === 'Excellent').length || 0}
                </Typography>
              </Box>
              
              <Box display="flex" justifyContent="space-between">
                <Typography variant="body2">
                  {i18n.language === 'ar' ? 'تحتاج مراقبة:' : 'Need Monitoring:'}
                </Typography>
                <Typography variant="body2" fontWeight="bold" color="warning.main">
                  {user?.fields?.filter(f => f.status === 'Monitoring Required' || f.status === 'Needs Attention').length || 0}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Password Change Dialog */}
      <Dialog open={passwordDialog} onClose={() => setPasswordDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {i18n.language === 'ar' ? 'تغيير كلمة المرور' : 'Change Password'}
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            margin="normal"
            label={i18n.language === 'ar' ? 'كلمة المرور الحالية' : 'Current Password'}
            name="currentPassword"
            type="password"
            value={passwordData.currentPassword}
            onChange={handlePasswordChange}
          />
          <TextField
            fullWidth
            margin="normal"
            label={i18n.language === 'ar' ? 'كلمة المرور الجديدة' : 'New Password'}
            name="newPassword"
            type="password"
            value={passwordData.newPassword}
            onChange={handlePasswordChange}
          />
          <TextField
            fullWidth
            margin="normal"
            label={i18n.language === 'ar' ? 'تأكيد كلمة المرور الجديدة' : 'Confirm New Password'}
            name="confirmPassword"
            type="password"
            value={passwordData.confirmPassword}
            onChange={handlePasswordChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPasswordDialog(false)}>
            {i18n.language === 'ar' ? 'إلغاء' : 'Cancel'}
          </Button>
          <Button onClick={handlePasswordSubmit} variant="contained">
            {i18n.language === 'ar' ? 'تغيير كلمة المرور' : 'Change Password'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProfilePage;

