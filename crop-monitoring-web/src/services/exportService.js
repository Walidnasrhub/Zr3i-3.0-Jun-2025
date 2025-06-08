class ExportService {
  constructor() {
    this.baseFileName = 'zr3i_export';
  }

  // Export field data as CSV
  async exportFieldDataAsCSV(fields, filename = 'field_data') {
    try {
      const csvHeader = 'Field Name,Crop Type,Area (hectares),Planting Date,Location,NDVI,NDMI,NDWI,Health Score\n';
      const csvData = fields.map(field => {
        return [
          field.name || '',
          field.cropType || '',
          field.area || 0,
          field.plantingDate || '',
          `"${field.location?.latitude || 0}, ${field.location?.longitude || 0}"`,
          field.satelliteData?.ndvi?.toFixed(3) || '0.000',
          field.satelliteData?.ndmi?.toFixed(3) || '0.000',
          field.satelliteData?.ndwi?.toFixed(3) || '0.000',
          field.healthScore || 0
        ].join(',');
      }).join('\n');

      const csvContent = csvHeader + csvData;
      this.downloadFile(csvContent, `${filename}_${this.getTimestamp()}.csv`, 'text/csv');
    } catch (error) {
      console.error('Error exporting CSV:', error);
      throw error;
    }
  }

  // Export comparative analysis data as JSON
  async exportComparativeAnalysisAsJSON(comparisonData, filename = 'comparative_analysis') {
    try {
      const exportData = {
        exportDate: new Date().toISOString(),
        analysisType: 'comparative_field_analysis',
        fields: comparisonData.map(data => ({
          fieldId: data.field.id,
          fieldName: data.field.name,
          area: data.field.area,
          currentMetrics: {
            ndvi: data.satellite?.ndvi,
            ndmi: data.satellite?.ndmi,
            ndwi: data.satellite?.ndwi,
            temperature: data.weather?.temperature,
            humidity: data.weather?.humidity,
          },
          historicalData: data.historical,
          healthScore: data.satellite?.ndvi ? (data.satellite.ndvi * 100).toFixed(0) : 0,
        })),
        summary: {
          totalFields: comparisonData.length,
          averageNDVI: comparisonData.reduce((sum, data) => sum + (data.satellite?.ndvi || 0), 0) / comparisonData.length,
          bestPerformingField: comparisonData.reduce((best, current) => 
            (current.satellite?.ndvi || 0) > (best.satellite?.ndvi || 0) ? current : best
          ).field.name,
        }
      };

      const jsonContent = JSON.stringify(exportData, null, 2);
      this.downloadFile(jsonContent, `${filename}_${this.getTimestamp()}.json`, 'application/json');
    } catch (error) {
      console.error('Error exporting JSON:', error);
      throw error;
    }
  }

  // Capture chart as image using html2canvas
  async captureChartAsImage(chartElement, filename = 'chart') {
    try {
      // Note: In a real implementation, you would use html2canvas library
      // For this demo, we'll simulate the functionality
      if (typeof html2canvas !== 'undefined') {
        const canvas = await html2canvas(chartElement, {
          backgroundColor: '#ffffff',
          scale: 2,
          logging: false,
        });
        
        canvas.toBlob((blob) => {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `${filename}_${this.getTimestamp()}.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        }, 'image/png');
      } else {
        throw new Error('html2canvas library not available');
      }
    } catch (error) {
      console.error('Error capturing chart:', error);
      throw error;
    }
  }

  // Generate comprehensive PDF report
  async generatePDFReport(reportData, filename = 'field_report') {
    try {
      const htmlContent = this.generateHTMLReport(reportData);
      
      // Note: In a real implementation, you would use jsPDF or similar library
      // For this demo, we'll download as HTML and provide instructions for PDF conversion
      this.downloadFile(htmlContent, `${filename}_${this.getTimestamp()}.html`, 'text/html');
      
      // Show instructions for PDF conversion
      alert('HTML report downloaded. You can convert it to PDF using your browser\'s print function (Ctrl+P) and selecting "Save as PDF".');
    } catch (error) {
      console.error('Error generating PDF report:', error);
      throw error;
    }
  }

  generateHTMLReport(reportData) {
    const { fields, weather, alerts, comparisonData, reportType = 'comprehensive' } = reportData;
    
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Zr3i 3.0 Field Report</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 20px;
            line-height: 1.6;
            color: #333;
        }
        .header {
            text-align: center;
            border-bottom: 2px solid #4CAF50;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        .logo {
            font-size: 24px;
            font-weight: bold;
            color: #4CAF50;
        }
        .report-title {
            font-size: 20px;
            margin: 10px 0;
        }
        .report-date {
            color: #666;
            font-size: 14px;
        }
        .section {
            margin: 30px 0;
            padding: 20px;
            border: 1px solid #ddd;
            border-radius: 8px;
        }
        .section-title {
            font-size: 18px;
            font-weight: bold;
            color: #4CAF50;
            margin-bottom: 15px;
            border-bottom: 1px solid #eee;
            padding-bottom: 5px;
        }
        .field-card {
            background: #f9f9f9;
            padding: 15px;
            margin: 10px 0;
            border-radius: 5px;
            border-left: 4px solid #4CAF50;
        }
        .field-name {
            font-weight: bold;
            font-size: 16px;
            margin-bottom: 10px;
        }
        .metrics-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 10px;
            margin: 10px 0;
        }
        .metric {
            background: white;
            padding: 10px;
            border-radius: 4px;
            text-align: center;
            border: 1px solid #eee;
        }
        .metric-label {
            font-size: 12px;
            color: #666;
            margin-bottom: 5px;
        }
        .metric-value {
            font-size: 16px;
            font-weight: bold;
            color: #333;
        }
        .alert {
            padding: 10px;
            margin: 5px 0;
            border-radius: 4px;
            border-left: 4px solid #ff9800;
        }
        .alert.warning {
            background: #fff3cd;
            border-color: #ff9800;
        }
        .alert.info {
            background: #d1ecf1;
            border-color: #17a2b8;
        }
        .weather-summary {
            background: #e3f2fd;
            padding: 15px;
            border-radius: 8px;
            margin: 10px 0;
        }
        .footer {
            margin-top: 50px;
            text-align: center;
            color: #666;
            font-size: 12px;
            border-top: 1px solid #eee;
            padding-top: 20px;
        }
        @media print {
            body { margin: 0; }
            .section { break-inside: avoid; }
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="logo">Zr3i 3.0</div>
        <div class="report-title">Agricultural Field Report</div>
        <div class="report-date">Generated on ${new Date().toLocaleDateString()}</div>
    </div>

    ${weather ? `
    <div class="section">
        <div class="section-title">Weather Summary</div>
        <div class="weather-summary">
            <strong>Current Conditions:</strong> ${weather.description || 'N/A'}<br>
            <strong>Temperature:</strong> ${weather.temperature || 'N/A'}°C<br>
            <strong>Humidity:</strong> ${weather.humidity || 'N/A'}%<br>
            <strong>Wind Speed:</strong> ${weather.windSpeed || 'N/A'} km/h
        </div>
    </div>
    ` : ''}

    <div class="section">
        <div class="section-title">Field Overview</div>
        ${fields && fields.length > 0 ? fields.map(field => `
            <div class="field-card">
                <div class="field-name">${field.name || 'Unnamed Field'}</div>
                <p><strong>Crop Type:</strong> ${field.cropType || 'N/A'}</p>
                <p><strong>Area:</strong> ${field.area || 0} hectares</p>
                <p><strong>Planting Date:</strong> ${field.plantingDate || 'N/A'}</p>
                
                <div class="metrics-grid">
                    <div class="metric">
                        <div class="metric-label">NDVI</div>
                        <div class="metric-value">${field.satelliteData?.ndvi?.toFixed(3) || '0.000'}</div>
                    </div>
                    <div class="metric">
                        <div class="metric-label">NDMI</div>
                        <div class="metric-value">${field.satelliteData?.ndmi?.toFixed(3) || '0.000'}</div>
                    </div>
                    <div class="metric">
                        <div class="metric-label">NDWI</div>
                        <div class="metric-value">${field.satelliteData?.ndwi?.toFixed(3) || '0.000'}</div>
                    </div>
                    <div class="metric">
                        <div class="metric-label">Health Score</div>
                        <div class="metric-value">${field.healthScore || 0}%</div>
                    </div>
                </div>
            </div>
        `).join('') : '<p>No field data available.</p>'}
    </div>

    ${alerts && alerts.length > 0 ? `
    <div class="section">
        <div class="section-title">Active Alerts</div>
        ${alerts.map(alert => `
            <div class="alert ${alert.severity}">
                <strong>${alert.title}</strong><br>
                ${alert.message}<br>
                <small>Time: ${alert.timestamp ? new Date(alert.timestamp).toLocaleString() : 'N/A'}</small>
            </div>
        `).join('')}
    </div>
    ` : ''}

    ${comparisonData && comparisonData.length > 0 ? `
    <div class="section">
        <div class="section-title">Comparative Analysis</div>
        <p>Comparison of ${comparisonData.length} fields based on vegetation indices and performance metrics.</p>
        
        <div class="metrics-grid">
            ${comparisonData.map(data => `
                <div class="metric">
                    <div class="metric-label">${data.field.name}</div>
                    <div class="metric-value">NDVI: ${data.satellite?.ndvi?.toFixed(3) || '0.000'}</div>
                </div>
            `).join('')}
        </div>
    </div>
    ` : ''}

    <div class="footer">
        <p>This report was generated by Zr3i 3.0 - Agriculture Platform As A Service</p>
        <p>For more information, visit our platform or contact support.</p>
    </div>
</body>
</html>
    `;
  }

  // Export weather data
  async exportWeatherData(weatherData, filename = 'weather_data') {
    try {
      const exportData = {
        exportDate: new Date().toISOString(),
        currentWeather: weatherData.current || {},
        forecast: weatherData.forecast || [],
        historical: weatherData.historical || [],
      };

      const jsonContent = JSON.stringify(exportData, null, 2);
      this.downloadFile(jsonContent, `${filename}_${this.getTimestamp()}.json`, 'application/json');
    } catch (error) {
      console.error('Error exporting weather data:', error);
      throw error;
    }
  }

  // Export satellite images (placeholder)
  async exportSatelliteImages(imageData, filename = 'satellite_images') {
    try {
      // In a real implementation, this would handle actual satellite imagery
      alert('Satellite image export feature will be available soon. Please use the individual image download options for now.');
    } catch (error) {
      console.error('Error exporting satellite images:', error);
      throw error;
    }
  }

  // Utility function to download file
  downloadFile(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  // Get timestamp for filename
  getTimestamp() {
    return new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];
  }

  // Export dashboard configuration
  async exportDashboardConfig(config, filename = 'dashboard_config') {
    try {
      const exportData = {
        exportDate: new Date().toISOString(),
        version: '1.0',
        config: config,
      };

      const jsonContent = JSON.stringify(exportData, null, 2);
      this.downloadFile(jsonContent, `${filename}_${this.getTimestamp()}.json`, 'application/json');
    } catch (error) {
      console.error('Error exporting dashboard config:', error);
      throw error;
    }
  }

  // Import dashboard configuration
  async importDashboardConfig(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          if (data.config) {
            resolve(data.config);
          } else {
            reject(new Error('Invalid configuration file format'));
          }
        } catch (error) {
          reject(new Error('Failed to parse configuration file'));
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  }

  // Bulk export all data
  async exportAllData(allData, filename = 'complete_export') {
    try {
      const exportData = {
        exportDate: new Date().toISOString(),
        version: '1.0',
        fields: allData.fields || [],
        weather: allData.weather || {},
        alerts: allData.alerts || [],
        dashboardConfig: allData.dashboardConfig || {},
        userPreferences: allData.userPreferences || {},
        comparisonData: allData.comparisonData || [],
      };

      const jsonContent = JSON.stringify(exportData, null, 2);
      this.downloadFile(jsonContent, `${filename}_${this.getTimestamp()}.json`, 'application/json');
    } catch (error) {
      console.error('Error exporting all data:', error);
      throw error;
    }
  }
}

export default new ExportService();

