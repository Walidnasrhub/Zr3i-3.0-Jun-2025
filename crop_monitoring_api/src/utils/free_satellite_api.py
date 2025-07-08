import os
import json
import requests
from datetime import datetime, timedelta
import numpy as np
from typing import List, Dict, Optional, Tuple
import base64

class AgromonitoringAPI:
    """
    Agromonitoring API integration for free satellite imagery and vegetation indices.
    Provides access to Sentinel-2 and Landsat-8 data with NDVI, EVI calculations.
    Free tier: 1000 API calls per month.
    """
    
    def __init__(self, api_key: str = None):
        """
        Initialize Agromonitoring API client.
        
        Args:
            api_key (str): Agromonitoring API key. Get free at https://agromonitoring.com/api/get
        """
        self.api_key = api_key or os.getenv('AGROMONITORING_API_KEY')
        if not self.api_key:
            raise ValueError("Agromonitoring API key is required. Get free key at https://agromonitoring.com/api/get")
        
        self.base_url = "http://api.agromonitoring.com/agro/1.0"
        self.session = requests.Session()
        
    def create_polygon(self, name: str, coordinates: List[List[float]]) -> Optional[str]:
        """
        Create a polygon for monitoring.
        
        Args:
            name (str): Name of the polygon
            coordinates (List[List[float]]): List of [lon, lat] coordinates
            
        Returns:
            Optional[str]: Polygon ID if successful
        """
        polygon_data = {
            "name": name,
            "geo_json": {
                "type": "Feature",
                "properties": {},
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [coordinates]
                }
            }
        }
        
        try:
            response = self.session.post(
                f"{self.base_url}/polygons",
                params={"appid": self.api_key},
                json=polygon_data
            )
            response.raise_for_status()
            
            result = response.json()
            return result.get('id')
            
        except requests.exceptions.RequestException as e:
            print(f"Error creating polygon: {e}")
            return None
    
    def get_satellite_imagery(self, polygon_id: str, start: int, end: int, 
                            resolution: float = 0.001) -> List[Dict]:
        """
        Get satellite imagery for a polygon.
        
        Args:
            polygon_id (str): Polygon ID
            start (int): Start timestamp (Unix)
            end (int): End timestamp (Unix)
            resolution (float): Image resolution
            
        Returns:
            List[Dict]: List of available satellite images
        """
        try:
            response = self.session.get(
                f"{self.base_url}/image/search",
                params={
                    "appid": self.api_key,
                    "polyid": polygon_id,
                    "start": start,
                    "end": end,
                    "resolution": resolution
                }
            )
            response.raise_for_status()
            
            return response.json()
            
        except requests.exceptions.RequestException as e:
            print(f"Error getting satellite imagery: {e}")
            return []
    
    def get_ndvi_image(self, polygon_id: str, start: int, end: int) -> List[Dict]:
        """
        Get NDVI images for a polygon.
        
        Args:
            polygon_id (str): Polygon ID
            start (int): Start timestamp (Unix)
            end (int): End timestamp (Unix)
            
        Returns:
            List[Dict]: List of NDVI images
        """
        try:
            response = self.session.get(
                f"{self.base_url}/image/search",
                params={
                    "appid": self.api_key,
                    "polyid": polygon_id,
                    "start": start,
                    "end": end,
                    "preset": "ndvi"
                }
            )
            response.raise_for_status()
            
            return response.json()
            
        except requests.exceptions.RequestException as e:
            print(f"Error getting NDVI images: {e}")
            return []
    
    def get_evi_image(self, polygon_id: str, start: int, end: int) -> List[Dict]:
        """
        Get EVI images for a polygon.
        
        Args:
            polygon_id (str): Polygon ID
            start (int): Start timestamp (Unix)
            end (int): End timestamp (Unix)
            
        Returns:
            List[Dict]: List of EVI images
        """
        try:
            response = self.session.get(
                f"{self.base_url}/image/search",
                params={
                    "appid": self.api_key,
                    "polyid": polygon_id,
                    "start": start,
                    "end": end,
                    "preset": "evi"
                }
            )
            response.raise_for_status()
            
            return response.json()
            
        except requests.exceptions.RequestException as e:
            print(f"Error getting EVI images: {e}")
            return []


