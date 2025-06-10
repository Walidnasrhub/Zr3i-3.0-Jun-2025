import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import { I18nextProvider } from 'react-i18next';
import i18n from './lib/i18n';
import './App.css';

// Layout components
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import Footer from './components/layout/Footer';

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

// Subscription pages
import SubscriptionPlansPage from './pages/subscription/SubscriptionPlansPage';
import MySubscriptionPage from './pages/subscription/MySubscriptionPage';
import PaymentHistoryPage from './pages/subscription/PaymentHistoryPage';

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
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
    localStorage.setItem('language', language);
    i18n.changeLanguage(language);
  }, [language]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  };

  return (
    <I18nextProvider i18n={i18n}>
      <AuthProvider>
        <Router>
          <div className={`app-container ${language === 'ar' ? 'rtl' : 'ltr'}`}>
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={
                <>
                  <Header toggleLanguage={toggleLanguage} language={language} />
                  <div className="main-content">
                    <LoginPage />
                  </div>
                  <Footer language={language} />
                </>
              } />
              <Route path="/register" element={
                <>
                  <Header toggleLanguage={toggleLanguage} language={language} />
                  <div className="main-content">
                    <RegisterPage />
                  </div>
                  <Footer language={language} />
                </>
              } />
              <Route path="/forgot-password" element={
                <>
                  <Header toggleLanguage={toggleLanguage} language={language} />
                  <div className="main-content">
                    <ForgotPasswordPage />
                  </div>
                  <Footer language={language} />
                </>
              } />

              {/* Protected routes */}
              <Route path="/" element={
                <ProtectedRoute>
                  <div className="flex h-screen overflow-hidden">
                    <Sidebar open={sidebarOpen} language={language} />
                    <div className="flex flex-col flex-1 overflow-hidden">
                      <Header 
                        toggleSidebar={toggleSidebar} 
                        toggleLanguage={toggleLanguage} 
                        language={language} 
                      />
                      <main className="flex-1 overflow-y-auto p-4 md:p-6">
                        <DashboardPage />
                      </main>
                      <Footer language={language} />
                    </div>
                  </div>
                </ProtectedRoute>
              } />

              {/* Dashboard */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <div className="flex h-screen overflow-hidden">
                    <Sidebar open={sidebarOpen} language={language} />
                    <div className="flex flex-col flex-1 overflow-hidden">
                      <Header 
                        toggleSidebar={toggleSidebar} 
                        toggleLanguage={toggleLanguage} 
                        language={language} 
                      />
                      <main className="flex-1 overflow-y-auto p-4 md:p-6">
                        <DashboardPage />
                      </main>
                      <Footer language={language} />
                    </div>
                  </div>
                </ProtectedRoute>
              } />

              {/* Profile */}
              <Route path="/profile" element={
                <ProtectedRoute>
                  <div className="flex h-screen overflow-hidden">
                    <Sidebar open={sidebarOpen} language={language} />
                    <div className="flex flex-col flex-1 overflow-hidden">
                      <Header 
                        toggleSidebar={toggleSidebar} 
                        toggleLanguage={toggleLanguage} 
                        language={language} 
                      />
                      <main className="flex-1 overflow-y-auto p-4 md:p-6">
                        <ProfilePage />
                      </main>
                      <Footer language={language} />
                    </div>
                  </div>
                </ProtectedRoute>
              } />

              {/* Fields */}
              <Route path="/fields" element={
                <ProtectedRoute>
                  <div className="flex h-screen overflow-hidden">
                    <Sidebar open={sidebarOpen} language={language} />
                    <div className="flex flex-col flex-1 overflow-hidden">
                      <Header 
                        toggleSidebar={toggleSidebar} 
                        toggleLanguage={toggleLanguage} 
                        language={language} 
                      />
                      <main className="flex-1 overflow-y-auto p-4 md:p-6">
                        <FieldsListPage />
                      </main>
                      <Footer language={language} />
                    </div>
                  </div>
                </ProtectedRoute>
              } />
              <Route path="/fields/:id" element={
                <ProtectedRoute>
                  <div className="flex h-screen overflow-hidden">
                    <Sidebar open={sidebarOpen} language={language} />
                    <div className="flex flex-col flex-1 overflow-hidden">
                      <Header 
                        toggleSidebar={toggleSidebar} 
                        toggleLanguage={toggleLanguage} 
                        language={language} 
                      />
                      <main className="flex-1 overflow-y-auto p-4 md:p-6">
                        <FieldDetailPage />
                      </main>
                      <Footer language={language} />
                    </div>
                  </div>
                </ProtectedRoute>
              } />
              <Route path="/fields/add" element={
                <ProtectedRoute>
                  <div className="flex h-screen overflow-hidden">
                    <Sidebar open={sidebarOpen} language={language} />
                    <div className="flex flex-col flex-1 overflow-hidden">
                      <Header 
                        toggleSidebar={toggleSidebar} 
                        toggleLanguage={toggleLanguage} 
                        language={language} 
                      />
                      <main className="flex-1 overflow-y-auto p-4 md:p-6">
                        <AddFieldPage />
                      </main>
                      <Footer language={language} />
                    </div>
                  </div>
                </ProtectedRoute>
              } />
              <Route path="/fields/:id/edit" element={
                <ProtectedRoute>
                  <div className="flex h-screen overflow-hidden">
                    <Sidebar open={sidebarOpen} language={language} />
                    <div className="flex flex-col flex-1 overflow-hidden">
                      <Header 
                        toggleSidebar={toggleSidebar} 
                        toggleLanguage={toggleLanguage} 
                        language={language} 
                      />
                      <main className="flex-1 overflow-y-auto p-4 md:p-6">
                        <EditFieldPage />
                      </main>
                      <Footer language={language} />
                    </div>
                  </div>
                </ProtectedRoute>
              } />

              {/* Monitoring */}
              <Route path="/monitoring" element={
                <ProtectedRoute>
                  <div className="flex h-screen overflow-hidden">
                    <Sidebar open={sidebarOpen} language={language} />
                    <div className="flex flex-col flex-1 overflow-hidden">
                      <Header 
                        toggleSidebar={toggleSidebar} 
                        toggleLanguage={toggleLanguage} 
                        language={language} 
                      />
                      <main className="flex-1 overflow-y-auto p-4 md:p-6">
                        <MonitoringOverviewPage />
                      </main>
                      <Footer language={language} />
                    </div>
                  </div>
                </ProtectedRoute>
              } />
              <Route path="/monitoring/satellite" element={
                <ProtectedRoute>
                  <div className="flex h-screen overflow-hidden">
                    <Sidebar open={sidebarOpen} language={language} />
                    <div className="flex flex-col flex-1 overflow-hidden">
                      <Header 
                        toggleSidebar={toggleSidebar} 
                        toggleLanguage={toggleLanguage} 
                        language={language} 
                      />
                      <main className="flex-1 overflow-y-auto p-4 md:p-6">
                        <SatelliteImageryPage />
                      </main>
                      <Footer language={language} />
                    </div>
                  </div>
                </ProtectedRoute>
              } />
              <Route path="/monitoring/weather" element={
                <ProtectedRoute>
                  <div className="flex h-screen overflow-hidden">
                    <Sidebar open={sidebarOpen} language={language} />
                    <div className="flex flex-col flex-1 overflow-hidden">
                      <Header 
                        toggleSidebar={toggleSidebar} 
                        toggleLanguage={toggleLanguage} 
                        language={language} 
                      />
                      <main className="flex-1 overflow-y-auto p-4 md:p-6">
                        <WeatherEnvironmentPage />
                      </main>
                      <Footer language={language} />
                    </div>
                  </div>
                </ProtectedRoute>
              } />
              <Route path="/monitoring/soil-water" element={
                <ProtectedRoute>
                  <div className="flex h-screen overflow-hidden">
                    <Sidebar open={sidebarOpen} language={language} />
                    <div className="flex flex-col flex-1 overflow-hidden">
                      <Header 
                        toggleSidebar={toggleSidebar} 
                        toggleLanguage={toggleLanguage} 
                        language={language} 
                      />
                      <main className="flex-1 overflow-y-auto p-4 md:p-6">
                        <SoilWaterPage />
                      </main>
                      <Footer language={language} />
                    </div>
                  </div>
                </ProtectedRoute>
              } />
              <Route path="/monitoring/crop-health" element={
                <ProtectedRoute>
                  <div className="flex h-screen overflow-hidden">
                    <Sidebar open={sidebarOpen} language={language} />
                    <div className="flex flex-col flex-1 overflow-hidden">
                      <Header 
                        toggleSidebar={toggleSidebar} 
                        toggleLanguage={toggleLanguage} 
                        language={language} 
                      />
                      <main className="flex-1 overflow-y-auto p-4 md:p-6">
                        <CropHealthPage />
                      </main>
                      <Footer language={language} />
                    </div>
                  </div>
                </ProtectedRoute>
              } />
              <Route path="/monitoring/risk-analysis" element={
                <ProtectedRoute>
                  <div className="flex h-screen overflow-hidden">
                    <Sidebar open={sidebarOpen} language={language} />
                    <div className="flex flex-col flex-1 overflow-hidden">
                      <Header 
                        toggleSidebar={toggleSidebar} 
                        toggleLanguage={toggleLanguage} 
                        language={language} 
                      />
                      <main className="flex-1 overflow-y-auto p-4 md:p-6">
                        <RiskAnalysisPage />
                      </main>
                      <Footer language={language} />
                    </div>
                  </div>
                </ProtectedRoute>
              } />
              <Route path="/monitoring/reports" element={
                <ProtectedRoute>
                  <div className="flex h-screen overflow-hidden">
                    <Sidebar open={sidebarOpen} language={language} />
                    <div className="flex flex-col flex-1 overflow-hidden">
                      <Header 
                        toggleSidebar={toggleSidebar} 
                        toggleLanguage={toggleLanguage} 
                        language={language} 
                      />
                      <main className="flex-1 overflow-y-auto p-4 md:p-6">
                        <MonitoringReportsPage />
                      </main>
                      <Footer language={language} />
                    </div>
                  </div>
                </ProtectedRoute>
              } />
              <Route path="/monitoring/history" element={
                <ProtectedRoute>
                  <div className="flex h-screen overflow-hidden">
                    <Sidebar open={sidebarOpen} language={language} />
                    <div className="flex flex-col flex-1 overflow-hidden">
                      <Header 
                        toggleSidebar={toggleSidebar} 
                        toggleLanguage={toggleLanguage} 
                        language={language} 
                      />
                      <main className="flex-1 overflow-y-auto p-4 md:p-6">
                        <MonitoringHistoryPage />
                      </main>
                      <Footer language={language} />
                    </div>
                  </div>
                </ProtectedRoute>
              } />
              <Route path="/monitoring/indicators" element={
                <ProtectedRoute>
                  <div className="flex h-screen overflow-hidden">
                    <Sidebar open={sidebarOpen} language={language} />
                    <div className="flex flex-col flex-1 overflow-hidden">
                      <Header 
                        toggleSidebar={toggleSidebar} 
                        toggleLanguage={toggleLanguage} 
                        language={language} 
                      />
                      <main className="flex-1 overflow-y-auto p-4 md:p-6">
                        <IndicatorsPage />
                      </main>
                      <Footer language={language} />
                    </div>
                  </div>
                </ProtectedRoute>
              } />

              {/* Subscription */}
              <Route path="/subscription/plans" element={
                <ProtectedRoute>
                  <div className="flex h-screen overflow-hidden">
                    <Sidebar open={sidebarOpen} language={language} />
                    <div className="flex flex-col flex-1 overflow-hidden">
                      <Header 
                        toggleSidebar={toggleSidebar} 
                        toggleLanguage={toggleLanguage} 
                        language={language} 
                      />
                      <main className="flex-1 overflow-y-auto p-4 md:p-6">
                        <SubscriptionPlansPage />
                      </main>
                      <Footer language={language} />
                    </div>
                  </div>
                </ProtectedRoute>
              } />
              <Route path="/subscription/my-subscription" element={
                <ProtectedRoute>
                  <div className="flex h-screen overflow-hidden">
                    <Sidebar open={sidebarOpen} language={language} />
                    <div className="flex flex-col flex-1 overflow-hidden">
                      <Header 
                        toggleSidebar={toggleSidebar} 
                        toggleLanguage={toggleLanguage} 
                        language={language} 
                      />
                      <main className="flex-1 overflow-y-auto p-4 md:p-6">
                        <MySubscriptionPage />
                      </main>
                      <Footer language={language} />
                    </div>
                  </div>
                </ProtectedRoute>
              } />
              <Route path="/subscription/payment-history" element={
                <ProtectedRoute>
                  <div className="flex h-screen overflow-hidden">
                    <Sidebar open={sidebarOpen} language={language} />
                    <div className="flex flex-col flex-1 overflow-hidden">
                      <Header 
                        toggleSidebar={toggleSidebar} 
                        toggleLanguage={toggleLanguage} 
                        language={language} 
                      />
                      <main className="flex-1 overflow-y-auto p-4 md:p-6">
                        <PaymentHistoryPage />
                      </main>
                      <Footer language={language} />
                    </div>
                  </div>
                </ProtectedRoute>
              } />

              {/* Redirect to dashboard if no route matches */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </I18nextProvider>
  );
}

export default App;



// This is a test comment to trigger Vercel deployment


