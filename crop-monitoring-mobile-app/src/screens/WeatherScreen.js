import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LineChart } from 'react-native-chart-kit';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { weatherService } from '../../services/apiService';
import * as Location from 'expo-location';

const { width } = Dimensions.get('window');

export default function WeatherScreen({ navigation }) {
  const { theme } = useTheme();
  const { t, isRTL } = useLanguage();

  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [location, setLocation] = useState(null);

  const styles = createStyles(theme, isRTL);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Permission to access location was denied');
        setIsLoading(false);
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation.coords);
      loadWeatherData(currentLocation.coords.latitude, currentLocation.coords.longitude);
    })();
  }, []);

  const loadWeatherData = async (lat, lon) => {
    setIsLoading(true);
    try {
      // Mock data for demonstration
      setCurrentWeather({
        temperature: 28,
        feelsLike: 30,
        humidity: 65,
        pressure: 1012,
        windSpeed: 12,
        windDirection: 'NW',
        visibility: 10,
        uvIndex: 8,
        sunrise: '05:30 AM',
        sunset: '06:45 PM',
        precipitation: 0,
        cloudCover: 20,
        dewPoint: 20,
        condition: 'partly-cloudy',
        description: 'Partly Cloudy',
      });

      setForecast({
        labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'],
        datasets: [
          {
            data: [28, 29, 27, 30, 31, 29, 28],
            name: 'Temperature (°C)',
            color: (opacity = 1) => `rgba(255, 99, 132, ${opacity})`,
          },
          {
            data: [65, 60, 70, 55, 50, 60, 65],
            name: 'Humidity (%)',
            color: (opacity = 1) => `rgba(54, 162, 235, ${opacity})`,
          },
        ],
      });

      // In a real app, you would fetch data from your backend:
      // const currentResult = await weatherService.getCurrentWeather(lat, lon);
      // if (currentResult.success) { setCurrentWeather(currentResult.data); }
      // const forecastResult = await weatherService.getForecast(lat, lon);
      // if (forecastResult.success) { setForecast(forecastResult.data); }

    } catch (error) {
      Alert.alert(t('common.error'), t('monitoring.errorLoadingData'));
      console.error('Error loading weather data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const chartConfig = {
    backgroundColor: theme.colors.surface,
    backgroundGradientFrom: theme.colors.surface,
    backgroundGradientTo: theme.colors.surface,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(31, 41, 55, ${opacity})`, // Text color
    labelColor: (opacity = 1) => `rgba(31, 41, 55, ${opacity})`, // Text color
    style: {
      borderRadius: theme.borderRadius.md,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: theme.colors.primary,
    },
  };

  const getWeatherIcon = (condition) => {
    switch (condition) {
      case 'sunny': return 'sunny-outline';
      case 'partly-cloudy': return 'partly-sunny-outline';
      case 'cloudy': return 'cloudy-outline';
      case 'rainy': return 'rainy-outline';
      case 'stormy': return 'thunderstorm-outline';
      case 'snowy': return 'snow-outline';
      default: return 'partly-sunny-outline';
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>{t('common.loadingData')}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name={isRTL ? "chevron-forward" : "chevron-back"} size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t('monitoring.weatherData')}</Text>
          <View style={{ width: 24 }} />{/* Spacer */}
        </View>

        {currentWeather ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('weather.currentWeather')}</Text>
            <View style={styles.currentWeatherCard}>
              <View style={styles.weatherMainInfo}>
                <Ionicons
                  name={getWeatherIcon(currentWeather.condition)}
                  size={60}
                  color={theme.colors.warning}
                />
                <View style={styles.temperatureContainer}>
                  <Text style={styles.currentTemperature}>{currentWeather.temperature}°C</Text>
                  <Text style={styles.feelsLikeText}>{t('weather.feelsLike')}: {currentWeather.feelsLike}°C</Text>
                </View>
              </View>
              <Text style={styles.weatherDescriptionText}>{currentWeather.description}</Text>

              <View style={styles.weatherDetailsGrid}>
                <View style={styles.detailItem}>
                  <Ionicons name="water-outline" size={20} color={theme.colors.textSecondary} />
                  <Text style={styles.detailItemText}>{t('weather.humidity')}: {currentWeather.humidity}%</Text>
                </View>
                <View style={styles.detailItem}>
                  <Ionicons name="speedometer-outline" size={20} color={theme.colors.textSecondary} />
                  <Text style={styles.detailItemText}>{t('weather.pressure')}: {currentWeather.pressure} hPa</Text>
                </View>
                <View style={styles.detailItem}>
                  <Ionicons name="leaf-outline" size={20} color={theme.colors.textSecondary} />
                  <Text style={styles.detailItemText}>{t('weather.windSpeed')}: {currentWeather.windSpeed} km/h</Text>
                </View>
                <View style={styles.detailItem}>
                  <Ionicons name="compass-outline" size={20} color={theme.colors.textSecondary} />
                  <Text style={styles.detailItemText}>{t('weather.windDirection')}: {currentWeather.windDirection}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Ionicons name="eye-outline" size={20} color={theme.colors.textSecondary} />
                  <Text style={styles.detailItemText}>{t('weather.visibility')}: {currentWeather.visibility} km</Text>
                </View>
                <View style={styles.detailItem}>
                  <Ionicons name="sunny-outline" size={20} color={theme.colors.textSecondary} />
                  <Text style={styles.detailItemText}>{t('weather.uvIndex')}: {currentWeather.uvIndex}</Text>
                </View>
              </View>
            </View>
          </View>
        ) : (
          <View style={styles.noDataContainer}>
            <Ionicons name="cloud-offline-outline" size={80} color={theme.colors.textSecondary} />
            <Text style={styles.noDataText}>{t('monitoring.noData')}</Text>
            <Text style={styles.noDataSubtitle}>Unable to load current weather data.</Text>
          </View>
        )}

        {forecast ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('weather.forecast')}</Text>
            <LineChart
              data={forecast.datasets.length > 0 ? { labels: forecast.labels, datasets: forecast.datasets } : { labels: [], datasets: [{ data: [] }] }}
              width={width - theme.spacing.lg * 2} // from styles.chartContainer
              height={220}
              chartConfig={chartConfig}
              bezier
              style={styles.chart}
            />
          </View>
        ) : (
          <View style={styles.noDataContainer}>
            <Ionicons name="cloud-offline-outline" size={80} color={theme.colors.textSecondary} />
            <Text style={styles.noDataText}>{t('monitoring.noData')}</Text>
            <Text style={styles.noDataSubtitle}>Unable to load weather forecast data.</Text>
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
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  headerTitle: {
    fontSize: theme.fontSize.xl,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  section: {
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  sectionTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
    textAlign: isRTL ? 'right' : 'left',
  },
  currentWeatherCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  weatherMainInfo: {
    flexDirection: isRTL ? 'row-reverse' : 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  temperatureContainer: {
    marginLeft: isRTL ? 0 : theme.spacing.md,
    marginRight: isRTL ? theme.spacing.md : 0,
  },
  currentTemperature: {
    fontSize: theme.fontSize.xxxl,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  feelsLikeText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
  },
  weatherDescriptionText: {
    fontSize: theme.fontSize.lg,
    color: theme.colors.text,
    marginBottom: theme.spacing.lg,
    textAlign: isRTL ? 'right' : 'left',
  },
  weatherDetailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  detailItem: {
    flexDirection: isRTL ? 'row-reverse' : 'row',
    alignItems: 'center',
    width: '48%',
    marginBottom: theme.spacing.sm,
  },
  detailItemText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    marginLeft: isRTL ? 0 : theme.spacing.xs,
    marginRight: isRTL ? theme.spacing.xs : 0,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  loadingText: {
    marginTop: theme.spacing.md,
    color: theme.colors.textSecondary,
  },
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
  },
  noDataText: {
    fontSize: theme.fontSize.lg,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.md,
    textAlign: 'center',
  },
  noDataSubtitle: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.sm,
    textAlign: 'center',
  },
});

