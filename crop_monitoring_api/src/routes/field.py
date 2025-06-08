from flask import Blueprint, jsonify, request
from src.models.user import Field, db
from flask_jwt_extended import jwt_required, get_jwt_identity
import json
import geopandas as gpd
from shapely.geometry import shape

field_bp = Blueprint("field", __name__)

@field_bp.route("/", methods=["GET"])
@jwt_required()
def get_fields():
    current_user_id = get_jwt_identity()
    fields = Field.query.filter_by(user_id=current_user_id).all()
    return jsonify([field.to_dict() for field in fields])

@field_bp.route("/", methods=["POST"])
@jwt_required()
def create_field():
    current_user_id = get_jwt_identity()
    data = request.json
    
    # Validate required fields
    if not all(k in data for k in ("name", "boundary")):
        return jsonify({"error": "Missing required fields"}), 400
    
    # Validate GeoJSON boundary
    try:
        boundary_json = data["boundary"]
        if isinstance(boundary_json, str):
            boundary_json = json.loads(boundary_json)
        
        # Convert to GeoDataFrame to validate and calculate properties
        gdf = gpd.GeoDataFrame(geometry=[shape(boundary_json["geometry"])], crs="EPSG:4326") # Set CRS to WGS84
        
        # Calculate center coordinates
        centroid = gdf.geometry[0].centroid
        center_lat = centroid.y
        center_lon = centroid.x
        
        # Calculate area in hectares (assuming the coordinates are in WGS84)
        # Convert to UTM for accurate area calculation
        gdf_utm = gdf.to_crs("+proj=utm +zone=33 +datum=WGS84 +units=m +no_defs")
        area_hectares = gdf_utm.area[0] / 10000  # Convert square meters to hectares
        
    except Exception as e:
        return jsonify({"error": f"Invalid GeoJSON boundary: {str(e)}"}), 400
    
    # Create new field
    field = Field(
        name=data["name"],
        description=data.get("description"),
        crop_type=data.get("crop_type"),
        area_hectares=area_hectares,
        boundary=json.dumps(boundary_json),
        center_lat=center_lat,
        center_lon=center_lon,
        user_id=current_user_id
    )
    
    db.session.add(field)
    db.session.commit()
    
    return jsonify(field.to_dict()), 201

@field_bp.route("/<int:field_id>", methods=["GET"])
@jwt_required()
def get_field(field_id):
    current_user_id = get_jwt_identity()
    field = Field.query.filter_by(id=field_id, user_id=current_user_id).first_or_404()
    return jsonify(field.to_dict())

@field_bp.route("/<int:field_id>", methods=["PUT"])
@jwt_required()
def update_field(field_id):
    current_user_id = get_jwt_identity()
    field = Field.query.filter_by(id=field_id, user_id=current_user_id).first_or_404()
    data = request.json
    
    # Update basic fields
    if "name" in data:
        field.name = data["name"]
    if "description" in data:
        field.description = data["description"]
    if "crop_type" in data:
        field.crop_type = data["crop_type"]
    
    # Update boundary if provided
    if "boundary" in data:
        try:
            boundary_json = data["boundary"]
            if isinstance(boundary_json, str):
                boundary_json = json.loads(boundary_json)
            
            # Convert to GeoDataFrame to validate and calculate properties
            gdf = gpd.GeoDataFrame(geometry=[shape(boundary_json["geometry"])], crs="EPSG:4326") # Set CRS to WGS84
            
            # Calculate center coordinates
            centroid = gdf.geometry[0].centroid
            field.center_lat = centroid.y
            field.center_lon = centroid.x
            
            # Calculate area in hectares (assuming the coordinates are in WGS84)
            # Convert to UTM for accurate area calculation
            gdf_utm = gdf.to_crs("+proj=utm +zone=33 +datum=WGS84 +units=m +no_defs")
            field.area_hectares = gdf_utm.area[0] / 10000  # Convert square meters to hectares
            
            field.boundary = json.dumps(boundary_json)
            
        except Exception as e:
            return jsonify({"error": f"Invalid GeoJSON boundary: {str(e)}"}), 400
    
    db.session.commit()
    return jsonify(field.to_dict())

@field_bp.route("/<int:field_id>", methods=["DELETE"])
@jwt_required()
def delete_field(field_id):
    current_user_id = get_jwt_identity()
    field = Field.query.filter_by(id=field_id, user_id=current_user_id).first_or_404()
    
    db.session.delete(field)
    db.session.commit()
    
    return "", 204



