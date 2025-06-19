import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tabs,
  Tab
} from '@mui/material';
import {
  Thermostat,
  WaterDrop,
  Air,
  Visibility,
  TrendingUp,
  TrendingDown,
  Warning,
  CheckCircle,
  WbSunny,
  Cloud,
  Grain,
  Speed
} from '@mui/icons-material';

const WeatherEnvironmentPage = () => {
  const { i18n } = useTranslation();
  const [selectedField, setSelectedField] = useState('all');
  const [timeRange, setTimeRange] = useState('7days');
  const [tabValue, setTabValue] = useState(0);

  const fields = [
    { id: 'all', name: i18n.language === 'ar' ? 'جميع الحقول' : 'All Fields' },
    { id: 'field1', name: i18n.language === 'ar' ? 'الحقل الشمالي' : 'North Field' },
    { id: 'field2', name: i18n.language === 'ar' ? 'الحقل الجنوبي' : 'South Field' },
    { id: 'field3', name: i18n.language === 'ar' ? 'الحقل الشرقي' : 'East Field' }
  ];

  const currentWeather = {
    temperature: 28,
    humidity: 65,
    windSpeed: 12,
    pressure: 1013,
    visibility: 10,
    uvIndex: 7,
    dewPoint: 18,
    condition: 'Partly Cloudy',
    precipitation: 0,
    soilTemp: 24
  };

  const forecast = [
    { day: i18n.language === 'ar' ? 'اليوم' : 'Today', temp: 28, humidity: 65, rain: 0, condition: 'sunny' },
    { day: i18n.language === 'ar' ? 'غداً' : 'Tomorrow', temp: 30, humidity: 70, rain: 20, condition: 'cloudy' },
    { day: i18n.language === 'ar' ? 'بعد غد' : 'Day After', temp: 26, humidity: 80, rain: 60, condition: 'rainy' },
    { day: i18n.language === 'ar' ? 'اليوم الرابع' : 'Day 4', temp: 25, humidity: 75, rain: 40, condition: 'cloudy' },
    { day: i18n.language === 'ar' ? 'اليوم الخامس' : 'Day 5', temp: 29, humidity: 60, rain: 10, condition: 'sunny' }
  ];

  const environmentalAlerts = [
    {
      id: 1,
      type: 'warning',
      title: i18n.language === 'ar' ? 'درجة حرارة عالية' : 'High Temperature Alert',
      message: i18n.language === 'ar' ? 'درجة الحرارة المتوقعة غداً 35°م' : 'Expected temperature tomorrow 35°C',
      severity: 'medium',
      field: 'North Field'
    },
    {
      id: 2,
      type: 'info',
      title: i18n.language === 'ar' ? 'أمطار متوقعة' : 'Rain Expected',
      message: i18n.language === 'ar' ? 'أمطار متوسطة متوقعة بعد غد' : 'Moderate rain expected day after tomorrow',
      severity: 'low',
      field: 'All Fields'
    },
    {
      id: 3,
      type: 'success',
      title: i18n.language === 'ar' ? 'ظروف مثالية' : 'Ideal Conditions',
      message: i18n.language === 'ar' ? 'ظروف مثالية للنمو هذا الأسبوع' : 'Ideal growing conditions this week',
      severity: 'low',
      field: 'South Field'
    }
  ];

  const historicalData = [
    { date: '2024-06-19', temp: 28, humidity: 65, rainfall: 0, windSpeed: 12 },
    { date: '2024-06-18', temp: 30, humidity: 70, rainfall: 5, windSpeed: 15 },
    { date: '2024-06-17', temp: 26, humidity: 80, rainfall: 15, windSpeed: 8 },
    { date: '2024-06-16', temp: 25, humidity: 75, rainfall: 20, windSpeed: 10 },
    { date: '2024-06-15', temp: 29, humidity: 60, rainfall: 0, windSpeed: 14 }
  ];

  const getWeatherIcon = (condition) => {
    switch (condition) {
      case 'sunny': return <WbSunny color="warning" />;
      case 'cloudy': return <Cloud color="action" />;
      case 'rainy': return <WaterDrop color="info" />;
      default: return <WbSunny color="warning" />;
    }
  };

  const getAlertColor = (severity) => {
    switch (severity) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'info';
      default: return 'default';
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        {i18n.language === 'ar' ? 'الطقس والبيئة' : 'Weather & Environment'}
      </Typography>

      {/* Filters */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth>
            <InputLabel>{i18n.language === 'ar' ? 'الحقل' : 'Field'}</InputLabel>
            <Select
              value={selectedField}
              onChange={(e) => setSelectedField(e.target.value)}
            >
              {fields.map((field) => (
                <MenuItem key={field.id} value={field.id}>
                  {field.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth>
            <InputLabel>{i18n.language === 'ar' ? 'الفترة الزمنية' : 'Time Range'}</InputLabel>
            <Select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
            >
              <MenuItem value="24hours">{i18n.language === 'ar' ? '24 ساعة' : '24 Hours'}</MenuItem>
              <MenuItem value="7days">{i18n.language === 'ar' ? '7 أيام' : '7 Days'}</MenuItem>
              <MenuItem value="30days">{i18n.language === 'ar' ? '30 يوم' : '30 Days'}</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {/* Current Weather */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {i18n.language === 'ar' ? 'الطقس الحالي' : 'Current Weather'}
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={4}>
                  <Box textAlign="center">
                    <Thermostat color="error" sx={{ fontSize: 40, mb: 1 }} />
                    <Typography variant="h4">{currentWeather.temperature}°C</Typography>
                    <Typography color="text.secondary">
                      {i18n.language === 'ar' ? 'درجة الحرارة' : 'Temperature'}
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={6} md={4}>
                  <Box textAlign="center">
                    <WaterDrop color="info" sx={{ fontSize: 40, mb: 1 }} />
                    <Typography variant="h4">{currentWeather.humidity}%</Typography>
                    <Typography color="text.secondary">
                      {i18n.language === 'ar' ? 'الرطوبة' : 'Humidity'}
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={6} md={4}>
                  <Box textAlign="center">
                    <Air color="primary" sx={{ fontSize: 40, mb: 1 }} />
                    <Typography variant="h4">{currentWeather.windSpeed}</Typography>
                    <Typography color="text.secondary">
                      {i18n.language === 'ar' ? 'سرعة الرياح (كم/س)' : 'Wind Speed (km/h)'}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              <Grid container spacing={2} sx={{ mt: 2 }}>
                <Grid item xs={6} sm={3}>
                  <Typography variant="body2" color="text.secondary">
                    {i18n.language === 'ar' ? 'الضغط الجوي' : 'Pressure'}
                  </Typography>
                  <Typography variant="h6">{currentWeather.pressure} hPa</Typography>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Typography variant="body2" color="text.secondary">
                    {i18n.language === 'ar' ? 'الرؤية' : 'Visibility'}
                  </Typography>
                  <Typography variant="h6">{currentWeather.visibility} km</Typography>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Typography variant="body2" color="text.secondary">
                    {i18n.language === 'ar' ? 'مؤشر الأشعة فوق البنفسجية' : 'UV Index'}
                  </Typography>
                  <Typography variant="h6">{currentWeather.uvIndex}</Typography>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Typography variant="body2" color="text.secondary">
                    {i18n.language === 'ar' ? 'درجة حرارة التربة' : 'Soil Temperature'}
                  </Typography>
                  <Typography variant="h6">{currentWeather.soilTemp}°C</Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {i18n.language === 'ar' ? 'التنبيهات البيئية' : 'Environmental Alerts'}
              </Typography>
              
              <List dense>
                {environmentalAlerts.map((alert) => (
                  <ListItem key={alert.id} sx={{ px: 0 }}>
                    <ListItemIcon>
                      {alert.type === 'warning' ? <Warning color="warning" /> : 
                       alert.type === 'success' ? <CheckCircle color="success" /> : 
                       <Thermostat color="info" />}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box display="flex" alignItems="center" gap={1}>
                          <Typography variant="subtitle2">{alert.title}</Typography>
                          <Chip
                            label={alert.severity}
                            size="small"
                            color={getAlertColor(alert.severity)}
                          />
                        </Box>
                      }
                      secondary={alert.message}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} variant="fullWidth">
          <Tab label={i18n.language === 'ar' ? 'التوقعات' : 'Forecast'} />
          <Tab label={i18n.language === 'ar' ? 'البيانات التاريخية' : 'Historical Data'} />
          <Tab label={i18n.language === 'ar' ? 'المؤشرات البيئية' : 'Environmental Indices'} />
        </Tabs>
      </Paper>

      {/* Tab Content */}
      {tabValue === 0 && (
        <Grid container spacing={2}>
          {forecast.map((day, index) => (
            <Grid item xs={12} sm={6} md={2.4} key={index}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="subtitle1" gutterBottom>
                    {day.day}
                  </Typography>
                  
                  <Box sx={{ mb: 2 }}>
                    {getWeatherIcon(day.condition)}
                  </Box>
                  
                  <Typography variant="h5" gutterBottom>
                    {day.temp}°C
                  </Typography>
                  
                  <Box sx={{ mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      {i18n.language === 'ar' ? 'الرطوبة' : 'Humidity'}
                    </Typography>
                    <Typography variant="body1">{day.humidity}%</Typography>
                  </Box>
                  
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      {i18n.language === 'ar' ? 'احتمال المطر' : 'Rain Chance'}
                    </Typography>
                    <Typography variant="body1">{day.rain}%</Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {tabValue === 1 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              {i18n.language === 'ar' ? 'البيانات التاريخية' : 'Historical Weather Data'}
            </Typography>
            
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>{i18n.language === 'ar' ? 'التاريخ' : 'Date'}</TableCell>
                    <TableCell>{i18n.language === 'ar' ? 'درجة الحرارة' : 'Temperature'}</TableCell>
                    <TableCell>{i18n.language === 'ar' ? 'الرطوبة' : 'Humidity'}</TableCell>
                    <TableCell>{i18n.language === 'ar' ? 'الأمطار' : 'Rainfall'}</TableCell>
                    <TableCell>{i18n.language === 'ar' ? 'سرعة الرياح' : 'Wind Speed'}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {historicalData.map((record, index) => (
                    <TableRow key={index}>
                      <TableCell>{record.date}</TableCell>
                      <TableCell>{record.temp}°C</TableCell>
                      <TableCell>{record.humidity}%</TableCell>
                      <TableCell>{record.rainfall}mm</TableCell>
                      <TableCell>{record.windSpeed} km/h</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}

      {tabValue === 2 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {i18n.language === 'ar' ? 'مؤشر الإجهاد الحراري' : 'Heat Stress Index'}
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <LinearProgress variant="determinate" value={35} color="warning" />
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    35% - {i18n.language === 'ar' ? 'معتدل' : 'Moderate'}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {i18n.language === 'ar' 
                    ? 'مستوى الإجهاد الحراري للمحاصيل بناءً على درجة الحرارة والرطوبة'
                    : 'Crop heat stress level based on temperature and humidity'
                  }
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {i18n.language === 'ar' ? 'مؤشر الجفاف' : 'Drought Index'}
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <LinearProgress variant="determinate" value={20} color="success" />
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    20% - {i18n.language === 'ar' ? 'منخفض' : 'Low'}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {i18n.language === 'ar'
                    ? 'مستوى خطر الجفاف بناءً على هطول الأمطار ودرجة الحرارة'
                    : 'Drought risk level based on rainfall and temperature patterns'
                  }
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {i18n.language === 'ar' ? 'مؤشر الرطوبة' : 'Moisture Index'}
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <LinearProgress variant="determinate" value={75} color="info" />
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    75% - {i18n.language === 'ar' ? 'جيد' : 'Good'}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {i18n.language === 'ar'
                    ? 'مستوى الرطوبة في التربة والهواء'
                    : 'Soil and atmospheric moisture levels'
                  }
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {i18n.language === 'ar' ? 'مؤشر جودة الهواء' : 'Air Quality Index'}
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <LinearProgress variant="determinate" value={85} color="success" />
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    85% - {i18n.language === 'ar' ? 'ممتاز' : 'Excellent'}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {i18n.language === 'ar'
                    ? 'جودة الهواء وتأثيرها على نمو المحاصيل'
                    : 'Air quality and its impact on crop growth'
                  }
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default WeatherEnvironmentPage;

