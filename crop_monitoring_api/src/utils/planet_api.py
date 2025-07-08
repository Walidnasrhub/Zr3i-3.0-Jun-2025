import os
import json
import requests
from datetime import datetime, timedelta
import numpy as np
from typing import List, Dict, Optional, Tuple

class PlanetAPI:
    """
    Planet API integration for real-time satellite imagery and vegetation indices.
    Provides access to Planet's satellite data including PlanetScope and Sentinel-2.
    """
    
    def __init__(self, api_key: str = None):
        """
        Initialize Planet API client.
        
        Args:
            api_key (str): Planet API key. If not provided, will look for PLANET_API_KEY environment variable.
        """
        self.api_key = api_key or os.getenv('PLANET_API_KEY')
        if not self.api_key:
            raise ValueError("Planet API key is required. Set PLANET_API_KEY environment variable or pass api_key parameter.")
        
        self.base_url = "https://api.planet.com"
        self.session = requests.Session()
        self.session.auth = (self.api_key, '')
        
    def search_items(self, geometry: Dict, start_date: str, end_date: str, 
                    item_types: List[str] = None, cloud_cover: float = 0.2) -> List[Dict]:
        """
        Search for Planet items (satellite images) based on criteria.
        
        Args:
            geometry (Dict): GeoJSON geometry defining the area of interest
            start_date (str): Start date in YYYY-MM-DD format
            end_date (str): End date in YYYY-MM-DD format
            item_types (List[str]): List of item types (e.g., ['PSScene', 'Sentinel2L1C'])
            cloud_cover (float): Maximum cloud cover percentage (0.0 to 1.0)
            
        Returns:
            List[Dict]: List of matching items
        """
        if item_types is None:
            item_types = ['PSScene4Band', 'Sentinel2L1C']
        
        # Build search filter
        search_filter = {
            "type": "AndFilter",
            "config": [
                {
                    "type": "GeometryFilter",
                    "field_name": "geometry",
                    "config": geometry
                },
                {
                    "type": "DateRangeFilter",
                    "field_name": "acquired",
                    "config": {
                        "gte": f"{start_date}T00:00:00.000Z",
                        "lte": f"{end_date}T23:59:59.999Z"
                    }
                },
                {
                    "type": "RangeFilter",
                    "field_name": "cloud_cover",
                    "config": {
                        "lte": cloud_cover
                    }
                }
            ]
        }
        
        # Search request
        search_request = {
            "item_types": item_types,
            "filter": search_filter
        }
        
        try:
            response = self.session.post(
                f"{self.base_url}/data/v1/quick-search",
                json=search_request
            )
            response.raise_for_status()
            
            results = response.json()
            return results.get('features', [])
            
        except requests.exceptions.RequestException as e:
            print(f"Error searching Planet items: {e}")
            return []
    
    def get_item_assets(self, item_id: str, item_type: str) -> Dict:
        """
        Get available assets for a specific item.
        
        Args:
            item_id (str): Planet item ID
            item_type (str): Item type (e.g., 'PSScene4Band')
            
        Returns:
            Dict: Available assets for the item
        """
        try:
            response = self.session.get(
                f"{self.base_url}/data/v1/item-types/{item_type}/items/{item_id}/assets"
            )
            response.raise_for_status()
            return response.json()
            
        except requests.exceptions.RequestException as e:
            print(f"Error getting item assets: {e}")
            return {}
    
    def activate_asset(self, item_id: str, item_type: str, asset_type: str) -> bool:
        """
        Activate an asset for download.
        
        Args:
            item_id (str): Planet item ID
            item_type (str): Item type
            asset_type (str): Asset type (e.g., 'analytic', 'visual')
            
        Returns:
            bool: True if activation successful
        """
        try:
            response = self.session.get(
                f"{self.base_url}/data/v1/item-types/{item_type}/items/{item_id}/assets/{asset_type}/activate",
                allow_redirects=False
            )
            
            # 202 means activation started, 204 means already active
            return response.status_code in [202, 204]
            
        except requests.exceptions.RequestException as e:
            print(f"Error activating asset: {e}")
            return False
    
    def download_asset(self, item_id: str, item_type: str, asset_type: str, 
                      download_path: str) -> Optional[str]:
        """
        Download an activated asset.
        
        Args:
            item_id (str): Planet item ID
            item_type (str): Item type
            asset_type (str): Asset type
            download_path (str): Local path to save the file
            
        Returns:
            Optional[str]: Path to downloaded file if successful
        """
        try:
            # Get asset info
            assets = self.get_item_assets(item_id, item_type)
            if asset_type not in assets:
                print(f"Asset type {asset_type} not available")
                return None
            
            asset = assets[asset_type]
            if asset['status'] != 'active':
                print(f"Asset {asset_type} is not active. Status: {asset['status']}")
                return None
            
            # Download the asset
            download_url = asset['location']
            response = self.session.get(download_url, stream=True)
            response.raise_for_status()
            
            os.makedirs(os.path.dirname(download_path), exist_ok=True)
            
            with open(download_path, 'wb') as f:
                for chunk in response.iter_content(chunk_size=8192):
                    f.write(chunk)
            
            return download_path
            
        except requests.exceptions.RequestException as e:
            print(f"Error downloading asset: {e}")
            return None
    
    def calculate_ndvi(self, red_band: np.ndarray, nir_band: np.ndarray) -> np.ndarray:
        """
        Calculate NDVI (Normalized Difference Vegetation Index).
        
        Args:
            red_band (np.ndarray): Red band values
            nir_band (np.ndarray): Near-infrared band values
            
        Returns:
            np.ndarray: NDVI values
        """
        # Avoid division by zero
        denominator = nir_band + red_band
        ndvi = np.where(denominator != 0, (nir_band - red_band) / denominator, 0)
        return np.clip(ndvi, -1, 1)
    
    def calculate_evi(self, red_band: np.ndarray, nir_band: np.ndarray, 
                     blue_band: np.ndarray, G: float = 2.5, C1: float = 6.0, 
                     C2: float = 7.5, L: float = 1.0) -> np.ndarray:
        """
        Calculate EVI (Enhanced Vegetation Index).
        
        Args:
            red_band (np.ndarray): Red band values
            nir_band (np.ndarray): Near-infrared band values
            blue_band (np.ndarray): Blue band values
            G, C1, C2, L (float): EVI coefficients
            
        Returns:
            np.ndarray: EVI values
        """
        denominator = nir_band + C1 * red_band - C2 * blue_band + L
        evi = np.where(denominator != 0, G * (nir_band - red_band) / denominator, 0)
        return np.clip(evi, -1, 1)
    
    def calculate_savi(self, red_band: np.ndarray, nir_band: np.ndarray, 
                      L: float = 0.5) -> np.ndarray:
        """
        Calculate SAVI (Soil Adjusted Vegetation Index).
        
        Args:
            red_band (np.ndarray): Red band values
            nir_band (np.ndarray): Near-infrared band values
            L (float): Soil brightness correction factor
            
        Returns:
            np.ndarray: SAVI values
        """
        denominator = nir_band + red_band + L
        savi = np.where(denominator != 0, (1 + L) * (nir_band - red_band) / denominator, 0)
        return np.clip(savi, -1, 1)
    
    def get_satellite_data(self, start_date: str, end_date: str, lat: float, lon: float, 
                          cloud_cover_percentage: float = 20, buffer_km: float = 1.0) -> List[Dict]:
        """
        Get satellite data for a specific location and time range.
        
        Args:
            start_date (str): Start date in YYYY-MM-DD format
            end_date (str): End date in YYYY-MM-DD format
            lat (float): Latitude of the center point
            lon (float): Longitude of the center point
            cloud_cover_percentage (float): Maximum cloud cover percentage (0-100)
            buffer_km (float): Buffer around the point in kilometers
            
        Returns:
            List[Dict]: List of satellite data items with metadata
        """
        # Convert buffer from km to degrees (approximate)
        buffer_deg = buffer_km / 111.0  # 1 degree ≈ 111 km
        
        # Create bounding box geometry
        geometry = {
            "type": "Polygon",
            "coordinates": [[
                [lon - buffer_deg, lat - buffer_deg],
                [lon + buffer_deg, lat - buffer_deg],
                [lon + buffer_deg, lat + buffer_deg],
                [lon - buffer_deg, lat + buffer_deg],
                [lon - buffer_deg, lat - buffer_deg]
            ]]
        }
        
        # Search for items
        items = self.search_items(
            geometry=geometry,
            start_date=start_date,
            end_date=end_date,
            cloud_cover=cloud_cover_percentage / 100.0
        )
        
        # Process items and extract metadata
        processed_items = []
        for item in items:
            properties = item.get('properties', {})
            
            processed_item = {
                'id': item.get('id'),
                'item_type': properties.get('item_type'),
                'acquisition_date': properties.get('acquired'),
                'cloud_cover_percentage': properties.get('cloud_cover', 0) * 100,
                'satellite': properties.get('satellite_id', 'Unknown'),
                'geometry': item.get('geometry'),
                'assets': self.get_item_assets(item.get('id'), properties.get('item_type'))
            }
            
            processed_items.append(processed_item)
        
        return processed_items