class CopernicusDataSpaceAPI:
    """
    Copernicus Data Space Ecosystem API for free Sentinel-2 data access.
    Completely free access to Sentinel data.
    """
    
    def __init__(self, username: str = None, password: str = None):
        """
        Initialize Copernicus Data Space API client.
        
        Args:
            username (str): Copernicus account username
            password (str): Copernicus account password
        """
        self.username = username or os.getenv('COPERNICUS_USERNAME')
        self.password = password or os.getenv('COPERNICUS_PASSWORD')
        self.base_url = "https://catalogue.dataspace.copernicus.eu/odata/v1"
        self.session = requests.Session()
        self.access_token = None
        
        if self.username and self.password:
            self._authenticate()
    
    def _authenticate(self):
        """Authenticate with Copernicus Data Space."""
        try:
            auth_url = "https://identity.dataspace.copernicus.eu/auth/realms/CDSE/protocol/openid-connect/token"
            
            data = {
                'grant_type': 'password',
                'username': self.username,
                'password': self.password,
                'client_id': 'cdse-public'
            }
            
            response = requests.post(auth_url, data=data)
            response.raise_for_status()
            
            token_data = response.json()
            self.access_token = token_data.get('access_token')
            
            if self.access_token:
                self.session.headers.update({
                    'Authorization': f'Bearer {self.access_token}'
                })
                print("[COPERNICUS] Authentication successful")
            
        except requests.exceptions.RequestException as e:
            print(f"[COPERNICUS] Authentication failed: {e}")
    
    def search_products(self, bbox: List[float], start_date: str, end_date: str, 
                       cloud_cover: int = 20) -> List[Dict]:
        """
        Search for Sentinel-2 products.
        
        Args:
            bbox (List[float]): Bounding box [west, south, east, north]
            start_date (str): Start date in YYYY-MM-DD format
            end_date (str): End date in YYYY-MM-DD format
            cloud_cover (int): Maximum cloud cover percentage
            
        Returns:
            List[Dict]: List of matching products
        """
        try:
            # Build OData filter
            filter_parts = [
                f"Collection/Name eq 'SENTINEL-2'",
                f"OData.CSC.Intersects(area=geography'SRID=4326;POLYGON(({bbox[0]} {bbox[1]},{bbox[2]} {bbox[1]},{bbox[2]} {bbox[3]},{bbox[0]} {bbox[3]},{bbox[0]} {bbox[1]}))')",
                f"ContentDate/Start ge {start_date}T00:00:00.000Z",
                f"ContentDate/Start le {end_date}T23:59:59.999Z",
                f"Attributes/OData.CSC.DoubleAttribute/any(att:att/Name eq 'cloudCover' and att/OData.CSC.DoubleAttribute/Value le {cloud_cover})"
            ]
            
            filter_query = " and ".join(filter_parts)
            
            response = self.session.get(
                f"{self.base_url}/Products",
                params={
                    '$filter': filter_query,
                    '$orderby': 'ContentDate/Start desc',
                    '$top': 100
                }
            )
            response.raise_for_status()
            
            data = response.json()
            return data.get('value', [])
            
        except requests.exceptions.RequestException as e:
            print(f"Error searching Copernicus products: {e}")
            return []


