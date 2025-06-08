import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertTriangle, FileText, BarChart2, Shield, Umbrella, Thermometer, Bug, Droplets, Wind } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, BarChart, Bar } from 'recharts';

export default function RiskAnalysisPage() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedField, setSelectedField] = useState(null);
  const [fields, setFields] = useState([]);
  const [riskData, setRiskData] = useState(null);
  const [weatherRiskData, setWeatherRiskData] = useState(null);
  const [diseaseRiskData, setDiseaseRiskData] = useState(null);
  const [economicRiskData, setEconomicRiskData] = useState(null);
  const [historicalRiskData, setHistoricalRiskData] = useState([]);
  const [insuranceOptions, setInsuranceOptions] = useState([]);
  const [selectedInsuranceOption, setSelectedInsuranceOption] = useState(null);
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
    
    // Simulate loading risk data for the selected field
    setIsLoading(true);
    setTimeout(() => {
      // Overall risk data
      const mockRiskData = {
        overall_risk: 45 + Math.random() * 20,
        weather_risk: 50 + Math.random() * 25,
        disease_risk: 30 + Math.random() * 20,
        economic_risk: 40 + Math.random() * 15,
        water_shortage_risk: 60 + Math.random() * 20,
        risk_trend: Math.random() > 0.5 ? 'increasing' : 'decreasing',
        risk_level: 'moderate',
        timestamp: new Date().toISOString(),
      };
      setRiskData(mockRiskData);
      
      // Weather risk data
      const mockWeatherRiskData = {
        drought_risk: 65 + Math.random() * 20,
        flood_risk: 20 + Math.random() * 15,
        heatwave_risk: 55 + Math.random() * 20,
        excess_rainfall_risk: 30 + Math.random() * 20,
        deficit_rainfall_risk: 60 + Math.random() * 20,
        timestamp: new Date().toISOString(),
      };
      setWeatherRiskData(mockWeatherRiskData);
      
      // Disease risk data
      const mockDiseaseRiskData = {
        pest_risk: 35 + Math.random() * 20,
        fungal_disease_risk: 40 + Math.random() * 20,
        bacterial_disease_risk: 25 + Math.random() * 15,
        viral_disease_risk: 20 + Math.random() * 15,
        timestamp: new Date().toISOString(),
      };
      setDiseaseRiskData(mockDiseaseRiskData);
      
      // Economic risk data
      const mockEconomicRiskData = {
        price_volatility_risk: 45 + Math.random() * 20,
        input_cost_risk: 50 + Math.random() * 15,
        market_access_risk: 35 + Math.random() * 20,
        labor_shortage_risk: 30 + Math.random() * 15,
        timestamp: new Date().toISOString(),
      };
      setEconomicRiskData(mockEconomicRiskData);
      
      // Historical risk data
      const mockHistoricalRiskData = [];
      const startDate = new Date(dateRange.startDate);
      const endDate = new Date(dateRange.endDate);
      const dayDiff = Math.floor((endDate - startDate) / (24 * 60 * 60 * 1000));
      
      let overallRisk = 40 + Math.random() * 10;
      let weatherRisk = 45 + Math.random() * 10;
      let diseaseRisk = 30 + Math.random() * 10;
      
      for (let i = 0; i <= dayDiff; i += 5) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + i);
        
        // Simulate risk fluctuations
        overallRisk = Math.max(10, Math.min(90, overallRisk + (Math.random() * 10 - 5)));
        weatherRisk = Math.max(10, Math.min(90, weatherRisk + (Math.random() * 12 - 6)));
        diseaseRisk = Math.max(10, Math.min(90, diseaseRisk + (Math.random() * 8 - 4)));
        
        mockHistoricalRiskData.push({
          date: date.toISOString().split('T')[0],
          overall_risk: overallRisk,
          weather_risk: weatherRisk,
          disease_risk: diseaseRisk,
        });
      }
      setHistoricalRiskData(mockHistoricalRiskData);
      
      // Insurance options
      const mockInsuranceOptions = [
        {
          id: 1,
          name: t('insurance.basicPlan'),
          description: t('insurance.basicPlanDescription'),
          coverage: [
            t('insurance.deficitRainfall'),
            t('insurance.excessRainfall'),
            t('insurance.drought'),
          ],
          premium_per_acre: field.crop_type === 'Rice' ? 5 : 4,
          coverage_limit_per_acre: field.crop_type === 'Rice' ? 200 : 180,
          deductible_percentage: 10,
        },
        {
          id: 2,
          name: t('insurance.standardPlan'),
          description: t('insurance.standardPlanDescription'),
          coverage: [
            t('insurance.deficitRainfall'),
            t('insurance.excessRainfall'),
            t('insurance.drought'),
            t('insurance.flood'),
            t('insurance.heatwave'),
          ],
          premium_per_acre: field.crop_type === 'Rice' ? 12 : 10,
          coverage_limit_per_acre: field.crop_type === 'Rice' ? 350 : 300,
          deductible_percentage: 8,
        },
        {
          id: 3,
          name: t('insurance.premiumPlan'),
          description: t('insurance.premiumPlanDescription'),
          coverage: [
            t('insurance.deficitRainfall'),
            t('insurance.excessRainfall'),
            t('insurance.drought'),
            t('insurance.flood'),
            t('insurance.heatwave'),
            t('insurance.pestAndDiseases'),
          ],
          premium_per_acre: field.crop_type === 'Rice' ? 20 : 18,
          coverage_limit_per_acre: field.crop_type === 'Rice' ? 500 : 450,
          deductible_percentage: 5,
        },
      ];
      setInsuranceOptions(mockInsuranceOptions);
      
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
      // Historical risk data
      const mockHistoricalRiskData = [];
      const startDate = new Date(dateRange.startDate);
      const endDate = new Date(dateRange.endDate);
      const dayDiff = Math.floor((endDate - startDate) / (24 * 60 * 60 * 1000));
      
      let overallRisk = 40 + Math.random() * 10;
      let weatherRisk = 45 + Math.random() * 10;
      let diseaseRisk = 30 + Math.random() * 10;
      
      for (let i = 0; i <= dayDiff; i += 5) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + i);
        
        // Simulate risk fluctuations
        overallRisk = Math.max(10, Math.min(90, overallRisk + (Math.random() * 10 - 5)));
        weatherRisk = Math.max(10, Math.min(90, weatherRisk + (Math.random() * 12 - 6)));
        diseaseRisk = Math.max(10, Math.min(90, diseaseRisk + (Math.random() * 8 - 4)));
        
        mockHistoricalRiskData.push({
          date: date.toISOString().split('T')[0],
          overall_risk: overallRisk,
          weather_risk: weatherRisk,
          disease_risk: diseaseRisk,
        });
      }
      setHistoricalRiskData(mockHistoricalRiskData);
      
      setIsLoading(false);
    }, 1000);
  };

  // Handle insurance option selection
  const handleInsuranceSelect = (option) => {
    setSelectedInsuranceOption(option);
  };

  // Get risk level color
  const getRiskLevelColor = (value) => {
    if (value < 25) return 'text-green-500';
    if (value < 50) return 'text-yellow-500';
    if (value < 75) return 'text-orange-500';
    return 'text-red-500';
  };

  // Get risk level text
  const getRiskLevelText = (value) => {
    if (value < 25) return t('common.low');
    if (value < 50) return t('common.moderate');
    if (value < 75) return t('common.high');
    return t('common.severe');
  };

  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  // Prepare radar data for risk factors
  const getRiskRadarData = () => {
    if (!riskData || !weatherRiskData || !diseaseRiskData || !economicRiskData) return [];
    
    return [
      {
        subject: t('common.weatherRisk'),
        value: riskData.weather_risk,
        fullMark: 100,
      },
      {
        subject: t('common.diseaseRisk'),
        value: riskData.disease_risk,
        fullMark: 100,
      },
      {
        subject: t('common.economicRisk'),
        value: riskData.economic_risk,
        fullMark: 100,
      },
      {
        subject: t('common.waterShortageRisk'),
        value: riskData.water_shortage_risk,
        fullMark: 100,
      },
    ];
  };

  // Prepare weather risk data for bar chart
  const getWeatherRiskData = () => {
    if (!weatherRiskData) return [];
    
    return [
      {
        name: t('common.drought'),
        value: weatherRiskData.drought_risk,
      },
      {
        name: t('common.flood'),
        value: weatherRiskData.flood_risk,
      },
      {
        name: t('common.heatwave'),
        value: weatherRiskData.heatwave_risk,
      },
      {
        name: t('common.excessRainfall'),
        value: weatherRiskData.excess_rainfall_risk,
      },
      {
        name: t('common.deficitRainfall'),
        value: weatherRiskData.deficit_rainfall_risk,
      },
    ];
  };

  // Calculate total premium for selected field
  const calculateTotalPremium = (option) => {
    if (!selectedField || !option) return 0;
    return (option.premium_per_acre * selectedField.area_hectares * 2.47).toFixed(2); // Convert hectares to acres
  };

  // Calculate total coverage for selected field
  const calculateTotalCoverage = (option) => {
    if (!selectedField || !option) return 0;
    return (option.coverage_limit_per_acre * selectedField.area_hectares * 2.47).toFixed(2); // Convert hectares to acres
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{t('monitoring.riskAnalysis')}</h1>
        <div className="space-x-2">
          <Button
            variant="outline"
            onClick={() => setActiveTab('overview')}
          >
            <AlertTriangle className="mr-2 h-4 w-4" />
            {t('common.overview')}
          </Button>
          <Button
            variant="outline"
            onClick={() => setActiveTab('weather')}
          >
            <Umbrella className="mr-2 h-4 w-4" />
            {t('common.weatherRisks')}
          </Button>
          <Button
            variant="outline"
            onClick={() => setActiveTab('insurance')}
          >
            <Shield className="mr-2 h-4 w-4" />
            {t('common.insuranceOptions')}
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

          {selectedField && activeTab === 'history' && (
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

          {selectedField && riskData && (
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>{t('monitoring.lastUpdated')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  {new Date(riskData.timestamp).toLocaleString()}
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
                <TabsTrigger value="overview">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  {t('common.overview')}
                </TabsTrigger>
                <TabsTrigger value="weather">
                  <Umbrella className="h-4 w-4 mr-2" />
                  {t('common.weatherRisks')}
                </TabsTrigger>
                <TabsTrigger value="disease">
                  <Bug className="h-4 w-4 mr-2" />
                  {t('common.diseaseRisks')}
                </TabsTrigger>
                <TabsTrigger value="economic">
                  <BarChart2 className="h-4 w-4 mr-2" />
                  {t('common.economicRisks')}
                </TabsTrigger>
                <TabsTrigger value="history">
                  <BarChart2 className="h-4 w-4 mr-2" />
                  {t('common.riskHistory')}
                </TabsTrigger>
                <TabsTrigger value="insurance">
                  <Shield className="h-4 w-4 mr-2" />
                  {t('common.insuranceOptions')}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>{t('monitoring.overallRisk')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col items-center">
                        <AlertTriangle className={`h-12 w-12 ${getRiskLevelColor(riskData.overall_risk)} mb-2`} />
                        <div className="text-center">
                          <h3 className="text-3xl font-bold">
                            {riskData.overall_risk.toFixed(1)}%
                          </h3>
                          <p className={`${getRiskLevelColor(riskData.overall_risk)}`}>
                            {getRiskLevelText(riskData.overall_risk)}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>{t('monitoring.riskTrend')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col items-center">
                        {riskData.risk_trend === 'increasing' ? (
                          <AlertTriangle className="h-12 w-12 text-red-500 mb-2" />
                        ) : (
                          <AlertTriangle className="h-12 w-12 text-green-500 mb-2" />
                        )}
                        <div className="text-center">
                          <h3 className="text-xl font-bold">
                            {riskData.risk_trend === 'increasing' ? t('common.increasing') : t('common.decreasing')}
                          </h3>
                          <p className="text-muted-foreground">
                            {riskData.risk_trend === 'increasing' 
                              ? t('common.riskIncreasingMessage') 
                              : t('common.riskDecreasingMessage')}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>{t('monitoring.highestRiskFactor')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col items-center">
                        {riskData.weather_risk >= riskData.disease_risk && riskData.weather_risk >= riskData.economic_risk ? (
                          <Umbrella className="h-12 w-12 text-orange-500 mb-2" />
                        ) : riskData.disease_risk >= riskData.weather_risk && riskData.disease_risk >= riskData.economic_risk ? (
                          <Bug className="h-12 w-12 text-orange-500 mb-2" />
                        ) : (
                          <BarChart2 className="h-12 w-12 text-orange-500 mb-2" />
                        )}
                        <div className="text-center">
                          <h3 className="text-xl font-bold">
                            {riskData.weather_risk >= riskData.disease_risk && riskData.weather_risk >= riskData.economic_risk
                              ? t('common.weatherRisks')
                              : riskData.disease_risk >= riskData.weather_risk && riskData.disease_risk >= riskData.economic_risk
                              ? t('common.diseaseRisks')
                              : t('common.economicRisks')}
                          </h3>
                          <p className={`${
                            riskData.weather_risk >= riskData.disease_risk && riskData.weather_risk >= riskData.economic_risk
                              ? getRiskLevelColor(riskData.weather_risk)
                              : riskData.disease_risk >= riskData.weather_risk && riskData.disease_risk >= riskData.economic_risk
                              ? getRiskLevelColor(riskData.disease_risk)
                              : getRiskLevelColor(riskData.economic_risk)
                          }`}>
                            {riskData.weather_risk >= riskData.disease_risk && riskData.weather_risk >= riskData.economic_risk
                              ? `${riskData.weather_risk.toFixed(1)}%`
                              : riskData.disease_risk >= riskData.weather_risk && riskData.disease_risk >= riskData.economic_risk
                              ? `${riskData.disease_risk.toFixed(1)}%`
                              : `${riskData.economic_risk.toFixed(1)}%`}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>{t('monitoring.riskFactors')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={getRiskRadarData()}>
                          <PolarGrid />
                          <PolarAngleAxis dataKey="subject" />
                          <PolarRadiusAxis angle={30} domain={[0, 100]} />
                          <Radar
                            name={t('monitoring.riskLevel')}
                            dataKey="value"
                            stroke="#FF8042"
                            fill="#FF8042"
                            fillOpacity={0.6}
                          />
                          <Tooltip formatter={(value) => [`${value}%`, t('monitoring.riskLevel')]} />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>{t('monitoring.riskMitigationRecommendations')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {riskData.weather_risk > 50 && (
                          <Alert>
                            <Umbrella className="h-4 w-4" />
                            <AlertDescription>
                              {t('common.weatherRiskMitigationMessage')}
                            </AlertDescription>
                          </Alert>
                        )}
                        {riskData.disease_risk > 40 && (
                          <Alert>
                            <Bug className="h-4 w-4" />
                            <AlertDescription>
                              {t('common.diseaseRiskMitigationMessage')}
                            </AlertDescription>
                          </Alert>
                        )}
                        {riskData.economic_risk > 45 && (
                          <Alert>
                            <BarChart2 className="h-4 w-4" />
                            <AlertDescription>
                              {t('common.economicRiskMitigationMessage')}
                            </AlertDescription>
                          </Alert>
                        )}
                        {riskData.water_shortage_risk > 55 && (
                          <Alert>
                            <Droplets className="h-4 w-4" />
                            <AlertDescription>
                              {t('common.waterShortageRiskMitigationMessage')}
                            </AlertDescription>
                          </Alert>
                        )}
                        <Button className="w-full mt-2">
                          <FileText className="mr-2 h-4 w-4" />
                          {t('monitoring.generateDetailedRiskReport')}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>{t('monitoring.insuranceRecommendation')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <p className="text-sm">
                          {riskData.overall_risk > 60
                            ? t('common.highRiskInsuranceMessage')
                            : riskData.overall_risk > 40
                            ? t('common.moderateRiskInsuranceMessage')
                            : t('common.lowRiskInsuranceMessage')}
                        </p>
                        <div className="p-4 bg-muted rounded-md">
                          <h4 className="font-medium mb-2">
                            {riskData.overall_risk > 60
                              ? t('insurance.premiumPlan')
                              : riskData.overall_risk > 40
                              ? t('insurance.standardPlan')
                              : t('insurance.basicPlan')}
                          </h4>
                          <p className="text-sm mb-4">
                            {riskData.overall_risk > 60
                              ? t('insurance.premiumPlanDescription')
                              : riskData.overall_risk > 40
                              ? t('insurance.standardPlanDescription')
                              : t('insurance.basicPlanDescription')}
                          </p>
                          <Button 
                            className="w-full"
                            onClick={() => setActiveTab('insurance')}
                          >
                            <Shield className="mr-2 h-4 w-4" />
                            {t('common.viewInsuranceOptions')}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="weather" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>{t('monitoring.weatherRiskFactors')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={getWeatherRiskData()}
                          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis domain={[0, 100]} />
                          <Tooltip formatter={(value) => [`${value}%`, t('monitoring.riskLevel')]} />
                          <Legend />
                          <Bar 
                            dataKey="value" 
                            name={t('monitoring.riskLevel')} 
                            fill="#8884d8"
                            label={{ position: 'top', formatter: (value) => `${value}%` }}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>{t('common.drought')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col items-center">
                        <Thermometer className={`h-12 w-12 ${getRiskLevelColor(weatherRiskData.drought_risk)} mb-2`} />
                        <div className="text-center">
                          <h3 className="text-3xl font-bold">
                            {weatherRiskData.drought_risk.toFixed(1)}%
                          </h3>
                          <p className={`${getRiskLevelColor(weatherRiskData.drought_risk)}`}>
                            {getRiskLevelText(weatherRiskData.drought_risk)}
                          </p>
                        </div>
                        <p className="text-sm mt-4 text-center">
                          {weatherRiskData.drought_risk > 50
                            ? t('common.highDroughtRiskMessage')
                            : t('common.lowDroughtRiskMessage')}
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>{t('common.excessRainfall')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col items-center">
                        <Umbrella className={`h-12 w-12 ${getRiskLevelColor(weatherRiskData.excess_rainfall_risk)} mb-2`} />
                        <div className="text-center">
                          <h3 className="text-3xl font-bold">
                            {weatherRiskData.excess_rainfall_risk.toFixed(1)}%
                          </h3>
                          <p className={`${getRiskLevelColor(weatherRiskData.excess_rainfall_risk)}`}>
                            {getRiskLevelText(weatherRiskData.excess_rainfall_risk)}
                          </p>
                        </div>
                        <p className="text-sm mt-4 text-center">
                          {weatherRiskData.excess_rainfall_risk > 50
                            ? t('common.highRainfallRiskMessage')
                            : t('common.lowRainfallRiskMessage')}
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>{t('common.heatwave')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col items-center">
                        <Thermometer className={`h-12 w-12 ${getRiskLevelColor(weatherRiskData.heatwave_risk)} mb-2`} />
                        <div className="text-center">
                          <h3 className="text-3xl font-bold">
                            {weatherRiskData.heatwave_risk.toFixed(1)}%
                          </h3>
                          <p className={`${getRiskLevelColor(weatherRiskData.heatwave_risk)}`}>
                            {getRiskLevelText(weatherRiskData.heatwave_risk)}
                          </p>
                        </div>
                        <p className="text-sm mt-4 text-center">
                          {weatherRiskData.heatwave_risk > 50
                            ? t('common.highHeatwaveRiskMessage')
                            : t('common.lowHeatwaveRiskMessage')}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>{t('monitoring.weatherRiskMitigation')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <h3 className="font-medium">{t('common.recommendedActions')}</h3>
                      <div className="space-y-2">
                        {weatherRiskData.drought_risk > 50 && (
                          <div className="flex items-start space-x-2">
                            <Thermometer className="h-5 w-5 text-orange-500 mt-0.5" />
                            <p className="text-sm">{t('common.droughtMitigationAction')}</p>
                          </div>
                        )}
                        {weatherRiskData.excess_rainfall_risk > 40 && (
                          <div className="flex items-start space-x-2">
                            <Umbrella className="h-5 w-5 text-blue-500 mt-0.5" />
                            <p className="text-sm">{t('common.excessRainfallMitigationAction')}</p>
                          </div>
                        )}
                        {weatherRiskData.deficit_rainfall_risk > 50 && (
                          <div className="flex items-start space-x-2">
                            <Droplets className="h-5 w-5 text-blue-500 mt-0.5" />
                            <p className="text-sm">{t('common.deficitRainfallMitigationAction')}</p>
                          </div>
                        )}
                        {weatherRiskData.heatwave_risk > 50 && (
                          <div className="flex items-start space-x-2">
                            <Thermometer className="h-5 w-5 text-red-500 mt-0.5" />
                            <p className="text-sm">{t('common.heatwaveMitigationAction')}</p>
                          </div>
                        )}
                        {weatherRiskData.flood_risk > 40 && (
                          <div className="flex items-start space-x-2">
                            <Umbrella className="h-5 w-5 text-indigo-500 mt-0.5" />
                            <p className="text-sm">{t('common.floodMitigationAction')}</p>
                          </div>
                        )}
                      </div>
                      <div className="mt-4">
                        <Button className="w-full">
                          <FileText className="mr-2 h-4 w-4" />
                          {t('monitoring.generateWeatherRiskReport')}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="disease" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>{t('monitoring.diseaseRiskFactors')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={[
                            { name: t('common.pestRisk'), value: diseaseRiskData.pest_risk },
                            { name: t('common.fungalDiseaseRisk'), value: diseaseRiskData.fungal_disease_risk },
                            { name: t('common.bacterialDiseaseRisk'), value: diseaseRiskData.bacterial_disease_risk },
                            { name: t('common.viralDiseaseRisk'), value: diseaseRiskData.viral_disease_risk },
                          ]}
                          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis domain={[0, 100]} />
                          <Tooltip formatter={(value) => [`${value}%`, t('monitoring.riskLevel')]} />
                          <Legend />
                          <Bar 
                            dataKey="value" 
                            name={t('monitoring.riskLevel')} 
                            fill="#82ca9d"
                            label={{ position: 'top', formatter: (value) => `${value}%` }}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>{t('common.pestRisk')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col items-center">
                        <Bug className={`h-12 w-12 ${getRiskLevelColor(diseaseRiskData.pest_risk)} mb-2`} />
                        <div className="text-center">
                          <h3 className="text-3xl font-bold">
                            {diseaseRiskData.pest_risk.toFixed(1)}%
                          </h3>
                          <p className={`${getRiskLevelColor(diseaseRiskData.pest_risk)}`}>
                            {getRiskLevelText(diseaseRiskData.pest_risk)}
                          </p>
                        </div>
                        <p className="text-sm mt-4 text-center">
                          {diseaseRiskData.pest_risk > 40
                            ? t('common.highPestRiskMessage', { crop: selectedField.crop_type })
                            : t('common.lowPestRiskMessage', { crop: selectedField.crop_type })}
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>{t('common.fungalDiseaseRisk')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col items-center">
                        <Bug className={`h-12 w-12 ${getRiskLevelColor(diseaseRiskData.fungal_disease_risk)} mb-2`} />
                        <div className="text-center">
                          <h3 className="text-3xl font-bold">
                            {diseaseRiskData.fungal_disease_risk.toFixed(1)}%
                          </h3>
                          <p className={`${getRiskLevelColor(diseaseRiskData.fungal_disease_risk)}`}>
                            {getRiskLevelText(diseaseRiskData.fungal_disease_risk)}
                          </p>
                        </div>
                        <p className="text-sm mt-4 text-center">
                          {diseaseRiskData.fungal_disease_risk > 40
                            ? t('common.highFungalRiskMessage', { crop: selectedField.crop_type })
                            : t('common.lowFungalRiskMessage', { crop: selectedField.crop_type })}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>{t('monitoring.diseaseRiskMitigation')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <h3 className="font-medium">{t('common.recommendedActions')}</h3>
                      <div className="space-y-2">
                        {diseaseRiskData.pest_risk > 40 && (
                          <div className="flex items-start space-x-2">
                            <Bug className="h-5 w-5 text-orange-500 mt-0.5" />
                            <p className="text-sm">{t('common.pestMitigationAction', { crop: selectedField.crop_type })}</p>
                          </div>
                        )}
                        {diseaseRiskData.fungal_disease_risk > 40 && (
                          <div className="flex items-start space-x-2">
                            <Bug className="h-5 w-5 text-green-500 mt-0.5" />
                            <p className="text-sm">{t('common.fungalMitigationAction', { crop: selectedField.crop_type })}</p>
                          </div>
                        )}
                        {diseaseRiskData.bacterial_disease_risk > 30 && (
                          <div className="flex items-start space-x-2">
                            <Bug className="h-5 w-5 text-blue-500 mt-0.5" />
                            <p className="text-sm">{t('common.bacterialMitigationAction', { crop: selectedField.crop_type })}</p>
                          </div>
                        )}
                        {diseaseRiskData.viral_disease_risk > 30 && (
                          <div className="flex items-start space-x-2">
                            <Bug className="h-5 w-5 text-red-500 mt-0.5" />
                            <p className="text-sm">{t('common.viralMitigationAction', { crop: selectedField.crop_type })}</p>
                          </div>
                        )}
                      </div>
                      <div className="mt-4">
                        <Button className="w-full">
                          <FileText className="mr-2 h-4 w-4" />
                          {t('monitoring.generateDiseaseRiskReport')}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="economic" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>{t('monitoring.economicRiskFactors')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={[
                            { name: t('common.priceVolatilityRisk'), value: economicRiskData.price_volatility_risk },
                            { name: t('common.inputCostRisk'), value: economicRiskData.input_cost_risk },
                            { name: t('common.marketAccessRisk'), value: economicRiskData.market_access_risk },
                            { name: t('common.laborShortageRisk'), value: economicRiskData.labor_shortage_risk },
                          ]}
                          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis domain={[0, 100]} />
                          <Tooltip formatter={(value) => [`${value}%`, t('monitoring.riskLevel')]} />
                          <Legend />
                          <Bar 
                            dataKey="value" 
                            name={t('monitoring.riskLevel')} 
                            fill="#8884d8"
                            label={{ position: 'top', formatter: (value) => `${value}%` }}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>{t('common.priceVolatilityRisk')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col items-center">
                        <BarChart2 className={`h-12 w-12 ${getRiskLevelColor(economicRiskData.price_volatility_risk)} mb-2`} />
                        <div className="text-center">
                          <h3 className="text-3xl font-bold">
                            {economicRiskData.price_volatility_risk.toFixed(1)}%
                          </h3>
                          <p className={`${getRiskLevelColor(economicRiskData.price_volatility_risk)}`}>
                            {getRiskLevelText(economicRiskData.price_volatility_risk)}
                          </p>
                        </div>
                        <p className="text-sm mt-4 text-center">
                          {economicRiskData.price_volatility_risk > 45
                            ? t('common.highPriceVolatilityRiskMessage', { crop: selectedField.crop_type })
                            : t('common.lowPriceVolatilityRiskMessage', { crop: selectedField.crop_type })}
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>{t('common.inputCostRisk')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col items-center">
                        <BarChart2 className={`h-12 w-12 ${getRiskLevelColor(economicRiskData.input_cost_risk)} mb-2`} />
                        <div className="text-center">
                          <h3 className="text-3xl font-bold">
                            {economicRiskData.input_cost_risk.toFixed(1)}%
                          </h3>
                          <p className={`${getRiskLevelColor(economicRiskData.input_cost_risk)}`}>
                            {getRiskLevelText(economicRiskData.input_cost_risk)}
                          </p>
                        </div>
                        <p className="text-sm mt-4 text-center">
                          {economicRiskData.input_cost_risk > 45
                            ? t('common.highInputCostRiskMessage')
                            : t('common.lowInputCostRiskMessage')}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>{t('monitoring.economicRiskMitigation')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <h3 className="font-medium">{t('common.recommendedActions')}</h3>
                      <div className="space-y-2">
                        {economicRiskData.price_volatility_risk > 45 && (
                          <div className="flex items-start space-x-2">
                            <BarChart2 className="h-5 w-5 text-orange-500 mt-0.5" />
                            <p className="text-sm">{t('common.priceVolatilityMitigationAction')}</p>
                          </div>
                        )}
                        {economicRiskData.input_cost_risk > 45 && (
                          <div className="flex items-start space-x-2">
                            <BarChart2 className="h-5 w-5 text-green-500 mt-0.5" />
                            <p className="text-sm">{t('common.inputCostMitigationAction')}</p>
                          </div>
                        )}
                        {economicRiskData.market_access_risk > 40 && (
                          <div className="flex items-start space-x-2">
                            <BarChart2 className="h-5 w-5 text-blue-500 mt-0.5" />
                            <p className="text-sm">{t('common.marketAccessMitigationAction')}</p>
                          </div>
                        )}
                        {economicRiskData.labor_shortage_risk > 40 && (
                          <div className="flex items-start space-x-2">
                            <BarChart2 className="h-5 w-5 text-red-500 mt-0.5" />
                            <p className="text-sm">{t('common.laborShortageMitigationAction')}</p>
                          </div>
                        )}
                      </div>
                      <div className="mt-4">
                        <Button className="w-full">
                          <FileText className="mr-2 h-4 w-4" />
                          {t('monitoring.generateEconomicRiskReport')}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="history" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>{t('monitoring.riskHistoryTrends')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={historicalRiskData}
                          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis
                            dataKey="date"
                            tickFormatter={(date) => new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                          />
                          <YAxis domain={[0, 100]} />
                          <Tooltip
                            labelFormatter={(date) => new Date(date).toLocaleDateString()}
                            formatter={(value) => [`${value.toFixed(1)}%`, '']}
                          />
                          <Legend />
                          <Line
                            type="monotone"
                            dataKey="overall_risk"
                            name={t('monitoring.overallRisk')}
                            stroke="#8884d8"
                            activeDot={{ r: 8 }}
                          />
                          <Line
                            type="monotone"
                            dataKey="weather_risk"
                            name={t('common.weatherRisks')}
                            stroke="#82ca9d"
                          />
                          <Line
                            type="monotone"
                            dataKey="disease_risk"
                            name={t('common.diseaseRisks')}
                            stroke="#ff7300"
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>{t('monitoring.riskAnalysisSummary')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-sm">
                        {historicalRiskData.length > 0 && 
                         historicalRiskData[historicalRiskData.length - 1].overall_risk > 
                         historicalRiskData[0].overall_risk
                          ? t('common.increasingRiskTrendMessage')
                          : t('common.decreasingRiskTrendMessage')}
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-muted p-4 rounded-md">
                          <h4 className="font-medium mb-2">{t('monitoring.overallRisk')}</h4>
                          <div className="flex items-center">
                            <AlertTriangle className="h-5 w-5 mr-2 text-orange-500" />
                            <span>
                              {historicalRiskData.length > 0
                                ? `${historicalRiskData[historicalRiskData.length - 1].overall_risk.toFixed(1)}%`
                                : '0%'}
                            </span>
                          </div>
                        </div>
                        <div className="bg-muted p-4 rounded-md">
                          <h4 className="font-medium mb-2">{t('common.weatherRisks')}</h4>
                          <div className="flex items-center">
                            <Umbrella className="h-5 w-5 mr-2 text-blue-500" />
                            <span>
                              {historicalRiskData.length > 0
                                ? `${historicalRiskData[historicalRiskData.length - 1].weather_risk.toFixed(1)}%`
                                : '0%'}
                            </span>
                          </div>
                        </div>
                        <div className="bg-muted p-4 rounded-md">
                          <h4 className="font-medium mb-2">{t('common.diseaseRisks')}</h4>
                          <div className="flex items-center">
                            <Bug className="h-5 w-5 mr-2 text-green-500" />
                            <span>
                              {historicalRiskData.length > 0
                                ? `${historicalRiskData[historicalRiskData.length - 1].disease_risk.toFixed(1)}%`
                                : '0%'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Button className="w-full mt-2">
                        <FileText className="mr-2 h-4 w-4" />
                        {t('monitoring.generateHistoricalRiskReport')}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="insurance" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>{t('insurance.cropInsuranceOptions')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-sm">
                        {t('insurance.cropInsuranceDescription')}
                      </p>
                      <h3 className="font-medium">{t('insurance.availablePlans')}</h3>
                      <div className="space-y-4">
                        {insuranceOptions.map((option) => (
                          <div 
                            key={option.id}
                            className={`p-4 border rounded-md cursor-pointer transition-colors ${
                              selectedInsuranceOption?.id === option.id
                                ? 'border-primary bg-primary/5'
                                : 'border-border hover:border-primary'
                            }`}
                            onClick={() => handleInsuranceSelect(option)}
                          >
                            <div className="flex justify-between items-center mb-2">
                              <h4 className="font-medium">{option.name}</h4>
                              <div className="text-right">
                                <span className="font-bold">{option.premium_per_acre} {t('common.currencyPerAcre')}</span>
                                <p className="text-xs text-muted-foreground">
                                  {t('insurance.coverageLimit')}: {option.coverage_limit_per_acre} {t('common.currencyPerAcre')}
                                </p>
                              </div>
                            </div>
                            <p className="text-sm mb-3">{option.description}</p>
                            <div className="space-y-2">
                              <h5 className="text-sm font-medium">{t('insurance.coveredPerils')}</h5>
                              <div className="grid grid-cols-2 gap-2">
                                {option.coverage.map((peril, index) => (
                                  <div key={index} className="flex items-center">
                                    <Shield className="h-4 w-4 mr-2 text-green-500" />
                                    <span className="text-sm">{peril}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {selectedInsuranceOption && (
                  <Card>
                    <CardHeader>
                      <CardTitle>{t('insurance.selectedPlan')}: {selectedInsuranceOption.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <h4 className="font-medium">{t('insurance.fieldDetails')}</h4>
                            <p className="text-sm">
                              <span className="font-medium">{t('common.fieldName')}:</span> {selectedField.name}
                            </p>
                            <p className="text-sm">
                              <span className="font-medium">{t('common.cropType')}:</span> {selectedField.crop_type}
                            </p>
                            <p className="text-sm">
                              <span className="font-medium">{t('common.area')}:</span> {selectedField.area_hectares.toFixed(2)} {t('fields.hectares')} ({(selectedField.area_hectares * 2.47).toFixed(2)} {t('common.acres')})
                            </p>
                          </div>
                          <div className="space-y-2">
                            <h4 className="font-medium">{t('insurance.premiumCalculation')}</h4>
                            <p className="text-sm">
                              <span className="font-medium">{t('insurance.premiumPerAcre')}:</span> {selectedInsuranceOption.premium_per_acre} {t('common.currency')}
                            </p>
                            <p className="text-sm">
                              <span className="font-medium">{t('insurance.totalAcres')}:</span> {(selectedField.area_hectares * 2.47).toFixed(2)} {t('common.acres')}
                            </p>
                            <p className="text-sm">
                              <span className="font-medium">{t('insurance.deductible')}:</span> {selectedInsuranceOption.deductible_percentage}%
                            </p>
                            <p className="text-sm font-bold">
                              <span className="font-medium">{t('insurance.totalPremium')}:</span> {calculateTotalPremium(selectedInsuranceOption)} {t('common.currency')}
                            </p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <h4 className="font-medium">{t('insurance.coverageDetails')}</h4>
                          <p className="text-sm">
                            <span className="font-medium">{t('insurance.coverageLimitPerAcre')}:</span> {selectedInsuranceOption.coverage_limit_per_acre} {t('common.currency')}
                          </p>
                          <p className="text-sm">
                            <span className="font-medium">{t('insurance.totalCoverageLimit')}:</span> {calculateTotalCoverage(selectedInsuranceOption)} {t('common.currency')}
                          </p>
                          <p className="text-sm">
                            <span className="font-medium">{t('insurance.coveredPerils')}:</span> {selectedInsuranceOption.coverage.join(', ')}
                          </p>
                        </div>
                        <div className="pt-4 border-t">
                          <Button className="w-full">
                            <Shield className="mr-2 h-4 w-4" />
                            {t('insurance.applyForInsurance')}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <Card>
                  <CardHeader>
                    <CardTitle>{t('insurance.howItWorks')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                          1
                        </div>
                        <div>
                          <h4 className="font-medium">{t('insurance.step1Title')}</h4>
                          <p className="text-sm">{t('insurance.step1Description')}</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                          2
                        </div>
                        <div>
                          <h4 className="font-medium">{t('insurance.step2Title')}</h4>
                          <p className="text-sm">{t('insurance.step2Description')}</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                          3
                        </div>
                        <div>
                          <h4 className="font-medium">{t('insurance.step3Title')}</h4>
                          <p className="text-sm">{t('insurance.step3Description')}</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                          4
                        </div>
                        <div>
                          <h4 className="font-medium">{t('insurance.step4Title')}</h4>
                          <p className="text-sm">{t('insurance.step4Description')}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>
    </div>
  );
}

