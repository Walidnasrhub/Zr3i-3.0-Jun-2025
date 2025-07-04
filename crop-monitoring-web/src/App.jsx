import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useTranslation } from 'react-i18next';
import './i18n'; // Import i18n configuration

// Import the Layout component from our new layout folder
import { Layout } from './layout';

// Import HomePage
import HomePage from './pages/HomePage';

// Import VegetationIndicesPage
import VegetationIndicesPage from './pages/monitoring/VegetationIndicesPage';

// Auth pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';

// Dashboard pages
import DashboardPage from './pages/dashboard/DashboardPage';
import ProfilePage from './pages/dashboard/ProfilePage';

// Field pages
import FieldsListPage from './pages/fields/FieldsListPage';
import FieldDetailPage from './pages/fields/FieldDetailPage';
import AddFieldPage from './pages/fields/AddFieldPage';
import EditFieldPage from './pages/fields/EditFieldPage';

// Monitoring pages
import MonitoringOverviewPage from './pages/monitoring/MonitoringOverviewPage';
import SatelliteImageryPage from './pages/monitoring/SatelliteImageryPage';
import WeatherEnvironmentPage from './pages/monitoring/WeatherEnvironmentPage';
import SoilWaterPage from './pages/monitoring/SoilWaterPage';
import CropHealthPage from './pages/monitoring/CropHealthPage';
import RiskAnalysisPage from './pages/monitoring/RiskAnalysisPage';
import MonitoringReportsPage from './pages/monitoring/MonitoringReportsPage';
import MonitoringHistoryPage from './pages/monitoring/MonitoringHistoryPage';
import IndicatorsPage from './pages/monitoring/IndicatorsPage';
import ComparativeAnalysisPage from './pages/monitoring/ComparativeAnalysisPage';

// Subscription pages
import SubscriptionPlansPage from './pages/subscription/SubscriptionPlansPage';
import MySubscriptionPage from './pages/subscription/MySubscriptionPage';
import PaymentHistoryPage from './pages/subscription/PaymentHistoryPage';

// Other pages
import AffiliateRegistrationPage from './pages/AffiliateRegistrationPage';
import AffiliateDashboardPage from './pages/AffiliateDashboardPage';
import ExportPage from './pages/ExportPage';
import DashboardCustomizationPage from './pages/DashboardCustomizationPage';

// Auth Provider
import AuthProvider, { useAuth } from './hooks/useAuth';

import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import './rtl.css';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('zr3i_token');
  console.log("ProtectedRoute - isAuthenticated (direct check):", isAuthenticated);
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

