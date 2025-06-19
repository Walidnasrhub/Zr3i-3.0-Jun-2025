import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import {
  Share,
  MonetizationOn,
  TrendingUp,
  People,
  ContentCopy,
  WhatsApp,
  Facebook,
  Twitter,
  Email,
  Link as LinkIcon,
  EmojiEvents,
  AccountBalance
} from '@mui/icons-material';

const AffiliateRegistrationPage = () => {
  const { i18n } = useTranslation();
  const [isAffiliate, setIsAffiliate] = useState(false); // This would come from user context
  const [registrationData, setRegistrationData] = useState({
    businessName: '',
    contactPerson: '',
    email: '',
    phone: '',
    website: '',
    experience: '',
    targetAudience: '',
    marketingChannels: []
  });
  const [shareDialog, setShareDialog] = useState(false);
  const [referralCode] = useState('ZR3I-REF-12345'); // This would be generated
  
  const affiliateStats = {
    totalReferrals: 15,
    activeSubscriptions: 8,
    totalEarnings: 1250,
    pendingPayouts: 320,
    conversionRate: 53.3
  };

  const recentReferrals = [
    {
      id: 1,
      name: 'Ahmed Al-Rashid',
      email: 'ahmed@farm.com',
      plan: 'Professional',
      status: 'Active',
      commission: 79,
      date: '2024-06-15'
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      email: 'sarah@agri.com',
      plan: 'Basic',
      status: 'Active',
      commission: 29,
      date: '2024-06-10'
    },
    {
      id: 3,
      name: 'Mohamed Hassan',
      email: 'mohamed@crops.com',
      plan: 'Premium',
      status: 'Pending',
      commission: 149,
      date: '2024-06-08'
    }
  ];

  const handleRegistrationChange = (e) => {
    setRegistrationData({
      ...registrationData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmitRegistration = () => {
    // Validate required fields
    if (!registrationData.businessName || !registrationData.contactPerson || !registrationData.email) {
      toast.error(i18n.language === 'ar' ? 'يرجى ملء جميع الحقول المطلوبة' : 'Please fill all required fields');
      return;
    }

    // Submit registration
    setIsAffiliate(true);
    toast.success(i18n.language === 'ar' ? 'تم تسجيلك كشريك بنجاح!' : 'Successfully registered as affiliate!');
  };

  const copyReferralCode = () => {
    navigator.clipboard.writeText(referralCode);
    toast.success(i18n.language === 'ar' ? 'تم نسخ الكود' : 'Code copied to clipboard');
  };

  const shareViaWhatsApp = () => {
    const message = i18n.language === 'ar' 
      ? `انضم إلى زرعي - منصة المراقبة الزراعية الذكية! استخدم كود الإحالة: ${referralCode}`
      : `Join Zr3i - Smart Agricultural Monitoring Platform! Use referral code: ${referralCode}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`);
  };

  const shareViaEmail = () => {
    const subject = i18n.language === 'ar' ? 'انضم إلى زرعي' : 'Join Zr3i';
    const body = i18n.language === 'ar'
      ? `مرحباً،\n\nأدعوك للانضمام إلى زرعي - منصة المراقبة الزراعية الذكية.\n\nاستخدم كود الإحالة: ${referralCode}\n\nزر الموقع: www.zr3i.com`
      : `Hello,\n\nI invite you to join Zr3i - Smart Agricultural Monitoring Platform.\n\nUse referral code: ${referralCode}\n\nVisit: www.zr3i.com`;
    window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
  };

  if (!isAffiliate) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          {i18n.language === 'ar' ? 'انضم لبرنامج الشراكة' : 'Join Affiliate Program'}
        </Typography>

        <Grid container spacing={3}>
          {/* Benefits Section */}
          <Grid item xs={12} md={6}>
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {i18n.language === 'ar' ? 'مزايا برنامج الشراكة' : 'Affiliate Program Benefits'}
                </Typography>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <MonetizationOn color="success" />
                    </ListItemIcon>
                    <ListItemText 
                      primary={i18n.language === 'ar' ? 'عمولة 30% على كل إحالة' : '30% commission on every referral'}
                      secondary={i18n.language === 'ar' ? 'احصل على 30% من قيمة الاشتراك الشهري' : 'Earn 30% of monthly subscription value'}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <TrendingUp color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary={i18n.language === 'ar' ? 'عمولة متكررة' : 'Recurring commissions'}
                      secondary={i18n.language === 'ar' ? 'استمر في الكسب طالما العميل مشترك' : 'Keep earning as long as customer stays subscribed'}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <People color="info" />
                    </ListItemIcon>
                    <ListItemText 
                      primary={i18n.language === 'ar' ? 'دعم تسويقي' : 'Marketing support'}
                      secondary={i18n.language === 'ar' ? 'مواد تسويقية وأدوات ترويجية' : 'Marketing materials and promotional tools'}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <EmojiEvents color="warning" />
                    </ListItemIcon>
                    <ListItemText 
                      primary={i18n.language === 'ar' ? 'مكافآت إضافية' : 'Bonus rewards'}
                      secondary={i18n.language === 'ar' ? 'مكافآت خاصة للشركاء المتميزين' : 'Special bonuses for top performers'}
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>

            {/* Commission Structure */}
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {i18n.language === 'ar' ? 'هيكل العمولات' : 'Commission Structure'}
                </Typography>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>{i18n.language === 'ar' ? 'الخطة' : 'Plan'}</TableCell>
                        <TableCell>{i18n.language === 'ar' ? 'السعر الشهري' : 'Monthly Price'}</TableCell>
                        <TableCell>{i18n.language === 'ar' ? 'عمولتك' : 'Your Commission'}</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell>{i18n.language === 'ar' ? 'الأساسي' : 'Basic'}</TableCell>
                        <TableCell>$29</TableCell>
                        <TableCell><strong>$8.70</strong></TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>{i18n.language === 'ar' ? 'المحترف' : 'Professional'}</TableCell>
                        <TableCell>$79</TableCell>
                        <TableCell><strong>$23.70</strong></TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>{i18n.language === 'ar' ? 'المميز' : 'Premium'}</TableCell>
                        <TableCell>$149</TableCell>
                        <TableCell><strong>$44.70</strong></TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* Registration Form */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {i18n.language === 'ar' ? 'نموذج التسجيل' : 'Registration Form'}
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label={i18n.language === 'ar' ? 'اسم الشركة/المؤسسة *' : 'Business/Organization Name *'}
                      name="businessName"
                      value={registrationData.businessName}
                      onChange={handleRegistrationChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label={i18n.language === 'ar' ? 'اسم الشخص المسؤول *' : 'Contact Person *'}
                      name="contactPerson"
                      value={registrationData.contactPerson}
                      onChange={handleRegistrationChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label={i18n.language === 'ar' ? 'البريد الإلكتروني *' : 'Email *'}
                      name="email"
                      type="email"
                      value={registrationData.email}
                      onChange={handleRegistrationChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label={i18n.language === 'ar' ? 'رقم الهاتف' : 'Phone Number'}
                      name="phone"
                      value={registrationData.phone}
                      onChange={handleRegistrationChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label={i18n.language === 'ar' ? 'الموقع الإلكتروني' : 'Website'}
                      name="website"
                      value={registrationData.website}
                      onChange={handleRegistrationChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel>{i18n.language === 'ar' ? 'الخبرة في التسويق' : 'Marketing Experience'}</InputLabel>
                      <Select
                        name="experience"
                        value={registrationData.experience}
                        onChange={handleRegistrationChange}
                      >
                        <MenuItem value="beginner">{i18n.language === 'ar' ? 'مبتدئ' : 'Beginner'}</MenuItem>
                        <MenuItem value="intermediate">{i18n.language === 'ar' ? 'متوسط' : 'Intermediate'}</MenuItem>
                        <MenuItem value="advanced">{i18n.language === 'ar' ? 'متقدم' : 'Advanced'}</MenuItem>
                        <MenuItem value="expert">{i18n.language === 'ar' ? 'خبير' : 'Expert'}</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      label={i18n.language === 'ar' ? 'الجمهور المستهدف' : 'Target Audience'}
                      name="targetAudience"
                      value={registrationData.targetAudience}
                      onChange={handleRegistrationChange}
                      placeholder={i18n.language === 'ar' ? 'صف جمهورك المستهدف...' : 'Describe your target audience...'}
                    />
                  </Grid>
                </Grid>

                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  onClick={handleSubmitRegistration}
                  sx={{ mt: 3 }}
                >
                  {i18n.language === 'ar' ? 'تسجيل كشريك' : 'Register as Affiliate'}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    );
  }

  // Affiliate Dashboard
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        {i18n.language === 'ar' ? 'لوحة تحكم الشريك' : 'Affiliate Dashboard'}
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <People color="primary" sx={{ mr: 2 }} />
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    {i18n.language === 'ar' ? 'إجمالي الإحالات' : 'Total Referrals'}
                  </Typography>
                  <Typography variant="h4">
                    {affiliateStats.totalReferrals}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <TrendingUp color="success" sx={{ mr: 2 }} />
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    {i18n.language === 'ar' ? 'الاشتراكات النشطة' : 'Active Subscriptions'}
                  </Typography>
                  <Typography variant="h4">
                    {affiliateStats.activeSubscriptions}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <MonetizationOn color="warning" sx={{ mr: 2 }} />
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    {i18n.language === 'ar' ? 'إجمالي الأرباح' : 'Total Earnings'}
                  </Typography>
                  <Typography variant="h4">
                    ${affiliateStats.totalEarnings}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <AccountBalance color="info" sx={{ mr: 2 }} />
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    {i18n.language === 'ar' ? 'المدفوعات المعلقة' : 'Pending Payouts'}
                  </Typography>
                  <Typography variant="h4">
                    ${affiliateStats.pendingPayouts}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <EmojiEvents color="secondary" sx={{ mr: 2 }} />
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    {i18n.language === 'ar' ? 'معدل التحويل' : 'Conversion Rate'}
                  </Typography>
                  <Typography variant="h4">
                    {affiliateStats.conversionRate}%
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Referral Tools */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {i18n.language === 'ar' ? 'أدوات الإحالة' : 'Referral Tools'}
              </Typography>
              
              <Paper sx={{ p: 2, mb: 2, bgcolor: 'grey.50' }}>
                <Typography variant="subtitle2" gutterBottom>
                  {i18n.language === 'ar' ? 'كود الإحالة الخاص بك' : 'Your Referral Code'}
                </Typography>
                <Box display="flex" alignItems="center" gap={1}>
                  <Typography variant="h6" sx={{ fontFamily: 'monospace' }}>
                    {referralCode}
                  </Typography>
                  <Button
                    size="small"
                    startIcon={<ContentCopy />}
                    onClick={copyReferralCode}
                  >
                    {i18n.language === 'ar' ? 'نسخ' : 'Copy'}
                  </Button>
                </Box>
              </Paper>

              <Typography variant="subtitle2" gutterBottom>
                {i18n.language === 'ar' ? 'مشاركة عبر' : 'Share via'}
              </Typography>
              <Grid container spacing={1}>
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<WhatsApp />}
                    onClick={shareViaWhatsApp}
                    sx={{ color: '#25D366', borderColor: '#25D366' }}
                  >
                    WhatsApp
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<Email />}
                    onClick={shareViaEmail}
                  >
                    {i18n.language === 'ar' ? 'بريد إلكتروني' : 'Email'}
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<Facebook />}
                    sx={{ color: '#1877F2', borderColor: '#1877F2' }}
                  >
                    Facebook
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<Twitter />}
                    sx={{ color: '#1DA1F2', borderColor: '#1DA1F2' }}
                  >
                    Twitter
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Referrals */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {i18n.language === 'ar' ? 'الإحالات الحديثة' : 'Recent Referrals'}
              </Typography>
              
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>{i18n.language === 'ar' ? 'العميل' : 'Customer'}</TableCell>
                      <TableCell>{i18n.language === 'ar' ? 'الخطة' : 'Plan'}</TableCell>
                      <TableCell>{i18n.language === 'ar' ? 'العمولة' : 'Commission'}</TableCell>
                      <TableCell>{i18n.language === 'ar' ? 'الحالة' : 'Status'}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recentReferrals.map((referral) => (
                      <TableRow key={referral.id}>
                        <TableCell>
                          <Box>
                            <Typography variant="body2">{referral.name}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              {referral.email}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>{referral.plan}</TableCell>
                        <TableCell>${referral.commission}</TableCell>
                        <TableCell>
                          <Chip
                            label={referral.status}
                            color={referral.status === 'Active' ? 'success' : 'warning'}
                            size="small"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AffiliateRegistrationPage;

