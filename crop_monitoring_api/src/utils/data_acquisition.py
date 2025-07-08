# Import the new free satellite API integration
from .free_satellite_api import FreeSatelliteDataAcquisition

# Create an instance for easy importing
# This replaces the mock data acquisition with real free satellite APIs
data_acquisition = FreeSatelliteDataAcquisition()

