import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { fieldService, weatherService } from '../services/apiService';

const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation }) {
  const { theme } = useTheme();
  const { t, isRTL } = useLanguage();
  const { user } = useAuth();

  const [fields, setFields] = useState([]);
  const [weather, setWeather] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [stats, setStats] = useState({
    totalFields: 0,
    totalArea: 0,
    activeAlerts: 0,
  });
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
    layout: 'grid',
    refreshInterval: 300,
    showNotifications: true,
    compactMode: false,
  });

  const styles = createStyles(theme, isRTL);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      await Promise.all([
        loadFields(),
        loadWeather(),
        loadAlerts(),
        loadDashboardConfig(),
      ]);
    } catch (error) {
      console.error('Failed to load data:', error);
    }
  };

  const loadDashboardConfig = async () => {
    try {
      const savedConfig = await AsyncStorage.getItem(`dashboard_config_${user.id}`);
      if (savedConfig) {
        setDashboardConfig(JSON.parse(savedConfig));
      }
    } catch (error) {
      console.error('Error loading dashboard config:', error);
    }
  };

  const loadFields = async () => {
    const result = await fieldService.getFields();
    if (result.success) {
      setFields(result.data);
      calculateStats(result.data);
    }
  };

  const loadWeather = async () => {
    // Mock weather data for demo
    setWeather({
      temperature: 28,
      humidity: 65,
      windSpeed: 12,
      condition: 'partly-cloudy',
      description: 'Partly Cloudy',
    });
  };

  const loadAlerts = async () => {
    // Mock alerts data for demo
    setAlerts([
      {
        id: 1,
        type: 'weather',
        severity: 'warning',
        title: 'Heavy Rain Expected',
        message: 'Heavy rainfall expected in the next 24 hours',
        timestamp: new Date(),
      },
      {
        id: 2,
        type: 'crop',
        severity: 'info',
        title: 'Irrigation Reminder',
        message: 'Field A requires irrigation',
        timestamp: new Date(),
      },
    ]);
  };

  const calculateStats = (fieldsData) => {
    const totalArea = fieldsData.reduce((sum, field) => sum + (field.size || 0), 0);
    setStats({
      totalFields: fieldsData.length,
      totalArea: totalArea.toFixed(1),
      activeAlerts: alerts.length,
    });
  };

  const onRefresh = async () => {
    setIsRefreshing(true);
    await loadData();
    setIsRefreshing(false);
  };

  const quickActions = [
    {
      id: 'add-field',
      title: t('home.addNewField'),
      icon: 'add-circle-outline',
      color: theme.colors.primary,
      onPress: () => navigation.navigate('Fields'),
    },
    {
      id: 'take-photo',
      title: t('home.takePhoto'),
      icon: 'camera-outline',
      color: theme.colors.secondary,
      onPress: () => navigation.navigate('FarmToFork'),
    },
    {
      id: 'weather',
      title: t('home.checkWeather'),
      icon: 'partly-sunny-outline',
      color: theme.colors.warning,
      onPress: () => navigation.navigate('Weather'),
    },
    {
      id: 'reports',
      title: t('home.viewReports'),
      icon: 'document-text-outline',
      color: theme.colors.info,
      onPress: () => navigation.navigate('Monitoring'),
    },
  ];

  const getWeatherIcon = (condition) => {
    switch (condition) {
      case 'sunny': return 'sunny-outline';
      case 'partly-cloudy': return 'partly-sunny-outline';
      case 'cloudy': return 'cloudy-outline';
      case 'rainy': return 'rainy-outline';
      default: return 'partly-sunny-outline';
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return theme.colors.error;
      case 'warning': return theme.colors.warning;
      case 'info': return theme.colors.info;
      default: return theme.colors.textSecondary;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.welcomeText}>
              {t('home.welcomeMessage', { name: user?.firstName || 'Farmer' })}
            </Text>
            <Text style={styles.dateText}>
              {new Date().toLocaleDateString(isRTL ? 'ar-EG' : 'en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </Text>
          </View>
          <View style={styles.headerButtons}>
            <TouchableOpacity 
              style={styles.headerButton}
              onPress={() => navigation.navigate('DashboardCustomization')}
            >
              <Ionicons name="options-outline" size={28} color={theme.colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.profileButton}>
              <Ionicons name="person-circle-outline" size={32} color={theme.colors.primary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Ionicons name="leaf-outline" size={24} color={theme.colors.primary} />
            <Text style={styles.statValue}>{stats.totalFields}</Text>
            <Text style={styles.statLabel}>{t('home.totalFields')}</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="resize-outline" size={24} color={theme.colors.secondary} />
            <Text style={styles.statValue}>{stats.totalArea}</Text>
            <Text style={styles.statLabel}>{t('home.totalArea')}</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="warning-outline" size={24} color={theme.colors.warning} />
            <Text style={styles.statValue}>{stats.activeAlerts}</Text>
            <Text style={styles.statLabel}>{t('home.activeAlerts')}</Text>
          </View>
        </View>

        {/* Weather Card */}
        {weather && dashboardConfig.widgets.weatherWidget && (
          <View style={styles.weatherCard}>
            <View style={styles.weatherHeader}>
              <Text style={styles.sectionTitle}>{t('home.weatherToday')}</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Weather')}>
                <Text style={styles.viewAllText}>{t('home.forecast')}</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.weatherContent}>
              <View style={styles.weatherMain}>
                <Ionicons
                  name={getWeatherIcon(weather.condition)}
                  size={48}
                  color={theme.colors.warning}
                />
                <View style={styles.weatherInfo}>
                  <Text style={styles.temperature}>{weather.temperature}°C</Text>
                  <Text style={styles.weatherDescription}>{weather.description}</Text>
                </View>
              </View>
              <View style={styles.weatherDetails}>
                <View style={styles.weatherDetail}>
                  <Ionicons name="water-outline" size={16} color={theme.colors.textSecondary} />
                  <Text style={styles.weatherDetailText}>{weather.humidity}%</Text>
                </View>
                <View style={styles.weatherDetail}>
                  <Ionicons name="speedometer-outline" size={16} color={theme.colors.textSecondary} />
                  <Text style={styles.weatherDetailText}>{weather.windSpeed} km/h</Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Quick Actions */}
        {dashboardConfig.widgets.quickActions && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('home.quickActions')}</Text>
            <View style={styles.quickActionsGrid}>
              {quickActions.map((action) => (
                <TouchableOpacity
                  key={action.id}
                  style={styles.quickActionCard}
                  onPress={action.onPress}
                >
                  <View style={[styles.quickActionIcon, { backgroundColor: action.color + '20' }]}>
                    <Ionicons name={action.icon} size={24} color={action.color} />
                  </View>
                  <Text style={styles.quickActionText}>{action.title}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Recent Alerts */}
        {dashboardConfig.widgets.recentAlerts && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{t('home.alerts')}</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Alerts')}>
                <Text style={styles.viewAllText}>{t('common.all')}</Text>
              </TouchableOpacity>
            </View>
            {alerts.length > 0 ? (
              <View style={styles.alertsList}>
                {alerts.slice(0, 3).map((alert) => (
                  <View key={alert.id} style={styles.alertCard}>
                    <View style={[styles.alertIndicator, { backgroundColor: getSeverityColor(alert.severity) }]} />
                    <View style={styles.alertContent}>
                      <Text style={styles.alertTitle}>{alert.title}</Text>
                      <Text style={styles.alertMessage}>{alert.message}</Text>
                      <Text style={styles.alertTime}>
                        {alert.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            ) : (
              <View style={styles.noAlertsContainer}>
                <Ionicons name="checkmark-circle-outline" size={48} color={theme.colors.success} />
                <Text style={styles.noAlertsText}>{t('home.noAlerts')}</Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (theme, isRTL) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: isRTL ? 'row-reverse' : 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
  },
  welcomeText: {
    fontSize: theme.fontSize.lg,
    fontWeight: 'bold',
    color: theme.colors.text,
    textAlign: isRTL ? 'right' : 'left',
  },
  dateText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
    textAlign: isRTL ? 'right' : 'left',
  },
  profileButton: {
    padding: theme.spacing.xs,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  headerButton: {
    padding: theme.spacing.xs,
  },
  statsContainer: {
    flexDirection: isRTL ? 'row-reverse' : 'row',
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    alignItems: 'center',
  },
  statValue: {
    fontSize: theme.fontSize.xl,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginTop: theme.spacing.xs,
  },
  statLabel: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: theme.spacing.xs,
  },
  weatherCard: {
    backgroundColor: theme.colors.surface,
    marginHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  weatherHeader: {
    flexDirection: isRTL ? 'row-reverse' : 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  weatherContent: {
    flexDirection: isRTL ? 'row-reverse' : 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  weatherMain: {
    flexDirection: isRTL ? 'row-reverse' : 'row',
    alignItems: 'center',
  },
  weatherInfo: {
    marginLeft: isRTL ? 0 : theme.spacing.md,
    marginRight: isRTL ? theme.spacing.md : 0,
  },
  temperature: {
    fontSize: theme.fontSize.xxl,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  weatherDescription: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  weatherDetails: {
    alignItems: isRTL ? 'flex-start' : 'flex-end',
  },
  weatherDetail: {
    flexDirection: isRTL ? 'row-reverse' : 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  weatherDetailText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    marginLeft: isRTL ? 0 : theme.spacing.xs,
    marginRight: isRTL ? theme.spacing.xs : 0,
  },
  section: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  sectionHeader: {
    flexDirection: isRTL ? 'row-reverse' : 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: '600',
    color: theme.colors.text,
  },
  viewAllText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.primary,
    fontWeight: '500',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.md,
  },
  quickActionCard: {
    width: (width - theme.spacing.lg * 2 - theme.spacing.md) / 2,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    alignItems: 'center',
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  quickActionText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.text,
    textAlign: 'center',
    fontWeight: '500',
  },
  alertsList: {
    gap: theme.spacing.sm,
  },
  alertCard: {
    flexDirection: isRTL ? 'row-reverse' : 'row',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    alignItems: 'center',
  },
  alertIndicator: {
    width: 4,
    height: '100%',
    borderRadius: 2,
    marginRight: isRTL ? 0 : theme.spacing.md,
    marginLeft: isRTL ? theme.spacing.md : 0,
  },
  alertContent: {
    flex: 1,
  },
  alertTitle: {
    fontSize: theme.fontSize.md,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
    textAlign: isRTL ? 'right' : 'left',
  },
  alertMessage: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
    textAlign: isRTL ? 'right' : 'left',
  },
  alertTime: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textSecondary,
    textAlign: isRTL ? 'right' : 'left',
  },
  noAlertsContainer: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
  },
  noAlertsText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.sm,
  },
});

