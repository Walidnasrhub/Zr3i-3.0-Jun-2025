from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationship with Field
    fields = db.relationship('Field', backref='owner', lazy=True, cascade="all, delete-orphan")

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def __repr__(self):
        return f'<User {self.username}>'

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

class Field(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=True)
    crop_type = db.Column(db.String(50), nullable=True)
    area_hectares = db.Column(db.Float, nullable=True)
    
    # GeoJSON boundary stored as text
    boundary = db.Column(db.Text, nullable=False)
    
    # Center coordinates for quick reference
    center_lat = db.Column(db.Float, nullable=False)
    center_lon = db.Column(db.Float, nullable=False)
    
    # Foreign key to User
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationship with SatelliteImage
    satellite_images = db.relationship('SatelliteImage', backref='field', lazy=True, cascade="all, delete-orphan")

    def __repr__(self):
        return f'<Field {self.name}>'

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'crop_type': self.crop_type,
            'area_hectares': self.area_hectares,
            'boundary': self.boundary,
            'center_lat': self.center_lat,
            'center_lon': self.center_lon,
            'user_id': self.user_id,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

class SatelliteImage(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    
    # Metadata
    acquisition_date = db.Column(db.DateTime, nullable=False)
    cloud_cover_percentage = db.Column(db.Float, nullable=True)
    satellite = db.Column(db.String(20), default="Sentinel-2")
    product_type = db.Column(db.String(20), default="L2A")
    
    # File paths
    raw_data_path = db.Column(db.String(255), nullable=True)
    ndvi_path = db.Column(db.String(255), nullable=True)
    evi_path = db.Column(db.String(255), nullable=True)
    
    # Statistics
    ndvi_min = db.Column(db.Float, nullable=True)
    ndvi_max = db.Column(db.Float, nullable=True)
    ndvi_mean = db.Column(db.Float, nullable=True)
    evi_min = db.Column(db.Float, nullable=True)
    evi_max = db.Column(db.Float, nullable=True)
    evi_mean = db.Column(db.Float, nullable=True)
    
    # Foreign key to Field
    field_id = db.Column(db.Integer, db.ForeignKey('field.id'), nullable=False)
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self):
        return f'<SatelliteImage {self.acquisition_date} for Field {self.field_id}>'

    def to_dict(self):
        return {
            'id': self.id,
            'acquisition_date': self.acquisition_date.isoformat() if self.acquisition_date else None,
            'cloud_cover_percentage': self.cloud_cover_percentage,
            'satellite': self.satellite,
            'product_type': self.product_type,
            'ndvi_min': self.ndvi_min,
            'ndvi_max': self.ndvi_max,
            'ndvi_mean': self.ndvi_mean,
            'evi_min': self.evi_min,
            'evi_max': self.evi_max,
            'evi_mean': self.evi_mean,
            'field_id': self.field_id,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

