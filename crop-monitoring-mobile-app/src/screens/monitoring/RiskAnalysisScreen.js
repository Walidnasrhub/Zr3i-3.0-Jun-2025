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
import { riskService } from '../../services/apiService';

const { width } = Dimensions.get('window');

export default function RiskAnalysisScreen({ navigation }) {
  const { theme } = useTheme();
  const { t, isRTL } = useLanguage();

  const [selectedField, setSelectedField] = useState(null);
  const [riskData, setRiskData] = useState(null);
  const [insuranceData, setInsuranceData] = useState(null);
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
      loadRiskData(selectedField.id);
    }
  }, [selectedField]);

  const loadRiskData = async (fieldId) => {
    setIsLoading(true);
    try {
      // Mock data for demonstration
      setRiskData({
        overallRisk: 'Medium',
        riskFactors: [
          { name: 'Drought', level: 'High', impact: 'Severe' },
          { name: 'Pest Infestation', level: 'Medium', impact: 'Moderate' },
          { name: 'Disease Outbreak', level: 'Low', impact: 'Mild' },
          { name: 'Flood', level: 'Low', impact: 'Mild' },
        ],
        riskHistory: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          datasets: [
            { data: [0.6, 0.5, 0.4, 0.5, 0.6, 0.55], name: 'Overall Risk Index', color: (opacity = 1) => `rgba(255, 159, 64, ${opacity})` },
          ],
        },
      });

      setInsuranceData({
        provider: 'AgriProtect Insurance',
        policyNumber: 'AGRI-2024-001',
        coverage: 'Drought, Flood, Pest, Disease',
        sumInsured: '10,000 EGP/hectare',
        premium: '500 EGP/hectare',
        status: 'Active',
        claimHistory: [
          { id: 1, date: '2023-08-15', type: 'Drought', status: 'Approved', amount: '2,500 EGP' },
        ],
      });

      // In a real app, you would fetch data from your backend:
      // const riskResult = await riskService.getRiskAnalysis(fieldId);
      // if (riskResult.success) { setRiskData(riskResult.data); }
      // const insuranceResult = await riskService.getCropInsurance(fieldId);
      // if (insuranceResult.success) { setInsuranceData(insuranceResult.data); }

    } catch (error) {
      Alert.alert(t('common.error'), t('monitoring.errorLoadingData'));
      console.error('Error loading risk and insurance data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const chartConfig = {
    backgroundColor: theme.colors.surface,
    backgroundGradientFrom: theme.colors.surface,
    backgroundGradientTo: theme.colors.surface,
    decimalPlaces: 2,
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
          <Text style={styles.headerTitle}>{t('monitoring.riskAnalysis')}</Text>
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
        ) : selectedField && riskData && insuranceData ? (
          <>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t('riskAnalysis.overallRisk')}</Text>
              <View style={styles.dataCard}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>{t('riskAnalysis.overallRiskLevel')}:</Text>
                  <Text style={styles.detailValue}>{riskData.overallRisk}</Text>
                </View>
              </View>
              {riskData.riskHistory && (
                <LineChart
                  data={riskData.riskHistory}
                  width={width - theme.spacing.lg * 2}
                  height={220}
                  chartConfig={chartConfig}
                  bezier
                  style={styles.chart}
                />
              )}
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t('riskAnalysis.riskFactors')}</Text>
              <View style={styles.dataCard}>
                {riskData.riskFactors.map((factor, index) => (
                  <View key={index} style={styles.detailRow}>
                    <Text style={styles.detailLabel}>{factor.name}:</Text>
                    <Text style={styles.detailValue}>{factor.level} ({factor.impact})</Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t('cropInsurance.cropInsurance')}</Text>
              <View style={styles.dataCard}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>{t('cropInsurance.provider')}:</Text>
                  <Text style={styles.detailValue}>{insuranceData.provider}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>{t('cropInsurance.policyNumber')}:</Text>
                  <Text style={styles.detailValue}>{insuranceData.policyNumber}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>{t('cropInsurance.coverage')}:</Text>
                  <Text style={styles.detailValue}>{insuranceData.coverage}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>{t('cropInsurance.sumInsured')}:</Text>
                  <Text style={styles.detailValue}>{insuranceData.sumInsured}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>{t('cropInsurance.premium')}:</Text>
                  <Text style={styles.detailValue}>{insuranceData.premium}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>{t('cropInsurance.status')}:</Text>
                  <Text style={styles.detailValue}>{insuranceData.status}</Text>
                </View>
              </View>
            </View>

            {insuranceData.claimHistory && insuranceData.claimHistory.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>{t('cropInsurance.claimHistory')}</Text>
                <View style={styles.dataCard}>
                  {insuranceData.claimHistory.map((claim) => (
                    <View key={claim.id} style={styles.detailRow}>
                      <Text style={styles.detailLabel}>{claim.date} - {claim.type}:</Text>
                      <Text style={styles.detailValue}>{claim.status} ({claim.amount})</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </>
        ) : (
          <View style={styles.noDataContainer}>
            <Ionicons name="cloud-offline-outline" size={80} color={theme.colors.textSecondary} />
            <Text style={styles.noDataText}>{t('monitoring.noData')}</Text>
            <Text style={styles.noDataSubtitle}>Select a field to view risk analysis and insurance data.</Text>
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

