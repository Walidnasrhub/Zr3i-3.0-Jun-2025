import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { LineChart } from 'react-native-chart-kit';
import { useTranslation } from 'react-i18next';
import { api } from '../services/apiService';

const screenWidth = Dimensions.get('window').width;

function FieldDetailScreen() {
  const { t } = useTranslation();
  const route = useRoute();
  const { fieldId } = route.params;
  const [field, setField] = useState(null);
  const [satelliteData, setSatelliteData] = useState([]);
  const [weatherData, setWeatherData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFieldDetails = async () => {
      try {
        const fieldResponse = await api.get(`/api/fields/${fieldId}`);
        setField(fieldResponse.data);

        // Mock data for satellite and weather for now
        // In a real app, these would be fetched from the backend based on fieldId
        setSatelliteData([
          { date: '2024-01-01', ndvi: 0.6, ndmi: 0.4, ndwi: 0.3 },
          { date: '2024-01-15', ndvi: 0.7, ndmi: 0.5, ndwi: 0.4 },
          { date: '2024-02-01', ndvi: 0.65, ndmi: 0.45, ndwi: 0.35 },
          { date: '2024-02-15', ndvi: 0.75, ndmi: 0.55, ndwi: 0.45 },
          { date: '2024-03-01', ndvi: 0.8, ndmi: 0.6, ndwi: 0.5 },
        ]);

        setWeatherData([
          { date: '2024-01-01', temp: 15, rainfall: 5 },
          { date: '2024-01-15', temp: 18, rainfall: 2 },
          { date: '2024-02-01', temp: 16, rainfall: 8 },
          { date: '2024-02-15', temp: 20, rainfall: 0 },
          { date: '2024-03-01', temp: 22, rainfall: 1 },
        ]);

      } catch (err) {
        setError(t('common.errorFetchingData'));
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFieldDetails();
  }, [fieldId, t]);

  if (loading) {
    return <Text style={styles.loadingText}>{t('common.loading')}</Text>;
  }

  if (error) {
    return <Text style={styles.errorText}>{error}</Text>;
  }

  if (!field) {
    return <Text style={styles.noDataText}>{t('fieldDetail.noFieldFound')}</Text>;
  }

  const chartConfig = {
    backgroundColor: '#e26a00',
    backgroundGradientFrom: '#fb8c00',
    backgroundGradientTo: '#ffa726',
    decimalPlaces: 2, // optional, defaults to 2dp
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    style: {
      borderRadius: 16
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: '#ffa726'
    }
  };

  const ndviData = {
    labels: satelliteData.map(d => d.date),
    datasets: [
      {
        data: satelliteData.map(d => d.ndvi),
        color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // optional
        strokeWidth: 2 // optional
      }
    ],
    legend: [t('fieldDetail.ndvi')] // optional
  };

  const ndmiData = {
    labels: satelliteData.map(d => d.date),
    datasets: [
      {
        data: satelliteData.map(d => d.ndmi),
        color: (opacity = 1) => `rgba(255, 99, 132, ${opacity})`, // optional
        strokeWidth: 2 // optional
      }
    ],
    legend: [t('fieldDetail.ndmi')] // optional
  };

  const ndwiData = {
    labels: satelliteData.map(d => d.date),
    datasets: [
      {
        data: satelliteData.map(d => d.ndwi),
        color: (opacity = 1) => `rgba(54, 162, 235, ${opacity})`, // optional
        strokeWidth: 2 // optional
      }
    ],
    legend: [t('fieldDetail.ndwi')] // optional
  };

  const tempData = {
    labels: weatherData.map(d => d.date),
    datasets: [
      {
        data: weatherData.map(d => d.temp),
        color: (opacity = 1) => `rgba(255, 159, 64, ${opacity})`, // optional
        strokeWidth: 2 // optional
      }
    ],
    legend: [t('fieldDetail.temperature')] // optional
  };

  const rainfallData = {
    labels: weatherData.map(d => d.date),
    datasets: [
      {
        data: weatherData.map(d => d.rainfall),
        color: (opacity = 1) => `rgba(75, 192, 192, ${opacity})`, // optional
        strokeWidth: 2 // optional
      }
    ],
    legend: [t('fieldDetail.rainfall')] // optional
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{field.name}</Text>
      <Text style={styles.subtitle}>{t('fieldDetail.location')}: {field.location}</Text>
      <Text style={styles.subtitle}>{t('fieldDetail.size')}: {field.size} {field.unit}</Text>

      <Text style={styles.sectionTitle}>{t('fieldDetail.satelliteDataTrends')}</Text>
      <ScrollView horizontal>
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>{t('fieldDetail.ndviTrend')}</Text>
          <LineChart
            data={ndviData}
            width={screenWidth - 40} // from react-native
            height={220}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
          />
        </View>
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>{t('fieldDetail.ndmiTrend')}</Text>
          <LineChart
            data={ndmiData}
            width={screenWidth - 40} // from react-native
            height={220}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
          />
        </View>
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>{t('fieldDetail.ndwiTrend')}</Text>
          <LineChart
            data={ndwiData}
            width={screenWidth - 40} // from react-native
            height={220}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
          />
        </View>
      </ScrollView>

      <Text style={styles.sectionTitle}>{t('fieldDetail.weatherDataTrends')}</Text>
      <ScrollView horizontal>
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>{t('fieldDetail.temperatureTrend')}</Text>
          <LineChart
            data={tempData}
            width={screenWidth - 40} // from react-native
            height={220}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
          />
        </View>
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>{t('fieldDetail.rainfallTrend')}</Text>
          <LineChart
            data={rainfallData}
            width={screenWidth - 40} // from react-native
            height={220}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
          />
        </View>
      </ScrollView>

      {/* Add more details or components as needed */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 5,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 15,
    color: '#444',
  },
  chartContainer: {
    marginRight: 10,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#333',
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 18,
    color: '#555',
  },
  errorText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 18,
    color: 'red',
  },
  noDataText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 18,
    color: '#888',
  },
});

export default FieldDetailScreen;


