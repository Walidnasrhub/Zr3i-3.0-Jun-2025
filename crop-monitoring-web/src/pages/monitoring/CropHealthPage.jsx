import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Leaf, Plant, AlertTriangle, FileText, BarChart2, Activity, Zap } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';

export default function CropHealthPage() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedField, setSelectedField] = useState(null);
  const [fields, setFields] = useState([]);
  const [cropHealthData, setCropHealthData] = useState(null);
  const [cropStressData, setCropStressData] = useState(null);
  const [cropGrowthData, setCropGrowthData] = useState([]);
  const [cropDiseaseData, setCropDiseaseData] = useState([]);
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
    
    // Simulate loading crop health data for the selected field
    setIsLoading(true);
    setTimeout(() => {
      // Crop health data
      const mockCropHealthData = {
        overall_health: 75 + Math.random() * 20,
        ndvi_value: 0.65 + Math.random() * 0.2,
        evi_value: 0.55 + Math.random() * 0.2,
        lai_value: 3.5 + Math.random() * 1.5,
        chlorophyll_content: 35 + Math.random() * 10,
        biomass: 4.5 + Math.random() * 1.5,
        growth_stage: field.crop_type === 'Rice' ? 'Reproductive' : 'Grain filling',
        days_to_harvest: 30 + Math.floor(Math.random() * 20),
        timestamp: new Date().toISOString(),
      };
      setCropHealthData(mockCropHealthData);
      
      // Crop stress data
      const mockCropStressData = {
        water_stress: 15 + Math.random() * 20,
        nutrient_stress: 10 + Math.random() * 15,
        pest_pressure: 5 + Math.random() * 10,
        disease_risk: 10 + Math.random() * 15,
        weed_pressure: 15 + Math.random() * 20,
        temperature_stress: 5 + Math.random() * 15,
        timestamp: new Date().toISOString(),
      };
      setCropStressData(mockCropStressData);
      
      // Crop growth data
      const mockCropGrowthData = [];
      const startDate = new Date(dateRange.startDate);
      const endDate = new Date(dateRange.endDate);
      const dayDiff = Math.floor((endDate - startDate) / (24 * 60 * 60 * 1000));
      
      let ndviValue = 0.3 + Math.random() * 0.1;
      let heightValue = 10 + Math.random() * 5;
      
      for (let i = 0; i <= dayDiff; i += 3) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + i);
        
        // Simulate growth pattern
        ndviValue = Math.min(0.85, ndviValue + (0.01 + Math.random() * 0.02));
        heightValue = Math.min(field.crop_type === 'Rice' ? 100 : 80, heightValue + (2 + Math.random() * 3));
        
        mockCropGrowthData.push({
          date: date.toISOString().split('T')[0],
          ndvi: ndviValue,
          height: heightValue,
          biomass: heightValue * (0.05 + Math.random() * 0.02),
        });
      }
      setCropGrowthData(mockCropGrowthData);
      
      // Crop disease data
      const mockCropDiseaseData = [
        {
          name: field.crop_type === 'Rice' ? 'Blast' : 'Rust',
          risk: 15 + Math.random() * 20,
          affected_area: 5 + Math.random() * 10,
          severity: 'Low',
        },
        {
          name: field.crop_type === 'Rice' ? 'Bacterial Leaf Blight' : 'Powdery Mildew',
          risk: 10 + Math.random() * 15,
          affected_area: 3 + Math.random() * 7,
          severity: 'Low',
        },
        {
          name: field.crop_type === 'Rice' ? 'Sheath Blight' : 'Septoria',
          risk: 5 + Math.random() * 10,
          affected_area: 1 + Math.random() * 5,
          severity: 'Very Low',
        },
      ];
      setCropDiseaseData(mockCropDiseaseData);
      
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
      // Crop growth data
      const mockCropGrowthData = [];
      const startDate = new Date(dateRange.startDate);
      const endDate = new Date(dateRange.endDate);
      const dayDiff = Math.floor((endDate - startDate) / (24 * 60 * 60 * 1000));
      
      let ndviValue = 0.3 + Math.random() * 0.1;
      let heightValue = 10 + Math.random() * 5;
      
      for (let i = 0; i <= dayDiff; i += 3) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + i);
        
        // Simulate growth pattern
        ndviValue = Math.min(0.85, ndviValue + (0.01 + Math.random() * 0.02));
        heightValue = Math.min(selectedField.crop_type === 'Rice' ? 100 : 80, heightValue + (2 + Math.random() * 3));
        
        mockCropGrowthData.push({
          date: date.toISOString().split('T')[0],
          ndvi: ndviValue,
          height: heightValue,
          biomass: heightValue * (0.05 + Math.random() * 0.02),
        });
      }
      setCropGrowthData(mockCropGrowthData);
      
      setIsLoading(false);
    }, 1000);
  };

  // Get health status color
  const getHealthStatusColor = (value) => {
    if (value < 40) return 'text-red-500';
    if (value < 60) return 'text-orange-500';
    if (value < 75) return 'text-yellow-500';
    if (value < 90) return 'text-green-500';
    return 'text-emerald-500';
  };

  // Get health status text
  const getHealthStatusText = (value) => {
    if (value < 40) return t('common.poor');
    if (value < 60) return t('common.fair');
    if (value < 75) return t('common.good');
    if (value < 90) return t('common.veryGood');
    return t('common.excellent');
  };

  // Get stress level color
  const getStressLevelColor = (value) => {
    if (value < 10) return 'text-green-500';
    if (value < 25) return 'text-yellow-500';
    if (value < 50) return 'text-orange-500';
    return 'text-red-500';
  };

  // Get stress level text
  const getStressLevelText = (value) => {
    if (value < 10) return t('common.minimal');
    if (value < 25) return t('common.low');
    if (value < 50) return t('common.moderate');
    if (value < 75) return t('common.high');
    return t('common.severe');
  };

  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  // Prepare radar data for stress factors
  const getStressRadarData = () => {
    if (!cropStressData) return [];
    
    return [
      {
        subject: t('common.waterStress'),
        value: cropStressData.water_stress,
        fullMark: 100,
      },
      {
        subject: t('common.nutrientStress'),
        value: cropStressData.nutrient_stress,
        fullMark: 100,
      },
      {
        subject: t('common.pestPressure'),
        value: cropStressData.pest_pressure,
        fullMark: 100,
      },
      {
        subject: t('common.diseaseRisk'),
        value: cropStressData.disease_risk,
        fullMark: 100,
      },
      {
        subject: t('common.weedPressure'),
        value: cropStressData.weed_pressure,
        fullMark: 100,
      },
      {
        subject: t('common.temperatureStress'),
        value: cropStressData.temperature_stress,
        fullMark: 100,
      },
    ];
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{t('monitoring.cropHealth')}</h1>
        <div className="space-x-2">
          <Button
            variant="outline"
            onClick={() => setActiveTab('overview')}
          >
            <Leaf className="mr-2 h-4 w-4" />
            {t('common.overview')}
          </Button>
          <Button
            variant="outline"
            onClick={() => setActiveTab('stress')}
          >
            <AlertTriangle className="mr-2 h-4 w-4" />
            {t('monitoring.cropStress')}
          </Button>
          <Button
            variant="outline"
            onClick={() => setActiveTab('growth')}
          >
            <Plant className="mr-2 h-4 w-4" />
            {t('monitoring.cropGrowth')}
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

          {selectedField && activeTab === 'growth' && (
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

          {selectedField && cropHealthData && (
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>{t('monitoring.lastUpdated')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  {new Date(cropHealthData.timestamp).toLocaleString()}
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
                  <Leaf className="h-4 w-4 mr-2" />
                  {t('common.overview')}
                </TabsTrigger>
                <TabsTrigger value="stress">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  {t('monitoring.cropStress')}
                </TabsTrigger>
                <TabsTrigger value="growth">
                  <Plant className="h-4 w-4 mr-2" />
                  {t('monitoring.cropGrowth')}
                </TabsTrigger>
                <TabsTrigger value="diseases">
                  <Activity className="h-4 w-4 mr-2" />
                  {t('monitoring.cropDiseases')}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>{t('monitoring.overallHealth')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col items-center">
                        <Leaf className="h-12 w-12 text-green-500 mb-2" />
                        <div className="text-center">
                          <h3 className="text-3xl font-bold">
                            {cropHealthData.overall_health.toFixed(1)}%
                          </h3>
                          <p className={`${getHealthStatusColor(cropHealthData.overall_health)}`}>
                            {getHealthStatusText(cropHealthData.overall_health)}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>{t('monitoring.growthStage')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col items-center">
                        <Plant className="h-12 w-12 text-green-500 mb-2" />
                        <div className="text-center">
                          <h3 className="text-xl font-bold">
                            {cropHealthData.growth_stage}
                          </h3>
                          <p className="text-muted-foreground">
                            {cropHealthData.days_to_harvest} {t('common.daysToHarvest')}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>{t('monitoring.ndvi')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col items-center">
                        <Activity className="h-12 w-12 text-green-500 mb-2" />
                        <div className="text-center">
                          <h3 className="text-3xl font-bold">
                            {cropHealthData.ndvi_value.toFixed(2)}
                          </h3>
                          <p className={`${getHealthStatusColor(cropHealthData.ndvi_value * 100)}`}>
                            {getHealthStatusText(cropHealthData.ndvi_value * 100)}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>{t('monitoring.vegetationIndices')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>NDVI</span>
                            <span className="font-medium">{cropHealthData.ndvi_value.toFixed(2)}</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2.5">
                            <div
                              className="bg-green-600 h-2.5 rounded-full"
                              style={{ width: `${Math.min(100, cropHealthData.ndvi_value * 100)}%` }}
                            ></div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>EVI</span>
                            <span className="font-medium">{cropHealthData.evi_value.toFixed(2)}</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2.5">
                            <div
                              className="bg-blue-600 h-2.5 rounded-full"
                              style={{ width: `${Math.min(100, cropHealthData.evi_value * 100)}%` }}
                            ></div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>LAI</span>
                            <span className="font-medium">{cropHealthData.lai_value.toFixed(1)}</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2.5">
                            <div
                              className="bg-purple-600 h-2.5 rounded-full"
                              style={{ width: `${Math.min(100, (cropHealthData.lai_value / 5) * 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>{t('monitoring.cropParameters')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>{t('common.chlorophyllContent')}</span>
                            <span className="font-medium">{cropHealthData.chlorophyll_content.toFixed(1)} SPAD</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2.5">
                            <div
                              className="bg-green-600 h-2.5 rounded-full"
                              style={{ width: `${Math.min(100, (cropHealthData.chlorophyll_content / 50) * 100)}%` }}
                            ></div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>{t('common.biomass')}</span>
                            <span className="font-medium">{cropHealthData.biomass.toFixed(1)} kg/m²</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2.5">
                            <div
                              className="bg-amber-600 h-2.5 rounded-full"
                              style={{ width: `${Math.min(100, (cropHealthData.biomass / 6) * 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                      <div className="mt-6">
                        <h4 className="font-medium mb-2">{t('common.cropHealthAssessment')}</h4>
                        <p className="text-sm">
                          {cropHealthData.overall_health > 70
                            ? t('common.healthyCropMessage')
                            : cropHealthData.overall_health > 50
                            ? t('common.moderateHealthCropMessage')
                            : t('common.poorHealthCropMessage')}
                        </p>
                        <Button className="w-full mt-4">
                          <FileText className="mr-2 h-4 w-4" />
                          {t('monitoring.generateReport')}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="stress" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>{t('monitoring.stressFactors')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={getStressRadarData()}>
                          <PolarGrid />
                          <PolarAngleAxis dataKey="subject" />
                          <PolarRadiusAxis angle={30} domain={[0, 100]} />
                          <Radar
                            name={t('monitoring.stressLevel')}
                            dataKey="value"
                            stroke="#FF8042"
                            fill="#FF8042"
                            fillOpacity={0.6}
                          />
                          <Tooltip formatter={(value) => [`${value}%`, t('monitoring.stressLevel')]} />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>{t('common.waterStress')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col items-center">
                        <Droplets className="h-12 w-12 text-blue-500 mb-2" />
                        <div className="text-center">
                          <h3 className="text-3xl font-bold">
                            {cropStressData.water_stress.toFixed(1)}%
                          </h3>
                          <p className={`${getStressLevelColor(cropStressData.water_stress)}`}>
                            {getStressLevelText(cropStressData.water_stress)}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>{t('common.nutrientStress')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col items-center">
                        <Plant className="h-12 w-12 text-green-500 mb-2" />
                        <div className="text-center">
                          <h3 className="text-3xl font-bold">
                            {cropStressData.nutrient_stress.toFixed(1)}%
                          </h3>
                          <p className={`${getStressLevelColor(cropStressData.nutrient_stress)}`}>
                            {getStressLevelText(cropStressData.nutrient_stress)}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>{t('common.diseaseRisk')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col items-center">
                        <AlertTriangle className="h-12 w-12 text-orange-500 mb-2" />
                        <div className="text-center">
                          <h3 className="text-3xl font-bold">
                            {cropStressData.disease_risk.toFixed(1)}%
                          </h3>
                          <p className={`${getStressLevelColor(cropStressData.disease_risk)}`}>
                            {getStressLevelText(cropStressData.disease_risk)}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>{t('monitoring.stressManagement')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {cropStressData.water_stress > 25 && (
                        <Alert>
                          <AlertTriangle className="h-4 w-4" />
                          <AlertDescription>
                            {t('common.waterStressAlert')}
                          </AlertDescription>
                        </Alert>
                      )}
                      {cropStressData.nutrient_stress > 25 && (
                        <Alert>
                          <AlertTriangle className="h-4 w-4" />
                          <AlertDescription>
                            {t('common.nutrientStressAlert')}
                          </AlertDescription>
                        </Alert>
                      )}
                      {cropStressData.disease_risk > 25 && (
                        <Alert>
                          <AlertTriangle className="h-4 w-4" />
                          <AlertDescription>
                            {t('common.diseaseRiskAlert')}
                          </AlertDescription>
                        </Alert>
                      )}
                      {cropStressData.pest_pressure > 25 && (
                        <Alert>
                          <AlertTriangle className="h-4 w-4" />
                          <AlertDescription>
                            {t('common.pestPressureAlert')}
                          </AlertDescription>
                        </Alert>
                      )}
                      {cropStressData.water_stress <= 25 && 
                        cropStressData.nutrient_stress <= 25 && 
                        cropStressData.disease_risk <= 25 && 
                        cropStressData.pest_pressure <= 25 && (
                        <Alert>
                          <Leaf className="h-4 w-4" />
                          <AlertDescription>
                            {t('common.noSignificantStressAlert')}
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="growth" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>{t('monitoring.cropGrowthTrends')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={cropGrowthData}
                          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis
                            dataKey="date"
                            tickFormatter={(date) => new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                          />
                          <YAxis yAxisId="left" orientation="left" />
                          <YAxis yAxisId="right" orientation="right" domain={[0, 1]} />
                          <Tooltip
                            labelFormatter={(date) => new Date(date).toLocaleDateString()}
                          />
                          <Legend />
                          <Line
                            yAxisId="left"
                            type="monotone"
                            dataKey="height"
                            name={t('common.height')}
                            stroke="#8884d8"
                            activeDot={{ r: 8 }}
                            unit=" cm"
                          />
                          <Line
                            yAxisId="left"
                            type="monotone"
                            dataKey="biomass"
                            name={t('common.biomass')}
                            stroke="#82ca9d"
                            unit=" kg/m²"
                          />
                          <Line
                            yAxisId="right"
                            type="monotone"
                            dataKey="ndvi"
                            name="NDVI"
                            stroke="#ff7300"
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>{t('monitoring.growthStageProgress')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span>{t('common.currentStage')}</span>
                          <span className="font-medium">{cropHealthData.growth_stage}</span>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>{t('common.emergence')}</span>
                            <span>{t('common.vegetative')}</span>
                            <span>{t('common.reproductive')}</span>
                            <span>{t('common.maturity')}</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2.5">
                            <div
                              className="bg-green-600 h-2.5 rounded-full"
                              style={{ 
                                width: cropHealthData.growth_stage === 'Emergence' ? '25%' :
                                       cropHealthData.growth_stage === 'Vegetative' ? '50%' :
                                       cropHealthData.growth_stage === 'Reproductive' ? '75%' :
                                       '90%'
                              }}
                            ></div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-4">
                          <span>{t('common.daysToHarvest')}</span>
                          <span className="font-medium">{cropHealthData.days_to_harvest} {t('common.days')}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>{t('monitoring.growthAnalysis')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <p className="text-sm">
                          {cropGrowthData.length > 0 && cropGrowthData[cropGrowthData.length - 1].ndvi > 0.7
                            ? t('common.healthyGrowthMessage')
                            : cropGrowthData.length > 0 && cropGrowthData[cropGrowthData.length - 1].ndvi > 0.5
                            ? t('common.moderateGrowthMessage')
                            : t('common.poorGrowthMessage')}
                        </p>
                        <div className="flex items-center justify-between">
                          <span>{t('common.growthRate')}</span>
                          <span className={`font-medium ${
                            cropGrowthData.length > 5 && 
                            (cropGrowthData[cropGrowthData.length - 1].height - cropGrowthData[cropGrowthData.length - 5].height) > 10
                              ? 'text-green-500'
                              : 'text-yellow-500'
                          }`}>
                            {cropGrowthData.length > 5
                              ? ((cropGrowthData[cropGrowthData.length - 1].height - cropGrowthData[cropGrowthData.length - 5].height) / 5).toFixed(1)
                              : '0'} cm/day
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>{t('common.estimatedYield')}</span>
                          <span className="font-medium">
                            {selectedField.crop_type === 'Rice' ? '5.2 - 6.1' : '4.3 - 5.2'} {t('common.tonsPerHectare')}
                          </span>
                        </div>
                        <Button className="w-full mt-2">
                          <FileText className="mr-2 h-4 w-4" />
                          {t('monitoring.generateReport')}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="diseases" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>{t('monitoring.diseaseRiskAssessment')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={cropDiseaseData}
                          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip formatter={(value) => [`${value}%`, '']} />
                          <Legend />
                          <Bar dataKey="risk" name={t('common.riskLevel')} fill="#8884d8" />
                          <Bar dataKey="affected_area" name={t('common.affectedArea')} fill="#82ca9d" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <div className="space-y-4">
                  {cropDiseaseData.map((disease, index) => (
                    <Card key={index}>
                      <CardHeader>
                        <CardTitle>{disease.name}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <h4 className="font-medium">{t('common.riskLevel')}</h4>
                            <div className="flex items-center">
                              <div className="w-full bg-muted rounded-full h-2.5 mr-2">
                                <div
                                  className={`h-2.5 rounded-full ${
                                    disease.risk < 20 ? 'bg-green-600' :
                                    disease.risk < 40 ? 'bg-yellow-600' :
                                    'bg-red-600'
                                  }`}
                                  style={{ width: `${disease.risk}%` }}
                                ></div>
                              </div>
                              <span className="font-medium">{disease.risk}%</span>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <h4 className="font-medium">{t('common.affectedArea')}</h4>
                            <div className="flex items-center">
                              <div className="w-full bg-muted rounded-full h-2.5 mr-2">
                                <div
                                  className={`h-2.5 rounded-full ${
                                    disease.affected_area < 10 ? 'bg-green-600' :
                                    disease.affected_area < 20 ? 'bg-yellow-600' :
                                    'bg-red-600'
                                  }`}
                                  style={{ width: `${disease.affected_area}%` }}
                                ></div>
                              </div>
                              <span className="font-medium">{disease.affected_area}%</span>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <h4 className="font-medium">{t('common.severity')}</h4>
                            <span className={`font-medium ${
                              disease.severity === 'Very Low' ? 'text-green-500' :
                              disease.severity === 'Low' ? 'text-yellow-500' :
                              disease.severity === 'Moderate' ? 'text-orange-500' :
                              'text-red-500'
                            }`}>
                              {disease.severity}
                            </span>
                          </div>
                        </div>
                        <div className="mt-4">
                          <h4 className="font-medium mb-2">{t('common.recommendedActions')}</h4>
                          <p className="text-sm">
                            {disease.risk > 30
                              ? t('common.highRiskDiseaseMessage', { disease: disease.name })
                              : t('common.lowRiskDiseaseMessage', { disease: disease.name })}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>
    </div>
  );
}

