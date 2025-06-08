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
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LineChart } from 'react-native-chart-kit';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { satelliteService } from '../../services/apiService';

const { width } = Dimensions.get('window');

export default function SatelliteImageryScreen({ navigation }) {
  const { theme } = useTheme();
  const { t, isRTL } = useLanguage();

  const [selectedField, setSelectedField] = useState(null);
  const [satelliteData, setSatelliteData] = useState(null);
  const [vegetationIndices, setVegetationIndices] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fields, setFields] = useState([]); // Assuming fields are loaded elsewhere or fetched here

  const styles = createStyles(theme, isRTL);

  useEffect(() => {
    // In a real app, you would fetch fields from your backend
    setFields([
      { id: 1, name: 'Field A', crop_type: 'Wheat', size: 10, geojson: { type: 'Polygon', coordinates: [[[30.0, 31.0], [30.1, 31.0], [30.1, 31.1], [30.0, 31.1], [30.0, 31.0]]] } },
      { id: 2, name: 'Field B', crop_type: 'Corn', size: 15, geojson: { type: 'Point', coordinates: [30.5, 31.5], radius: 200 } },
    ]);
  }, []);

  useEffect(() => {
    if (selectedField) {
      loadSatelliteData(selectedField.id);
    }
  }, [selectedField]);

  const loadSatelliteData = async (fieldId) => {
    setIsLoading(true);
    try {
      // Mock data for demonstration
      setSatelliteData({
        imageUrl: 'https://via.placeholder.com/600x400?text=Satellite+Image+for+Field+' + fieldId,
        cloudCover: '5%',
        date: '2024-06-01',
      });
      setVegetationIndices({
        ndvi: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          datasets: [
            {
              data: [0.2, 0.3, 0.6, 0.8, 0.7, 0.5],
            },
          ],
        },
        evi: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          datasets: [
            {
              data: [0.1, 0.25, 0.5, 0.7, 0.6, 0.4],
            },
          ],
        },
        ndmi: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          datasets: [
            {
              data: [0.3, 0.4, 0.7, 0.9, 0.8, 0.6],
            },
          ],
        },
        ndwi: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          datasets: [
            {
              data: [0.15, 0.35, 0.65, 0.85, 0.75, 0.55],
            },
          ],
        },
      });

      // In a real app, you would fetch data from your backend:
      // const satResult = await satelliteService.getSatelliteData(fieldId, '2024-01-01', '2024-06-30');
      // if (satResult.success) { setSatelliteData(satResult.data); }
      // const viResult = await satelliteService.getVegetationIndices(fieldId);
      // if (viResult.success) { setVegetationIndices(viResult.data); }

    } catch (error) {
      Alert.alert(t('common.error'), t('monitoring.errorLoadingData'));
      console.error('Error loading satellite data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const chartConfig = {
    backgroundColor: theme.colors.surface,
    backgroundGradientFrom: theme.colors.surface,
    backgroundGradientTo: theme.colors.surface,
    decimalPlaces: 2,
    color: (opacity = 1) => `rgba(34, 197, 94, ${opacity})`, // Primary color
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

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name={isRTL ? "chevron-forward" : "chevron-back"} size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t('monitoring.satelliteImagery')}</Text>
          <View style={{ width: 24 }} />{/* Spacer */}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('fields.fieldName')}</Text>
          <View style={styles.fieldSelector}>
            {fields.map((fieldItem) => (
              <TouchableOpacity
                key={fieldItem.id}
                style={[
                  styles.fieldButton,
                  selectedField?.id === fieldItem.id && styles.fieldButtonActive,
                ]}
                onPress={() => setSelectedField(fieldItem)}
              >
                <Text
                  style={[
                    styles.fieldButtonText,
                    selectedField?.id === fieldItem.id && styles.fieldButtonTextActive,
                  ]}
                >
                  {fieldItem.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text style={styles.loadingText}>{t('common.loadingData')}</Text>
          </View>
        ) : selectedField && satelliteData && vegetationIndices ? (
          <>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t('monitoring.satelliteImagery')}</Text>
              <Image source={{ uri: satelliteData.imageUrl }} style={styles.satelliteImage} />
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>{t('common.date')}:</Text>
                <Text style={styles.detailValue}>{satelliteData.date}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>{t('monitoring.cloudCover')}:</Text>
                <Text style={styles.detailValue}>{satelliteData.cloudCover}</Text>
              </View>
            </View>

            {vegetationIndices?.ndvi && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>{t('monitoring.ndvi')}</Text>
                <LineChart
                  data={vegetationIndices.ndvi}
                  width={width - theme.spacing.lg * 2} // from styles.chartContainer
                  height={220}
                  chartConfig={chartConfig}
                  bezier
                  style={styles.chart}
                />
              </View>
            )}

            {vegetationIndices?.evi && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>{t('monitoring.evi')}</Text>
                <LineChart
                  data={vegetationIndices.evi}
                  width={width - theme.spacing.lg * 2} // from styles.chartContainer
                  height={220}
                  chartConfig={chartConfig}
                  bezier
                  style={styles.chart}
                />
              </View>
            )}

            {vegetationIndices?.ndmi && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>{t('monitoring.ndmi')}</Text>
                <LineChart
                  data={vegetationIndices.ndmi}
                  width={width - theme.spacing.lg * 2} // from styles.chartContainer
                  height={220}
                  chartConfig={chartConfig}
                  bezier
                  style={styles.chart}
                />
              </View>
            )}

            {vegetationIndices?.ndwi && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>{t('monitoring.ndwi')}</Text>
                <LineChart
                  data={vegetationIndices.ndwi}
                  width={width - theme.spacing.lg * 2} // from styles.chartContainer
                  height={220}
                  chartConfig={chartConfig}
                  bezier
                  style={styles.chart}
                />
              </View>
            )}
          </>
        ) : (
          <View style={styles.noDataContainer}>
            <Ionicons name="cloud-offline-outline" size={80} color={theme.colors.textSecondary} />
            <Text style={styles.noDataText}>{t('monitoring.noData')}</Text>
            <Text style={styles.noDataSubtitle}>Select a field to view satellite data.</Text>
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
  fieldSelector: {
    flexDirection: isRTL ? 'row-reverse' : 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  fieldButton: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  fieldButtonActive: {
    borderColor: theme.colors.primary,
    backgroundColor: `${theme.colors.primary}20`,
  },
  fieldButtonText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
  },
  fieldButtonTextActive: {
    color: theme.colors.primary,
    fontWeight: 'bold',
  },
  satelliteImage: {
    width: '100%',
    height: 200,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
  },
  detailRow: {
    flexDirection: isRTL ? 'row-reverse' : 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.sm,
  },
  detailLabel: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
    textAlign: isRTL ? 'right' : 'left',
  },
  detailValue: {
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
    fontWeight: '500',
    textAlign: isRTL ? 'left' : 'right',
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

