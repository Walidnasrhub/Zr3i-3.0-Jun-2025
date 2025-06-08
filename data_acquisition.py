import os
from eodag import EODataAccessGateway
from eodag.api.core import EODataAccessGateway
from eodag.config import load_config

# Load eodag configuration from default locations or a specified path
# For Copernicus Data Space Ecosystem, ensure your eodag.yml is configured
# with the 'cop_dataspace' provider and your credentials.
# Example eodag.yml snippet for cop_dataspace:
# providers:
#   cop_dataspace:
#     auth:
#       type: oauth
#       client_id: 'cdse-public'
#       token_url: 'https://identity.dataspace.copernicus.eu/auth/realms/CDSE/protocol/openid-connect/token'
#       username: YOUR_CDSE_USERNAME
#       password: YOUR_CDSE_PASSWORD

# It's recommended to set username/password as environment variables for security
# For example: export CDSE_USERNAME='your_username' and export CDSE_PASSWORD='your_password'

# Initialize EODAG
dag = EODataAccessGateway()

def get_sentinel2_data(start_date, end_date, lat, lon, cloud_cover_percentage=10):
    """
    Searches for and downloads Sentinel-2 Level 2A data for a given area and time range.

    Args:
        start_date (str): Start date in YYYY-MM-DD format.
        end_date (str): End date in YYYY-MM-DD format.
        lat (float): Latitude of the center of the area of interest.
        lon (float): Longitude of the center of the area of interest.
        cloud_cover_percentage (int): Maximum cloud cover percentage allowed (0-100).

    Returns:
        list: A list of paths to the downloaded Sentinel-2 product directories.
    """
    print(f"Searching for Sentinel-2 data from {start_date} to {end_date} for lat: {lat}, lon: {lon} with max cloud cover: {cloud_cover_percentage}%")

    # Define the area of interest as a small bounding box around the lat/lon
    # For a real application, this would be a polygon representing the field boundary
    delta = 0.01 # degrees, roughly 1.1 km at the equator
    geom = {
        'type': 'Polygon',
        'coordinates': [
            [
                [lon - delta, lat - delta],
                [lon + delta, lat - delta],
                [lon + delta, lat + delta],
                [lon - delta, lat + delta],
                [lon - delta, lat - delta]
            ]
        ]
    }

    try:
        products = dag.search(
            productType='S2_MSI_L2A',
            geom=geom,
            startDate=start_date,
            endDate=end_date,
            cloudCover=cloud_cover_percentage,
            # provider='cop_dataspace' # Uncomment if you have multiple providers and want to force this one
        )
        print(f"Found {len(products)} products.")

        downloaded_paths = []
        for product in products:
            print(f"Downloading product: {product.properties['title']}")
            # Download to a specific directory, e.g., 'sentinel_data'
            download_path = dag.download(product, outputs_prefix='sentinel_data')
            downloaded_paths.append(download_path)
            print(f"Downloaded to: {download_path}")
        return downloaded_paths

    except Exception as e:
        print(f"An error occurred during data acquisition: {e}")
        return []

if __name__ == "__main__":
    # Example usage:
    # Replace with actual field coordinates and desired dates
    example_lat = 52.52
    example_lon = 13.37
    example_start_date = '2023-06-01'
    example_end_date = '2023-06-30'

    # Before running, ensure you have configured eodag with your Copernicus Data Space Ecosystem credentials.
    # You can set them as environment variables: CDSE_USERNAME and CDSE_PASSWORD
    # Or configure them in ~/.config/eodag/eodag.yml

    # For testing, you might need to create a dummy eodag.yml if you don't have one
    # and set dummy credentials or use a public provider if available for testing.

    # For this example, we'll try to use environment variables.
    # Make sure to replace with your actual credentials or set environment variables.
    # For security, do NOT hardcode your credentials here in a real application.
    if 'CDSE_USERNAME' not in os.environ or 'CDSE_PASSWORD' not in os.environ:
        print("Please set CDSE_USERNAME and CDSE_PASSWORD environment variables or configure eodag.yml")
        print("You can create a dummy eodag.yml for testing if you don't have real credentials:")
        print("  mkdir -p ~/.config/eodag/")
        print("  echo \"providers:\" > ~/.config/eodag/eodag.yml")
        print("  echo \"  cop_dataspace:\" >> ~/.config/eodag/eodag.yml")
        print("  echo \"    auth:\" >> ~/.config/eodag/eodag.yml")
        print("  echo \"      type: oauth\" >> ~/.config/eodag/eodag.yml")
        print("  echo \"      client_id: 'cdse-public'\" >> ~/.config/eodag/eodag.yml")
        print("  echo \"      token_url: 'https://identity.dataspace.copernicus.eu/auth/realms/CDSE/protocol/openid-connect/token'\" >> ~/.config/eodag/eodag.yml")
        print("  echo \"      username: YOUR_CDSE_USERNAME\" >> ~/.config/eodag/eodag.yml")
        print("  echo \"      password: YOUR_CDSE_PASSWORD\" >> ~/.config/eodag/eodag.yml")
        exit()

    downloaded_products = get_sentinel2_data(example_start_date, example_end_date, example_lat, example_lon)
    if downloaded_products:
        print("Successfully downloaded products:")
        for path in downloaded_products:
            print(path)
    else:
        print("No products downloaded or an error occurred.")