function App() {
  const { i18n } = useTranslation();
  const [language, setLanguage] = useState(i18n.language || 'ar');

  // Create theme with RTL support
  const theme = createTheme({
    direction: language === 'ar' ? 'rtl' : 'ltr',
    typography: {
      fontFamily: language === 'ar' ? 
        '"Cairo", "Noto Sans Arabic", "Arial", sans-serif' : 
        '"Roboto", "Helvetica", "Arial", sans-serif'
    },
    palette: {
      primary: {
        main: '#2e7d32',
      },
      secondary: {
        main: '#ff9800',
      },
    },
  });

  const toggleLanguage = () => {
    const newLanguage = language === 'en' ? 'ar' : 'en';
    setLanguage(newLanguage);
    i18n.changeLanguage(newLanguage);
    
    // Update document direction
    document.dir = newLanguage === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = newLanguage;
  };

  useEffect(() => {
    // Set initial direction and language
    document.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  console.log("App component rendering...");

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <div className="App" dir={language === 'ar' ? 'rtl' : 'ltr'}>
            <Routes>
              {/* Auth routes */}
              <Route path="/login" element={<LoginPage toggleLanguage={toggleLanguage} language={language} />} />
              <Route path="/register" element={<RegisterPage toggleLanguage={toggleLanguage} language={language} />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage toggleLanguage={toggleLanguage} language={language} />} />
              
              {/* Public Home Page */}
              <Route path="/home" element={<HomePage />} />
              
              {/* Vegetation Indices - can be public for demo */}
              <Route path="/vegetation-indices" element={<VegetationIndicesPage />} />

              {/* Protected routes - with Layout wrapper */}
              <Route path="/" element={
                <ProtectedRoute>
                  <Layout language={language} toggleLanguage={toggleLanguage}>
                    <DashboardPage />
                  </Layout>
                </ProtectedRoute>
              } />

              {/* Dashboard */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Layout language={language} toggleLanguage={toggleLanguage}>
                    <DashboardPage />
                  </Layout>
                </ProtectedRoute>
              } />

              {/* Profile */}
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Layout language={language} toggleLanguage={toggleLanguage}>
                    <ProfilePage />
                  </Layout>
                </ProtectedRoute>
              } />

              {/* Fields */}
              <Route path="/fields" element={
                <ProtectedRoute>
                  <Layout language={language} toggleLanguage={toggleLanguage}>
                    <FieldsListPage />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/fields/:id" element={
                <ProtectedRoute>
                  <Layout language={language} toggleLanguage={toggleLanguage}>
                    <FieldDetailPage />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/fields/add" element={
                <ProtectedRoute>
                  <Layout language={language} toggleLanguage={toggleLanguage}>
                    <AddFieldPage />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/fields/:id/edit" element={
                <ProtectedRoute>
                  <Layout language={language} toggleLanguage={toggleLanguage}>
                    <EditFieldPage />
                  </Layout>
                </ProtectedRoute>
              } />

              {/* Monitoring */}
              <Route path="/monitoring" element={
                <ProtectedRoute>
                  <Layout language={language} toggleLanguage={toggleLanguage}>
                    <MonitoringOverviewPage />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/monitoring/satellite" element={
                <ProtectedRoute>
                  <Layout language={language} toggleLanguage={toggleLanguage}>
                    <SatelliteImageryPage />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/monitoring/weather" element={
                <ProtectedRoute>
                  <Layout language={language} toggleLanguage={toggleLanguage}>
                    <WeatherEnvironmentPage />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/monitoring/vegetation-indices" element={
                <ProtectedRoute>
                  <Layout language={language} toggleLanguage={toggleLanguage}>
                    <VegetationIndicesPage />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/monitoring/soil-water" element={
                <ProtectedRoute>
                  <Layout language={language} toggleLanguage={toggleLanguage}>
                    <SoilWaterPage />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/monitoring/crop-health" element={
                <ProtectedRoute>
                  <Layout language={language} toggleLanguage={toggleLanguage}>
                    <CropHealthPage />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/monitoring/risk-analysis" element={
                <ProtectedRoute>
                  <Layout language={language} toggleLanguage={toggleLanguage}>
                    <RiskAnalysisPage />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/monitoring/reports" element={
                <ProtectedRoute>
                  <Layout language={language} toggleLanguage={toggleLanguage}>
                    <MonitoringReportsPage />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/monitoring/history" element={
                <ProtectedRoute>
                  <Layout language={language} toggleLanguage={toggleLanguage}>
                    <MonitoringHistoryPage />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/monitoring/indicators" element={
                <ProtectedRoute>
                  <Layout language={language} toggleLanguage={toggleLanguage}>
                    <IndicatorsPage />
                  </Layout>
                </ProtectedRoute>
              } />

              {/* Comparative Analysis */}
              <Route path="/comparative-analysis" element={
                <ProtectedRoute>
                  <Layout language={language} toggleLanguage={toggleLanguage}>
                    <ComparativeAnalysisPage />
                  </Layout>
                </ProtectedRoute>
              } />

              {/* Export */}
              <Route path="/export" element={
                <ProtectedRoute>
                  <Layout language={language} toggleLanguage={toggleLanguage}>
                    <ExportPage />
                  </Layout>
                </ProtectedRoute>
              } />

              {/* Dashboard Customization */}
              <Route path="/dashboard-customization" element={
                <ProtectedRoute>
                  <Layout language={language} toggleLanguage={toggleLanguage}>
                    <DashboardCustomizationPage />
                  </Layout>
                </ProtectedRoute>
              } />

              {/* Subscription */}
              <Route path="/subscription/plans" element={
                <ProtectedRoute>
                  <Layout language={language} toggleLanguage={toggleLanguage}>
                    <SubscriptionPlansPage />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/subscription/my-subscription" element={
                <ProtectedRoute>
                  <Layout language={language} toggleLanguage={toggleLanguage}>
                    <MySubscriptionPage />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/subscription/payment-history" element={
                <ProtectedRoute>
                  <Layout language={language} toggleLanguage={toggleLanguage}>
                    <PaymentHistoryPage />
                  </Layout>
                </ProtectedRoute>
              } />

              {/* Affiliate */}
              <Route path="/affiliate/register" element={
                <ProtectedRoute>
                  <Layout language={language} toggleLanguage={toggleLanguage}>
                    <AffiliateRegistrationPage />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/affiliate/dashboard" element={
                <ProtectedRoute>
                  <Layout language={language} toggleLanguage={toggleLanguage}>
                    <AffiliateDashboardPage />
                  </Layout>
                </ProtectedRoute>
              } />
            </Routes>
            
            <ToastContainer
              position="top-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={language === 'ar'}
              pauseOnFocusLoss
              draggable
              pauseOnHover
            />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;

