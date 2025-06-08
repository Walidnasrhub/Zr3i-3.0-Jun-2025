import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import './ComparativeAnalysisPage.css';

const ComparativeAnalysisPage = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  
  const [fields, setFields] = useState([]);
  const [selectedFields, setSelectedFields] = useState([]);
  const [comparisonData, setComparisonData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [analysisType, setAnalysisType] = useState('vegetation_indices');

  const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#8dd1e1'];

  useEffect(() => {
    fetchFields();
  }, []);

  const fetchFields = async () => {
    try {
      // Mock field data - in real app, this would come from API
      const mockFields = [
        { id: 1, name: 'Field A', area: 5.2, cropType: 'Wheat', location: { lat: 30.0444, lng: 31.2357 } },
        { id: 2, name: 'Field B', area: 3.8, cropType: 'Corn', location: { lat: 30.0626, lng: 31.2497 } },
        { id: 3, name: 'Field C', area: 7.1, cropType: 'Rice', location: { lat: 30.0875, lng: 31.2753 } },
        { id: 4, name: 'Field D', area: 4.5, cropType: 'Cotton', location: { lat: 30.0444, lng: 31.2357 } },
        { id: 5, name: 'Field E', area: 6.3, cropType: 'Soybeans', location: { lat: 30.0626, lng: 31.2497 } },
      ];
      setFields(mockFields);
    } catch (error) {
      console.error('Error fetching fields:', error);
    }
  };

  const toggleFieldSelection = (fieldId) => {
    setSelectedFields(prev => {
      if (prev.includes(fieldId)) {
        return prev.filter(id => id !== fieldId);
      } else if (prev.length < 5) { // Limit to 5 fields for better visualization
        return [...prev, fieldId];
      } else {
        alert(t('monitoring.maxFiveFieldsComparison'));
        return prev;
      }
    });
  };

  const generateComparison = async () => {
    if (selectedFields.length < 2) {
      alert(t('monitoring.selectAtLeastTwoFields'));
      return;
    }

    setLoading(true);
    try {
      const comparisonPromises = selectedFields.map(async (fieldId) => {
        const field = fields.find(f => f.id === fieldId);
        
        // Mock satellite and weather data
        const satelliteData = {
          ndvi: 0.3 + Math.random() * 0.5,
          ndmi: 0.2 + Math.random() * 0.4,
          ndwi: -0.2 + Math.random() * 0.4,
          evi: 0.25 + Math.random() * 0.45,
        };
        
        const weatherData = {
          temperature: 20 + Math.random() * 15,
          humidity: 40 + Math.random() * 40,
          rainfall: 10 + Math.random() * 50,
        };
        
        return {
          field,
          satellite: satelliteData,
          weather: weatherData,
          historical: generateMockHistoricalData(fieldId)
        };
      });

      const results = await Promise.all(comparisonPromises);
      setComparisonData(results);
    } catch (error) {
      console.error('Error generating comparison:', error);
      alert(t('monitoring.failedToGenerateComparison'));
    } finally {
      setLoading(false);
    }
  };

  const generateMockHistoricalData = (fieldId) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    return months.map(month => ({
      month,
      ndvi: 0.3 + Math.random() * 0.5,
      ndmi: 0.2 + Math.random() * 0.4,
      ndwi: -0.2 + Math.random() * 0.4,
      rainfall: 10 + Math.random() * 50,
      temperature: 20 + Math.random() * 15,
    }));
  };

  const exportData = () => {
    if (!comparisonData) {
      alert(t('export.noDataToExport'));
      return;
    }

    const exportData = {
      exportDate: new Date().toISOString(),
      analysisType: 'comparative_field_analysis',
      fields: comparisonData.map(data => ({
        fieldId: data.field.id,
        fieldName: data.field.name,
        area: data.field.area,
        cropType: data.field.cropType,
        currentMetrics: {
          ndvi: data.satellite?.ndvi,
          ndmi: data.satellite?.ndmi,
          ndwi: data.satellite?.ndwi,
          evi: data.satellite?.evi,
        },
        historicalData: data.historical,
        performanceScore: data.satellite?.ndvi ? (data.satellite.ndvi * 100).toFixed(0) : 0,
      })),
      summary: {
        totalFields: comparisonData.length,
        averageNDVI: comparisonData.reduce((sum, data) => sum + (data.satellite?.ndvi || 0), 0) / comparisonData.length,
        bestPerformingField: comparisonData.reduce((best, current) => 
          (current.satellite?.ndvi || 0) > (best.satellite?.ndvi || 0) ? current : best
        ).field.name,
      }
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `comparative_analysis_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const renderVegetationIndicesComparison = () => {
    if (!comparisonData) return null;

    const chartData = comparisonData[0].historical.map((_, index) => {
      const dataPoint = { month: comparisonData[0].historical[index].month };
      comparisonData.forEach((data, fieldIndex) => {
        dataPoint[`${data.field.name}_NDVI`] = data.historical[index].ndvi;
        dataPoint[`${data.field.name}_NDMI`] = data.historical[index].ndmi;
      });
      return dataPoint;
    });

    return (
      <div className="chart-container">
        <h3>{t('monitoring.ndviComparison')}</h3>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            {comparisonData.map((data, index) => (
              <Line
                key={`ndvi-${data.field.id}`}
                type="monotone"
                dataKey={`${data.field.name}_NDVI`}
                stroke={colors[index % colors.length]}
                strokeWidth={2}
                dot={{ r: 4 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  };

  const renderWeatherComparison = () => {
    if (!comparisonData) return null;

    const rainfallData = comparisonData.map(data => ({
      name: data.field.name,
      rainfall: data.historical.reduce((sum, point) => sum + point.rainfall, 0) / data.historical.length,
      temperature: data.historical.reduce((sum, point) => sum + point.temperature, 0) / data.historical.length,
    }));

    return (
      <div className="chart-container">
        <h3>{t('monitoring.averageRainfallComparison')}</h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={rainfallData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="rainfall" fill="#8884d8" name={t('monitoring.rainfall')} />
            <Bar dataKey="temperature" fill="#82ca9d" name={t('monitoring.temperature')} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  };

  const renderPerformanceMetrics = () => {
    if (!comparisonData) return null;

    const performanceData = comparisonData.map(data => ({
      name: data.field.name,
      ndvi: data.satellite?.ndvi || 0,
      ndmi: data.satellite?.ndmi || 0,
      ndwi: data.satellite?.ndwi || 0,
      healthScore: data.satellite?.ndvi ? (data.satellite.ndvi * 100) : 0,
    }));

    return (
      <div className="metrics-grid">
        <h3>{t('monitoring.performanceMetrics')}</h3>
        <div className="metrics-cards">
          {performanceData.map((data, index) => (
            <div key={data.name} className="metric-card">
              <h4>{data.name}</h4>
              <div className="metric-values">
                <div className="metric-item">
                  <span className="metric-label">{t('monitoring.currentNdvi')}</span>
                  <span className="metric-value">{data.ndvi.toFixed(3)}</span>
                </div>
                <div className="metric-item">
                  <span className="metric-label">{t('monitoring.currentNdmi')}</span>
                  <span className="metric-value">{data.ndmi.toFixed(3)}</span>
                </div>
                <div className="metric-item">
                  <span className="metric-label">{t('monitoring.healthScore')}</span>
                  <span className="metric-value">{data.healthScore.toFixed(0)}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
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
    <div className={`comparative-analysis-page ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className="page-header">
        <h1>{t('monitoring.comparativeAnalysis')}</h1>
        <button 
          className="export-btn"
          onClick={exportData}
          disabled={!comparisonData}
        >
          <i className="icon-download"></i>
          {t('export.exportData')}
        </button>
      </div>

      <div className="analysis-controls">
        <div className="field-selector">
          <h3>{t('monitoring.selectFieldsToCompare')}</h3>
          <div className="fields-grid">
            {fields.map((field) => (
              <div
                key={field.id}
                className={`field-card ${selectedFields.includes(field.id) ? 'selected' : ''}`}
                onClick={() => toggleFieldSelection(field.id)}
              >
                <h4>{field.name}</h4>
                <p>{field.cropType}</p>
                <span>{field.area} {t('fields.hectares')}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="analysis-type-selector">
          <h3>{t('monitoring.analysisType')}</h3>
          <select 
            value={analysisType} 
            onChange={(e) => setAnalysisType(e.target.value)}
          >
            <option value="vegetation_indices">{t('monitoring.vegetationIndices')}</option>
            <option value="weather_comparison">{t('monitoring.weatherComparison')}</option>
            <option value="yield_performance">{t('monitoring.yieldPerformance')}</option>
            <option value="resource_efficiency">{t('monitoring.resourceEfficiency')}</option>
          </select>
        </div>

        <button
          className={`generate-btn ${selectedFields.length >= 2 ? 'enabled' : 'disabled'}`}
          onClick={generateComparison}
          disabled={selectedFields.length < 2 || loading}
        >
          {loading ? t('common.loading') : t('monitoring.generateComparison')}
        </button>
      </div>

      <div className="comparison-results">
        {renderComparisonResults()}
      </div>
    </div>
  );
};

export default ComparativeAnalysisPage;

