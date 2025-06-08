import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { LineChart, BarChart } from 'react-native-chart-kit';
import { Ionicons } from '@expo/vector-icons';
import { LanguageContext } from '../context/LanguageContext';
import { ThemeContext } from '../context/ThemeContext';
import { AuthContext } from '../context/AuthContext';
import apiService from '../services/apiService';

const { width: screenWidth } = Dimensions.get('window');

const ComparativeAnalysisScreen = ({ navigation }) => {
  const { t, isRTL } = useContext(LanguageContext);
  const { theme } = useContext(ThemeContext);
  const { user } = useContext(AuthContext);
  
  const [fields, setFields] = useState([]);
  const [selectedFields, setSelectedFields] = useState([]);
  const [comparisonData, setComparisonData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [analysisType, setAnalysisType] = useState('vegetation_indices');

  useEffect(() => {
    fetchFields();
  }, []);

  const fetchFields = async () => {
    try {
      const response = await apiService.get('/fields');
      setFields(response.data || []);
    } catch (error) {
      console.error('Error fetching fields:', error);
      Alert.alert(t('error'), t('failed_to_fetch_fields'));
    }
  };

  const toggleFieldSelection = (fieldId) => {
    setSelectedFields(prev => {
      if (prev.includes(fieldId)) {
        return prev.filter(id => id !== fieldId);
      } else if (prev.length < 4) { // Limit to 4 fields for better visualization
        return [...prev, fieldId];
      } else {
        Alert.alert(t('limit_reached'), t('max_four_fields_comparison'));
        return prev;
      }
    });
  };

  const generateComparison = async () => {
    if (selectedFields.length < 2) {
      Alert.alert(t('selection_required'), t('select_at_least_two_fields'));
      return;
    }

    setLoading(true);
    try {
      const comparisonPromises = selectedFields.map(async (fieldId) => {
        const field = fields.find(f => f.id === fieldId);
        const satelliteData = await apiService.get(`/satellite/${fieldId}/latest`);
        const weatherData = await apiService.get(`/weather/${fieldId}/current`);
        
        return {
          field,
          satellite: satelliteData.data,
          weather: weatherData.data,
          // Generate mock historical data for comparison
          historical: generateMockHistoricalData(fieldId)
        };
      });

      const results = await Promise.all(comparisonPromises);
      setComparisonData(results);
    } catch (error) {
      console.error('Error generating comparison:', error);
      Alert.alert(t('error'), t('failed_to_generate_comparison'));
    } finally {
      setLoading(false);
    }
  };

  const generateMockHistoricalData = (fieldId) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    return {
      ndvi: months.map(() => 0.3 + Math.random() * 0.5),
      ndmi: months.map(() => 0.2 + Math.random() * 0.4),
      ndwi: months.map(() => -0.2 + Math.random() * 0.4),
      rainfall: months.map(() => 10 + Math.random() * 50),
      temperature: months.map(() => 20 + Math.random() * 15),
    };
  };

  const renderFieldSelector = () => (
    <View style={[styles.section, { backgroundColor: theme.cardBackground }]}>
      <Text style={[styles.sectionTitle, { color: theme.text }]}>
        {t('select_fields_to_compare')}
      </Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {fields.map((field) => (
          <TouchableOpacity
            key={field.id}
            style={[
              styles.fieldCard,
              {
                backgroundColor: selectedFields.includes(field.id) 
                  ? theme.primary 
                  : theme.surface,
                borderColor: theme.border,
              }
            ]}
            onPress={() => toggleFieldSelection(field.id)}
          >
            <Text style={[
              styles.fieldName,
              {
                color: selectedFields.includes(field.id) 
                  ? '#fff' 
                  : theme.text
              }
            ]}>
              {field.name}
            </Text>
            <Text style={[
              styles.fieldSize,
              {
                color: selectedFields.includes(field.id) 
                  ? '#fff' 
                  : theme.textSecondary
              }
            ]}>
              {field.area} {t('hectares')}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderAnalysisTypeSelector = () => (
    <View style={[styles.section, { backgroundColor: theme.cardBackground }]}>
      <Text style={[styles.sectionTitle, { color: theme.text }]}>
        {t('analysis_type')}
      </Text>
      <View style={[styles.pickerContainer, { borderColor: theme.border }]}>
        <Picker
          selectedValue={analysisType}
          onValueChange={setAnalysisType}
          style={[styles.picker, { color: theme.text }]}
        >
          <Picker.Item label={t('vegetation_indices')} value="vegetation_indices" />
          <Picker.Item label={t('weather_comparison')} value="weather_comparison" />
          <Picker.Item label={t('yield_performance')} value="yield_performance" />
          <Picker.Item label={t('resource_efficiency')} value="resource_efficiency" />
        </Picker>
      </View>
    </View>
  );

  const renderVegetationIndicesComparison = () => {
    if (!comparisonData) return null;

    const chartData = {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: comparisonData.map((data, index) => ({
        data: data.historical.ndvi,
        color: (opacity = 1) => `rgba(${index * 80 + 50}, ${150 - index * 30}, ${200 + index * 20}, ${opacity})`,
        strokeWidth: 2,
      }))
    };

    return (
      <View style={[styles.chartSection, { backgroundColor: theme.cardBackground }]}>
        <Text style={[styles.chartTitle, { color: theme.text }]}>
          {t('ndvi_comparison')}
        </Text>
        <ScrollView horizontal>
          <LineChart
            data={chartData}
            width={screenWidth - 40}
            height={220}
            chartConfig={{
              backgroundColor: theme.cardBackground,
              backgroundGradientFrom: theme.cardBackground,
              backgroundGradientTo: theme.cardBackground,
              decimalPlaces: 2,
              color: (opacity = 1) => `rgba(${theme.primary}, ${opacity})`,
              labelColor: (opacity = 1) => theme.text,
              style: {
                borderRadius: 16,
              },
              propsForDots: {
                r: '6',
                strokeWidth: '2',
                stroke: theme.primary,
              },
            }}
            bezier
            style={styles.chart}
          />
        </ScrollView>
        
        {/* Legend */}
        <View style={styles.legend}>
          {comparisonData.map((data, index) => (
            <View key={data.field.id} style={styles.legendItem}>
              <View style={[
                styles.legendColor,
                { backgroundColor: `rgba(${index * 80 + 50}, ${150 - index * 30}, ${200 + index * 20}, 1)` }
              ]} />
              <Text style={[styles.legendText, { color: theme.text }]}>
                {data.field.name}
              </Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  const renderWeatherComparison = () => {
    if (!comparisonData) return null;

    const rainfallData = {
      labels: comparisonData.map(data => data.field.name.substring(0, 8)),
      datasets: [{
        data: comparisonData.map(data => 
          data.historical.rainfall.reduce((a, b) => a + b, 0) / data.historical.rainfall.length
        ),
      }]
    };

    return (
      <View style={[styles.chartSection, { backgroundColor: theme.cardBackground }]}>
        <Text style={[styles.chartTitle, { color: theme.text }]}>
          {t('average_rainfall_comparison')}
        </Text>
        <BarChart
          data={rainfallData}
          width={screenWidth - 40}
          height={220}
          chartConfig={{
            backgroundColor: theme.cardBackground,
            backgroundGradientFrom: theme.cardBackground,
            backgroundGradientTo: theme.cardBackground,
            decimalPlaces: 1,
            color: (opacity = 1) => theme.primary,
            labelColor: (opacity = 1) => theme.text,
            style: {
              borderRadius: 16,
            },
          }}
          style={styles.chart}
        />
      </View>
    );
  };

  const renderPerformanceMetrics = () => {
    if (!comparisonData) return null;

    return (
      <View style={[styles.section, { backgroundColor: theme.cardBackground }]}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          {t('performance_metrics')}
        </Text>
        {comparisonData.map((data, index) => (
          <View key={data.field.id} style={[styles.metricCard, { borderColor: theme.border }]}>
            <Text style={[styles.metricFieldName, { color: theme.text }]}>
              {data.field.name}
            </Text>
            <View style={styles.metricRow}>
              <View style={styles.metricItem}>
                <Text style={[styles.metricLabel, { color: theme.textSecondary }]}>
                  {t('current_ndvi')}
                </Text>
                <Text style={[styles.metricValue, { color: theme.primary }]}>
                  {data.satellite?.ndvi?.toFixed(3) || '0.000'}
                </Text>
              </View>
              <View style={styles.metricItem}>
                <Text style={[styles.metricLabel, { color: theme.textSecondary }]}>
                  {t('current_ndmi')}
                </Text>
                <Text style={[styles.metricValue, { color: theme.primary }]}>
                  {data.satellite?.ndmi?.toFixed(3) || '0.000'}
                </Text>
              </View>
              <View style={styles.metricItem}>
                <Text style={[styles.metricLabel, { color: theme.textSecondary }]}>
                  {t('health_score')}
                </Text>
                <Text style={[styles.metricValue, { color: theme.success }]}>
                  {((data.satellite?.ndvi || 0.5) * 100).toFixed(0)}%
                </Text>
              </View>
            </View>
          </View>
        ))}
      </View>
    );
  };

  const renderComparisonResults = () => {
    if (!comparisonData) return null;

    switch (analysisType) {
      case 'vegetation_indices':
        return renderVegetationIndicesComparison();
      case 'weather_comparison':
        return renderWeatherComparison();
      case 'yield_performance':
      case 'resource_efficiency':
        return renderPerformanceMetrics();
      default:
        return renderVegetationIndicesComparison();
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
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
          {t('comparative_analysis')}
        </Text>
      </View>

      {renderFieldSelector()}
      {renderAnalysisTypeSelector()}

      <TouchableOpacity
        style={[
          styles.generateButton,
          {
            backgroundColor: selectedFields.length >= 2 ? theme.primary : theme.disabled,
          }
        ]}
        onPress={generateComparison}
        disabled={selectedFields.length < 2 || loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.generateButtonText}>
            {t('generate_comparison')}
          </Text>
        )}
      </TouchableOpacity>

      {renderComparisonResults()}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingTop: 50,
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
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
    marginBottom: 12,
  },
  fieldCard: {
    padding: 12,
    marginRight: 12,
    borderRadius: 8,
    borderWidth: 1,
    minWidth: 120,
  },
  fieldName: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  fieldSize: {
    fontSize: 12,
  },
  pickerContainer: {
    borderWidth: 1,
    borderRadius: 8,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  generateButton: {
    margin: 16,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  generateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  chartSection: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 8,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  legendText: {
    fontSize: 12,
  },
  metricCard: {
    padding: 12,
    marginBottom: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  metricFieldName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metricItem: {
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ComparativeAnalysisScreen;

