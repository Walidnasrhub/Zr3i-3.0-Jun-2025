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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  Divider
} from '@mui/material';
import {
  CreditCard,
  CheckCircle,
  Cancel,
  Upgrade,
  History,
  Receipt,
  Star
} from '@mui/icons-material';

const SubscriptionPlansPage = () => {
  const { i18n } = useTranslation();
  const [selectedPlan, setSelectedPlan] = useState('basic');
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [upgradeDialog, setUpgradeDialog] = useState(false);
  const [currentPlan] = useState('basic'); // This would come from user context

  const plans = [
    {
      id: 'basic',
      name: i18n.language === 'ar' ? 'الأساسي' : 'Basic',
      monthlyPrice: 29,
      yearlyPrice: 290,
      features: [
        i18n.language === 'ar' ? 'مراقبة حتى 5 حقول' : 'Monitor up to 5 fields',
        i18n.language === 'ar' ? 'صور الأقمار الصناعية الأساسية' : 'Basic satellite imagery',
        i18n.language === 'ar' ? 'تقارير شهرية' : 'Monthly reports',
        i18n.language === 'ar' ? 'دعم عبر البريد الإلكتروني' : 'Email support',
        i18n.language === 'ar' ? 'مؤشرات الغطاء النباتي الأساسية' : 'Basic vegetation indices'
      ],
      popular: false,
      color: 'primary'
    },
    {
      id: 'professional',
      name: i18n.language === 'ar' ? 'المحترف' : 'Professional',
      monthlyPrice: 79,
      yearlyPrice: 790,
      features: [
        i18n.language === 'ar' ? 'مراقبة حتى 20 حقل' : 'Monitor up to 20 fields',
        i18n.language === 'ar' ? 'صور عالية الدقة' : 'High-resolution imagery',
        i18n.language === 'ar' ? 'تقارير أسبوعية' : 'Weekly reports',
        i18n.language === 'ar' ? 'دعم هاتفي' : 'Phone support',
        i18n.language === 'ar' ? 'جميع مؤشرات الغطاء النباتي' : 'All vegetation indices',
        i18n.language === 'ar' ? 'تنبيهات في الوقت الفعلي' : 'Real-time alerts',
        i18n.language === 'ar' ? 'تحليل الطقس المتقدم' : 'Advanced weather analysis'
      ],
      popular: true,
      color: 'secondary'
    },
    {
      id: 'premium',
      name: i18n.language === 'ar' ? 'المميز' : 'Premium',
      monthlyPrice: 149,
      yearlyPrice: 1490,
      features: [
        i18n.language === 'ar' ? 'حقول غير محدودة' : 'Unlimited fields',
        i18n.language === 'ar' ? 'صور فائقة الدقة' : 'Ultra-high resolution imagery',
        i18n.language === 'ar' ? 'تقارير يومية' : 'Daily reports',
        i18n.language === 'ar' ? 'دعم مخصص 24/7' : 'Dedicated 24/7 support',
        i18n.language === 'ar' ? 'تحليل بالذكاء الاصطناعي' : 'AI-powered analysis',
        i18n.language === 'ar' ? 'تتبع المنتج من المزرعة للمائدة' : 'Farm-to-fork traceability',
        i18n.language === 'ar' ? 'تكامل API مخصص' : 'Custom API integration',
        i18n.language === 'ar' ? 'استشارات زراعية' : 'Agricultural consulting'
      ],
      popular: false,
      color: 'warning'
    }
  ];

  const paymentHistory = [
    {
      id: 1,
      date: '2024-06-01',
      amount: 29,
      plan: 'Basic',
      status: 'paid',
      invoice: 'INV-2024-001'
    },
    {
      id: 2,
      date: '2024-05-01',
      amount: 29,
      plan: 'Basic',
      status: 'paid',
      invoice: 'INV-2024-002'
    },
    {
      id: 3,
      date: '2024-04-01',
      amount: 29,
      plan: 'Basic',
      status: 'paid',
      invoice: 'INV-2024-003'
    }
  ];

  const handlePlanSelect = (planId) => {
    setSelectedPlan(planId);
  };

  const handleUpgrade = () => {
    setUpgradeDialog(true);
  };

  const confirmUpgrade = () => {
    // Handle upgrade logic here
    setUpgradeDialog(false);
    // Show success message
  };

  const getPrice = (plan) => {
    return billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice;
  };

  const getSavings = (plan) => {
    const monthlyCost = plan.monthlyPrice * 12;
    const yearlyCost = plan.yearlyPrice;
    return monthlyCost - yearlyCost;
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        {i18n.language === 'ar' ? 'خطط الاشتراك' : 'Subscription Plans'}
      </Typography>

      {/* Current Plan Status */}
      <Card sx={{ mb: 4, bgcolor: 'primary.light', color: 'primary.contrastText' }}>
        <CardContent>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box>
              <Typography variant="h6">
                {i18n.language === 'ar' ? 'خطتك الحالية' : 'Your Current Plan'}
              </Typography>
              <Typography variant="h4">
                {plans.find(p => p.id === currentPlan)?.name}
              </Typography>
              <Typography variant="body2">
                {i18n.language === 'ar' ? 'التجديد التالي: 1 يوليو 2024' : 'Next renewal: July 1, 2024'}
              </Typography>
            </Box>
            <Box textAlign="center">
              <Typography variant="h3">
                ${plans.find(p => p.id === currentPlan)?.monthlyPrice}
              </Typography>
              <Typography variant="body2">
                {i18n.language === 'ar' ? 'شهرياً' : 'per month'}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Billing Cycle Toggle */}
      <Box display="flex" justifyContent="center" sx={{ mb: 4 }}>
        <FormControl>
          <InputLabel>{i18n.language === 'ar' ? 'دورة الفوترة' : 'Billing Cycle'}</InputLabel>
          <Select
            value={billingCycle}
            onChange={(e) => setBillingCycle(e.target.value)}
            sx={{ minWidth: 200 }}
          >
            <MenuItem value="monthly">{i18n.language === 'ar' ? 'شهرياً' : 'Monthly'}</MenuItem>
            <MenuItem value="yearly">
              {i18n.language === 'ar' ? 'سنوياً (وفر 20%)' : 'Yearly (Save 20%)'}
            </MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Plans Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {plans.map((plan) => (
          <Grid item xs={12} md={4} key={plan.id}>
            <Card
              sx={{
                height: '100%',
                position: 'relative',
                border: selectedPlan === plan.id ? 2 : 1,
                borderColor: selectedPlan === plan.id ? 'primary.main' : 'divider',
                cursor: 'pointer',
                '&:hover': {
                  boxShadow: 4
                }
              }}
              onClick={() => handlePlanSelect(plan.id)}
            >
              {plan.popular && (
                <Chip
                  label={i18n.language === 'ar' ? 'الأكثر شعبية' : 'Most Popular'}
                  color="secondary"
                  sx={{
                    position: 'absolute',
                    top: -10,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    zIndex: 1
                  }}
                />
              )}
              
              <CardContent sx={{ textAlign: 'center', p: 3 }}>
                <Typography variant="h5" gutterBottom>
                  {plan.name}
                </Typography>
                
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h3" color="primary">
                    ${getPrice(plan)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {billingCycle === 'monthly' 
                      ? (i18n.language === 'ar' ? 'شهرياً' : 'per month')
                      : (i18n.language === 'ar' ? 'سنوياً' : 'per year')
                    }
                  </Typography>
                  {billingCycle === 'yearly' && (
                    <Typography variant="body2" color="success.main">
                      {i18n.language === 'ar' ? `وفر $${getSavings(plan)}` : `Save $${getSavings(plan)}`}
                    </Typography>
                  )}
                </Box>

                <List dense>
                  {plan.features.map((feature, index) => (
                    <ListItem key={index} sx={{ px: 0 }}>
                      <CheckCircle color="success" sx={{ mr: 1, fontSize: 16 }} />
                      <ListItemText 
                        primary={feature}
                        primaryTypographyProps={{ variant: 'body2' }}
                      />
                    </ListItem>
                  ))}
                </List>

                <Button
                  variant={plan.id === currentPlan ? "outlined" : "contained"}
                  color={plan.color}
                  fullWidth
                  sx={{ mt: 2 }}
                  disabled={plan.id === currentPlan}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (plan.id !== currentPlan) {
                      handleUpgrade();
                    }
                  }}
                >
                  {plan.id === currentPlan 
                    ? (i18n.language === 'ar' ? 'الخطة الحالية' : 'Current Plan')
                    : (i18n.language === 'ar' ? 'ترقية' : 'Upgrade')
                  }
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Payment History */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {i18n.language === 'ar' ? 'سجل المدفوعات' : 'Payment History'}
          </Typography>
          
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>{i18n.language === 'ar' ? 'التاريخ' : 'Date'}</TableCell>
                  <TableCell>{i18n.language === 'ar' ? 'الخطة' : 'Plan'}</TableCell>
                  <TableCell>{i18n.language === 'ar' ? 'المبلغ' : 'Amount'}</TableCell>
                  <TableCell>{i18n.language === 'ar' ? 'الحالة' : 'Status'}</TableCell>
                  <TableCell>{i18n.language === 'ar' ? 'الفاتورة' : 'Invoice'}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paymentHistory.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell>{payment.date}</TableCell>
                    <TableCell>{payment.plan}</TableCell>
                    <TableCell>${payment.amount}</TableCell>
                    <TableCell>
                      <Chip
                        label={payment.status === 'paid' 
                          ? (i18n.language === 'ar' ? 'مدفوع' : 'Paid')
                          : (i18n.language === 'ar' ? 'معلق' : 'Pending')
                        }
                        color={payment.status === 'paid' ? 'success' : 'warning'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        size="small"
                        startIcon={<Receipt />}
                        onClick={() => {/* Download invoice */}}
                      >
                        {payment.invoice}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Upgrade Confirmation Dialog */}
      <Dialog open={upgradeDialog} onClose={() => setUpgradeDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {i18n.language === 'ar' ? 'تأكيد الترقية' : 'Confirm Upgrade'}
        </DialogTitle>
        <DialogContent>
          <Typography gutterBottom>
            {i18n.language === 'ar' 
              ? `هل أنت متأكد من أنك تريد الترقية إلى خطة ${plans.find(p => p.id === selectedPlan)?.name}؟`
              : `Are you sure you want to upgrade to the ${plans.find(p => p.id === selectedPlan)?.name} plan?`
            }
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {i18n.language === 'ar'
              ? 'ستتم محاسبتك على الفور وستصبح الميزات الجديدة متاحة على الفور.'
              : 'You will be charged immediately and new features will be available instantly.'
            }
          </Typography>
          <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
            <Typography variant="h6">
              {plans.find(p => p.id === selectedPlan)?.name}
            </Typography>
            <Typography variant="h4" color="primary">
              ${getPrice(plans.find(p => p.id === selectedPlan))}
              <Typography component="span" variant="body2" color="text.secondary">
                {billingCycle === 'monthly' 
                  ? (i18n.language === 'ar' ? '/شهر' : '/month')
                  : (i18n.language === 'ar' ? '/سنة' : '/year')
                }
              </Typography>
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUpgradeDialog(false)}>
            {i18n.language === 'ar' ? 'إلغاء' : 'Cancel'}
          </Button>
          <Button onClick={confirmUpgrade} variant="contained">
            {i18n.language === 'ar' ? 'تأكيد الترقية' : 'Confirm Upgrade'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SubscriptionPlansPage;

