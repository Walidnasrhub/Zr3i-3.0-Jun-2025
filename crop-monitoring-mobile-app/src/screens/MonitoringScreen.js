import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';

export default function MonitoringScreen({ navigation }) {
  const { theme } = useTheme();
  const { t, isRTL } = useLanguage();

  const styles = createStyles(theme, isRTL);

  const monitoringOptions = [
    {
      id: 'satellite',
      title: t('monitoring.satelliteImagery'),
      icon: 'planet-outline',
      screen: 'SatelliteImagery',
    },
    {
      id: 'weather',
      title: t('monitoring.weatherData'),
      icon: 'partly-sunny-outline',
      screen: 'Weather',
    },
    {
      id: 'soil',
      title: t('monitoring.soilData'),
      icon: 'leaf-outline',
      screen: 'SoilWater',
    },
    {
      id: 'cropHealth',
      title: t('monitoring.cropHealth'),
      icon: 'nutrition-outline',
      screen: 'CropHealth',
    },
    {
      id: 'riskAnalysis',
      title: t('monitoring.riskAnalysis'),
      icon: 'warning-outline',
      screen: 'RiskAnalysis',
    },
    {
      id: 'comparativeAnalysis',
      title: t('monitoring.comparativeAnalysis'),
      icon: 'analytics-outline',
      screen: 'ComparativeAnalysis',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name={isRTL ? "chevron-forward" : "chevron-back"} size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('navigation.monitoring')}</Text>
        <View style={{ width: 24 }} />{/* Spacer */}
      </View>

      <View style={styles.optionsContainer}>
        {monitoringOptions.map((option) => (
          <TouchableOpacity
            key={option.id}
            style={styles.optionCard}
            onPress={() => navigation.navigate(option.screen)}
          >
            <Ionicons name={option.icon} size={40} color={theme.colors.primary} />
            <Text style={styles.optionText}>{option.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

const createStyles = (theme, isRTL) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: isRTL ? 'row-reverse' : 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  headerTitle: {
    fontSize: theme.fontSize.xl,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    padding: theme.spacing.md,
  },
  optionCard: {
    width: '45%', // Adjust as needed
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    margin: theme.spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  optionText: {
    marginTop: theme.spacing.md,
    fontSize: theme.fontSize.md,
    fontWeight: '600',
    color: theme.colors.text,
    textAlign: 'center',
  },
});

