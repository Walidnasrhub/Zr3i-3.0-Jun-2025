import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Cloud, Droplets, Thermometer, Wind, Umbrella, Compass, BarChart2 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';

export default function WeatherEnvironmentPage() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('current');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedField, setSelectedField] = useState(null);
  const [fields, setFields] = useState([]);
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState([]);
  const [historicalData, setHistoricalData] = useState([]);
  const [airQualityData, setAirQualityData] = useState(null);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
  });

  // Mock data for demonstration
  useEffect(() => {
    // Simulate loading fields
    setIsLoading(true);
    setTimeout(() => {
      const mockFields = [
        {
          id: 1,
          name: 'Nile Delta Field 1',
          description: 'Rice cultivation field in the Nile Delta',
          crop_type: 'Rice',
          area_hectares: 25.5,
          center_lat: 30.9427,
          center_lon: 31.1198,
        },
        {
          id: 2,
          name: 'Upper Egypt Field',
          description: 'Wheat cultivation field in Upper Egypt',
          crop_type: 'Wheat',
          area_hectares: 18.3,
          center_lat: 25.6872,
          center_lon: 32.6396,
        },
      ];
      setFields(mockFields);
      setIsLoading(false);
    }, 1000);
  }, []);

  // Handle field selection
  const handleFieldSelect = (field) => {
    setSelectedField(field);
    
    // Simulate loading weather data for the selected field
    setIsLoading(true);
    setTimeout(() => {
      // Current weather data
      const mockWeatherData = {
        temperature: 28 + Math.random() * 5,
        humidity: 40 + Math.random() * 30,
        wind_speed: 5 + Math.random() * 10,
        wind_direction: 'NE',
        pressure: 1010 + Math.random() * 10,
        precipitation: Math.random() * 5,
        cloud_cover: Math.random() * 30,
        timestamp: new Date().toISOString(),
        location: {
          lat: field.center_lat,
          lon: field.center_lon,
        },
      };
      setWeatherData(mockWeatherData);
      
      // Forecast data
      const mockForecastData = [];
      const now = new Date();
      for (let i = 0; i < 7; i++) {
        const date = new Date(now);
        date.setDate(date.getDate() + i);
        mockForecastData.push({
          date: date.toISOString().split('T')[0],
          temperature_min: 22 + Math.random() * 5,
          temperature_max: 30 + Math.random() * 5,
          humidity: 40 + Math.random() * 30,
          precipitation_probability: Math.random() * 100,
          precipitation_amount: Math.random() * 10,
          wind_speed: 5 + Math.random() * 10,
          cloud_cover: Math.random() * 100,
        });
      }
      setForecastData(mockForecastData);
      
      // Historical data
      const mockHistoricalData = [];
      const startDate = new Date(dateRange.startDate);
      const endDate = new Date(dateRange.endDate);
      const dayDiff = Math.floor((endDate - startDate) / (24 * 60 * 60 * 1000));
      
      for (let i = 0; i <= dayDiff; i++) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + i);
        mockHistoricalData.push({
          date: date.toISOString().split('T')[0],
          temperature_avg: 25 + Math.random() * 5,
          temperature_min: 20 + Math.random() * 5,
          temperature_max: 30 + Math.random() * 5,
          humidity: 40 + Math.random() * 30,
          precipitation: Math.random() * 5,
          wind_speed: 5 + Math.random() * 10,
        });
      }
      setHistoricalData(mockHistoricalData);
      
      // Air quality data
      const mockAirQualityData = {
        aqi: 50 + Math.random() * 50,
        pm25: 10 + Math.random() * 20,
        pm10: 20 + Math.random() * 30,
        o3: 30 + Math.random() * 40,
        no2: 10 + Math.random() * 20,
        so2: 5 + Math.random() * 10,
        co: 0.5 + Math.random() * 1,
        timestamp: new Date().toISOString(),
        category: 'Moderate',
        location: {
          lat: field.center_lat,
          lon: field.center_lon,
        },
      };
      setAirQualityData(mockAirQualityData);
      
      setIsLoading(false);
    }, 1000);
  };

  // Handle date range change
  const handleDateRangeChange = (e) => {
    setDateRange({
      ...dateRange,
      [e.target.name]: e.target.value,
    });
  };

  // Handle apply filter
  const handleApplyFilter = () => {
    if (!selectedField) return;
    
    // Reload historical data with new date range
    setIsLoading(true);
    setTimeout(() => {
      // Historical data
      const mockHistoricalData = [];
      const startDate = new Date(dateRange.startDate);
      const endDate = new Date(dateRange.endDate);
      const dayDiff = Math.floor((endDate - startDate) / (24 * 60 * 60 * 1000));
      
      for (let i = 0; i <= dayDiff; i++) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + i);
        mockHistoricalData.push({
          date: date.toISOString().split('T')[0],
          temperature_avg: 25 + Math.random() * 5,
          temperature_min: 20 + Math.random() * 5,
          temperature_max: 30 + Math.random() * 5,
          humidity: 40 + Math.random() * 30,
          precipitation: Math.random() * 5,
          wind_speed: 5 + Math.random() * 10,
        });
      }
      setHistoricalData(mockHistoricalData);
      
      setIsLoading(false);
    }, 1000);
  };

  // Get weather icon based on conditions
  const getWeatherIcon = (cloudCover, precipitation) => {
    if (precipitation > 1) {
      return <Umbrella className="h-16 w-16 text-blue-500" />;
    } else if (cloudCover > 50) {
      return <Cloud className="h-16 w-16 text-gray-500" />;
    } else {
      return <Thermometer className="h-16 w-16 text-orange-500" />;
    }
  };

  // Get air quality category color
  const getAirQualityColor = (aqi) => {
    if (aqi <= 50) return 'text-green-500';
    if (aqi <= 100) return 'text-yellow-500';
    if (aqi <= 150) return 'text-orange-500';
    if (aqi <= 200) return 'text-red-500';
    if (aqi <= 300) return 'text-purple-500';
    return 'text-rose-900';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{t('monitoring.weatherEnvironment')}</h1>
        <div className="space-x-2">
          <Button
            variant="outline"
            onClick={() => setActiveTab('current')}
          >
            <Thermometer className="mr-2 h-4 w-4" />
            {t('monitoring.realTimeData')}
          </Button>
          <Button
            variant="outline"
            onClick={() => setActiveTab('forecast')}
          >
            <Cloud className="mr-2 h-4 w-4" />
            {t('monitoring.forecastData')}
          </Button>
          <Button
            variant="outline"
            onClick={() => setActiveTab('historical')}
          >
            <BarChart2 className="mr-2 h-4 w-4" />
            {t('monitoring.historicalData')}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>{t('fields.fields')}</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading && !selectedField ? (
                <div className="flex items-center justify-center h-64">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <div className="space-y-2">
                  {fields.map((field) => (
                    <div
                      key={field.id}
                      className={`p-3 rounded-md cursor-pointer transition-colors ${
                        selectedField?.id === field.id
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-card hover:bg-muted'
                      }`}
                      onClick={() => handleFieldSelect(field)}
                    >
                      <h3 className="font-medium">{field.name}</h3>
                      <p className="text-sm truncate">
                        {field.crop_type} - {field.area_hectares.toFixed(2)} {t('fields.hectares')}
                      </p>
                    </div>
                  ))}
                  {fields.length === 0 && (
                    <p className="text-muted-foreground">{t('fields.noFields')}</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {selectedField && activeTab === 'historical' && (
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>{t('monitoring.dataRange')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      {t('monitoring.startDate')}
                    </label>
                    <input
                      type="date"
                      name="startDate"
                      value={dateRange.startDate}
                      onChange={handleDateRangeChange}
                      className="w-full rounded-md border border-input bg-background px-3 py-2"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      {t('monitoring.endDate')}
                    </label>
                    <input
                      type="date"
                      name="endDate"
                      value={dateRange.endDate}
                      onChange={handleDateRangeChange}
                      className="w-full rounded-md border border-input bg-background px-3 py-2"
                    />
                  </div>
                  <Button
                    onClick={handleApplyFilter}
                    disabled={isLoading}
                    className="w-full"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {t('common.loading')}
                      </>
                    ) : (
                      t('monitoring.applyFilter')
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {selectedField && weatherData && (
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>{t('monitoring.lastUpdated')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  {new Date(weatherData.timestamp).toLocaleString()}
                </p>
                <Button
                  variant="outline"
                  className="w-full mt-4"
                  onClick={() => handleFieldSelect(selectedField)}
                >
                  <Loader2 className="mr-2 h-4 w-4" />
                  {t('monitoring.refreshData')}
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="md:col-span-3">
          {isLoading && selectedField ? (
            <div className="flex items-center justify-center h-64 bg-card rounded-lg">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : !selectedField ? (
            <div className="flex items-center justify-center h-64 bg-card rounded-lg">
              <p className="text-muted-foreground">{t('fields.selectField')}</p>
            </div>
          ) : (
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="current">
                  <Thermometer className="h-4 w-4 mr-2" />
                  {t('monitoring.realTimeData')}
                </TabsTrigger>
                <TabsTrigger value="forecast">
                  <Cloud className="h-4 w-4 mr-2" />
                  {t('monitoring.forecastData')}
                </TabsTrigger>
                <TabsTrigger value="historical">
                  <BarChart2 className="h-4 w-4 mr-2" />
                  {t('monitoring.historicalData')}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="current" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>{t('monitoring.weatherData')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col items-center mb-4">
                        {getWeatherIcon(weatherData.cloud_cover, weatherData.precipitation)}
                        <div className="text-center mt-2">
                          <h3 className="text-3xl font-bold">
                            {weatherData.temperature.toFixed(1)}°C
                          </h3>
                          <p className="text-muted-foreground">
                            {weatherData.cloud_cover < 30
                              ? t('common.clear')
                              : weatherData.cloud_cover < 70
                              ? t('common.partlyCloudy')
                              : t('common.cloudy')}
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mt-6">
                        <div className="flex flex-col items-center">
                          <Droplets className="h-5 w-5 text-blue-500 mb-1" />
                          <p className="text-sm text-muted-foreground">
                            {t('monitoring.humidity')}
                          </p>
                          <p className="font-medium">{weatherData.humidity.toFixed(0)}%</p>
                        </div>
                        <div className="flex flex-col items-center">
                          <Wind className="h-5 w-5 text-blue-500 mb-1" />
                          <p className="text-sm text-muted-foreground">
                            {t('monitoring.windSpeed')}
                          </p>
                          <p className="font-medium">{weatherData.wind_speed.toFixed(1)} km/h</p>
                        </div>
                        <div className="flex flex-col items-center">
                          <Compass className="h-5 w-5 text-blue-500 mb-1" />
                          <p className="text-sm text-muted-foreground">
                            {t('monitoring.windDirection')}
                          </p>
                          <p className="font-medium">{weatherData.wind_direction}</p>
                        </div>
                        <div className="flex flex-col items-center">
                          <Umbrella className="h-5 w-5 text-blue-500 mb-1" />
                          <p className="text-sm text-muted-foreground">
                            {t('monitoring.precipitation')}
                          </p>
                          <p className="font-medium">{weatherData.precipitation.toFixed(1)} mm</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>{t('monitoring.airQuality')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col items-center mb-4">
                        <div className={`text-5xl font-bold ${getAirQualityColor(airQualityData.aqi)}`}>
                          {airQualityData.aqi.toFixed(0)}
                        </div>
                        <p className={`font-medium ${getAirQualityColor(airQualityData.aqi)}`}>
                          {airQualityData.category}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {t('monitoring.airQualityIndex')}
                        </p>
                      </div>
                      <div className="space-y-3 mt-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">PM2.5</span>
                          <span className="font-medium">{airQualityData.pm25.toFixed(1)} µg/m³</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">PM10</span>
                          <span className="font-medium">{airQualityData.pm10.toFixed(1)} µg/m³</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">O₃</span>
                          <span className="font-medium">{airQualityData.o3.toFixed(1)} µg/m³</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">NO₂</span>
                          <span className="font-medium">{airQualityData.no2.toFixed(1)} µg/m³</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>{t('monitoring.weatherAnomaly')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p>
                        {t('monitoring.weatherAnomalyDescription')}
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-muted p-4 rounded-md">
                          <h4 className="font-medium mb-2">{t('monitoring.temperature')}</h4>
                          <div className="flex items-center">
                            <Thermometer className="h-5 w-5 mr-2 text-orange-500" />
                            <span>+2.1°C {t('common.aboveAverage')}</span>
                          </div>
                        </div>
                        <div className="bg-muted p-4 rounded-md">
                          <h4 className="font-medium mb-2">{t('monitoring.precipitation')}</h4>
                          <div className="flex items-center">
                            <Umbrella className="h-5 w-5 mr-2 text-blue-500" />
                            <span>-15% {t('common.belowAverage')}</span>
                          </div>
                        </div>
                        <div className="bg-muted p-4 rounded-md">
                          <h4 className="font-medium mb-2">{t('monitoring.humidity')}</h4>
                          <div className="flex items-center">
                            <Droplets className="h-5 w-5 mr-2 text-blue-500" />
                            <span>{t('common.normal')}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="forecast" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>{t('monitoring.forecastData')} (7 {t('common.days')})</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-7 gap-2">
                      {forecastData.map((day, index) => (
                        <div
                          key={index}
                          className="bg-muted p-3 rounded-md text-center"
                        >
                          <p className="font-medium">
                            {new Date(day.date).toLocaleDateString(undefined, { weekday: 'short' })}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(day.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                          </p>
                          <div className="my-2">
                            {day.precipitation_probability > 50 ? (
                              <Umbrella className="h-8 w-8 mx-auto text-blue-500" />
                            ) : day.cloud_cover > 50 ? (
                              <Cloud className="h-8 w-8 mx-auto text-gray-500" />
                            ) : (
                              <Thermometer className="h-8 w-8 mx-auto text-orange-500" />
                            )}
                          </div>
                          <div className="flex justify-center space-x-2 text-sm">
                            <span className="font-medium">{day.temperature_max.toFixed(0)}°</span>
                            <span className="text-muted-foreground">{day.temperature_min.toFixed(0)}°</span>
                          </div>
                          <div className="mt-2 text-xs text-muted-foreground">
                            {day.precipitation_probability.toFixed(0)}% {t('common.chance')}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>{t('monitoring.temperatureForecast')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart
                            data={forecastData}
                            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                              dataKey="date"
                              tickFormatter={(date) => new Date(date).toLocaleDateString(undefined, { weekday: 'short' })}
                            />
                            <YAxis />
                            <Tooltip
                              labelFormatter={(date) => new Date(date).toLocaleDateString()}
                              formatter={(value) => [`${value.toFixed(1)}°C`, '']}
                            />
                            <Area
                              type="monotone"
                              dataKey="temperature_max"
                              stroke="#ff7300"
                              fill="#ff7300"
                              name={t('monitoring.max')}
                              fillOpacity={0.3}
                            />
                            <Area
                              type="monotone"
                              dataKey="temperature_min"
                              stroke="#82ca9d"
                              fill="#82ca9d"
                              name={t('monitoring.min')}
                              fillOpacity={0.3}
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>{t('monitoring.precipitationForecast')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart
                            data={forecastData}
                            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                              dataKey="date"
                              tickFormatter={(date) => new Date(date).toLocaleDateString(undefined, { weekday: 'short' })}
                            />
                            <YAxis yAxisId="left" orientation="left" />
                            <YAxis yAxisId="right" orientation="right" />
                            <Tooltip
                              labelFormatter={(date) => new Date(date).toLocaleDateString()}
                            />
                            <Area
                              yAxisId="left"
                              type="monotone"
                              dataKey="precipitation_probability"
                              stroke="#8884d8"
                              fill="#8884d8"
                              name={t('common.probability')}
                              unit="%"
                              fillOpacity={0.3}
                            />
                            <Area
                              yAxisId="right"
                              type="monotone"
                              dataKey="precipitation_amount"
                              stroke="#82ca9d"
                              fill="#82ca9d"
                              name={t('common.amount')}
                              unit=" mm"
                              fillOpacity={0.3}
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="historical" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>{t('monitoring.temperatureHistory')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={historicalData}
                          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis
                            dataKey="date"
                            tickFormatter={(date) => new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                          />
                          <YAxis />
                          <Tooltip
                            labelFormatter={(date) => new Date(date).toLocaleDateString()}
                            formatter={(value) => [`${value.toFixed(1)}°C`, '']}
                          />
                          <Legend />
                          <Line
                            type="monotone"
                            dataKey="temperature_min"
                            name={t('monitoring.min')}
                            stroke="#8884d8"
                            activeDot={{ r: 8 }}
                          />
                          <Line
                            type="monotone"
                            dataKey="temperature_avg"
                            name={t('monitoring.mean')}
                            stroke="#82ca9d"
                            activeDot={{ r: 8 }}
                          />
                          <Line
                            type="monotone"
                            dataKey="temperature_max"
                            name={t('monitoring.max')}
                            stroke="#ff7300"
                            activeDot={{ r: 8 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>{t('monitoring.precipitationHistory')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart
                            data={historicalData}
                            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                              dataKey="date"
                              tickFormatter={(date) => new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                            />
                            <YAxis />
                            <Tooltip
                              labelFormatter={(date) => new Date(date).toLocaleDateString()}
                              formatter={(value) => [`${value.toFixed(1)} mm`, '']}
                            />
                            <Area
                              type="monotone"
                              dataKey="precipitation"
                              stroke="#8884d8"
                              fill="#8884d8"
                              name={t('monitoring.precipitation')}
                              fillOpacity={0.3}
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>{t('monitoring.humidityHistory')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart
                            data={historicalData}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                              dataKey="date"
                              tickFormatter={(date) => new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                            />
                            <YAxis />
                            <Tooltip
                              labelFormatter={(date) => new Date(date).toLocaleDateString()}
                              formatter={(value) => [`${value.toFixed(0)}%`, '']}
                            />
                            <Line
                              type="monotone"
                              dataKey="humidity"
                              name={t('monitoring.humidity')}
                              stroke="#82ca9d"
                              activeDot={{ r: 8 }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>
    </div>
  );
}

