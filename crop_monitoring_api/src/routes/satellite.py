from flask import Blueprint, jsonify, request, current_app
from src.models.user import Field, SatelliteImage, db
from flask_jwt_extended import jwt_required, get_jwt_identity
import os
import sys
import json
from datetime import datetime

# Import the mock data acquisition and processing modules
from src.utils.data_acquisition import data_acquisition
from src.utils.data_processing import calculate_ndvi, calculate_evi, apply_cloud_mask

satellite_bp = Blueprint('satellite', __name__)

@satellite_bp.route('/fields/<int:field_id>/satellite-images', methods=['GET'])
@jwt_required()
def get_satellite_images(field_id):
    current_user_id = get_jwt_identity()
    
    # Verify field belongs to current user
    field = Field.query.filter_by(id=field_id, user_id=current_user_id).first_or_404()
    
    # Get all satellite images for this field
    images = SatelliteImage.query.filter_by(field_id=field_id).order_by(SatelliteImage.acquisition_date.desc()).all()
    
    return jsonify([image.to_dict() for image in images])

@satellite_bp.route('/fields/<int:field_id>/satellite-images/<int:image_id>', methods=['GET'])
@jwt_required()
def get_satellite_image(field_id, image_id):
    current_user_id = get_jwt_identity()
    
    # Verify field belongs to current user
    field = Field.query.filter_by(id=field_id, user_id=current_user_id).first_or_404()
    
    # Get the specific satellite image
    image = SatelliteImage.query.filter_by(id=image_id, field_id=field_id).first_or_404()
    
    return jsonify(image.to_dict())

@satellite_bp.route('/fields/<int:field_id>/fetch-satellite-data', methods=['POST'])
@jwt_required()
def fetch_satellite_data(field_id):
    current_user_id = get_jwt_identity()
    
    # Verify field belongs to current user
    field = Field.query.filter_by(id=field_id, user_id=current_user_id).first_or_404()
    
    data = request.json
    
    # Validate required fields
    if not all(k in data for k in ('start_date', 'end_date')):
        return jsonify({'error': 'Missing required fields'}), 400
    
    try:
        # Parse dates
        start_date = data['start_date']
        end_date = data['end_date']
        cloud_cover = data.get('cloud_cover', 20)  # Default to 20% max cloud cover
        
        # Get field center coordinates
        center_lat = field.center_lat
        center_lon = field.center_lon
        
        # Fetch Sentinel-2 data using the mock data acquisition module
        downloaded_paths = data_acquisition.get_sentinel2_data(start_date, end_date, center_lat, center_lon, cloud_cover)
        
        if not downloaded_paths:
            return jsonify({'message': 'No satellite images found for the specified criteria'}), 404
        
        # Process each downloaded image
        processed_images = []
        for path in downloaded_paths:
            # Read the metadata file
            try:
                with open(os.path.join(path, "metadata.json"), "r") as f:
                    metadata = json.load(f)
                
                acquisition_date = datetime.fromisoformat(metadata['acquisition_date'])
                cloud_cover_percentage = metadata.get('cloud_cover_percentage', 10.0)
                
                # Create a new satellite image record
                image = SatelliteImage(
                    acquisition_date=acquisition_date,
                    cloud_cover_percentage=cloud_cover_percentage,
                    satellite="Sentinel-2",
                    product_type="L2A",
                    raw_data_path=path,
                    ndvi_path=f"{path}_ndvi",  # Placeholder
                    evi_path=f"{path}_evi",  # Placeholder
                    ndvi_min=0.1,  # Placeholder
                    ndvi_max=0.9,  # Placeholder
                    ndvi_mean=0.5,  # Placeholder
                    evi_min=0.1,  # Placeholder
                    evi_max=0.9,  # Placeholder
                    evi_mean=0.5,  # Placeholder
                    field_id=field_id
                )
                
                db.session.add(image)
                processed_images.append(image)
                
            except Exception as e:
                print(f"Error processing image at {path}: {str(e)}")
                continue
        
        db.session.commit()
        
        return jsonify({
            'message': f'Successfully processed {len(processed_images)} satellite images',
            'images': [image.to_dict() for image in processed_images]
        })
        
    except Exception as e:
        return jsonify({'error': f'Error processing satellite data: {str(e)}'}), 500

@satellite_bp.route('/fields/<int:field_id>/vegetation-indices', methods=['GET'])
@jwt_required()
def get_vegetation_indices(field_id):
    current_user_id = get_jwt_identity()
    
    # Verify field belongs to current user
    field = Field.query.filter_by(id=field_id, user_id=current_user_id).first_or_404()
    
    # Get query parameters
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')
    index_type = request.args.get('index_type', 'ndvi')  # Default to NDVI
    
    # Build query
    query = SatelliteImage.query.filter_by(field_id=field_id)
    
    if start_date:
        query = query.filter(SatelliteImage.acquisition_date >= datetime.strptime(start_date, '%Y-%m-%d'))
    
    if end_date:
        query = query.filter(SatelliteImage.acquisition_date <= datetime.strptime(end_date, '%Y-%m-%d'))
    
    # Get images and extract relevant index data
    images = query.order_by(SatelliteImage.acquisition_date).all()
    
    if index_type.lower() == 'ndvi':
        indices = [{
            'date': image.acquisition_date.isoformat(),
            'min': image.ndvi_min,
            'max': image.ndvi_max,
            'mean': image.ndvi_mean,
            'image_id': image.id
        } for image in images]
    elif index_type.lower() == 'evi':
        indices = [{
            'date': image.acquisition_date.isoformat(),
            'min': image.evi_min,
            'max': image.evi_max,
            'mean': image.evi_mean,
            'image_id': image.id
        } for image in images]
    else:
        return jsonify({'error': 'Invalid index type. Supported types: ndvi, evi'}), 400
    
    return jsonify({
        'field_id': field_id,
        'field_name': field.name,
        'index_type': index_type,
        'data': indices
    })

