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
  Slider,
  Switch,
  FormControlLabel,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Tabs,
  Tab
} from '@mui/material';
import {
  Satellite,
  CloudDownload,
  Visibility,
  FilterList,
  ZoomIn,
  Timeline,
  Compare,
  Download,
  Settings,
  Layers,
  Map
} from '@mui/icons-material';

const SatelliteImageryPage = () => {
  const { i18n } = useTranslation();
  const [selectedField, setSelectedField] = useState('all');
  const [dateRange, setDateRange] = useState([7, 30]); // days
  const [cloudCover, setCloudCover] = useState(20);
  const [resolution, setResolution] = useState('10m');
  const [showNDVI, setShowNDVI] = useState(true);
  const [showRGB, setShowRGB] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [downloadDialog, setDownloadDialog] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);

  const fields = [
    { id: 'all', name: i18n.language === 'ar' ? 'جميع الحقول' : 'All Fields' },
    { id: 'field1', name: i18n.language === 'ar' ? 'الحقل الشمالي' : 'North Field' },
    { id: 'field2', name: i18n.language === 'ar' ? 'الحقل الجنوبي' : 'South Field' },
    { id: 'field3', name: i18n.language === 'ar' ? 'الحقل الشرقي' : 'East Field' }
  ];

  const satelliteImages = [
    {
      id: 1,
      date: '2024-06-19',
      satellite: 'Sentinel-2',
      cloudCover: 5,
      resolution: '10m',
      field: 'North Field',
      ndviAvg: 0.75,
      thumbnail: '/images/satellite-thumb-1.jpg',
      size: '45.2 MB'
    },
    {
      id: 2,
      date: '2024-06-17',
      satellite: 'Landsat-8',
      cloudCover: 12,
      resolution: '30m',
      field: 'South Field',
      ndviAvg: 0.68,
      thumbnail: '/images/satellite-thumb-2.jpg',
      size: '38.7 MB'
    },
    {
      id: 3,
      date: '2024-06-15',
      satellite: 'Sentinel-2',
      cloudCover: 8,
      resolution: '10m',
      field: 'East Field',
      ndviAvg: 0.72,
      thumbnail: '/images/satellite-thumb-3.jpg',
      size: '42.1 MB'
    },
    {
      id: 4,
      date: '2024-06-13',
      satellite: 'Planet',
      cloudCover: 3,
      resolution: '3m',
      field: 'North Field',
      ndviAvg: 0.78,
      thumbnail: '/images/satellite-thumb-4.jpg',
      size: '67.8 MB'
    }
  ];

  const analysisTools = [
    {
      name: i18n.language === 'ar' ? 'مؤشر NDVI' : 'NDVI Index',
      description: i18n.language === 'ar' ? 'تحليل صحة النبات' : 'Vegetation health analysis',
      icon: <Timeline color="success" />
    },
    {
      name: i18n.language === 'ar' ? 'مؤشر NDWI' : 'NDWI Index',
      description: i18n.language === 'ar' ? 'تحليل محتوى الماء' : 'Water content analysis',
      icon: <Timeline color="info" />
    },
    {
      name: i18n.language === 'ar' ? 'التحليل الزمني' : 'Time Series',
      description: i18n.language === 'ar' ? 'تتبع التغيرات عبر الزمن' : 'Track changes over time',
      icon: <Compare color="primary" />
    },
    {
      name: i18n.language === 'ar' ? 'كشف التغيرات' : 'Change Detection',
      description: i18n.language === 'ar' ? 'مقارنة الصور عبر فترات زمنية' : 'Compare images across time periods',
      icon: <Compare color="warning" />
    }
  ];

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleImageSelect = (imageId) => {
    setSelectedImages(prev => 
      prev.includes(imageId) 
        ? prev.filter(id => id !== imageId)
        : [...prev, imageId]
    );
  };

  const handleDownload = () => {
    setDownloadDialog(true);
  };

  const confirmDownload = () => {
    // Handle download logic
    setDownloadDialog(false);
    setSelectedImages([]);
  };

  const getCloudCoverColor = (cover) => {
    if (cover <= 10) return 'success';
    if (cover <= 30) return 'warning';
    return 'error';
  };

  const getNDVIColor = (ndvi) => {
    if (ndvi >= 0.7) return 'success';
    if (ndvi >= 0.5) return 'warning';
    return 'error';
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h4">
          {i18n.language === 'ar' ? 'صور الأقمار الصناعية' : 'Satellite Imagery'}
        </Typography>
        <Button
          variant="contained"
          startIcon={<Download />}
          onClick={handleDownload}
          disabled={selectedImages.length === 0}
        >
          {i18n.language === 'ar' ? 'تحميل المحدد' : 'Download Selected'} ({selectedImages.length})
        </Button>
      </Box>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {i18n.language === 'ar' ? 'المرشحات' : 'Filters'}
          </Typography>
          
          <Grid container spacing={3} alignItems="center">
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
                <InputLabel>{i18n.language === 'ar' ? 'الدقة' : 'Resolution'}</InputLabel>
                <Select
                  value={resolution}
                  onChange={(e) => setResolution(e.target.value)}
                >
                  <MenuItem value="3m">3m (Planet)</MenuItem>
                  <MenuItem value="10m">10m (Sentinel-2)</MenuItem>
                  <MenuItem value="30m">30m (Landsat-8)</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Typography gutterBottom>
                {i18n.language === 'ar' ? 'الفترة الزمنية (أيام)' : 'Date Range (days)'}
              </Typography>
              <Slider
                value={dateRange}
                onChange={(e, newValue) => setDateRange(newValue)}
                valueLabelDisplay="auto"
                min={1}
                max={90}
                marks={[
                  { value: 7, label: '7' },
                  { value: 30, label: '30' },
                  { value: 90, label: '90' }
                ]}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Typography gutterBottom>
                {i18n.language === 'ar' ? 'الحد الأقصى للغيوم (%)' : 'Max Cloud Cover (%)'}
              </Typography>
              <Slider
                value={cloudCover}
                onChange={(e, newValue) => setCloudCover(newValue)}
                valueLabelDisplay="auto"
                min={0}
                max={100}
                step={5}
              />
            </Grid>
          </Grid>

          <Box sx={{ mt: 2 }}>
            <FormControlLabel
              control={<Switch checked={showNDVI} onChange={(e) => setShowNDVI(e.target.checked)} />}
              label={i18n.language === 'ar' ? 'عرض NDVI' : 'Show NDVI'}
            />
            <FormControlLabel
              control={<Switch checked={showRGB} onChange={(e) => setShowRGB(e.target.checked)} />}
              label={i18n.language === 'ar' ? 'عرض RGB' : 'Show RGB'}
              sx={{ ml: 2 }}
            />
          </Box>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} variant="fullWidth">
          <Tab label={i18n.language === 'ar' ? 'معرض الصور' : 'Image Gallery'} />
          <Tab label={i18n.language === 'ar' ? 'أدوات التحليل' : 'Analysis Tools'} />
          <Tab label={i18n.language === 'ar' ? 'المقارنة الزمنية' : 'Time Comparison'} />
        </Tabs>
      </Paper>

      {/* Tab Content */}
      {tabValue === 0 && (
        <Grid container spacing={3}>
          {satelliteImages.map((image) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={image.id}>
              <Card 
                sx={{ 
                  cursor: 'pointer',
                  border: selectedImages.includes(image.id) ? 2 : 1,
                  borderColor: selectedImages.includes(image.id) ? 'primary.main' : 'divider'
                }}
                onClick={() => handleImageSelect(image.id)}
              >
                <Box
                  sx={{
                    height: 200,
                    backgroundImage: `url(${image.thumbnail})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    position: 'relative'
                  }}
                >
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      display: 'flex',
                      gap: 1
                    }}
                  >
                    <Chip
                      label={`${image.cloudCover}%`}
                      size="small"
                      color={getCloudCoverColor(image.cloudCover)}
                    />
                    <Chip
                      label={image.resolution}
                      size="small"
                      color="info"
                    />
                  </Box>
                </Box>
                
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {image.field}
                  </Typography>
                  
                  <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      {image.date}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {image.satellite}
                    </Typography>
                  </Box>
                  
                  <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                    <Box>
                      <Typography variant="caption" display="block">
                        NDVI {i18n.language === 'ar' ? 'المتوسط' : 'Avg'}
                      </Typography>
                      <Chip
                        label={image.ndviAvg.toFixed(2)}
                        size="small"
                        color={getNDVIColor(image.ndviAvg)}
                      />
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      {image.size}
                    </Typography>
                  </Box>
                  
                  <Box display="flex" gap={1}>
                    <Button size="small" startIcon={<Visibility />} fullWidth>
                      {i18n.language === 'ar' ? 'عرض' : 'View'}
                    </Button>
                    <Button size="small" startIcon={<ZoomIn />} fullWidth>
                      {i18n.language === 'ar' ? 'تحليل' : 'Analyze'}
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {tabValue === 1 && (
        <Grid container spacing={3}>
          {analysisTools.map((tool, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card sx={{ height: '100%', cursor: 'pointer', '&:hover': { boxShadow: 4 } }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Box sx={{ mb: 2 }}>
                    {tool.icon}
                  </Box>
                  <Typography variant="h6" gutterBottom>
                    {tool.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {tool.description}
                  </Typography>
                  <Button variant="outlined" fullWidth>
                    {i18n.language === 'ar' ? 'تشغيل التحليل' : 'Run Analysis'}
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {tabValue === 2 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {i18n.language === 'ar' ? 'مقارنة زمنية' : 'Time Series Comparison'}
                </Typography>
                <Box
                  sx={{
                    height: 400,
                    bgcolor: 'grey.100',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 1
                  }}
                >
                  <Typography color="text.secondary">
                    {i18n.language === 'ar' ? 'مخطط المقارنة الزمنية' : 'Time Series Chart Placeholder'}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {i18n.language === 'ar' ? 'إعدادات المقارنة' : 'Comparison Settings'}
                </Typography>
                
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>{i18n.language === 'ar' ? 'المؤشر' : 'Index'}</InputLabel>
                  <Select defaultValue="ndvi">
                    <MenuItem value="ndvi">NDVI</MenuItem>
                    <MenuItem value="ndwi">NDWI</MenuItem>
                    <MenuItem value="evi">EVI</MenuItem>
                  </Select>
                </FormControl>

                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>{i18n.language === 'ar' ? 'الفترة' : 'Period'}</InputLabel>
                  <Select defaultValue="monthly">
                    <MenuItem value="weekly">{i18n.language === 'ar' ? 'أسبوعي' : 'Weekly'}</MenuItem>
                    <MenuItem value="monthly">{i18n.language === 'ar' ? 'شهري' : 'Monthly'}</MenuItem>
                    <MenuItem value="seasonal">{i18n.language === 'ar' ? 'موسمي' : 'Seasonal'}</MenuItem>
                  </Select>
                </FormControl>

                <Button variant="contained" fullWidth>
                  {i18n.language === 'ar' ? 'تحديث المقارنة' : 'Update Comparison'}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Download Dialog */}
      <Dialog open={downloadDialog} onClose={() => setDownloadDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {i18n.language === 'ar' ? 'تحميل الصور' : 'Download Images'}
        </DialogTitle>
        <DialogContent>
          <Typography gutterBottom>
            {i18n.language === 'ar' 
              ? `سيتم تحميل ${selectedImages.length} صورة`
              : `${selectedImages.length} images will be downloaded`
            }
          </Typography>
          
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>{i18n.language === 'ar' ? 'تنسيق التحميل' : 'Download Format'}</InputLabel>
            <Select defaultValue="geotiff">
              <MenuItem value="geotiff">GeoTIFF</MenuItem>
              <MenuItem value="jpeg">JPEG</MenuItem>
              <MenuItem value="png">PNG</MenuItem>
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label={i18n.language === 'ar' ? 'البريد الإلكتروني (اختياري)' : 'Email (optional)'}
            placeholder={i18n.language === 'ar' ? 'سيتم إرسال رابط التحميل' : 'Download link will be sent'}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDownloadDialog(false)}>
            {i18n.language === 'ar' ? 'إلغاء' : 'Cancel'}
          </Button>
          <Button onClick={confirmDownload} variant="contained">
            {i18n.language === 'ar' ? 'تحميل' : 'Download'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SatelliteImageryPage;