class PlanetDataAcquisition:
    """
    Enhanced data acquisition class that integrates with Planet API.
    Replaces the mock data acquisition with real Planet API calls.
    """
    
    def __init__(self, api_key: str = None):
        """
        Initialize Planet data acquisition.
        
        Args:
            api_key (str): Planet API key
        """
        try:
            self.planet_api = PlanetAPI(api_key)
            self.use_planet = True
            print("[PLANET] Planet API initialized successfully")
        except ValueError as e:
            print(f"[WARNING] Planet API not available: {e}")
            print("[WARNING] Falling back to mock data")
            self.use_planet = False
    
    def get_sentinel2_data(self, start_date: str, end_date: str, lat: float, lon: float, 
                          cloud_cover_percentage: float = 10) -> List[str]:
        """
        Get Sentinel-2 data using Planet API or fallback to mock data.
        
        Args:
            start_date (str): Start date in YYYY-MM-DD format
            end_date (str): End date in YYYY-MM-DD format
            lat (float): Latitude of the center point
            lon (float): Longitude of the center point
            cloud_cover_percentage (float): Maximum cloud cover percentage
            
        Returns:
            List[str]: List of data paths or identifiers
        """
        if self.use_planet:
            return self._get_planet_data(start_date, end_date, lat, lon, cloud_cover_percentage)
        else:
            return self._get_mock_data(start_date, end_date, lat, lon, cloud_cover_percentage)
    
    def _get_planet_data(self, start_date: str, end_date: str, lat: float, lon: float, 
                        cloud_cover_percentage: float) -> List[str]:
        """
        Get real data from Planet API.
        """
        print(f"[PLANET] Searching for satellite data from {start_date} to {end_date} for lat: {lat}, lon: {lon}")
        
        try:
            items = self.planet_api.get_satellite_data(
                start_date=start_date,
                end_date=end_date,
                lat=lat,
                lon=lon,
                cloud_cover_percentage=cloud_cover_percentage
            )
            
            # Create data directory
            data_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'planet_data')
            os.makedirs(data_dir, exist_ok=True)
            
            processed_paths = []
            for item in items:
                # Create item directory
                item_dir = os.path.join(data_dir, item['id'])
                os.makedirs(item_dir, exist_ok=True)
                
                # Save metadata
                metadata_path = os.path.join(item_dir, 'metadata.json')
                with open(metadata_path, 'w') as f:
                    json.dump(item, f, indent=2)
                
                processed_paths.append(item_dir)
            
            print(f"[PLANET] Found {len(processed_paths)} items")
            return processed_paths
            
        except Exception as e:
            print(f"[PLANET] Error fetching data: {e}")
            print("[PLANET] Falling back to mock data")
            return self._get_mock_data(start_date, end_date, lat, lon, cloud_cover_percentage)
    
    def _get_mock_data(self, start_date: str, end_date: str, lat: float, lon: float, 
                      cloud_cover_percentage: float) -> List[str]:
        """
        Generate mock data as fallback.
        """
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
            
            # Create a metadata file
            metadata = {
                "title": product_name,
                "acquisition_date": current_date.isoformat(),
                "cloud_cover_percentage": min(cloud_cover_percentage, 5),  # Always below the threshold
                "coordinates": {
                    "lat": lat,
                    "lon": lon
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
data_acquisition = PlanetDataAcquisition()

