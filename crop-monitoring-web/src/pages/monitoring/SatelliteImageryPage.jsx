import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { MapContainer, TileLayer, FeatureGroup, Polygon, Marker, Popup } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Calendar, Cloud, Droplets, Thermometer, Wind, Layers, Map, Activity, AlertTriangle, FileText, History, BarChart2 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';

// This is a workaround for Leaflet's icon issues with webpack
import L from 'leaflet';
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

export default function SatelliteImageryPage() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('imagery');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedField, setSelectedField] = useState(null);
  const [fields, setFields] = useState([]);
  const [satelliteImages, setSatelliteImages] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [ndviData, setNdviData] = useState([]);
  const [mapCenter, setMapCenter] = useState([30.0444, 31.2357]); // Cairo, Egypt as default
  const [mapZoom, setMapZoom] = useState(7);
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
          boundary: JSON.stringify({
            type: 'Feature',
            geometry: {
              type: 'Polygon',
              coordinates: [
                [
                  [31.1098, 30.9327],
                  [31.1298, 30.9327],
                  [31.1298, 30.9527],
                  [31.1098, 30.9527],
                  [31.1098, 30.9327],
                ],
              ],
            },
          }),
        },
        {
          id: 2,
          name: 'Upper Egypt Field',
          description: 'Wheat cultivation field in Upper Egypt',
          crop_type: 'Wheat',
          area_hectares: 18.3,
          center_lat: 25.6872,
          center_lon: 32.6396,
          boundary: JSON.stringify({
            type: 'Feature',
            geometry: {
              type: 'Polygon',
              coordinates: [
                [
                  [32.6296, 25.6772],
                  [32.6496, 25.6772],
                  [32.6496, 25.6972],
                  [32.6296, 25.6972],
                  [32.6296, 25.6772],
                ],
              ],
            },
          }),
        },
      ];
      setFields(mockFields);
      setIsLoading(false);
    }, 1000);

    // Simulate NDVI data
    const mockNdviData = [];
    const startDate = new Date(dateRange.startDate);
    const endDate = new Date(dateRange.endDate);
    const dayDiff = Math.floor((endDate - startDate) / (24 * 60 * 60 * 1000));
    
    for (let i = 0; i <= dayDiff; i += 5) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      mockNdviData.push({
        date: date.toISOString().split('T')[0],
        min: Math.random() * 0.2,
        mean: 0.3 + Math.random() * 0.4,
        max: 0.7 + Math.random() * 0.3,
      });
    }
    setNdviData(mockNdviData);
  }, [dateRange]);

  // Handle field selection
  const handleFieldSelect = (field) => {
    setSelectedField(field);
    setMapCenter([field.center_lat, field.center_lon]);
    setMapZoom(14);
    
    // Simulate loading satellite images for the selected field
    setIsLoading(true);
    setTimeout(() => {
      const mockSatelliteImages = [];
      const startDate = new Date(dateRange.startDate);
      const endDate = new Date(dateRange.endDate);
      const dayDiff = Math.floor((endDate - startDate) / (24 * 60 * 60 * 1000));
      
      for (let i = 0; i <= dayDiff; i += 5) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + i);
        mockSatelliteImages.push({
          id: i + 1,
          acquisition_date: date.toISOString(),
          cloud_cover_percentage: Math.floor(Math.random() * 20),
          satellite: 'Sentinel-2',
          product_type: 'L2A',
          ndvi_min: Math.random() * 0.2,
          ndvi_max: 0.7 + Math.random() * 0.3,
          ndvi_mean: 0.3 + Math.random() * 0.4,
          evi_min: Math.random() * 0.2,
          evi_max: 0.7 + Math.random() * 0.3,
          evi_mean: 0.3 + Math.random() * 0.4,
          field_id: field.id,
        });
      }
      setSatelliteImages(mockSatelliteImages);
      setIsLoading(false);
    }, 1000);
  };

  // Handle date selection
  const handleDateSelect = (date) => {
    setSelectedDate(date);
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
    // Reload data with new date range
    setIsLoading(true);
    setTimeout(() => {
      // Simulate NDVI data
      const mockNdviData = [];
      const startDate = new Date(dateRange.startDate);
      const endDate = new Date(dateRange.endDate);
      const dayDiff = Math.floor((endDate - startDate) / (24 * 60 * 60 * 1000));
      
      for (let i = 0; i <= dayDiff; i += 5) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + i);
        mockNdviData.push({
          date: date.toISOString().split('T')[0],
          min: Math.random() * 0.2,
          mean: 0.3 + Math.random() * 0.4,
          max: 0.7 + Math.random() * 0.3,
        });
      }
      setNdviData(mockNdviData);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{t('monitoring.satelliteImagery')}</h1>
        <div className="space-x-2">
          <Button
            variant="outline"
            onClick={() => setActiveTab('imagery')}
          >
            <Layers className="mr-2 h-4 w-4" />
            {t('monitoring.highResolutionImagery')}
          </Button>
          <Button
            variant="outline"
            onClick={() => setActiveTab('mapping')}
          >
            <Map className="mr-2 h-4 w-4" />
            {t('monitoring.gisMapping')}
          </Button>
          <Button
            variant="outline"
            onClick={() => setActiveTab('analysis')}
          >
            <Activity className="mr-2 h-4 w-4" />
            {t('monitoring.ndvi')}
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
              {isLoading ? (
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

          {selectedField && (
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

          {selectedField && satelliteImages.length > 0 && (
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>{t('monitoring.satelliteImagery')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {satelliteImages.map((image) => (
                    <div
                      key={image.id}
                      className={`p-3 rounded-md cursor-pointer transition-colors ${
                        selectedDate === image.acquisition_date
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-card hover:bg-muted'
                      }`}
                      onClick={() => handleDateSelect(image.acquisition_date)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2" />
                          <span>
                            {new Date(image.acquisition_date).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <Cloud className="h-4 w-4 mr-1" />
                          <span>{image.cloud_cover_percentage}%</span>
                        </div>
                      </div>
                      <div className="mt-2 text-sm">
                        <div className="flex justify-between">
                          <span>NDVI:</span>
                          <span>{image.ndvi_mean.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="md:col-span-3">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="imagery">
                <Layers className="h-4 w-4 mr-2" />
                {t('monitoring.highResolutionImagery')}
              </TabsTrigger>
              <TabsTrigger value="mapping">
                <Map className="h-4 w-4 mr-2" />
                {t('monitoring.gisMapping')}
              </TabsTrigger>
              <TabsTrigger value="analysis">
                <Activity className="h-4 w-4 mr-2" />
                {t('monitoring.ndvi')}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="imagery" className="space-y-4">
              <Card>
                <CardContent className="p-0">
                  <div className="h-[600px] relative">
                    {isLoading && (
                      <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      </div>
                    )}
                    <MapContainer
                      center={mapCenter}
                      zoom={mapZoom}
                      style={{ height: '100%', width: '100%' }}
                    >
                      <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />
                      {/* Sentinel-2 imagery layer (mock) */}
                      <TileLayer
                        url="https://services.sentinel-hub.com/ogc/wms/{instanceId}?service=WMS&request=GetMap&layers=TRUE-COLOR-S2-L1C&styles=&format=image/jpeg&transparent=true&version=1.1.1&showlogo=false&name=Sentinel-2%20L1C%20True%20Color&width=256&height=256&pane=overlayPane&maxcc=20&time=2020-01-01/2020-12-31&srs=EPSG:3857&bbox={bbox}"
                        attribution="&copy; <a href='https://www.sentinel-hub.com/' target='_blank'>Sentinel Hub</a>"
                      />
                      {selectedField && (
                        <>
                          {/* Field boundary */}
                          <Polygon
                            positions={JSON.parse(selectedField.boundary).geometry.coordinates[0].map(coord => [coord[1], coord[0]])}
                            pathOptions={{ color: 'green', fillColor: 'green', fillOpacity: 0.2 }}
                          />
                          {/* Field center marker */}
                          <Marker position={[selectedField.center_lat, selectedField.center_lon]}>
                            <Popup>{selectedField.name}</Popup>
                          </Marker>
                        </>
                      )}
                    </MapContainer>
                  </div>
                </CardContent>
              </Card>

              {selectedField && selectedDate && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>{t('monitoring.ndvi')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64 bg-muted rounded-md flex items-center justify-center">
                        <div className="text-center">
                          <Activity className="h-16 w-16 mx-auto text-primary mb-2" />
                          <p>{t('monitoring.ndviDescription')}</p>
                          <p className="text-lg font-bold mt-2">
                            {satelliteImages.find(img => img.acquisition_date === selectedDate)?.ndvi_mean.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>{t('monitoring.evi')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64 bg-muted rounded-md flex items-center justify-center">
                        <div className="text-center">
                          <BarChart2 className="h-16 w-16 mx-auto text-primary mb-2" />
                          <p>{t('monitoring.eviDescription')}</p>
                          <p className="text-lg font-bold mt-2">
                            {satelliteImages.find(img => img.acquisition_date === selectedDate)?.evi_mean.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </TabsContent>

            <TabsContent value="mapping" className="space-y-4">
              <Card>
                <CardContent className="p-0">
                  <div className="h-[600px] relative">
                    {isLoading && (
                      <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      </div>
                    )}
                    <MapContainer
                      center={mapCenter}
                      zoom={mapZoom}
                      style={{ height: '100%', width: '100%' }}
                    >
                      <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />
                      {/* GIS layers */}
                      {fields.map((field) => (
                        <Polygon
                          key={field.id}
                          positions={JSON.parse(field.boundary).geometry.coordinates[0].map(coord => [coord[1], coord[0]])}
                          pathOptions={{
                            color: selectedField?.id === field.id ? 'green' : 'blue',
                            fillColor: selectedField?.id === field.id ? 'green' : 'blue',
                            fillOpacity: 0.2,
                            weight: selectedField?.id === field.id ? 3 : 1,
                          }}
                          eventHandlers={{
                            click: () => handleFieldSelect(field),
                          }}
                        >
                          <Popup>
                            <div>
                              <h3 className="font-bold">{field.name}</h3>
                              <p>{field.description}</p>
                              <p>
                                <strong>{t('fields.fieldCropType')}:</strong> {field.crop_type}
                              </p>
                              <p>
                                <strong>{t('fields.fieldArea')}:</strong> {field.area_hectares.toFixed(2)} {t('fields.hectares')}
                              </p>
                            </div>
                          </Popup>
                        </Polygon>
                      ))}
                    </MapContainer>
                  </div>
                </CardContent>
              </Card>

              {selectedField && (
                <Card>
                  <CardHeader>
                    <CardTitle>{t('fields.fieldBoundary')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="font-medium">{t('fields.fieldName')}:</span>
                        <span>{selectedField.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">{t('fields.fieldCropType')}:</span>
                        <span>{selectedField.crop_type}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">{t('fields.fieldArea')}:</span>
                        <span>{selectedField.area_hectares.toFixed(2)} {t('fields.hectares')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">{t('fields.fieldCenter')}:</span>
                        <span>
                          {selectedField.center_lat.toFixed(6)}, {selectedField.center_lon.toFixed(6)}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="analysis" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>{t('monitoring.ndvi')} {t('monitoring.timeSeries')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={ndviData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis domain={[0, 1]} />
                        <Tooltip />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="min"
                          name={t('monitoring.min')}
                          stroke="#ff7300"
                        />
                        <Line
                          type="monotone"
                          dataKey="mean"
                          name={t('monitoring.mean')}
                          stroke="#2e7d32"
                          strokeWidth={2}
                        />
                        <Line
                          type="monotone"
                          dataKey="max"
                          name={t('monitoring.max')}
                          stroke="#387908"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>{t('monitoring.ndviRange')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center mb-4">
                      <div className="ndvi-gradient mr-2"></div>
                      <div className="flex justify-between w-full text-xs">
                        <span>0.0</span>
                        <span>0.5</span>
                        <span>1.0</span>
                      </div>
                    </div>
                    <p className="text-sm">
                      {t('monitoring.ndviDescription')}: {t('monitoring.ndviRange')} 0-1
                    </p>
                    <ul className="mt-4 space-y-2 text-sm">
                      <li>
                        <span className="inline-block w-3 h-3 bg-red-500 mr-2"></span>
                        0.0 - 0.2: {t('common.bareSoil')}
                      </li>
                      <li>
                        <span className="inline-block w-3 h-3 bg-yellow-500 mr-2"></span>
                        0.2 - 0.4: {t('common.sparseVegetation')}
                      </li>
                      <li>
                        <span className="inline-block w-3 h-3 bg-lime-500 mr-2"></span>
                        0.4 - 0.6: {t('common.moderateVegetation')}
                      </li>
                      <li>
                        <span className="inline-block w-3 h-3 bg-green-500 mr-2"></span>
                        0.6 - 0.8: {t('common.denseVegetation')}
                      </li>
                      <li>
                        <span className="inline-block w-3 h-3 bg-green-800 mr-2"></span>
                        0.8 - 1.0: {t('common.veryDenseVegetation')}
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>{t('monitoring.cropHealth')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selectedField ? (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{t('monitoring.cropType')}:</span>
                          <span>{selectedField.crop_type}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{t('monitoring.cropStage')}:</span>
                          <span>{t('common.growing')}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{t('monitoring.cropHealth')}:</span>
                          <span className="text-green-500">{t('common.healthy')}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{t('monitoring.lastUpdated')}:</span>
                          <span>{new Date().toLocaleDateString()}</span>
                        </div>
                        <Button className="w-full">
                          <FileText className="mr-2 h-4 w-4" />
                          {t('monitoring.generateReport')}
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-40">
                        <p className="text-muted-foreground">{t('fields.selectField')}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

