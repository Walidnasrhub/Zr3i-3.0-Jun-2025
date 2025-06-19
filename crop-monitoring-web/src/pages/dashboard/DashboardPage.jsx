import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Avatar,
  Chip,
  LinearProgress,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Agriculture,
  TrendingUp,
  Warning,
  CheckCircle,
  Satellite,
  WbSunny,
  Water,
  Nature,
  Assessment,
  Notifications
} from '@mui/icons-material';

const DashboardPage = () => {
  const { user } = useAuth();
  const { t, i18n } = useTranslation();
  const [weatherData, setWeatherData] = useState(null);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    // Simulate loading weather data
    setWeatherData({
      temperature: 28,
      humidity: 65,
      windSpeed: 12,
      condition: 'Partly Cloudy',
      forecast: [
        { day: 'Today', temp: 28, condition: 'Sunny' },
        { day: 'Tomorrow', temp: 30, condition: 'Cloudy' },
        { day: 'Day 3', temp: 26, condition: 'Rain' }
      ]
    });

    // Simulate alerts
    setAlerts([
      {
        id: 1,
        type: 'warning',
        title: i18n.language === 'ar' ? 'تحذير من الجفاف' : 'Drought Warning',
        message: i18n.language === 'ar' ? 'الحقل الشمالي يحتاج للري' : 'North Field needs irrigation',
        time: '2 hours ago'
      },
      {
        id: 2,
        type: 'success',
        title: i18n.language === 'ar' ? 'نمو ممتاز' : 'Excellent Growth',
        message: i18n.language === 'ar' ? 'الحقل الجنوبي يظهر نمواً ممتازاً' : 'South Field showing excellent growth',
        time: '1 day ago'
      }
    ]);
  }, [i18n.language]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (i18n.language === 'ar') {
      if (hour < 12) return 'صباح الخير';
      if (hour < 18) return 'مساء الخير';
      return 'مساء الخير';
    } else {
      if (hour < 12) return 'Good Morning';
      if (hour < 18) return 'Good Afternoon';
      return 'Good Evening';
    }
  };

  const fieldStats = user?.fields || [];
  const healthyFields = fieldStats.filter(field => field.status === 'Healthy' || field.status === 'Excellent').length;
  const totalFields = fieldStats.length;
  const healthPercentage = totalFields > 0 ? (healthyFields / totalFields) * 100 : 0;

  return (
    <Box sx={{ p: 3 }}>
      {/* Welcome Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          {getGreeting()}, {user?.name}!
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          {i18n.language === 'ar' ? 
            'إليك نظرة عامة على مزرعتك اليوم' : 
            'Here\'s an overview of your farm today'
          }
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Agriculture color="primary" sx={{ mr: 2 }} />
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    {i18n.language === 'ar' ? 'إجمالي الحقول' : 'Total Fields'}
                  </Typography>
                  <Typography variant="h4">
                    {totalFields}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Nature color="success" sx={{ mr: 2 }} />
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    {i18n.language === 'ar' ? 'الحقول الصحية' : 'Healthy Fields'}
                  </Typography>
                  <Typography variant="h4">
                    {healthyFields}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <TrendingUp color="info" sx={{ mr: 2 }} />
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    {i18n.language === 'ar' ? 'معدل الصحة' : 'Health Rate'}
                  </Typography>
                  <Typography variant="h4">
                    {healthPercentage.toFixed(0)}%
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Satellite color="secondary" sx={{ mr: 2 }} />
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    {i18n.language === 'ar' ? 'آخر تحديث' : 'Last Update'}
                  </Typography>
                  <Typography variant="h6">
                    {i18n.language === 'ar' ? 'اليوم' : 'Today'}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Weather Widget */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {i18n.language === 'ar' ? 'الطقس الحالي' : 'Current Weather'}
              </Typography>
              {weatherData && (
                <Box>
                  <Box display="flex" alignItems="center" sx={{ mb: 2 }}>
                    <WbSunny color="warning" sx={{ mr: 1 }} />
                    <Typography variant="h4">
                      {weatherData.temperature}°C
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {weatherData.condition}
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2">
                      {i18n.language === 'ar' ? 'الرطوبة' : 'Humidity'}: {weatherData.humidity}%
                    </Typography>
                    <Typography variant="body2">
                      {i18n.language === 'ar' ? 'سرعة الرياح' : 'Wind Speed'}: {weatherData.windSpeed} km/h
                    </Typography>
                  </Box>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Field Health Overview */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {i18n.language === 'ar' ? 'صحة الحقول' : 'Field Health'}
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  {i18n.language === 'ar' ? 'الصحة العامة' : 'Overall Health'}
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={healthPercentage} 
                  sx={{ mt: 1, height: 8, borderRadius: 4 }}
                />
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {healthPercentage.toFixed(0)}% {i18n.language === 'ar' ? 'صحي' : 'Healthy'}
                </Typography>
              </Box>
              <List dense>
                {fieldStats.slice(0, 3).map((field) => (
                  <ListItem key={field.id} sx={{ px: 0 }}>
                    <ListItemIcon>
                      {field.status === 'Healthy' || field.status === 'Excellent' ? 
                        <CheckCircle color="success" /> : 
                        <Warning color="warning" />
                      }
                    </ListItemIcon>
                    <ListItemText 
                      primary={field.name}
                      secondary={`${field.crop} - ${field.area}`}
                    />
                    <Chip 
                      label={field.status} 
                      size="small"
                      color={field.status === 'Healthy' || field.status === 'Excellent' ? 'success' : 'warning'}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Alerts */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {i18n.language === 'ar' ? 'التنبيهات الحديثة' : 'Recent Alerts'}
              </Typography>
              <List>
                {alerts.map((alert, index) => (
                  <React.Fragment key={alert.id}>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon>
                        {alert.type === 'warning' ? 
                          <Warning color="warning" /> : 
                          <CheckCircle color="success" />
                        }
                      </ListItemIcon>
                      <ListItemText 
                        primary={alert.title}
                        secondary={
                          <Box>
                            <Typography variant="body2">
                              {alert.message}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {alert.time}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < alerts.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              {i18n.language === 'ar' ? 'الإجراءات السريعة' : 'Quick Actions'}
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<Satellite />}
                  sx={{ py: 2 }}
                >
                  {i18n.language === 'ar' ? 'صور الأقمار الصناعية' : 'Satellite Images'}
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<Assessment />}
                  sx={{ py: 2 }}
                >
                  {i18n.language === 'ar' ? 'تقارير المراقبة' : 'Monitoring Reports'}
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<Water />}
                  sx={{ py: 2 }}
                >
                  {i18n.language === 'ar' ? 'إدارة الري' : 'Irrigation Management'}
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<Agriculture />}
                  sx={{ py: 2 }}
                >
                  {i18n.language === 'ar' ? 'إضافة حقل جديد' : 'Add New Field'}
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardPage;

