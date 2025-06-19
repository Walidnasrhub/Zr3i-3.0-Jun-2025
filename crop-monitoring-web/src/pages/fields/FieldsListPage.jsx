import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Fab
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Visibility,
  Agriculture,
  LocationOn,
  TrendingUp,
  Warning
} from '@mui/icons-material';

const FieldsListPage = () => {
  const { user, updateUser } = useAuth();
  const { i18n } = useTranslation();
  const [fields, setFields] = useState(user?.fields || []);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingField, setEditingField] = useState(null);
  const [fieldData, setFieldData] = useState({
    name: '',
    area: '',
    crop: '',
    status: 'Healthy',
    location: '',
    plantingDate: '',
    expectedHarvest: ''
  });

  useEffect(() => {
    setFields(user?.fields || []);
  }, [user]);

  const handleAddField = () => {
    setEditingField(null);
    setFieldData({
      name: '',
      area: '',
      crop: '',
      status: 'Healthy',
      location: '',
      plantingDate: '',
      expectedHarvest: ''
    });
    setOpenDialog(true);
  };

  const handleEditField = (field) => {
    setEditingField(field);
    setFieldData({
      name: field.name,
      area: field.area,
      crop: field.crop,
      status: field.status,
      location: field.location || '',
      plantingDate: field.plantingDate || '',
      expectedHarvest: field.expectedHarvest || ''
    });
    setOpenDialog(true);
  };

  const handleDeleteField = (fieldId) => {
    const updatedFields = fields.filter(field => field.id !== fieldId);
    setFields(updatedFields);
    updateUser({ fields: updatedFields });
    toast.success(i18n.language === 'ar' ? 'تم حذف الحقل' : 'Field deleted successfully');
  };

  const handleSaveField = () => {
    if (!fieldData.name || !fieldData.area || !fieldData.crop) {
      toast.error(i18n.language === 'ar' ? 'يرجى ملء جميع الحقول المطلوبة' : 'Please fill all required fields');
      return;
    }

    let updatedFields;
    if (editingField) {
      updatedFields = fields.map(field => 
        field.id === editingField.id 
          ? { ...field, ...fieldData }
          : field
      );
    } else {
      const newField = {
        id: Date.now(),
        ...fieldData
      };
      updatedFields = [...fields, newField];
    }

    setFields(updatedFields);
    updateUser({ fields: updatedFields });
    setOpenDialog(false);
    toast.success(
      editingField 
        ? (i18n.language === 'ar' ? 'تم تحديث الحقل' : 'Field updated successfully')
        : (i18n.language === 'ar' ? 'تم إضافة الحقل' : 'Field added successfully')
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Excellent': return 'success';
      case 'Healthy': return 'success';
      case 'Good': return 'info';
      case 'Monitoring Required': return 'warning';
      case 'Needs Attention': return 'warning';
      case 'Poor': return 'error';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Excellent':
      case 'Healthy':
      case 'Good':
        return <TrendingUp />;
      case 'Monitoring Required':
      case 'Needs Attention':
      case 'Poor':
        return <Warning />;
      default:
        return <Agriculture />;
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h4">
          {i18n.language === 'ar' ? 'إدارة الحقول' : 'Field Management'}
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleAddField}
        >
          {i18n.language === 'ar' ? 'إضافة حقل جديد' : 'Add New Field'}
        </Button>
      </Box>

      {/* Summary Cards */}
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
                    {fields.length}
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
                <TrendingUp color="success" sx={{ mr: 2 }} />
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    {i18n.language === 'ar' ? 'الحقول الصحية' : 'Healthy Fields'}
                  </Typography>
                  <Typography variant="h4">
                    {fields.filter(f => f.status === 'Healthy' || f.status === 'Excellent').length}
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
                    {i18n.language === 'ar' ? 'تحتاج مراقبة' : 'Need Monitoring'}
                  </Typography>
                  <Typography variant="h4">
                    {fields.filter(f => f.status === 'Monitoring Required' || f.status === 'Needs Attention').length}
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
                <LocationOn color="info" sx={{ mr: 2 }} />
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    {i18n.language === 'ar' ? 'إجمالي المساحة' : 'Total Area'}
                  </Typography>
                  <Typography variant="h6">
                    {fields.reduce((total, field) => {
                      const area = parseFloat(field.area.replace(/[^\d.]/g, '')) || 0;
                      return total + area;
                    }, 0).toFixed(1)} {i18n.language === 'ar' ? 'هكتار' : 'ha'}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Fields Table */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {i18n.language === 'ar' ? 'قائمة الحقول' : 'Fields List'}
          </Typography>
          
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>{i18n.language === 'ar' ? 'اسم الحقل' : 'Field Name'}</TableCell>
                  <TableCell>{i18n.language === 'ar' ? 'المساحة' : 'Area'}</TableCell>
                  <TableCell>{i18n.language === 'ar' ? 'المحصول' : 'Crop'}</TableCell>
                  <TableCell>{i18n.language === 'ar' ? 'الحالة' : 'Status'}</TableCell>
                  <TableCell>{i18n.language === 'ar' ? 'الموقع' : 'Location'}</TableCell>
                  <TableCell>{i18n.language === 'ar' ? 'الإجراءات' : 'Actions'}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {fields.map((field) => (
                  <TableRow key={field.id}>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <Agriculture sx={{ mr: 1, color: 'text.secondary' }} />
                        {field.name}
                      </Box>
                    </TableCell>
                    <TableCell>{field.area}</TableCell>
                    <TableCell>{field.crop}</TableCell>
                    <TableCell>
                      <Chip
                        icon={getStatusIcon(field.status)}
                        label={field.status}
                        color={getStatusColor(field.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{field.location || 'N/A'}</TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={() => handleEditField(field)}
                        color="primary"
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteField(field.id)}
                        color="error"
                      >
                        <Delete />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="info"
                      >
                        <Visibility />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
                {fields.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      <Typography color="text.secondary">
                        {i18n.language === 'ar' ? 'لا توجد حقول مضافة بعد' : 'No fields added yet'}
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Add/Edit Field Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingField 
            ? (i18n.language === 'ar' ? 'تعديل الحقل' : 'Edit Field')
            : (i18n.language === 'ar' ? 'إضافة حقل جديد' : 'Add New Field')
          }
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label={i18n.language === 'ar' ? 'اسم الحقل *' : 'Field Name *'}
                value={fieldData.name}
                onChange={(e) => setFieldData({ ...fieldData, name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label={i18n.language === 'ar' ? 'المساحة *' : 'Area *'}
                value={fieldData.area}
                onChange={(e) => setFieldData({ ...fieldData, area: e.target.value })}
                placeholder={i18n.language === 'ar' ? 'مثال: 25 هكتار' : 'e.g., 25 hectares'}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label={i18n.language === 'ar' ? 'نوع المحصول *' : 'Crop Type *'}
                value={fieldData.crop}
                onChange={(e) => setFieldData({ ...fieldData, crop: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>{i18n.language === 'ar' ? 'الحالة' : 'Status'}</InputLabel>
                <Select
                  value={fieldData.status}
                  onChange={(e) => setFieldData({ ...fieldData, status: e.target.value })}
                >
                  <MenuItem value="Excellent">{i18n.language === 'ar' ? 'ممتاز' : 'Excellent'}</MenuItem>
                  <MenuItem value="Healthy">{i18n.language === 'ar' ? 'صحي' : 'Healthy'}</MenuItem>
                  <MenuItem value="Good">{i18n.language === 'ar' ? 'جيد' : 'Good'}</MenuItem>
                  <MenuItem value="Monitoring Required">{i18n.language === 'ar' ? 'يحتاج مراقبة' : 'Monitoring Required'}</MenuItem>
                  <MenuItem value="Needs Attention">{i18n.language === 'ar' ? 'يحتاج انتباه' : 'Needs Attention'}</MenuItem>
                  <MenuItem value="Poor">{i18n.language === 'ar' ? 'ضعيف' : 'Poor'}</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={i18n.language === 'ar' ? 'الموقع' : 'Location'}
                value={fieldData.location}
                onChange={(e) => setFieldData({ ...fieldData, location: e.target.value })}
                placeholder={i18n.language === 'ar' ? 'مثال: المنطقة الشمالية، المزرعة الرئيسية' : 'e.g., North Section, Main Farm'}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label={i18n.language === 'ar' ? 'تاريخ الزراعة' : 'Planting Date'}
                type="date"
                value={fieldData.plantingDate}
                onChange={(e) => setFieldData({ ...fieldData, plantingDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label={i18n.language === 'ar' ? 'تاريخ الحصاد المتوقع' : 'Expected Harvest'}
                type="date"
                value={fieldData.expectedHarvest}
                onChange={(e) => setFieldData({ ...fieldData, expectedHarvest: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>
            {i18n.language === 'ar' ? 'إلغاء' : 'Cancel'}
          </Button>
          <Button onClick={handleSaveField} variant="contained">
            {editingField 
              ? (i18n.language === 'ar' ? 'تحديث' : 'Update')
              : (i18n.language === 'ar' ? 'إضافة' : 'Add')
            }
          </Button>
        </DialogActions>
      </Dialog>

      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="add"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={handleAddField}
      >
        <Add />
      </Fab>
    </Box>
  );
};

export default FieldsListPage;