class NASAEarthdataAPI:
    """
    NASA Earthdata API for free satellite data access.
    Provides access to MODIS, Landsat, and other NASA satellite data.
    """
    
    def __init__(self, username: str = None, password: str = None):
        """
        Initialize NASA Earthdata API client.
        
        Args:
            username (str): NASA Earthdata username
            password (str): NASA Earthdata password
        """
        self.username = username or os.getenv('NASA_USERNAME')
        self.password = password or os.getenv('NASA_PASSWORD')
        self.base_url = "https://cmr.earthdata.nasa.gov/search"
        self.session = requests.Session()
        
        if self.username and self.password:
            self.session.auth = (self.username, self.password)
    
    def search_granules(self, bbox: List[float], start_date: str, end_date: str, 
                       collection: str = "C1711961296-LPCLOUD") -> List[Dict]:
        """
        Search for satellite data granules.
        
        Args:
            bbox (List[float]): Bounding box [west, south, east, north]
            start_date (str): Start date in YYYY-MM-DD format
            end_date (str): End date in YYYY-MM-DD format
            collection (str): Collection concept ID (default: Landsat 8-9 OLI/TIRS)
            
        Returns:
            List[Dict]: List of matching granules
        """
        try:
            params = {
                'collection_concept_id': collection,
                'bounding_box': f"{bbox[0]},{bbox[1]},{bbox[2]},{bbox[3]}",
                'temporal': f"{start_date}T00:00:00Z,{end_date}T23:59:59Z",
                'page_size': 100,
                'format': 'json'
            }
            
            response = self.session.get(f"{self.base_url}/granules", params=params)
            response.raise_for_status()
            
            data = response.json()
            return data.get('feed', {}).get('entry', [])
            
        except requests.exceptions.RequestException as e:
            print(f"Error searching NASA granules: {e}")
            return []


