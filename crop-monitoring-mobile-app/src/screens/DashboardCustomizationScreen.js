import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LanguageContext } from '../context/LanguageContext';
import { ThemeContext } from '../context/ThemeContext';
import { AuthContext } from '../context/AuthContext';

const DashboardCustomizationScreen = ({ navigation }) => {
  const { t, isRTL } = useContext(LanguageContext);
  const { theme } = useContext(ThemeContext);
  const { user } = useContext(AuthContext);
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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
    },
    layout: 'grid', // 'grid' or 'list'
    refreshInterval: 300, // seconds
    showNotifications: true,
    compactMode: false,
  });

  const availableWidgets = [
    {
      key: 'weatherWidget',
      title: t('dashboard.weather_widget'),
      description: t('dashboard.weather_widget_desc'),
      icon: 'partly-sunny-outline',
      category: 'monitoring',
    },
    {
      key: 'fieldOverview',
      title: t('dashboard.field_overview'),
      description: t('dashboard.field_overview_desc'),
      icon: 'map-outline',
      category: 'fields',
    },
    {
      key: 'recentAlerts',
      title: t('dashboard.recent_alerts'),
      description: t('dashboard.recent_alerts_desc'),
      icon: 'notifications-outline',
      category: 'alerts',
    },
    {
      key: 'quickActions',
      title: t('dashboard.quick_actions'),
      description: t('dashboard.quick_actions_desc'),
      icon: 'flash-outline',
      category: 'actions',
    },
    {
      key: 'satelliteData',
      title: t('dashboard.satellite_data'),
      description: t('dashboard.satellite_data_desc'),
      icon: 'planet-outline',
      category: 'monitoring',
    },
    {
      key: 'cropHealth',
      title: t('dashboard.crop_health'),
      description: t('dashboard.crop_health_desc'),
      icon: 'nutrition-outline',
      category: 'monitoring',
    },
    {
      key: 'riskAnalysis',
      title: t('dashboard.risk_analysis'),
      description: t('dashboard.risk_analysis_desc'),
      icon: 'warning-outline',
      category: 'analytics',
    },
    {
      key: 'farmToFork',
      title: t('dashboard.farm_to_fork'),
      description: t('dashboard.farm_to_fork_desc'),
      icon: 'leaf-outline',
      category: 'traceability',
      premium: true,
    },
    {
      key: 'comparativeAnalysis',
      title: t('dashboard.comparative_analysis'),
      description: t('dashboard.comparative_analysis_desc'),
      icon: 'analytics-outline',
      category: 'analytics',
    },
  ];

  useEffect(() => {
    loadDashboardConfig();
  }, []);

  const loadDashboardConfig = async () => {
    try {
      const savedConfig = await AsyncStorage.getItem(`dashboard_config_${user.id}`);
      if (savedConfig) {
        setDashboardConfig(JSON.parse(savedConfig));
      }
    } catch (error) {
      console.error('Error loading dashboard config:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveDashboardConfig = async () => {
    setSaving(true);
    try {
      await AsyncStorage.setItem(
        `dashboard_config_${user.id}`,
        JSON.stringify(dashboardConfig)
      );
      Alert.alert(t('success'), t('dashboard.config_saved'));
    } catch (error) {
      console.error('Error saving dashboard config:', error);
      Alert.alert(t('error'), t('dashboard.config_save_failed'));
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

  const renderWidgetItem = (widget) => (
    <View key={widget.key} style={[styles.widgetItem, { borderColor: theme.border }]}>
      <View style={styles.widgetInfo}>
        <View style={styles.widgetHeader}>
          <Ionicons 
            name={widget.icon} 
            size={24} 
            color={theme.primary} 
            style={styles.widgetIcon}
          />
          <View style={styles.widgetTitleContainer}>
            <Text style={[styles.widgetTitle, { color: theme.text }]}>
              {widget.title}
              {widget.premium && (
                <Text style={[styles.premiumBadge, { color: theme.warning }]}>
                  {' '}★ {t('premium')}
                </Text>
              )}
            </Text>
            <Text style={[styles.widgetDescription, { color: theme.textSecondary }]}>
              {widget.description}
            </Text>
          </View>
        </View>
      </View>
      <Switch
        value={dashboardConfig.widgets[widget.key]}
        onValueChange={() => toggleWidget(widget.key)}
        trackColor={{ false: theme.disabled, true: theme.primary }}
        thumbColor={dashboardConfig.widgets[widget.key] ? '#fff' : '#f4f3f4'}
      />
    </View>
  );

  const renderLayoutOptions = () => (
    <View style={[styles.section, { backgroundColor: theme.cardBackground }]}>
      <Text style={[styles.sectionTitle, { color: theme.text }]}>
        {t('dashboard.layout_options')}
      </Text>
      <View style={styles.layoutOptions}>
        <TouchableOpacity
          style={[
            styles.layoutOption,
            {
              backgroundColor: dashboardConfig.layout === 'grid' ? theme.primary : theme.surface,
              borderColor: theme.border,
            }
          ]}
          onPress={() => updateLayout('grid')}
        >
          <Ionicons 
            name="grid-outline" 
            size={24} 
            color={dashboardConfig.layout === 'grid' ? '#fff' : theme.text} 
          />
          <Text style={[
            styles.layoutOptionText,
            { color: dashboardConfig.layout === 'grid' ? '#fff' : theme.text }
          ]}>
            {t('dashboard.grid_layout')}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.layoutOption,
            {
              backgroundColor: dashboardConfig.layout === 'list' ? theme.primary : theme.surface,
              borderColor: theme.border,
            }
          ]}
          onPress={() => updateLayout('list')}
        >
          <Ionicons 
            name="list-outline" 
            size={24} 
            color={dashboardConfig.layout === 'list' ? '#fff' : theme.text} 
          />
          <Text style={[
            styles.layoutOptionText,
            { color: dashboardConfig.layout === 'list' ? '#fff' : theme.text }
          ]}>
            {t('dashboard.list_layout')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderRefreshOptions = () => (
    <View style={[styles.section, { backgroundColor: theme.cardBackground }]}>
      <Text style={[styles.sectionTitle, { color: theme.text }]}>
        {t('dashboard.refresh_interval')}
      </Text>
      <View style={styles.refreshOptions}>
        {[60, 300, 600, 1800].map((interval) => (
          <TouchableOpacity
            key={interval}
            style={[
              styles.refreshOption,
              {
                backgroundColor: dashboardConfig.refreshInterval === interval ? theme.primary : theme.surface,
                borderColor: theme.border,
              }
            ]}
            onPress={() => updateRefreshInterval(interval)}
          >
            <Text style={[
              styles.refreshOptionText,
              { color: dashboardConfig.refreshInterval === interval ? '#fff' : theme.text }
            ]}>
              {interval < 60 ? `${interval}s` : `${interval / 60}m`}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderGeneralSettings = () => (
    <View style={[styles.section, { backgroundColor: theme.cardBackground }]}>
      <Text style={[styles.sectionTitle, { color: theme.text }]}>
        {t('dashboard.general_settings')}
      </Text>
      
      <View style={styles.settingItem}>
        <Text style={[styles.settingLabel, { color: theme.text }]}>
          {t('dashboard.show_notifications')}
        </Text>
        <Switch
          value={dashboardConfig.showNotifications}
          onValueChange={(value) => setDashboardConfig(prev => ({ ...prev, showNotifications: value }))}
          trackColor={{ false: theme.disabled, true: theme.primary }}
          thumbColor={dashboardConfig.showNotifications ? '#fff' : '#f4f3f4'}
        />
      </View>
      
      <View style={styles.settingItem}>
        <Text style={[styles.settingLabel, { color: theme.text }]}>
          {t('dashboard.compact_mode')}
        </Text>
        <Switch
          value={dashboardConfig.compactMode}
          onValueChange={(value) => setDashboardConfig(prev => ({ ...prev, compactMode: value }))}
          trackColor={{ false: theme.disabled, true: theme.primary }}
          thumbColor={dashboardConfig.compactMode ? '#fff' : '#f4f3f4'}
        />
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={[styles.loadingText, { color: theme.text }]}>
          {t('loading')}
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons 
            name={isRTL ? "chevron-forward" : "chevron-back"} 
            size={24} 
            color={theme.text} 
          />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>
          {t('dashboard.customize_dashboard')}
        </Text>
        <TouchableOpacity
          style={[styles.saveButton, { backgroundColor: theme.primary }]}
          onPress={saveDashboardConfig}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.saveButtonText}>{t('save')}</Text>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={[styles.section, { backgroundColor: theme.cardBackground }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            {t('dashboard.available_widgets')}
          </Text>
          {availableWidgets.map(renderWidgetItem)}
        </View>

        {renderLayoutOptions()}
        {renderRefreshOptions()}
        {renderGeneralSettings()}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    paddingTop: 50,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 16,
  },
  saveButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    minWidth: 60,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  section: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  widgetItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  widgetInfo: {
    flex: 1,
  },
  widgetHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  widgetIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  widgetTitleContainer: {
    flex: 1,
  },
  widgetTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  premiumBadge: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  widgetDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  layoutOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  layoutOption: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    marginHorizontal: 4,
  },
  layoutOptionText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: 'bold',
  },
  refreshOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  refreshOption: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginHorizontal: 2,
  },
  refreshOptionText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  settingLabel: {
    fontSize: 16,
    flex: 1,
  },
});

export default DashboardCustomizationScreen;

