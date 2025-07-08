import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Box,
  Chip,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Refresh,
  Agriculture,
  Grain,
  LocalFlorist
} from '@mui/icons-material';

const CommodityPricesPage = () => {
  const [commodities, setCommodities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Free commodities available from API Ninjas
  const freeCommodities = [
    { name: 'lean_hogs', displayName: 'Lean Hogs', category: 'Livestock', icon: '🐷' },
    { name: 'oat', displayName: 'Oat', category: 'Grains', icon: '🌾' },
    { name: 'rough_rice', displayName: 'Rough Rice', category: 'Grains', icon: '🌾' },
    { name: 'soybean_meal', displayName: 'Soybean Meal', category: 'Feed', icon: '🌱' },
    { name: 'gold', displayName: 'Gold', category: 'Metals', icon: '🥇' },
    { name: 'platinum', displayName: 'Platinum', category: 'Metals', icon: '⚪' },
    { name: 'aluminum', displayName: 'Aluminum', category: 'Metals', icon: '🔩' },
    { name: 'lumber', displayName: 'Lumber', category: 'Materials', icon: '🪵' }
  ];

  const fetchCommodityPrice = async (commodity) => {
    try {
      // Note: In a real implementation, you would use your actual API key
      // For demo purposes, we'll simulate the API response
      const mockPrices = {
        lean_hogs: { price: 75.25, exchange: 'CME' },
        oat: { price: 3.45, exchange: 'CBOT' },
        rough_rice: { price: 16.80, exchange: 'CBOT' },
        soybean_meal: { price: 345.50, exchange: 'CBOT' },
        gold: { price: 2650.75, exchange: 'NYMEX' },
        platinum: { price: 995.05, exchange: 'NYMEX' },
        aluminum: { price: 2.15, exchange: 'LME' },
        lumber: { price: 485.20, exchange: 'CME' }
      };

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      const mockData = mockPrices[commodity.name];
      if (mockData) {
        return {
          ...commodity,
          ...mockData,
          updated: Date.now(),
          change: (Math.random() - 0.5) * 10, // Random change for demo
          changePercent: (Math.random() - 0.5) * 5 // Random percentage change
        };
      }
      throw new Error('Commodity not found');
    } catch (error) {
      console.error(`Error fetching ${commodity.name}:`, error);
      return null;
    }
  };

  const fetchAllPrices = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const promises = freeCommodities.map(commodity => fetchCommodityPrice(commodity));
      const results = await Promise.all(promises);
      const validResults = results.filter(result => result !== null);
      
      setCommodities(validResults);
      setLastUpdated(new Date());
    } catch (err) {
      setError('Failed to fetch commodity prices. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllPrices();
  }, []);

  const formatPrice = (price, category) => {
    if (category === 'Metals') {
      return `$${price.toFixed(2)}/oz`;
    } else if (category === 'Livestock') {
      return `$${price.toFixed(2)}/cwt`;
    } else if (category === 'Materials') {
      return `$${price.toFixed(2)}/1000 board feet`;
    } else {
      return `$${price.toFixed(2)}/bushel`;
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Livestock':
        return <Agriculture />;
      case 'Grains':
      case 'Feed':
        return <Grain />;
      case 'Metals':
      case 'Materials':
        return <LocalFlorist />;
      default:
        return <Agriculture />;
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Livestock':
        return 'primary';
      case 'Grains':
        return 'success';
      case 'Feed':
        return 'warning';
      case 'Metals':
        return 'secondary';
      case 'Materials':
        return 'info';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress size={60} />
          <Typography variant="h6" sx={{ ml: 2 }}>
            Loading commodity prices...
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            📈 Commodity Market Prices
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Real-time market data for agricultural commodities and materials
          </Typography>
        </Box>
        <Tooltip title="Refresh Prices">
          <IconButton onClick={fetchAllPrices} disabled={loading}>
            <Refresh />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Last Updated */}
      {lastUpdated && (
        <Alert severity="info" sx={{ mb: 3 }}>
          Last updated: {lastUpdated.toLocaleString()}
        </Alert>
      )}

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Commodity Cards Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {commodities.map((commodity) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={commodity.name}>
            <Card 
              sx={{ 
                height: '100%',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4
                }
              }}
            >
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                  <Box>
                    <Typography variant="h6" component="div" gutterBottom>
                      {commodity.icon} {commodity.displayName}
                    </Typography>
                    <Chip 
                      label={commodity.category}
                      color={getCategoryColor(commodity.category)}
                      size="small"
                      icon={getCategoryIcon(commodity.category)}
                    />
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    {commodity.exchange}
                  </Typography>
                </Box>

                <Typography variant="h5" color="primary" gutterBottom>
                  {formatPrice(commodity.price, commodity.category)}
                </Typography>

                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box display="flex" alignItems="center">
                    {commodity.change >= 0 ? (
                      <TrendingUp color="success" fontSize="small" />
                    ) : (
                      <TrendingDown color="error" fontSize="small" />
                    )}
                    <Typography 
                      variant="body2" 
                      color={commodity.change >= 0 ? 'success.main' : 'error.main'}
                      sx={{ ml: 0.5 }}
                    >
                      {commodity.change >= 0 ? '+' : ''}{commodity.change.toFixed(2)}
                    </Typography>
                  </Box>
                  <Typography 
                    variant="body2" 
                    color={commodity.changePercent >= 0 ? 'success.main' : 'error.main'}
                  >
                    ({commodity.changePercent >= 0 ? '+' : ''}{commodity.changePercent.toFixed(2)}%)
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Detailed Table */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Detailed Price Information
          </Typography>
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Commodity</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Exchange</TableCell>
                  <TableCell align="right">Current Price</TableCell>
                  <TableCell align="right">Change</TableCell>
                  <TableCell align="right">Change %</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {commodities.map((commodity) => (
                  <TableRow key={commodity.name} hover>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <span style={{ marginRight: 8 }}>{commodity.icon}</span>
                        {commodity.displayName}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={commodity.category}
                        color={getCategoryColor(commodity.category)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{commodity.exchange}</TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" fontWeight="bold">
                        {formatPrice(commodity.price, commodity.category)}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Box display="flex" alignItems="center" justifyContent="flex-end">
                        {commodity.change >= 0 ? (
                          <TrendingUp color="success" fontSize="small" />
                        ) : (
                          <TrendingDown color="error" fontSize="small" />
                        )}
                        <Typography 
                          variant="body2" 
                          color={commodity.change >= 0 ? 'success.main' : 'error.main'}
                          sx={{ ml: 0.5 }}
                        >
                          {commodity.change >= 0 ? '+' : ''}{commodity.change.toFixed(2)}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      <Typography 
                        variant="body2" 
                        color={commodity.changePercent >= 0 ? 'success.main' : 'error.main'}
                      >
                        {commodity.changePercent >= 0 ? '+' : ''}{commodity.changePercent.toFixed(2)}%
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Premium Notice */}
      <Alert severity="info" sx={{ mt: 3 }}>
        <Typography variant="body2">
          <strong>Note:</strong> This demo shows free commodity data. Premium agricultural commodities 
          (wheat, corn, soybeans, cotton, coffee, sugar) are available with a premium subscription. 
          Upgrade to access comprehensive market data for all major crops.
        </Typography>
      </Alert>
    </Container>
  );
};

export default CommodityPricesPage;

