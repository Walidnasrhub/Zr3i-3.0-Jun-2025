import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Polygon, Marker, Popup } from 'react-leaflet';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Calendar, Cloud, Droplets } from 'lucide-react';
import { fieldsAPI, satelliteAPI } from '../lib/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function FieldDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [field, setField] = useState(null);
  const [satelliteImages, setSatelliteImages] = useState([]);
  const [vegetationIndices, setVegetationIndices] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFetchingData, setIsFetchingData] = useState(false);

  // Fetch field data
  useEffect(() => {
    const fetchField = async () => {
      try {
        setIsLoading(true);
        const response = await fieldsAPI.getField(id);
        setField(response.data);
      } catch (err) {
        console.error('Failed to fetch field:', err);
        setError('Failed to load field data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchField();
  }, [id]);

  // Fetch satellite images
  useEffect(() => {
    const fetchSatelliteImages = async () => {
      if (!field) return;
      
      try {
        const response = await satelliteAPI.getImages(id);
        setSatelliteImages(response.data);
        
        // Fetch vegetation indices for the field
        const indicesResponse = await satelliteAPI.getVegetationIndices(id, {
          index_type: 'ndvi'
        });
        setVegetationIndices(indicesResponse.data.data);
      } catch (err) {
        console.error('Failed to fetch satellite data:', err);
        // Don't set error here to avoid blocking the UI
      }
    };

    fetchSatelliteImages();
  }, [id, field]);

  // Handle fetching new satellite data
  const handleFetchSatelliteData = async () => {
    try {
      setIsFetchingData(true);
      
      // Get dates for the last 3 months
      const endDate = new Date().toISOString().split('T')[0];
      const startDate = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      
      await satelliteAPI.fetchData(id, {
        start_date: startDate,
        end_date: endDate,
        cloud_cover: 20
      });
      
      // Refresh satellite images
      const response = await satelliteAPI.getImages(id);
      setSatelliteImages(response.data);
      
      // Refresh vegetation indices
      const indicesResponse = await satelliteAPI.getVegetationIndices(id, {
        index_type: 'ndvi'
      });
      setVegetationIndices(indicesResponse.data.data);
    } catch (err) {
      console.error('Failed to fetch satellite data:', err);
      setError('Failed to fetch satellite data. Please try again.');
    } finally {
      setIsFetchingData(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!field) {
    return (
      <Alert>
        <AlertDescription>Field not found.</AlertDescription>
      </Alert>
    );
  }

  // Parse the boundary GeoJSON
  const boundary = JSON.parse(field.boundary);
  const coordinates = boundary.geometry.coordinates[0].map(coord => [coord[1], coord[0]]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{field.name}</h1>
        <div className="space-x-2">
          <Button
            variant="outline"
            onClick={() => navigate(`/fields/${id}/edit`)}
          >
            Edit Field
          </Button>
          <Button
            onClick={handleFetchSatelliteData}
            disabled={isFetchingData}
          >
            {isFetchingData ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Fetching Data...
              </>
            ) : (
              'Fetch Satellite Data'
            )}
          </Button>
        </div>
      </div>

      {field.description && (
        <p className="text-muted-foreground">{field.description}</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Crop Type</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {field.crop_type || 'Not specified'}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Area</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {field.area_hectares ? `${field.area_hectares.toFixed(2)} ha` : 'Not calculated'}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Satellite Images</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {satelliteImages.length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="satellite">Satellite Images</TabsTrigger>
          <TabsTrigger value="vegetation">Vegetation Indices</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="h-96 border rounded-md overflow-hidden">
            <MapContainer
              center={[field.center_lat, field.center_lon]}
              zoom={13}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Polygon
                positions={coordinates}
                pathOptions={{ color: 'green', fillColor: 'green', fillOpacity: 0.2 }}
              />
              <Marker position={[field.center_lat, field.center_lon]}>
                <Popup>{field.name}</Popup>
              </Marker>
            </MapContainer>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Field Information</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="space-y-2">
                  <div className="flex justify-between">
                    <dt className="font-medium">Created</dt>
                    <dd>{new Date(field.created_at).toLocaleDateString()}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="font-medium">Last Updated</dt>
                    <dd>{new Date(field.updated_at).toLocaleDateString()}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="font-medium">Center Coordinates</dt>
                    <dd>{field.center_lat.toFixed(6)}, {field.center_lon.toFixed(6)}</dd>
                  </div>
                </dl>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Latest Satellite Data</CardTitle>
              </CardHeader>
              <CardContent>
                {satelliteImages.length > 0 ? (
                  <dl className="space-y-2">
                    <div className="flex justify-between">
                      <dt className="font-medium">Latest Image</dt>
                      <dd>{new Date(satelliteImages[0].acquisition_date).toLocaleDateString()}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="font-medium">Cloud Cover</dt>
                      <dd>{satelliteImages[0].cloud_cover_percentage}%</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="font-medium">Average NDVI</dt>
                      <dd>{satelliteImages[0].ndvi_mean?.toFixed(2) || 'N/A'}</dd>
                    </div>
                  </dl>
                ) : (
                  <p className="text-muted-foreground">No satellite data available. Click "Fetch Satellite Data" to get started.</p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="satellite">
          {satelliteImages.length > 0 ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {satelliteImages.map((image) => (
                  <Card key={image.id}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        {new Date(image.acquisition_date).toLocaleDateString()}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm flex items-center">
                            <Cloud className="h-4 w-4 mr-1" />
                            Cloud Cover
                          </span>
                          <span className="font-medium">{image.cloud_cover_percentage}%</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm flex items-center">
                            <Droplets className="h-4 w-4 mr-1" />
                            NDVI Range
                          </span>
                          <span className="font-medium">{image.ndvi_min?.toFixed(2) || 'N/A'} - {image.ndvi_max?.toFixed(2) || 'N/A'}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No satellite images available for this field.</p>
              <Button
                onClick={handleFetchSatelliteData}
                disabled={isFetchingData}
                className="mt-4"
              >
                {isFetchingData ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Fetching Data...
                  </>
                ) : (
                  'Fetch Satellite Data'
                )}
              </Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="vegetation">
          {vegetationIndices.length > 0 ? (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>NDVI Time Series</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={vegetationIndices.map(item => ({
                          date: new Date(item.date).toLocaleDateString(),
                          min: item.min,
                          mean: item.mean,
                          max: item.max,
                        }))}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis domain={[0, 1]} />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="min" stroke="#ff7300" name="Min NDVI" />
                        <Line type="monotone" dataKey="mean" stroke="#2e7d32" name="Mean NDVI" strokeWidth={2} />
                        <Line type="monotone" dataKey="max" stroke="#387908" name="Max NDVI" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <div className="flex items-center justify-between p-4 bg-card rounded-lg">
                <div className="flex items-center">
                  <div className="ndvi-gradient mr-2"></div>
                  <div className="flex justify-between w-32 text-xs">
                    <span>0.0</span>
                    <span>0.5</span>
                    <span>1.0</span>
                  </div>
                </div>
                <div className="text-sm">
                  <p>NDVI Legend: Lower values indicate less vegetation, higher values indicate more vegetation.</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No vegetation index data available for this field.</p>
              <Button
                onClick={handleFetchSatelliteData}
                disabled={isFetchingData}
                className="mt-4"
              >
                {isFetchingData ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Fetching Data...
                  </>
                ) : (
                  'Fetch Satellite Data'
                )}
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

