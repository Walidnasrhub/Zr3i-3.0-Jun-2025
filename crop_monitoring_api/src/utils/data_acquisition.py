import os
import json
from datetime import datetime

class DataAcquisitionMock:
    """
    A mock class for simulating Sentinel-2 data acquisition.
    This is used for development and testing when actual Sentinel-2 data is not available.
    """
    
    def get_sentinel2_data(self, start_date, end_date, lat, lon, cloud_cover_percentage=10):
        """
        Simulates searching for and downloading Sentinel-2 Level 2A data.
        
        Args:
            start_date (str): Start date in YYYY-MM-DD format.
            end_date (str): End date in YYYY-MM-DD format.
            lat (float): Latitude of the center of the area of interest.
            lon (float): Longitude of the center of the area of interest.
            cloud_cover_percentage (int): Maximum cloud cover percentage allowed (0-100).
            
        Returns:
            list: A list of paths to the simulated Sentinel-2 product directories.
        """
        print(f"[MOCK] Searching for Sentinel-2 data from {start_date} to {end_date} for lat: {lat}, lon: {lon}")
        
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
                }
            }
            
            with open(os.path.join(product_path, "metadata.json"), "w") as f:
                json.dump(metadata, f, indent=2)
            
            mock_paths.append(product_path)
            
            # Advance by 5 days
            current_date = datetime.fromordinal(current_date.toordinal() + 5)
        
        print(f"[MOCK] Found {len(mock_paths)} products.")
        return mock_paths

# Create an instance for easy importing
data_acquisition = DataAcquisitionMock()

