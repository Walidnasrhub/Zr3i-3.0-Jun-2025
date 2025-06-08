import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import './DashboardCustomization.css';

const DashboardCustomization = ({ onSave, onClose }) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  
  const [dashboardConfig, setDashboardConfig] = useState({
    widgets: {
      weatherWidget: true,
      fieldOverview: true,
      recentAlerts: true,
      quickActions: true,
      satelliteData: true,
      cropHealth: true,
      riskAnalysis: false,
      farmToFork: false,
      comparativeAnalysis: false,
      marketPrices: false,
    },
    layout: 'grid', // 'grid' or 'list'
    refreshInterval: 300, // seconds
    showNotifications: true,
    compactMode: false,
    theme: 'light', // 'light' or 'dark'
  });

  const [saving, setSaving] = useState(false);

  const availableWidgets = [
    {
      key: 'weatherWidget',
      title: t('dashboard.weatherWidget'),
      description: t('dashboard.weatherWidgetDesc'),
      icon: '🌤️',
      category: 'monitoring',
    },
    {
      key: 'fieldOverview',
      title: t('dashboard.fieldOverview'),
      description: t('dashboard.fieldOverviewDesc'),
      icon: '🗺️',
      category: 'fields',
    },
    {
      key: 'recentAlerts',
      title: t('dashboard.recentAlerts'),
      description: t('dashboard.recentAlertsDesc'),
      icon: '🔔',
      category: 'alerts',
    },
    {
      key: 'quickActions',
      title: t('dashboard.quickActions'),
      description: t('dashboard.quickActionsDesc'),
      icon: '⚡',
      category: 'actions',
    },
    {
      key: 'satelliteData',
      title: t('dashboard.satelliteData'),
      description: t('dashboard.satelliteDataDesc'),
      icon: '🛰️',
      category: 'monitoring',
    },
    {
      key: 'cropHealth',
      title: t('dashboard.cropHealth'),
      description: t('dashboard.cropHealthDesc'),
      icon: '🌱',
      category: 'monitoring',
    },
    {
      key: 'riskAnalysis',
      title: t('dashboard.riskAnalysis'),
      description: t('dashboard.riskAnalysisDesc'),
      icon: '⚠️',
      category: 'analytics',
    },
    {
      key: 'farmToFork',
      title: t('dashboard.farmToFork'),
      description: t('dashboard.farmToForkDesc'),
      icon: '🍃',
      category: 'traceability',
      premium: true,
    },
    {
      key: 'comparativeAnalysis',
      title: t('dashboard.comparativeAnalysis'),
      description: t('dashboard.comparativeAnalysisDesc'),
      icon: '📊',
      category: 'analytics',
    },
    {
      key: 'marketPrices',
      title: t('dashboard.marketPrices'),
      description: t('dashboard.marketPricesDesc'),
      icon: '💰',
      category: 'market',
    },
  ];

  useEffect(() => {
    loadDashboardConfig();
  }, []);

  const loadDashboardConfig = () => {
    try {
      const savedConfig = localStorage.getItem('dashboard_config');
      if (savedConfig) {
        setDashboardConfig(JSON.parse(savedConfig));
      }
    } catch (error) {
      console.error('Error loading dashboard config:', error);
    }
  };

  const saveDashboardConfig = async () => {
    setSaving(true);
    try {
      localStorage.setItem('dashboard_config', JSON.stringify(dashboardConfig));
      if (onSave) {
        onSave(dashboardConfig);
      }
      alert(t('dashboard.configSaved'));
    } catch (error) {
      console.error('Error saving dashboard config:', error);
      alert(t('dashboard.configSaveFailed'));
    } finally {
      setSaving(false);
    }
  };

  const toggleWidget = (widgetKey) => {
    setDashboardConfig(prev => ({
      ...prev,
      widgets: {
        ...prev.widgets,
        [widgetKey]: !prev.widgets[widgetKey],
      },
    }));
  };

  const updateLayout = (layout) => {
    setDashboardConfig(prev => ({
      ...prev,
      layout,
    }));
  };

  const updateRefreshInterval = (interval) => {
    setDashboardConfig(prev => ({
      ...prev,
      refreshInterval: interval,
    }));
  };

  const updateTheme = (theme) => {
    setDashboardConfig(prev => ({
      ...prev,
      theme,
    }));
  };

  const groupedWidgets = availableWidgets.reduce((groups, widget) => {
    const category = widget.category;
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(widget);
    return groups;
  }, {});

  return (
    <div className={`dashboard-customization ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className="customization-header">
        <h2>{t('dashboard.customizeDashboard')}</h2>
        <div className="header-actions">
          <button 
            className="save-btn"
            onClick={saveDashboardConfig}
            disabled={saving}
          >
            {saving ? t('common.saving') : t('common.save')}
          </button>
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>
      </div>

      <div className="customization-content">
        <div className="customization-section">
          <h3>{t('dashboard.availableWidgets')}</h3>
          
          {Object.entries(groupedWidgets).map(([category, widgets]) => (
            <div key={category} className="widget-category">
              <h4 className="category-title">
                {t(`dashboard.category_${category}`, category.charAt(0).toUpperCase() + category.slice(1))}
              </h4>
              <div className="widgets-grid">
                {widgets.map((widget) => (
                  <div key={widget.key} className="widget-item">
                    <div className="widget-info">
                      <div className="widget-header">
                        <span className="widget-icon">{widget.icon}</span>
                        <div className="widget-details">
                          <span className="widget-title">
                            {widget.title}
                            {widget.premium && (
                              <span className="premium-badge">★ {t('common.premium')}</span>
                            )}
                          </span>
                          <span className="widget-description">{widget.description}</span>
                        </div>
                      </div>
                    </div>
                    <label className="widget-toggle">
                      <input
                        type="checkbox"
                        checked={dashboardConfig.widgets[widget.key]}
                        onChange={() => toggleWidget(widget.key)}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="customization-section">
          <h3>{t('dashboard.layoutOptions')}</h3>
          <div className="layout-options">
            <div 
              className={`layout-option ${dashboardConfig.layout === 'grid' ? 'selected' : ''}`}
              onClick={() => updateLayout('grid')}
            >
              <div className="layout-preview grid-preview">
                <div className="preview-item"></div>
                <div className="preview-item"></div>
                <div className="preview-item"></div>
                <div className="preview-item"></div>
              </div>
              <span>{t('dashboard.gridLayout')}</span>
            </div>
            
            <div 
              className={`layout-option ${dashboardConfig.layout === 'list' ? 'selected' : ''}`}
              onClick={() => updateLayout('list')}
            >
              <div className="layout-preview list-preview">
                <div className="preview-item"></div>
                <div className="preview-item"></div>
                <div className="preview-item"></div>
              </div>
              <span>{t('dashboard.listLayout')}</span>
            </div>
          </div>
        </div>

        <div className="customization-section">
          <h3>{t('dashboard.refreshInterval')}</h3>
          <div className="refresh-options">
            {[60, 300, 600, 1800].map((interval) => (
              <button
                key={interval}
                className={`refresh-option ${dashboardConfig.refreshInterval === interval ? 'selected' : ''}`}
                onClick={() => updateRefreshInterval(interval)}
              >
                {interval < 60 ? `${interval}s` : `${interval / 60}m`}
              </button>
            ))}
          </div>
        </div>

        <div className="customization-section">
          <h3>{t('dashboard.generalSettings')}</h3>
          
          <div className="setting-item">
            <span className="setting-label">{t('dashboard.showNotifications')}</span>
            <label className="setting-toggle">
              <input
                type="checkbox"
                checked={dashboardConfig.showNotifications}
                onChange={(e) => setDashboardConfig(prev => ({ 
                  ...prev, 
                  showNotifications: e.target.checked 
                }))}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
          
          <div className="setting-item">
            <span className="setting-label">{t('dashboard.compactMode')}</span>
            <label className="setting-toggle">
              <input
                type="checkbox"
                checked={dashboardConfig.compactMode}
                onChange={(e) => setDashboardConfig(prev => ({ 
                  ...prev, 
                  compactMode: e.target.checked 
                }))}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>

          <div className="setting-item">
            <span className="setting-label">{t('dashboard.theme')}</span>
            <select 
              value={dashboardConfig.theme}
              onChange={(e) => updateTheme(e.target.value)}
              className="theme-selector"
            >
              <option value="light">{t('dashboard.lightTheme')}</option>
              <option value="dark">{t('dashboard.darkTheme')}</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardCustomization;

