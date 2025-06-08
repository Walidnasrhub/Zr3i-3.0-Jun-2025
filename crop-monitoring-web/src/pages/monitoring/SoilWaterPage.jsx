import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Droplets, Thermometer, Waves, Beaker, BarChart2, FileText } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';

export default function SoilWaterPage() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('soil');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedField, setSelectedField] = useState(null);
  const [fields, setFields] = useState([]);
  const [soilData, setSoilData] = useState(null);
  const [waterData, setWaterData] = useState(null);
  const [soilHistoryData, setSoilHistoryData] = useState([]);
  const [waterHistoryData, setWaterHistoryData] = useState([]);
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
    
    // Simulate loading soil and water data for the selected field
    setIsLoading(true);
    setTimeout(() => {
      // Soil data
      const mockSoilData = {
        moisture: 35 + Math.random() * 20,
        temperature: 22 + Math.random() * 5,
        ph: 6.5 + Math.random() * 1.5,
        organic_matter: 2 + Math.random() * 3,
        nitrogen: 20 + Math.random() * 30,
        phosphorus: 15 + Math.random() * 20,
        potassium: 150 + Math.random() * 100,
        electrical_conductivity: 0.5 + Math.random() * 1,
        cation_exchange_capacity: 10 + Math.random() * 10,
        composition: {
          sand: 40 + Math.random() * 20,
          silt: 30 + Math.random() * 20,
          clay: 20 + Math.random() * 20,
        },
        timestamp: new Date().toISOString(),
      };
      setSoilData(mockSoilData);
      
      // Water data
      const mockWaterData = {
        level: 80 + Math.random() * 20,
        ph: 6.8 + Math.random() * 1,
        temperature: 20 + Math.random() * 5,
        dissolved_oxygen: 7 + Math.random() * 3,
        electrical_conductivity: 0.7 + Math.random() * 0.5,
        turbidity: 5 + Math.random() * 10,
        nitrate: 5 + Math.random() * 5,
        phosphate: 0.5 + Math.random() * 0.5,
        salinity: 0.2 + Math.random() * 0.3,
        timestamp: new Date().toISOString(),
      };
      setWaterData(mockWaterData);
      
      // Soil history data
      const mockSoilHistoryData = [];
      const startDate = new Date(dateRange.startDate);
      const endDate = new Date(dateRange.endDate);
      const dayDiff = Math.floor((endDate - startDate) / (24 * 60 * 60 * 1000));
      
      for (let i = 0; i <= dayDiff; i += 2) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + i);
        mockSoilHistoryData.push({
          date: date.toISOString().split('T')[0],
          moisture: 30 + Math.random() * 25,
          temperature: 20 + Math.random() * 7,
          ph: 6.2 + Math.random() * 1.8,
        });
      }
      setSoilHistoryData(mockSoilHistoryData);
      
      // Water history data
      const mockWaterHistoryData = [];
      for (let i = 0; i <= dayDiff; i += 2) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + i);
        mockWaterHistoryData.push({
          date: date.toISOString().split('T')[0],
          level: 75 + Math.random() * 25,
          ph: 6.5 + Math.random() * 1.5,
          dissolved_oxygen: 6 + Math.random() * 4,
        });
      }
      setWaterHistoryData(mockWaterHistoryData);
      
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
      // Soil history data
      const mockSoilHistoryData = [];
      const startDate = new Date(dateRange.startDate);
      const endDate = new Date(dateRange.endDate);
      const dayDiff = Math.floor((endDate - startDate) / (24 * 60 * 60 * 1000));
      
      for (let i = 0; i <= dayDiff; i += 2) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + i);
        mockSoilHistoryData.push({
          date: date.toISOString().split('T')[0],
          moisture: 30 + Math.random() * 25,
          temperature: 20 + Math.random() * 7,
          ph: 6.2 + Math.random() * 1.8,
        });
      }
      setSoilHistoryData(mockSoilHistoryData);
      
      // Water history data
      const mockWaterHistoryData = [];
      for (let i = 0; i <= dayDiff; i += 2) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + i);
        mockWaterHistoryData.push({
          date: date.toISOString().split('T')[0],
          level: 75 + Math.random() * 25,
          ph: 6.5 + Math.random() * 1.5,
          dissolved_oxygen: 6 + Math.random() * 4,
        });
      }
      setWaterHistoryData(mockWaterHistoryData);
      
      setIsLoading(false);
    }, 1000);
  };

  // Get soil moisture status
  const getSoilMoistureStatus = (moisture) => {
    if (moisture < 20) return { status: t('common.dry'), color: 'text-red-500' };
    if (moisture < 40) return { status: t('common.slightlyDry'), color: 'text-orange-500' };
    if (moisture < 60) return { status: t('common.optimal'), color: 'text-green-500' };
    if (moisture < 80) return { status: t('common.moist'), color: 'text-blue-500' };
    return { status: t('common.wet'), color: 'text-indigo-500' };
  };

  // Get soil pH status
  const getSoilPhStatus = (ph) => {
    if (ph < 5.5) return { status: t('common.veryAcidic'), color: 'text-red-500' };
    if (ph < 6.5) return { status: t('common.acidic'), color: 'text-orange-500' };
    if (ph < 7.5) return { status: t('common.neutral'), color: 'text-green-500' };
    if (ph < 8.5) return { status: t('common.alkaline'), color: 'text-blue-500' };
    return { status: t('common.veryAlkaline'), color: 'text-indigo-500' };
  };

  // Get water level status
  const getWaterLevelStatus = (level) => {
    if (level < 30) return { status: t('common.veryLow'), color: 'text-red-500' };
    if (level < 60) return { status: t('common.low'), color: 'text-orange-500' };
    if (level < 80) return { status: t('common.moderate'), color: 'text-green-500' };
    if (level < 95) return { status: t('common.high'), color: 'text-blue-500' };
    return { status: t('common.veryHigh'), color: 'text-indigo-500' };
  };

  // Soil composition data for pie chart
  const getSoilCompositionData = () => {
    if (!soilData) return [];
    
    return [
      { name: t('common.sand'), value: soilData.composition.sand },
      { name: t('common.silt'), value: soilData.composition.silt },
      { name: t('common.clay'), value: soilData.composition.clay },
      { name: t('common.other'), value: 100 - soilData.composition.sand - soilData.composition.silt - soilData.composition.clay },
    ];
  };

  // Colors for pie chart
  const COLORS = ['#FFBB28', '#FF8042', '#0088FE', '#00C49F'];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{t('monitoring.soilWater')}</h1>
        <div className="space-x-2">
          <Button
            variant="outline"
            onClick={() => setActiveTab('soil')}
          >
            <Beaker className="mr-2 h-4 w-4" />
            {t('monitoring.soilData')}
          </Button>
          <Button
            variant="outline"
            onClick={() => setActiveTab('water')}
          >
            <Waves className="mr-2 h-4 w-4" />
            {t('monitoring.waterData')}
          </Button>
          <Button
            variant="outline"
            onClick={() => setActiveTab('history')}
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

          {selectedField && soilData && (
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>{t('monitoring.lastUpdated')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  {new Date(soilData.timestamp).toLocaleString()}
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
                <TabsTrigger value="soil">
                  <Beaker className="h-4 w-4 mr-2" />
                  {t('monitoring.soilData')}
                </TabsTrigger>
                <TabsTrigger value="water">
                  <Waves className="h-4 w-4 mr-2" />
                  {t('monitoring.waterData')}
                </TabsTrigger>
                <TabsTrigger value="history">
                  <BarChart2 className="h-4 w-4 mr-2" />
                  {t('monitoring.historicalData')}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="soil" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>{t('monitoring.soilMoisture')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col items-center">
                        <Droplets className="h-12 w-12 text-blue-500 mb-2" />
                        <div className="text-center">
                          <h3 className="text-3xl font-bold">
                            {soilData.moisture.toFixed(1)}%
                          </h3>
                          <p className={`${getSoilMoistureStatus(soilData.moisture).color}`}>
                            {getSoilMoistureStatus(soilData.moisture).status}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>{t('monitoring.soilTemperature')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col items-center">
                        <Thermometer className="h-12 w-12 text-orange-500 mb-2" />
                        <div className="text-center">
                          <h3 className="text-3xl font-bold">
                            {soilData.temperature.toFixed(1)}°C
                          </h3>
                          <p className="text-muted-foreground">
                            {soilData.temperature < 15
                              ? t('common.cool')
                              : soilData.temperature < 25
                              ? t('common.moderate')
                              : t('common.warm')}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>{t('monitoring.soilPh')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col items-center">
                        <Beaker className="h-12 w-12 text-purple-500 mb-2" />
                        <div className="text-center">
                          <h3 className="text-3xl font-bold">
                            {soilData.ph.toFixed(1)}
                          </h3>
                          <p className={`${getSoilPhStatus(soilData.ph).color}`}>
                            {getSoilPhStatus(soilData.ph).status}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>{t('monitoring.soilComposition')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={getSoilCompositionData()}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                            >
                              {getSoilCompositionData().map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip formatter={(value) => `${value.toFixed(1)}%`} />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>{t('monitoring.soilNutrients')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>{t('common.nitrogen')} (N)</span>
                            <span className="font-medium">{soilData.nitrogen.toFixed(1)} ppm</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2.5">
                            <div
                              className="bg-blue-600 h-2.5 rounded-full"
                              style={{ width: `${Math.min(100, (soilData.nitrogen / 50) * 100)}%` }}
                            ></div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>{t('common.phosphorus')} (P)</span>
                            <span className="font-medium">{soilData.phosphorus.toFixed(1)} ppm</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2.5">
                            <div
                              className="bg-green-600 h-2.5 rounded-full"
                              style={{ width: `${Math.min(100, (soilData.phosphorus / 30) * 100)}%` }}
                            ></div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>{t('common.potassium')} (K)</span>
                            <span className="font-medium">{soilData.potassium.toFixed(1)} ppm</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2.5">
                            <div
                              className="bg-purple-600 h-2.5 rounded-full"
                              style={{ width: `${Math.min(100, (soilData.potassium / 200) * 100)}%` }}
                            ></div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>{t('common.organicMatter')}</span>
                            <span className="font-medium">{soilData.organic_matter.toFixed(1)}%</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2.5">
                            <div
                              className="bg-amber-600 h-2.5 rounded-full"
                              style={{ width: `${Math.min(100, (soilData.organic_matter / 5) * 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="water" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>{t('monitoring.waterLevel')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col items-center">
                        <Waves className="h-12 w-12 text-blue-500 mb-2" />
                        <div className="text-center">
                          <h3 className="text-3xl font-bold">
                            {waterData.level.toFixed(1)}%
                          </h3>
                          <p className={`${getWaterLevelStatus(waterData.level).color}`}>
                            {getWaterLevelStatus(waterData.level).status}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>{t('monitoring.waterTemperature')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col items-center">
                        <Thermometer className="h-12 w-12 text-orange-500 mb-2" />
                        <div className="text-center">
                          <h3 className="text-3xl font-bold">
                            {waterData.temperature.toFixed(1)}°C
                          </h3>
                          <p className="text-muted-foreground">
                            {waterData.temperature < 15
                              ? t('common.cool')
                              : waterData.temperature < 25
                              ? t('common.moderate')
                              : t('common.warm')}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>{t('monitoring.waterPh')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col items-center">
                        <Beaker className="h-12 w-12 text-purple-500 mb-2" />
                        <div className="text-center">
                          <h3 className="text-3xl font-bold">
                            {waterData.ph.toFixed(1)}
                          </h3>
                          <p className={`${getSoilPhStatus(waterData.ph).color}`}>
                            {getSoilPhStatus(waterData.ph).status}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>{t('monitoring.waterQuality')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>{t('common.dissolvedOxygen')}</span>
                            <span className="font-medium">{waterData.dissolved_oxygen.toFixed(1)} mg/L</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2.5">
                            <div
                              className="bg-blue-600 h-2.5 rounded-full"
                              style={{ width: `${Math.min(100, (waterData.dissolved_oxygen / 10) * 100)}%` }}
                            ></div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>{t('common.electricalConductivity')}</span>
                            <span className="font-medium">{waterData.electrical_conductivity.toFixed(2)} dS/m</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2.5">
                            <div
                              className="bg-green-600 h-2.5 rounded-full"
                              style={{ width: `${Math.min(100, (waterData.electrical_conductivity / 1.5) * 100)}%` }}
                            ></div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>{t('common.turbidity')}</span>
                            <span className="font-medium">{waterData.turbidity.toFixed(1)} NTU</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2.5">
                            <div
                              className="bg-amber-600 h-2.5 rounded-full"
                              style={{ width: `${Math.min(100, (waterData.turbidity / 20) * 100)}%` }}
                            ></div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>{t('common.salinity')}</span>
                            <span className="font-medium">{waterData.salinity.toFixed(2)} ppt</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2.5">
                            <div
                              className="bg-red-600 h-2.5 rounded-full"
                              style={{ width: `${Math.min(100, (waterData.salinity / 0.5) * 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>{t('monitoring.waterNutrients')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>{t('common.nitrate')} (NO₃)</span>
                            <span className="font-medium">{waterData.nitrate.toFixed(1)} mg/L</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2.5">
                            <div
                              className="bg-blue-600 h-2.5 rounded-full"
                              style={{ width: `${Math.min(100, (waterData.nitrate / 10) * 100)}%` }}
                            ></div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>{t('common.phosphate')} (PO₄)</span>
                            <span className="font-medium">{waterData.phosphate.toFixed(2)} mg/L</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2.5">
                            <div
                              className="bg-green-600 h-2.5 rounded-full"
                              style={{ width: `${Math.min(100, (waterData.phosphate / 1) * 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                      <div className="mt-6">
                        <h4 className="font-medium mb-2">{t('common.waterQualityAssessment')}</h4>
                        <p className="text-sm">
                          {waterData.dissolved_oxygen > 6 && waterData.ph > 6.5 && waterData.ph < 8.5 && waterData.turbidity < 10
                            ? t('common.goodWaterQuality')
                            : t('common.fairWaterQuality')}
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

              <TabsContent value="history" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>{t('monitoring.soilMoistureHistory')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                          data={soilHistoryData}
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
                            formatter={(value) => [`${value.toFixed(1)}%`, '']}
                          />
                          <Area
                            type="monotone"
                            dataKey="moisture"
                            stroke="#8884d8"
                            fill="#8884d8"
                            name={t('monitoring.soilMoisture')}
                            fillOpacity={0.3}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>{t('monitoring.soilTemperatureHistory')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart
                            data={soilHistoryData}
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
                            <Line
                              type="monotone"
                              dataKey="temperature"
                              name={t('monitoring.soilTemperature')}
                              stroke="#ff7300"
                              activeDot={{ r: 8 }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>{t('monitoring.soilPhHistory')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart
                            data={soilHistoryData}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                              dataKey="date"
                              tickFormatter={(date) => new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                            />
                            <YAxis domain={[5, 9]} />
                            <Tooltip
                              labelFormatter={(date) => new Date(date).toLocaleDateString()}
                              formatter={(value) => [`${value.toFixed(1)}`, '']}
                            />
                            <Line
                              type="monotone"
                              dataKey="ph"
                              name={t('monitoring.soilPh')}
                              stroke="#82ca9d"
                              activeDot={{ r: 8 }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>{t('monitoring.waterLevelHistory')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                          data={waterHistoryData}
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
                            formatter={(value) => [`${value.toFixed(1)}%`, '']}
                          />
                          <Area
                            type="monotone"
                            dataKey="level"
                            stroke="#0088FE"
                            fill="#0088FE"
                            name={t('monitoring.waterLevel')}
                            fillOpacity={0.3}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
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

