import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LanguageContext } from '../context/LanguageContext';
import { ThemeContext } from '../context/ThemeContext';
import { AuthContext } from '../context/AuthContext';
import exportService from '../services/exportService';
import apiService from '../services/apiService';

const ExportScreen = ({ navigation }) => {
  const { t, isRTL } = useContext(LanguageContext);
  const { theme } = useContext(ThemeContext);
  const { user } = useContext(AuthContext);
  
  const [loading, setLoading] = useState(false);
  const [exportedFiles, setExportedFiles] = useState([]);
  const [selectedExportType, setSelectedExportType] = useState('field_data');

  const exportTypes = [
    {
      id: 'field_data',
      title: t('export.field_data'),
      description: t('export.field_data_desc'),
      icon: 'leaf-outline',
      formats: ['csv', 'json'],
    },
    {
      id: 'comparative_analysis',
      title: t('export.comparative_analysis'),
      description: t('export.comparative_analysis_desc'),
      icon: 'analytics-outline',
      formats: ['json', 'pdf'],
    },
    {
      id: 'weather_data',
      title: t('export.weather_data'),
      description: t('export.weather_data_desc'),
      icon: 'partly-sunny-outline',
      formats: ['csv', 'json'],
    },
    {
      id: 'comprehensive_report',
      title: t('export.comprehensive_report'),
      description: t('export.comprehensive_report_desc'),
      icon: 'document-text-outline',
      formats: ['pdf', 'html'],
    },
    {
      id: 'satellite_images',
      title: t('export.satellite_images'),
      description: t('export.satellite_images_desc'),
      icon: 'planet-outline',
      formats: ['png', 'jpg'],
    },
  ];

  useEffect(() => {
    loadExportedFiles();
  }, []);

  const loadExportedFiles = async () => {
    try {
      const files = await exportService.getExportedFiles();
      setExportedFiles(files);
    } catch (error) {
      console.error('Error loading exported files:', error);
    }
  };

  const handleExport = async (exportType, format) => {
    setLoading(true);
    try {
      let filePath;
      
      switch (exportType) {
        case 'field_data':
          filePath = await exportFieldData(format);
          break;
        case 'comparative_analysis':
          filePath = await exportComparativeAnalysis(format);
          break;
        case 'weather_data':
          filePath = await exportWeatherData(format);
          break;
        case 'comprehensive_report':
          filePath = await exportComprehensiveReport(format);
          break;
        case 'satellite_images':
          filePath = await exportSatelliteImages(format);
          break;
        default:
          throw new Error('Unknown export type');
      }

      if (filePath) {
        Alert.alert(
          t('export.export_successful'),
          t('export.file_saved_successfully'),
          [
            { text: t('export.view_files'), onPress: () => loadExportedFiles() },
            { text: t('export.share'), onPress: () => exportService.shareFile(filePath) },
            { text: t('ok'), style: 'default' },
          ]
        );
      }
    } catch (error) {
      console.error('Export error:', error);
      Alert.alert(t('error'), t('export.export_failed'));
    } finally {
      setLoading(false);
    }
  };

  const exportFieldData = async (format) => {
    try {
      const response = await apiService.get('/fields');
      const fields = response.data || [];
      
      if (format === 'csv') {
        return await exportService.exportFieldDataAsCSV(fields);
      } else if (format === 'json') {
        const exportData = {
          exportDate: new Date().toISOString(),
          totalFields: fields.length,
          fields: fields.map(field => ({
            id: field.id,
            name: field.name,
            cropType: field.cropType,
            area: field.area,
            plantingDate: field.plantingDate,
            location: field.location,
            satelliteData: field.satelliteData,
            healthScore: field.healthScore,
          })),
        };
        
        const jsonContent = JSON.stringify(exportData, null, 2);
        const filePath = exportService.baseDirectory + `field_data_${Date.now()}.json`;
        await FileSystem.writeAsStringAsync(filePath, jsonContent);
        return filePath;
      }
    } catch (error) {
      throw new Error('Failed to export field data');
    }
  };

  const exportComparativeAnalysis = async (format) => {
    try {
      // Mock comparative analysis data - in real app, this would come from the analysis screen
      const mockComparisonData = [
        {
          field: { id: 1, name: 'Field A', area: 5.2 },
          satellite: { ndvi: 0.75, ndmi: 0.45, ndwi: 0.25 },
          weather: { temperature: 28, humidity: 65 },
          historical: {
            ndvi: [0.65, 0.68, 0.72, 0.75, 0.78, 0.75],
            ndmi: [0.35, 0.38, 0.42, 0.45, 0.48, 0.45],
          },
        },
        {
          field: { id: 2, name: 'Field B', area: 3.8 },
          satellite: { ndvi: 0.68, ndmi: 0.38, ndwi: 0.18 },
          weather: { temperature: 29, humidity: 62 },
          historical: {
            ndvi: [0.58, 0.61, 0.65, 0.68, 0.71, 0.68],
            ndmi: [0.28, 0.31, 0.35, 0.38, 0.41, 0.38],
          },
        },
      ];

      if (format === 'json') {
        return await exportService.exportComparativeAnalysisAsJSON(mockComparisonData);
      } else if (format === 'pdf') {
        const reportData = {
          comparisonData: mockComparisonData,
          reportType: 'comparative_analysis',
        };
        return await exportService.generatePDFReport(reportData, 'comparative_analysis');
      }
    } catch (error) {
      throw new Error('Failed to export comparative analysis');
    }
  };

  const exportWeatherData = async (format) => {
    try {
      // Mock weather data - in real app, this would come from weather service
      const weatherData = {
        exportDate: new Date().toISOString(),
        currentWeather: {
          temperature: 28,
          humidity: 65,
          windSpeed: 12,
          pressure: 1013,
          condition: 'partly-cloudy',
        },
        forecast: [
          { date: '2024-01-01', temp: 29, humidity: 68, rainfall: 0 },
          { date: '2024-01-02', temp: 27, humidity: 72, rainfall: 5 },
          { date: '2024-01-03', temp: 26, humidity: 75, rainfall: 12 },
        ],
      };

      if (format === 'csv') {
        const csvHeader = 'Date,Temperature,Humidity,Rainfall,Wind Speed\n';
        const csvData = weatherData.forecast.map(day => 
          `${day.date},${day.temp},${day.humidity},${day.rainfall},${weatherData.currentWeather.windSpeed}`
        ).join('\n');
        
        const csvContent = csvHeader + csvData;
        const filePath = exportService.baseDirectory + `weather_data_${Date.now()}.csv`;
        await FileSystem.writeAsStringAsync(filePath, csvContent);
        return filePath;
      } else if (format === 'json') {
        const jsonContent = JSON.stringify(weatherData, null, 2);
        const filePath = exportService.baseDirectory + `weather_data_${Date.now()}.json`;
        await FileSystem.writeAsStringAsync(filePath, jsonContent);
        return filePath;
      }
    } catch (error) {
      throw new Error('Failed to export weather data');
    }
  };

  const exportComprehensiveReport = async (format) => {
    try {
      const fieldsResponse = await apiService.get('/fields');
      const fields = fieldsResponse.data || [];
      
      const reportData = {
        fields,
        weather: {
          temperature: 28,
          humidity: 65,
          windSpeed: 12,
          description: 'Partly Cloudy',
        },
        alerts: [
          {
            id: 1,
            type: 'weather',
            severity: 'warning',
            title: 'Heavy Rain Expected',
            message: 'Heavy rainfall expected in the next 24 hours',
            timestamp: new Date(),
          },
        ],
        reportType: 'comprehensive',
      };

      return await exportService.generatePDFReport(reportData, 'comprehensive_report');
    } catch (error) {
      throw new Error('Failed to export comprehensive report');
    }
  };

  const exportSatelliteImages = async (format) => {
    try {
      // In a real implementation, this would capture actual satellite imagery
      // For now, we'll create a placeholder
      Alert.alert(
        t('export.feature_coming_soon'),
        t('export.satellite_export_coming_soon')
      );
      return null;
    } catch (error) {
      throw new Error('Failed to export satellite images');
    }
  };

  const handleDeleteFile = async (filePath) => {
    Alert.alert(
      t('export.delete_file'),
      t('export.delete_file_confirmation'),
      [
        { text: t('cancel'), style: 'cancel' },
        {
          text: t('delete'),
          style: 'destructive',
          onPress: async () => {
            try {
              await exportService.deleteExportedFile(filePath);
              loadExportedFiles();
            } catch (error) {
              Alert.alert(t('error'), t('export.delete_failed'));
            }
          },
        },
      ]
    );
  };

  const renderExportType = ({ item }) => (
    <View style={[styles.exportTypeCard, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}>
      <View style={styles.exportTypeHeader}>
        <Ionicons name={item.icon} size={24} color={theme.primary} />
        <View style={styles.exportTypeInfo}>
          <Text style={[styles.exportTypeTitle, { color: theme.text }]}>
            {item.title}
          </Text>
          <Text style={[styles.exportTypeDescription, { color: theme.textSecondary }]}>
            {item.description}
          </Text>
        </View>
      </View>
      
      <View style={styles.formatButtons}>
        {item.formats.map((format) => (
          <TouchableOpacity
            key={format}
            style={[
              styles.formatButton,
              { backgroundColor: theme.primary, opacity: loading ? 0.6 : 1 }
            ]}
            onPress={() => handleExport(item.id, format)}
            disabled={loading}
          >
            <Text style={styles.formatButtonText}>
              {format.toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderExportedFile = ({ item }) => (
    <View style={[styles.fileCard, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}>
      <View style={styles.fileInfo}>
        <Ionicons 
          name={getFileIcon(item.type)} 
          size={24} 
          color={theme.primary} 
          style={styles.fileIcon}
        />
        <View style={styles.fileDetails}>
          <Text style={[styles.fileName, { color: theme.text }]} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={[styles.fileSize, { color: theme.textSecondary }]}>
            {formatFileSize(item.size)} • {new Date(item.modificationTime).toLocaleDateString()}
          </Text>
        </View>
      </View>
      
      <View style={styles.fileActions}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: theme.primary }]}
          onPress={() => exportService.shareFile(item.path)}
        >
          <Ionicons name="share-outline" size={16} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: theme.error }]}
          onPress={() => handleDeleteFile(item.path)}
        >
          <Ionicons name="trash-outline" size={16} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const getFileIcon = (mimeType) => {
    if (mimeType.includes('pdf')) return 'document-text-outline';
    if (mimeType.includes('csv')) return 'grid-outline';
    if (mimeType.includes('json')) return 'code-outline';
    if (mimeType.includes('image')) return 'image-outline';
    if (mimeType.includes('html')) return 'globe-outline';
    return 'document-outline';
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

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
          {t('export.export_data')}
        </Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={[styles.section, { backgroundColor: theme.cardBackground }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            {t('export.available_exports')}
          </Text>
          <FlatList
            data={exportTypes}
            renderItem={renderExportType}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
          />
        </View>

        <View style={[styles.section, { backgroundColor: theme.cardBackground }]}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              {t('export.exported_files')}
            </Text>
            <TouchableOpacity onPress={loadExportedFiles}>
              <Ionicons name="refresh-outline" size={20} color={theme.primary} />
            </TouchableOpacity>
          </View>
          
          {exportedFiles.length > 0 ? (
            <FlatList
              data={exportedFiles}
              renderItem={renderExportedFile}
              keyExtractor={(item) => item.path}
              scrollEnabled={false}
            />
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="folder-open-outline" size={48} color={theme.textSecondary} />
              <Text style={[styles.emptyStateText, { color: theme.textSecondary }]}>
                {t('export.no_exported_files')}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {loading && (
        <View style={styles.loadingOverlay}>
          <View style={[styles.loadingContainer, { backgroundColor: theme.cardBackground }]}>
            <ActivityIndicator size="large" color={theme.primary} />
            <Text style={[styles.loadingText, { color: theme.text }]}>
              {t('export.exporting')}
            </Text>
          </View>
        </View>
      )}
    </View>
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  exportTypeCard: {
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  exportTypeHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  exportTypeInfo: {
    flex: 1,
    marginLeft: 12,
  },
  exportTypeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  exportTypeDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  formatButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  formatButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  formatButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  fileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    marginBottom: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  fileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  fileIcon: {
    marginRight: 12,
  },
  fileDetails: {
    flex: 1,
  },
  fileName: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  fileSize: {
    fontSize: 12,
  },
  fileActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 8,
    borderRadius: 6,
  },
  emptyState: {
    alignItems: 'center',
    padding: 32,
  },
  emptyStateText: {
    marginTop: 12,
    fontSize: 16,
    textAlign: 'center',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
  },
});

export default ExportScreen;

