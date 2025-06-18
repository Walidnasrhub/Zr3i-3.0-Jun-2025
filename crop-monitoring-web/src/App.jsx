import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import { I18nextProvider } from 'react-i18next';
import i18n from './lib/i18n';
import './App.css';

// Import the Layout component from our new layout folder
import { Layout } from './layout';

// Auth pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';

// Dashboard pages
import DashboardPage from './pages/dashboard/DashboardPage';
import ProfilePage from './pages/dashboard/ProfilePage';

// Field management pages
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

// Affiliate pages
import AffiliateRegistrationPage from './pages/AffiliateRegistrationPage';
import AffiliateDashboardPage from './pages/AffiliateDashboardPage';

// Export pages
import ExportPage from './pages/ExportPage';

// Dashboard Customization
import DashboardCustomizationPage from './pages/DashboardCustomizationPage';

// Protected route component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  const [language, setLanguage] = useState(localStorage.getItem('language') || 'en');

  useEffect(() => {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
    localStorage.setItem('language', language);
    i18n.changeLanguage(language);
  }, [language]);

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  };

  return (
    <I18nextProvider i18n={i18n}>
      <AuthProvider>
        <Router>
          <div className={`app-container ${language === 'ar' ? 'rtl' : 'ltr'}`}>
            <Routes>
              {/* Public routes - without Layout wrapper */}
              <Route path="/login" element={<LoginPage toggleLanguage={toggleLanguage} language={language} />} />
              <Route path="/register" element={<RegisterPage toggleLanguage={toggleLanguage} language={language} />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage toggleLanguage={toggleLanguage} language={language} />} />

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
              <Route path="/comparative-analysis" element={
                <ProtectedRoute>
                  <Layout language={language} toggleLanguage={toggleLanguage}>
                    <ComparativeAnalysisPage />
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

              {/* Affiliate Program */}
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

              {/* Fallback route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </I18nextProvider>
  );
}

export default App;


// Trigger Vercel deployment


