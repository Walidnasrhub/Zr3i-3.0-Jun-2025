import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, FeatureGroup, Polygon } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { fieldSchema } from '../lib/validations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';
import { fieldsAPI } from '../lib/api';

// This is a workaround for Leaflet's icon issues with webpack
import L from 'leaflet';
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

export default function FieldForm({ fieldId = null, onSuccess }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [drawnItems, setDrawnItems] = useState(null);
  const [mapCenter, setMapCenter] = useState([51.505, -0.09]); // Default center
  const [initialBoundary, setInitialBoundary] = useState(null);
  
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(fieldSchema),
    defaultValues: {
      name: '',
      description: '',
      crop_type: '',
      boundary: null,
    },
  });

  // Fetch field data if editing
  useEffect(() => {
    if (fieldId) {
      const fetchField = async () => {
        try {
          setIsLoading(true);
          const response = await fieldsAPI.getField(fieldId);
          const field = response.data;
          
          // Set form values
          reset({
            name: field.name,
            description: field.description || '',
            crop_type: field.crop_type || '',
          });
          
          // Parse boundary GeoJSON
          const boundary = JSON.parse(field.boundary);
          setInitialBoundary(boundary);
          setValue('boundary', boundary);
          
          // Set map center to field center
          setMapCenter([field.center_lat, field.center_lon]);
        } catch (err) {
          console.error('Failed to fetch field:', err);
          setError('Failed to load field data. Please try again.');
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchField();
    }
  }, [fieldId, reset, setValue]);

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      setError(null);
      
      if (fieldId) {
        // Update existing field
        await fieldsAPI.updateField(fieldId, data);
      } else {
        // Create new field
        await fieldsAPI.createField(data);
      }
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      console.error('Failed to save field:', err);
      setError(err.response?.data?.error || 'Failed to save field. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle map drawing events
  const handleCreated = (e) => {
    const { layerType, layer } = e;
    
    if (layerType === 'polygon') {
      // Convert Leaflet layer to GeoJSON
      const geoJSON = layer.toGeoJSON();
      setValue('boundary', geoJSON);
      setDrawnItems(layer);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">
        {fieldId ? 'Edit Field' : 'Add New Field'}
      </h2>
      
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Field Name</Label>
          <Input
            id="name"
            {...register('name')}
            disabled={isLoading}
          />
          {errors.name && (
            <p className="text-sm text-destructive">{errors.name.message}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description">Description (Optional)</Label>
          <Textarea
            id="description"
            {...register('description')}
            disabled={isLoading}
          />
          {errors.description && (
            <p className="text-sm text-destructive">{errors.description.message}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="crop_type">Crop Type (Optional)</Label>
          <Input
            id="crop_type"
            {...register('crop_type')}
            disabled={isLoading}
          />
          {errors.crop_type && (
            <p className="text-sm text-destructive">{errors.crop_type.message}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label>Field Boundary</Label>
          <div className="h-96 border rounded-md overflow-hidden">
            <MapContainer center={mapCenter} zoom={13} style={{ height: '100%', width: '100%' }}>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <FeatureGroup>
                <EditControl
                  position="topright"
                  onCreated={handleCreated}
                  draw={{
                    rectangle: false,
                    circle: false,
                    circlemarker: false,
                    marker: false,
                    polyline: false,
                  }}
                />
                {initialBoundary && (
                  <Polygon
                    positions={initialBoundary.geometry.coordinates[0].map(coord => [coord[1], coord[0]])}
                    pathOptions={{ color: 'green' }}
                  />
                )}
              </FeatureGroup>
            </MapContainer>
          </div>
          {errors.boundary && (
            <p className="text-sm text-destructive">{errors.boundary.message}</p>
          )}
          <p className="text-sm text-muted-foreground">
            Draw a polygon on the map to define your field boundary.
          </p>
        </div>
        
        <div className="flex justify-end space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={onSuccess}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Field'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

