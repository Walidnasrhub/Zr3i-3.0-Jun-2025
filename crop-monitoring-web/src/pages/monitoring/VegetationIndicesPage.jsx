import React, { useState, useEffect } from 'react';
import { Layout } from '../../layout';
import { 
  Card, 
  CardContent, 
  Typography, 
  Grid, 
  Box, 
  Chip, 
  Accordion, 
  AccordionSummary, 
  AccordionDetails,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tooltip,
  IconButton
} from '@mui/material';
import { 
  ExpandMore, 
  Info, 
  TrendingUp, 
  Nature, 
  WaterDrop, 
  Agriculture,
  Visibility,
  Science
} from '@mui/icons-material';
import './VegetationIndicesPage.css';

const VegetationIndicesPage = () => {
  const [selectedField, setSelectedField] = useState('North Field');
  const [indicesData, setIndicesData] = useState({});

  // Comprehensive vegetation indices with formulas and descriptions
  const vegetationIndices = [
    {
      category: 'Basic Vegetation Indices',
      icon: <Nature />,
      color: '#4caf50',
      indices: [
        {
          name: 'NDVI',
          fullName: 'Normalized Difference Vegetation Index',
          formula: '(NIR - Red) / (NIR + Red)',
          range: '-1 to +1',
          description: 'Most widely used vegetation index for assessing plant health and biomass',
          interpretation: {
            'High (0.6-1.0)': 'Dense, healthy vegetation',
            'Moderate (0.2-0.6)': 'Sparse or stressed vegetation',
            'Low (-1.0-0.2)': 'Non-vegetated surfaces, water, or bare soil'
          },
          applications: ['Crop health monitoring', 'Biomass estimation', 'Phenology tracking'],
          currentValue: 0.72,
          status: 'Excellent',
          trend: 'increasing'
        },
        {
          name: 'EVI',
          fullName: 'Enhanced Vegetation Index',
          formula: '2.5 * ((NIR - Red) / (NIR + 6*Red - 7.5*Blue + 1))',
          range: '-1 to +1',
          description: 'Improved version of NDVI with better sensitivity in high biomass areas',
          interpretation: {
            'High (0.4-1.0)': 'Dense, healthy vegetation',
            'Moderate (0.2-0.4)': 'Moderate vegetation cover',
            'Low (-1.0-0.2)': 'Sparse vegetation or non-vegetated areas'
          },
          applications: ['High biomass areas', 'Canopy structure analysis', 'LAI estimation'],
          currentValue: 0.58,
          status: 'Good',
          trend: 'stable'
        },
        {
          name: 'SAVI',
          fullName: 'Soil Adjusted Vegetation Index',
          formula: '((NIR - Red) / (NIR + Red + L)) * (1 + L)',
          range: '-1 to +1',
          description: 'Minimizes soil brightness influences when vegetation cover is low',
          interpretation: {
            'High (0.5-1.0)': 'Dense vegetation with minimal soil influence',
            'Moderate (0.2-0.5)': 'Moderate vegetation with some soil background',
            'Low (-1.0-0.2)': 'Sparse vegetation or exposed soil'
          },
          applications: ['Arid regions', 'Early growth stages', 'Sparse vegetation monitoring'],
          currentValue: 0.45,
          status: 'Good',
          trend: 'increasing'
        }
      ]
    },
    {
      category: 'Water Stress Indices',
      icon: <WaterDrop />,
      color: '#2196f3',
      indices: [
        {
          name: 'NDWI',
          fullName: 'Normalized Difference Water Index',
          formula: '(Green - NIR) / (Green + NIR)',
          range: '-1 to +1',
          description: 'Detects water content in vegetation and surface water',
          interpretation: {
            'High (0.3-1.0)': 'High water content or water bodies',
            'Moderate (0.0-0.3)': 'Moderate water content',
            'Low (-1.0-0.0)': 'Low water content or dry vegetation'
          },
          applications: ['Drought monitoring', 'Irrigation planning', 'Water stress detection'],
          currentValue: 0.25,
          status: 'Moderate',
          trend: 'decreasing'
        },
        {
          name: 'NDMI',
          fullName: 'Normalized Difference Moisture Index',
          formula: '(NIR - SWIR) / (NIR + SWIR)',
          range: '-1 to +1',
          description: 'Sensitive to vegetation moisture content',
          interpretation: {
            'High (0.4-1.0)': 'High moisture content',
            'Moderate (0.1-0.4)': 'Moderate moisture levels',
            'Low (-1.0-0.1)': 'Low moisture or water stress'
          },
          applications: ['Drought assessment', 'Fire risk evaluation', 'Crop water status'],
          currentValue: 0.32,
          status: 'Good',
          trend: 'stable'
        },
        {
          name: 'MSI',
          fullName: 'Moisture Stress Index',
          formula: 'SWIR / NIR',
          range: '0 to 3+',
          description: 'Indicates plant water stress levels',
          interpretation: {
            'Low (0.4-1.0)': 'No water stress',
            'Moderate (1.0-1.5)': 'Moderate water stress',
            'High (1.5+)': 'Severe water stress'
          },
          applications: ['Irrigation scheduling', 'Drought monitoring', 'Yield prediction'],
          currentValue: 0.85,
          status: 'Good',
          trend: 'stable'
        }
      ]
    },
    {
      category: 'Chlorophyll & Leaf Indices',
      icon: <Science />,
      color: '#ff9800',
      indices: [
        {
          name: 'GNDVI',
          fullName: 'Green Normalized Difference Vegetation Index',
          formula: '(NIR - Green) / (NIR + Green)',
          range: '-1 to +1',
          description: 'More sensitive to chlorophyll content than NDVI',
          interpretation: {
            'High (0.6-1.0)': 'High chlorophyll content',
            'Moderate (0.3-0.6)': 'Moderate chlorophyll levels',
            'Low (-1.0-0.3)': 'Low chlorophyll or stressed vegetation'
          },
          applications: ['Chlorophyll assessment', 'Nitrogen status', 'Crop health monitoring'],
          currentValue: 0.68,
          status: 'Excellent',
          trend: 'increasing'
        },
        {
          name: 'MCARI',
          fullName: 'Modified Chlorophyll Absorption Ratio Index',
          formula: '((Red Edge - Red) - 0.2*(Red Edge - Green)) * (Red Edge / Red)',
          range: '0 to 2+',
          description: 'Sensitive to chlorophyll variations with reduced soil and atmospheric effects',
          interpretation: {
            'High (1.5+)': 'High chlorophyll content',
            'Moderate (0.5-1.5)': 'Moderate chlorophyll levels',
            'Low (0-0.5)': 'Low chlorophyll content'
          },
          applications: ['Precision agriculture', 'Nitrogen management', 'Crop monitoring'],
          currentValue: 1.25,
          status: 'Good',
          trend: 'stable'
        },
        {
          name: 'REIP',
          fullName: 'Red Edge Inflection Point',
          formula: '700 + 40 * ((NIR + Red)/2 - Red Edge) / (NIR - Red Edge)',
          range: '690-750 nm',
          description: 'Position of red edge inflection point, sensitive to chlorophyll content',
          interpretation: {
            'High (730-750)': 'High chlorophyll, healthy vegetation',
            'Moderate (710-730)': 'Moderate chlorophyll levels',
            'Low (690-710)': 'Low chlorophyll, stressed vegetation'
          },
          applications: ['Chlorophyll mapping', 'Crop health assessment', 'Precision farming'],
          currentValue: 725,
          status: 'Excellent',
          trend: 'stable'
        }
      ]
    },
    {
      category: 'Structural Indices',
      icon: <Agriculture />,
      color: '#9c27b0',
      indices: [
        {
          name: 'LAI',
          fullName: 'Leaf Area Index',
          formula: 'Derived from multiple spectral bands using empirical models',
          range: '0 to 10+',
          description: 'Measure of leaf area per unit ground area',
          interpretation: {
            'High (4-8)': 'Dense canopy cover',
            'Moderate (2-4)': 'Moderate canopy development',
            'Low (0-2)': 'Sparse canopy or early growth'
          },
          applications: ['Biomass estimation', 'Growth monitoring', 'Yield prediction'],
          currentValue: 3.8,
          status: 'Good',
          trend: 'increasing'
        },
        {
          name: 'FAPAR',
          fullName: 'Fraction of Absorbed Photosynthetically Active Radiation',
          formula: 'Derived from NDVI and other vegetation indices',
          range: '0 to 1',
          description: 'Fraction of PAR absorbed by vegetation',
          interpretation: {
            'High (0.7-1.0)': 'High light absorption efficiency',
            'Moderate (0.4-0.7)': 'Moderate light absorption',
            'Low (0-0.4)': 'Low light absorption efficiency'
          },
          applications: ['Photosynthesis monitoring', 'Productivity assessment', 'Carbon modeling'],
          currentValue: 0.72,
          status: 'Excellent',
          trend: 'stable'
        }
      ]
    },
    {
      category: 'Specialized Indices',
      icon: <Visibility />,
      color: '#607d8b',
      indices: [
        {
          name: 'ARVI',
          fullName: 'Atmospherically Resistant Vegetation Index',
          formula: '(NIR - (2*Red - Blue)) / (NIR + (2*Red - Blue))',
          range: '-1 to +1',
          description: 'Reduces atmospheric effects on vegetation monitoring',
          interpretation: {
            'High (0.5-1.0)': 'Dense, healthy vegetation',
            'Moderate (0.2-0.5)': 'Moderate vegetation cover',
            'Low (-1.0-0.2)': 'Sparse vegetation or non-vegetated areas'
          },
          applications: ['Atmospheric correction', 'Regional monitoring', 'Climate studies'],
          currentValue: 0.65,
          status: 'Good',
          trend: 'stable'
        },
        {
          name: 'OSAVI',
          fullName: 'Optimized Soil Adjusted Vegetation Index',
          formula: '(NIR - Red) / (NIR + Red + 0.16)',
          range: '-1 to +1',
          description: 'Optimized version of SAVI for better soil background correction',
          interpretation: {
            'High (0.5-1.0)': 'Dense vegetation with minimal soil influence',
            'Moderate (0.2-0.5)': 'Moderate vegetation cover',
            'Low (-1.0-0.2)': 'Sparse vegetation or exposed soil'
          },
          applications: ['Sparse vegetation monitoring', 'Soil background correction', 'Arid regions'],
          currentValue: 0.52,
          status: 'Good',
          trend: 'increasing'
        },
        {
          name: 'TCARI',
          fullName: 'Transformed Chlorophyll Absorption Ratio Index',
          formula: '3*((Red Edge - Red) - 0.2*(Red Edge - Green)*(Red Edge/Red))',
          range: '0 to 3+',
          description: 'Enhanced sensitivity to chlorophyll content',
          interpretation: {
            'High (2.0+)': 'High chlorophyll content',
            'Moderate (1.0-2.0)': 'Moderate chlorophyll levels',
            'Low (0-1.0)': 'Low chlorophyll content'
          },
          applications: ['Chlorophyll mapping', 'Nitrogen assessment', 'Crop health monitoring'],
          currentValue: 1.65,
          status: 'Good',
          trend: 'stable'
        }
      ]
    }
  ];

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'excellent': return '#4caf50';
      case 'good': return '#8bc34a';
      case 'moderate': return '#ff9800';
      case 'poor': return '#f44336';
      default: return '#9e9e9e';
    }
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'increasing': return '↗️';
      case 'decreasing': return '↘️';
      case 'stable': return '➡️';
      default: return '➡️';
    }
  };

  return (
    <Layout>
      <div className="vegetation-indices-page">
        <Box className="page-header">
          <Typography variant="h4" component="h1" gutterBottom>
            Vegetation Indices Analysis
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Comprehensive spectral analysis for {selectedField}
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {vegetationIndices.map((category, categoryIndex) => (
            <Grid item xs={12} key={categoryIndex}>
              <Card className="category-card">
                <CardContent>
                  <Box display="flex" alignItems="center" mb={2}>
                    <Box 
                      display="flex" 
                      alignItems="center" 
                      justifyContent="center"
                      width={40}
                      height={40}
                      borderRadius="50%"
                      bgcolor={category.color}
                      color="white"
                      mr={2}
                    >
                      {category.icon}
                    </Box>
                    <Typography variant="h5" component="h2">
                      {category.category}
                    </Typography>
                  </Box>

                  <Grid container spacing={2}>
                    {category.indices.map((index, indexIndex) => (
                      <Grid item xs={12} md={6} lg={4} key={indexIndex}>
                        <Card variant="outlined" className="index-card">
                          <CardContent>
                            <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
                              <Typography variant="h6" component="h3">
                                {index.name}
                              </Typography>
                              <Chip 
                                label={index.status}
                                size="small"
                                style={{ 
                                  backgroundColor: getStatusColor(index.status),
                                  color: 'white'
                                }}
                              />
                            </Box>
                            
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                              {index.fullName}
                            </Typography>
                            
                            <Box display="flex" alignItems="center" mb={2}>
                              <Typography variant="h4" component="div" mr={1}>
                                {index.currentValue}
                              </Typography>
                              <Typography variant="body2">
                                {getTrendIcon(index.trend)}
                              </Typography>
                            </Box>
                            
                            <Typography variant="body2" paragraph>
                              {index.description}
                            </Typography>

                            <Accordion>
                              <AccordionSummary expandIcon={<ExpandMore />}>
                                <Typography variant="body2">
                                  Details & Formula
                                </Typography>
                              </AccordionSummary>
                              <AccordionDetails>
                                <Box>
                                  <Typography variant="body2" gutterBottom>
                                    <strong>Formula:</strong> {index.formula}
                                  </Typography>
                                  <Typography variant="body2" gutterBottom>
                                    <strong>Range:</strong> {index.range}
                                  </Typography>
                                  
                                  <Typography variant="body2" gutterBottom mt={2}>
                                    <strong>Interpretation:</strong>
                                  </Typography>
                                  {Object.entries(index.interpretation).map(([range, meaning]) => (
                                    <Typography key={range} variant="body2" component="div">
                                      • <strong>{range}:</strong> {meaning}
                                    </Typography>
                                  ))}
                                  
                                  <Typography variant="body2" gutterBottom mt={2}>
                                    <strong>Applications:</strong>
                                  </Typography>
                                  <Box display="flex" flexWrap="wrap" gap={0.5}>
                                    {index.applications.map((app, appIndex) => (
                                      <Chip 
                                        key={appIndex}
                                        label={app}
                                        size="small"
                                        variant="outlined"
                                      />
                                    ))}
                                  </Box>
                                </Box>
                              </AccordionDetails>
                            </Accordion>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Summary Table */}
        <Grid item xs={12} mt={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Indices Summary for {selectedField}
              </Typography>
              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Index</TableCell>
                      <TableCell>Current Value</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Trend</TableCell>
                      <TableCell>Primary Use</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {vegetationIndices.flatMap(category => 
                      category.indices.map((index, i) => (
                        <TableRow key={`${category.category}-${i}`}>
                          <TableCell>
                            <strong>{index.name}</strong>
                            <br />
                            <Typography variant="caption" color="text.secondary">
                              {index.fullName}
                            </Typography>
                          </TableCell>
                          <TableCell>{index.currentValue}</TableCell>
                          <TableCell>
                            <Chip 
                              label={index.status}
                              size="small"
                              style={{ 
                                backgroundColor: getStatusColor(index.status),
                                color: 'white'
                              }}
                            />
                          </TableCell>
                          <TableCell>{getTrendIcon(index.trend)}</TableCell>
                          <TableCell>{index.applications[0]}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </div>
    </Layout>
  );
};

export default VegetationIndicesPage;

