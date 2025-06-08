import rasterio
import numpy as np
import xarray as xr
import rioxarray # noqa: F401

def calculate_ndvi(red_band_path, nir_band_path):
    """
    Calculates the Normalized Difference Vegetation Index (NDVI).

    Args:
        red_band_path (str): Path to the Red band (B04) image file.
        nir_band_path (str): Path to the NIR band (B08) image file.

    Returns:
        xarray.DataArray: A DataArray containing the NDVI values.
    """
    with rasterio.open(red_band_path) as red_src,
         rasterio.open(nir_band_path) as nir_src:
        red = red_src.read(1).astype(float)
        nir = nir_src.read(1).astype(float)

        # Avoid division by zero
        ndvi = np.where(
            (nir + red) == 0.,
            0.,
            (nir - red) / (nir + red)
        )
        return xr.DataArray(ndvi, coords=red_src.coords, dims=red_src.dims, attrs=red_src.meta)

def calculate_evi(blue_band_path, red_band_path, nir_band_path):
    """
    Calculates the Enhanced Vegetation Index (EVI).

    Args:
        blue_band_path (str): Path to the Blue band (B02) image file.
        red_band_path (str): Path to the Red band (B04) image file.
        nir_band_path (str): Path to the NIR band (B08) image file.

    Returns:
        xarray.DataArray: A DataArray containing the EVI values.
    """
    with rasterio.open(blue_band_path) as blue_src,
         rasterio.open(red_band_path) as red_src,
         rasterio.open(nir_band_path) as nir_src:
        blue = blue_src.read(1).astype(float)
        red = red_src.read(1).astype(float)
        nir = nir_src.read(1).astype(float)

        # EVI formula: 2.5 * ((NIR - Red) / (NIR + 6 * Red - 7.5 * Blue + 1))
        evi = 2.5 * ((nir - red) / (nir + 6 * red - 7.5 * blue + 1))
        return xr.DataArray(evi, coords=red_src.coords, dims=red_src.dims, attrs=red_src.meta)

def apply_cloud_mask(image_path, s2_scl_path):
    """
    Applies a cloud mask to a Sentinel-2 image using the Scene Classification Map (SCL).

    Args:
        image_path (str): Path to the Sentinel-2 band image file to be masked.
        s2_scl_path (str): Path to the SCL band (B02) image file.

    Returns:
        xarray.DataArray: The masked image DataArray.
    """
    with rasterio.open(image_path) as src,
         rasterio.open(s2_scl_path) as scl_src:
        image = src.read(1).astype(float)
        scl = scl_src.read(1)

        # Sentinel-2 SCL values:
        # 0: No Data
        # 1: Saturated or defective pixel
        # 2: Dark Area Pixels
        # 3: Cloud Shadows
        # 4: Vegetation
        # 5: Not Vegetated
        # 6: Water
        # 7: Unclassified
        # 8: Cloud Medium Probability
        # 9: Cloud High Probability
        # 10: Thin Cirrus
        # 11: Snow / Ice

        # Mask out clouds (8, 9, 10), cloud shadows (3), and no data (0, 1)
        cloud_mask = ~((scl == 0) | (scl == 1) | (scl == 3) | (scl == 8) | (scl == 9) | (scl == 10))

        masked_image = np.where(cloud_mask, image, np.nan) # Use NaN for masked areas
        return xr.DataArray(masked_image, coords=src.coords, dims=src.dims, attrs=src.meta)

if __name__ == "__main__":
    # Example usage (requires actual Sentinel-2 band files and SCL file)
    # This part is for demonstration and testing purposes.
    # In a real scenario, these paths would come from the data acquisition step.
    print("This script provides functions for vegetation index calculation and cloud masking.")
    print("To use it, you need to provide paths to actual Sentinel-2 band files.")
    print("Example: ")
    print("  ndvi_result = calculate_ndvi("path/to/B04.jp2", "path/to/B08.jp2")")
    print("  masked_image = apply_cloud_mask("path/to/B04.jp2", "path/to/SCL.jp2")")


