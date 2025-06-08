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
import { cropHealthService } from '../../services/apiService';

const { width } = Dimensions.get('window');

export default function CropHealthScreen({ navigation }) {
  const { theme } = useTheme();
  const { t, isRTL } = useLanguage();

  const [selectedField, setSelectedField] = useState(null);
  const [cropHealthData, setCropHealthData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fields, setFields] = useState([]); // Assuming fields are loaded elsewhere or fetched here

  const styles = createStyles(theme, isRTL);

  useEffect(() => {
    // In a real app, you would fetch fields from your backend
    setFields([
      { id: 1, name: 'Field A', crop_type: 'Wheat', size: 10 },
      { id: 2, name: 'Field B', crop_type: 'Corn', size: 15 },
    ]);
  }, []);

  useEffect(() => {
    if (selectedField) {
      loadCropHealthData(selectedField.id);
    }
  }, [selectedField]);

  const loadCropHealthData = async (fieldId) => {
    setIsLoading(true);
    try {
      // Mock data for demonstration
      setCropHealthData({
        healthScore: 85,
        stressLevel: 'Low',
        growthStage: 'Tillering',
        diseaseRisk: 'Low',
        pestRisk: 'Medium',
        yieldPrediction: 5.2, // tons/hectare
        healthHistory: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          datasets: [
            { data: [70, 75, 80, 85, 82, 88], name: 'Health Score', color: (opacity = 1) => `rgba(34, 197, 94, ${opacity})` },
          ],
        },
        stressHistory: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          datasets: [
            { data: [0.3, 0.2, 0.1, 0.15, 0.25, 0.1], name: 'Stress Index', color: (opacity = 1) => `rgba(255, 159, 64, ${opacity})` },
          ],
        },
      });

      // In a real app, you would fetch data from your backend:
      // const result = await cropHealthService.getCropHealth(fieldId);
      // if (result.success) { setCropHealthData(result.data); }

    } catch (error) {
      Alert.alert(t('common.error'), t('monitoring.errorLoadingData'));
      console.error('Error loading crop health data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const chartConfig = {
    backgroundColor: theme.colors.surface,
    backgroundGradientFrom: theme.colors.surface,
    backgroundGradientTo: theme.colors.surface,
    decimalPlaces: 1,
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

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name={isRTL ? "chevron-forward" : "chevron-back"} size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t('monitoring.cropHealth')}</Text>
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
        ) : selectedField && cropHealthData ? (
          <>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t('cropHealth.overview')}</Text>
              <View style={styles.dataCard}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>{t('cropHealth.healthScore')}:</Text>
                  <Text style={styles.detailValue}>{cropHealthData.healthScore}%</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>{t('cropHealth.stressLevel')}:</Text>
                  <Text style={styles.detailValue}>{cropHealthData.stressLevel}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>{t('cropHealth.growthStage')}:</Text>
                  <Text style={styles.detailValue}>{cropHealthData.growthStage}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>{t('cropHealth.diseaseRisk')}:</Text>
                  <Text style={styles.detailValue}>{cropHealthData.diseaseRisk}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>{t('cropHealth.pestRisk')}:</Text>
                  <Text style={styles.detailValue}>{cropHealthData.pestRisk}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>{t('cropHealth.yieldPrediction')}:</Text>
                  <Text style={styles.detailValue}>{cropHealthData.yieldPrediction} {t('cropHealth.tonsPerHectare')}</Text>
                </View>
              </View>
            </View>

            {cropHealthData.healthHistory && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>{t('cropHealth.healthHistory')}</Text>
                <LineChart
                  data={cropHealthData.healthHistory}
                  width={width - theme.spacing.lg * 2}
                  height={220}
                  chartConfig={chartConfig}
                  bezier
                  style={styles.chart}
                />
              </View>
            )}

            {cropHealthData.stressHistory && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>{t('cropHealth.stressHistory')}</Text>
                <LineChart
                  data={cropHealthData.stressHistory}
                  width={width - theme.spacing.lg * 2}
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
            <Text style={styles.noDataSubtitle}>Select a field to view crop health data.</Text>
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
  dataCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
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