class FreeSatelliteDataAcquisition:
    """
    Enhanced data acquisition class that integrates with free satellite APIs.
    Provides fallback options and combines multiple free data sources.
    """
    
    def __init__(self, agromonitoring_key: str = None, copernicus_username: str = None, 
                 copernicus_password: str = None, nasa_username: str = None, nasa_password: str = None):
        """
        Initialize free satellite data acquisition with multiple API options.
        
        Args:
            agromonitoring_key (str): Agromonitoring API key (free tier available)
            copernicus_username (str): Copernicus Data Space username
            copernicus_password (str): Copernicus Data Space password
            nasa_username (str): NASA Earthdata username
            nasa_password (str): NASA Earthdata password
        """
        self.apis = {}
        
        # Initialize Agromonitoring API
        try:
            self.apis['agromonitoring'] = AgromonitoringAPI(agromonitoring_key)
            print("[FREE_SAT] Agromonitoring API initialized")
        except ValueError as e:
            print(f"[FREE_SAT] Agromonitoring API not available: {e}")
        
        # Initialize Copernicus API
        try:
            if copernicus_username and copernicus_password:
                self.apis['copernicus'] = CopernicusDataSpaceAPI(copernicus_username, copernicus_password)
                print("[FREE_SAT] Copernicus Data Space API initialized")
        except Exception as e:
            print(f"[FREE_SAT] Copernicus API not available: {e}")
        
        # Initialize NASA API
        try:
            if nasa_username and nasa_password:
                self.apis['nasa'] = NASAEarthdataAPI(nasa_username, nasa_password)
                print("[FREE_SAT] NASA Earthdata API initialized")
        except Exception as e:
            print(f"[FREE_SAT] NASA API not available: {e}")
        
        if not self.apis:
            print("[FREE_SAT] No APIs available, will use mock data")
    
    def get_sentinel2_data(self, start_date: str, end_date: str, lat: float, lon: float, 
                          cloud_cover_percentage: float = 10) -> List[str]:
        """
        Get Sentinel-2 data using available free APIs or fallback to mock data.
        
        Args:
            start_date (str): Start date in YYYY-MM-DD format
            end_date (str): End date in YYYY-MM-DD format
            lat (float): Latitude of the center point
            lon (float): Longitude of the center point
            cloud_cover_percentage (float): Maximum cloud cover percentage
            
        Returns:
            List[str]: List of data paths or identifiers
        """
        print(f"[FREE_SAT] Searching for satellite data from {start_date} to {end_date} for lat: {lat}, lon: {lon}")
        
        # Try Agromonitoring API first (easiest to use)
        if 'agromonitoring' in self.apis:
            try:
                return self._get_agromonitoring_data(start_date, end_date, lat, lon, cloud_cover_percentage)
            except Exception as e:
                print(f"[FREE_SAT] Agromonitoring failed: {e}")
        
        # Try Copernicus API
        if 'copernicus' in self.apis:
            try:
                return self._get_copernicus_data(start_date, end_date, lat, lon, cloud_cover_percentage)
            except Exception as e:
                print(f"[FREE_SAT] Copernicus failed: {e}")
        
        # Try NASA API
        if 'nasa' in self.apis:
            try:
                return self._get_nasa_data(start_date, end_date, lat, lon, cloud_cover_percentage)
            except Exception as e:
                print(f"[FREE_SAT] NASA failed: {e}")
        
        # Fallback to mock data
        print("[FREE_SAT] All APIs failed, using mock data")
        return self._get_mock_data(start_date, end_date, lat, lon, cloud_cover_percentage)
    
    def _get_agromonitoring_data(self, start_date: str, end_date: str, lat: float, lon: float, 
                                cloud_cover_percentage: float) -> List[str]:
        """Get data from Agromonitoring API."""
        api = self.apis['agromonitoring']
        
        # Create a small polygon around the point
        buffer = 0.01  # ~1km buffer
        coordinates = [
            [lon - buffer, lat - buffer],
            [lon + buffer, lat - buffer],
            [lon + buffer, lat + buffer],
            [lon - buffer, lat + buffer],
            [lon - buffer, lat - buffer]
        ]
        
        # Create polygon
        polygon_name = f"field_{lat}_{lon}_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        polygon_id = api.create_polygon(polygon_name, coordinates)
        
        if not polygon_id:
            raise Exception("Failed to create polygon")
        
        # Convert dates to timestamps
        start_ts = int(datetime.strptime(start_date, '%Y-%m-%d').timestamp())
        end_ts = int(datetime.strptime(end_date, '%Y-%m-%d').timestamp())
        
        # Get satellite imagery
        images = api.get_satellite_imagery(polygon_id, start_ts, end_ts)
        ndvi_images = api.get_ndvi_image(polygon_id, start_ts, end_ts)
        evi_images = api.get_evi_image(polygon_id, start_ts, end_ts)
        
        # Create data directory
        data_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'agromonitoring_data')
        os.makedirs(data_dir, exist_ok=True)
        
        processed_paths = []
        
        # Process and save data
        for i, image in enumerate(images[:5]):  # Limit to 5 images
            item_dir = os.path.join(data_dir, f"image_{i}_{polygon_id}")
            os.makedirs(item_dir, exist_ok=True)
            
            # Combine all data
            combined_data = {
                'satellite_image': image,
                'ndvi_data': ndvi_images[i] if i < len(ndvi_images) else None,
                'evi_data': evi_images[i] if i < len(evi_images) else None,
                'polygon_id': polygon_id,
                'coordinates': {'lat': lat, 'lon': lon},
                'source': 'agromonitoring'
            }
            
            # Save metadata
            with open(os.path.join(item_dir, 'metadata.json'), 'w') as f:
                json.dump(combined_data, f, indent=2)
            
            processed_paths.append(item_dir)
        
        print(f"[FREE_SAT] Agromonitoring: Found {len(processed_paths)} items")
        return processed_paths
    
    def _get_copernicus_data(self, start_date: str, end_date: str, lat: float, lon: float, 
                           cloud_cover_percentage: float) -> List[str]:
        """Get data from Copernicus Data Space API."""
        api = self.apis['copernicus']
        
        # Create bounding box
        buffer = 0.01
        bbox = [lon - buffer, lat - buffer, lon + buffer, lat + buffer]
        
        # Search for products
        products = api.search_products(bbox, start_date, end_date, int(cloud_cover_percentage))
        
        # Create data directory
        data_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'copernicus_data')
        os.makedirs(data_dir, exist_ok=True)
        
        processed_paths = []
        
        for i, product in enumerate(products[:5]):  # Limit to 5 products
            item_dir = os.path.join(data_dir, f"product_{i}_{product.get('Id', 'unknown')}")
            os.makedirs(item_dir, exist_ok=True)
            
            # Save metadata
            metadata = {
                'product': product,
                'coordinates': {'lat': lat, 'lon': lon},
                'source': 'copernicus'
            }
            
            with open(os.path.join(item_dir, 'metadata.json'), 'w') as f:
                json.dump(metadata, f, indent=2)
            
            processed_paths.append(item_dir)
        
        print(f"[FREE_SAT] Copernicus: Found {len(processed_paths)} products")
        return processed_paths
    
    def _get_nasa_data(self, start_date: str, end_date: str, lat: float, lon: float, 
                      cloud_cover_percentage: float) -> List[str]:
        """Get data from NASA Earthdata API."""
        api = self.apis['nasa']
        
        # Create bounding box
        buffer = 0.01
        bbox = [lon - buffer, lat - buffer, lon + buffer, lat + buffer]
        
        # Search for granules
        granules = api.search_granules(bbox, start_date, end_date)
        
        # Create data directory
        data_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'nasa_data')
        os.makedirs(data_dir, exist_ok=True)
        
        processed_paths = []
        
        for i, granule in enumerate(granules[:5]):  # Limit to 5 granules
            item_dir = os.path.join(data_dir, f"granule_{i}_{granule.get('id', 'unknown')}")
            os.makedirs(item_dir, exist_ok=True)
            
            # Save metadata
            metadata = {
                'granule': granule,
                'coordinates': {'lat': lat, 'lon': lon},
                'source': 'nasa'
            }
            
            with open(os.path.join(item_dir, 'metadata.json'), 'w') as f:
                json.dump(metadata, f, indent=2)
            
            processed_paths.append(item_dir)
        
        print(f"[FREE_SAT] NASA: Found {len(processed_paths)} granules")
        return processed_paths
    
    def _get_mock_data(self, start_date: str, end_date: str, lat: float, lon: float, 
                      cloud_cover_percentage: float) -> List[str]:
        """Generate mock data as fallback."""
        print(f"[MOCK] Generating mock satellite data from {start_date} to {end_date} for lat: {lat}, lon: {lon}")
        
        # Parse dates
        start = datetime.strptime(start_date, '%Y-%m-%d')
        end = datetime.strptime(end_date, '%Y-%m-%d')
        
        # Generate mock data paths
        mock_paths = []
        
        # Create a directory for mock data if it doesn't exist
        mock_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'sentinel_data')
        os.makedirs(mock_dir, exist_ok=True)
        
        # Generate one mock product per 5 days in the date range
        current_date = start
        while current_date <= end:
            date_str = current_date.strftime('%Y%m%d')
            product_name = f"S2A_MSIL2A_{date_str}T000000_N0000_R000_T00XXX_20250607T000000"
            product_path = os.path.join(mock_dir, product_name)
            
            # Create a directory for the mock product
            os.makedirs(product_path, exist_ok=True)
            
            # Create a metadata file with vegetation indices
            metadata = {
                "title": product_name,
                "acquisition_date": current_date.isoformat(),
                "cloud_cover_percentage": min(cloud_cover_percentage, 5),  # Always below the threshold
                "coordinates": {
                    "lat": lat,
                    "lon": lon
                },
                "vegetation_indices": {
                    "ndvi": round(0.3 + (0.5 * np.random.random()), 3),  # Mock NDVI 0.3-0.8
                    "evi": round(0.2 + (0.4 * np.random.random()), 3),   # Mock EVI 0.2-0.6
                    "savi": round(0.25 + (0.45 * np.random.random()), 3) # Mock SAVI 0.25-0.7
                },
                "source": "mock"
            }
            
            with open(os.path.join(product_path, "metadata.json"), "w") as f:
                json.dump(metadata, f, indent=2)
            
            mock_paths.append(product_path)
            
            # Advance by 5 days
            current_date = datetime.fromordinal(current_date.toordinal() + 5)
        
        print(f"[MOCK] Generated {len(mock_paths)} mock products")
        return mock_paths


# Create an instance for easy importing
data_acquisition = FreeSatelliteDataAcquisition()

