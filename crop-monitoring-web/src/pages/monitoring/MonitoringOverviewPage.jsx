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
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  LinearProgress,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import {
  Satellite,
  TrendingUp,
  Warning,
  CheckCircle,
  Timeline,
  Assessment,
  Download,
  Refresh
} from '@mui/icons-material';

const MonitoringOverviewPage = () => {
  const { i18n } = useTranslation();
  const [tabValue, setTabValue] = useState(0);
  const [monitoringData, setMonitoringData] = useState({
    lastUpdate: new Date().toISOString(),
    satelliteImages: 15,
    healthyFields: 8,
    alertsCount: 3,
    coveragePercentage: 95
  });

  const [recentAlerts] = useState([
    {
      id: 1,
      type: 'warning',
      field: 'North Field',
      message: i18n.language === 'ar' ? 'انخفاض في مؤشر NDVI' : 'NDVI index decline detected',
      timestamp: '2 hours ago',
      severity: 'medium'
    },
    {
      id: 2,
      type: 'info',
      field: 'South Field',
      message: i18n.language === 'ar' ? 'نمو طبيعي للمحصول' : 'Normal crop growth detected',
      timestamp: '1 day ago',
      severity: 'low'
    },
    {
      id: 3,
      type: 'error',
      field: 'East Field',
      message: i18n.language === 'ar' ? 'إجهاد مائي محتمل' : 'Potential water stress detected',
      timestamp: '3 hours ago',
      severity: 'high'
    }
  ]);

  const [monitoringHistory] = useState([
    {
      date: '2024-06-19',
      fieldsMonitored: 12,
      imagesProcessed: 48,
      alertsGenerated: 2,
      healthScore: 85
    },
    {
      date: '2024-06-18',
      fieldsMonitored: 12,
      imagesProcessed: 45,
      alertsGenerated: 1,
      healthScore: 87
    },
    {
      date: '2024-06-17',
      fieldsMonitored: 11,
      imagesProcessed: 42,
      alertsGenerated: 3,
      healthScore: 82
    }
  ]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const getAlertIcon = (type) => {
    switch (type) {
      case 'error': return <Warning color="error" />;
      case 'warning': return <Warning color="warning" />;
      case 'info': return <CheckCircle color="success" />;
      default: return <CheckCircle />;
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

  return (
    <Box sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h4">
          {i18n.language === 'ar' ? 'نظرة عامة على المراقبة' : 'Monitoring Overview'}
        </Typography>
        <Button
          variant="contained"
          startIcon={<Refresh />}
          onClick={() => window.location.reload()}
        >
          {i18n.language === 'ar' ? 'تحديث البيانات' : 'Refresh Data'}
        </Button>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Satellite color="primary" sx={{ mr: 2 }} />
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    {i18n.language === 'ar' ? 'صور الأقمار الصناعية' : 'Satellite Images'}
                  </Typography>
                  <Typography variant="h4">
                    {monitoringData.satelliteImages}
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
                <CheckCircle color="success" sx={{ mr: 2 }} />
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    {i18n.language === 'ar' ? 'الحقول الصحية' : 'Healthy Fields'}
                  </Typography>
                  <Typography variant="h4">
                    {monitoringData.healthyFields}
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
                <Warning color="warning" sx={{ mr: 2 }} />
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    {i18n.language === 'ar' ? 'التنبيهات النشطة' : 'Active Alerts'}
                  </Typography>
                  <Typography variant="h4">
                    {monitoringData.alertsCount}
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
                    {i18n.language === 'ar' ? 'نسبة التغطية' : 'Coverage'}
                  </Typography>
                  <Typography variant="h4">
                    {monitoringData.coveragePercentage}%
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs for different views */}
      <Paper sx={{ mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} variant="fullWidth">
          <Tab label={i18n.language === 'ar' ? 'التنبيهات الحديثة' : 'Recent Alerts'} />
          <Tab label={i18n.language === 'ar' ? 'سجل المراقبة' : 'Monitoring History'} />
          <Tab label={i18n.language === 'ar' ? 'إحصائيات الأداء' : 'Performance Stats'} />
        </Tabs>
      </Paper>

      {/* Tab Content */}
      {tabValue === 0 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {i18n.language === 'ar' ? 'التنبيهات الحديثة' : 'Recent Alerts'}
                </Typography>
                <List>
                  {recentAlerts.map((alert) => (
                    <ListItem key={alert.id} divider>
                      <ListItemIcon>
                        {getAlertIcon(alert.type)}
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box display="flex" alignItems="center" gap={1}>
                            <Typography variant="subtitle1">
                              {alert.field}
                            </Typography>
                            <Chip
                              label={alert.severity}
                              size="small"
                              color={getAlertColor(alert.severity)}
                            />
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2">
                              {alert.message}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {alert.timestamp}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {i18n.language === 'ar' ? 'حالة النظام' : 'System Status'}
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" gutterBottom>
                    {i18n.language === 'ar' ? 'آخر تحديث' : 'Last Update'}
                  </Typography>
                  <Typography variant="body1" color="primary">
                    {new Date(monitoringData.lastUpdate).toLocaleString()}
                  </Typography>
                </Box>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" gutterBottom>
                    {i18n.language === 'ar' ? 'حالة الاتصال' : 'Connection Status'}
                  </Typography>
                  <Chip label={i18n.language === 'ar' ? 'متصل' : 'Connected'} color="success" size="small" />
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" gutterBottom>
                    {i18n.language === 'ar' ? 'معالجة البيانات' : 'Data Processing'}
                  </Typography>
                  <LinearProgress variant="determinate" value={85} />
                  <Typography variant="caption">85% {i18n.language === 'ar' ? 'مكتمل' : 'Complete'}</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {tabValue === 1 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              {i18n.language === 'ar' ? 'سجل المراقبة' : 'Monitoring History'}
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>{i18n.language === 'ar' ? 'التاريخ' : 'Date'}</TableCell>
                    <TableCell>{i18n.language === 'ar' ? 'الحقول المراقبة' : 'Fields Monitored'}</TableCell>
                    <TableCell>{i18n.language === 'ar' ? 'الصور المعالجة' : 'Images Processed'}</TableCell>
                    <TableCell>{i18n.language === 'ar' ? 'التنبيهات' : 'Alerts'}</TableCell>
                    <TableCell>{i18n.language === 'ar' ? 'نقاط الصحة' : 'Health Score'}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {monitoringHistory.map((record, index) => (
                    <TableRow key={index}>
                      <TableCell>{record.date}</TableCell>
                      <TableCell>{record.fieldsMonitored}</TableCell>
                      <TableCell>{record.imagesProcessed}</TableCell>
                      <TableCell>{record.alertsGenerated}</TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          <Typography variant="body2" sx={{ mr: 1 }}>
                            {record.healthScore}%
                          </Typography>
                          <LinearProgress
                            variant="determinate"
                            value={record.healthScore}
                            sx={{ width: 60, height: 6 }}
                          />
                        </Box>
                      </TableCell>
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
                  {i18n.language === 'ar' ? 'إحصائيات الأداء' : 'Performance Statistics'}
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" gutterBottom>
                    {i18n.language === 'ar' ? 'دقة التحليل' : 'Analysis Accuracy'}
                  </Typography>
                  <LinearProgress variant="determinate" value={94} sx={{ mb: 1 }} />
                  <Typography variant="caption">94%</Typography>
                </Box>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" gutterBottom>
                    {i18n.language === 'ar' ? 'سرعة المعالجة' : 'Processing Speed'}
                  </Typography>
                  <LinearProgress variant="determinate" value={87} sx={{ mb: 1 }} />
                  <Typography variant="caption">87%</Typography>
                </Box>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" gutterBottom>
                    {i18n.language === 'ar' ? 'توفر النظام' : 'System Uptime'}
                  </Typography>
                  <LinearProgress variant="determinate" value={99} sx={{ mb: 1 }} />
                  <Typography variant="caption">99.2%</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {i18n.language === 'ar' ? 'إجراءات سريعة' : 'Quick Actions'}
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<Download />}
                      sx={{ mb: 1 }}
                    >
                      {i18n.language === 'ar' ? 'تحميل التقرير' : 'Download Report'}
                    </Button>
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<Assessment />}
                      sx={{ mb: 1 }}
                    >
                      {i18n.language === 'ar' ? 'عرض التحليلات' : 'View Analytics'}
                    </Button>
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<Timeline />}
                    >
                      {i18n.language === 'ar' ? 'إعداد تنبيهات' : 'Configure Alerts'}
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default MonitoringOverviewPage;

