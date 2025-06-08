import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as MediaLibrary from 'expo-media-library';
import { captureRef } from 'react-native-view-shot';
import { Alert } from 'react-native';

class ExportService {
  constructor() {
    this.baseDirectory = FileSystem.documentDirectory + 'exports/';
    this.ensureDirectoryExists();
  }

  async ensureDirectoryExists() {
    try {
      const dirInfo = await FileSystem.getInfoAsync(this.baseDirectory);
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(this.baseDirectory, { intermediates: true });
      }
    } catch (error) {
      console.error('Error creating export directory:', error);
    }
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
      const filePath = this.baseDirectory + `${filename}_${Date.now()}.csv`;
      
      await FileSystem.writeAsStringAsync(filePath, csvContent);
      return filePath;
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
      const filePath = this.baseDirectory + `${filename}_${Date.now()}.json`;
      
      await FileSystem.writeAsStringAsync(filePath, jsonContent);
      return filePath;
    } catch (error) {
      console.error('Error exporting JSON:', error);
      throw error;
    }
  }

  // Capture chart as image
  async captureChartAsImage(chartRef, filename = 'chart') {
    try {
      const uri = await captureRef(chartRef, {
        format: 'png',
        quality: 1.0,
        result: 'tmpfile',
      });

      const filePath = this.baseDirectory + `${filename}_${Date.now()}.png`;
      await FileSystem.moveAsync({
        from: uri,
        to: filePath,
      });

      return filePath;
    } catch (error) {
      console.error('Error capturing chart:', error);
      throw error;
    }
  }

  // Generate comprehensive PDF report
  async generatePDFReport(reportData, filename = 'field_report') {
    try {
      const htmlContent = this.generateHTMLReport(reportData);
      const htmlFilePath = this.baseDirectory + `${filename}_${Date.now()}.html`;
      
      await FileSystem.writeAsStringAsync(htmlFilePath, htmlContent);
      
      // Note: In a real implementation, you would use a library like react-native-html-to-pdf
      // For this demo, we'll return the HTML file path
      return htmlFilePath;
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

  // Share exported file
  async shareFile(filePath, title = 'Zr3i Export') {
    try {
      const isAvailable = await Sharing.isAvailableAsync();
      if (isAvailable) {
        await Sharing.shareAsync(filePath, {
          mimeType: this.getMimeType(filePath),
          dialogTitle: title,
        });
      } else {
        Alert.alert('Sharing not available', 'Sharing is not available on this device');
      }
    } catch (error) {
      console.error('Error sharing file:', error);
      throw error;
    }
  }

  // Save to device gallery (for images)
  async saveToGallery(filePath) {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status === 'granted') {
        await MediaLibrary.saveToLibraryAsync(filePath);
        Alert.alert('Success', 'File saved to gallery');
      } else {
        Alert.alert('Permission denied', 'Cannot save to gallery without permission');
      }
    } catch (error) {
      console.error('Error saving to gallery:', error);
      throw error;
    }
  }

  getMimeType(filePath) {
    const extension = filePath.split('.').pop().toLowerCase();
    const mimeTypes = {
      'pdf': 'application/pdf',
      'csv': 'text/csv',
      'json': 'application/json',
      'png': 'image/png',
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'html': 'text/html',
    };
    return mimeTypes[extension] || 'application/octet-stream';
  }

  // Get list of exported files
  async getExportedFiles() {
    try {
      const files = await FileSystem.readDirectoryAsync(this.baseDirectory);
      const fileDetails = await Promise.all(
        files.map(async (filename) => {
          const filePath = this.baseDirectory + filename;
          const info = await FileSystem.getInfoAsync(filePath);
          return {
            name: filename,
            path: filePath,
            size: info.size,
            modificationTime: info.modificationTime,
            type: this.getMimeType(filename),
          };
        })
      );
      return fileDetails.sort((a, b) => b.modificationTime - a.modificationTime);
    } catch (error) {
      console.error('Error getting exported files:', error);
      return [];
    }
  }

  // Delete exported file
  async deleteExportedFile(filePath) {
    try {
      await FileSystem.deleteAsync(filePath);
    } catch (error) {
      console.error('Error deleting file:', error);
      throw error;
    }
  }

  // Clean up old exports (keep only last 10 files)
  async cleanupOldExports() {
    try {
      const files = await this.getExportedFiles();
      if (files.length > 10) {
        const filesToDelete = files.slice(10);
        await Promise.all(
          filesToDelete.map(file => this.deleteExportedFile(file.path))
        );
      }
    } catch (error) {
      console.error('Error cleaning up exports:', error);
    }
  }
}

export default new ExportService();

