from flask import Blueprint, jsonify, request
from src.models.user import User, db
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from datetime import timedelta

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.json
    
    # Check if required fields are present
    if not all(k in data for k in ('username', 'email', 'password')):
        return jsonify({'error': 'Missing required fields'}), 400
    
    # Check if user already exists
    if User.query.filter_by(username=data['username']).first():
        return jsonify({'error': 'Username already exists'}), 409
    
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'Email already exists'}), 409
    
    # Create new user
    user = User(username=data['username'], email=data['email'])
    user.set_password(data['password'])
    
    db.session.add(user)
    db.session.commit()
    
    # Generate access token
    access_token = create_access_token(
        identity=user.id,
        expires_delta=timedelta(days=1)
    )
    
    return jsonify({
        'message': 'User registered successfully',
        'user': user.to_dict(),
        'access_token': access_token
    }), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    
    # Check if required fields are present
    if not all(k in data for k in ('username', 'password')):
        return jsonify({'error': 'Missing username or password'}), 400
    
    # Find user by username
    user = User.query.filter_by(username=data['username']).first()
    
    # Check if user exists and password is correct
    if not user or not user.check_password(data['password']):
        return jsonify({'error': 'Invalid username or password'}), 401
    
    # Generate access token
    access_token = create_access_token(
        identity=user.id,
        expires_delta=timedelta(days=1)
    )
    
    return jsonify({
        'message': 'Login successful',
        'user': user.to_dict(),
        'access_token': access_token
    }), 200

@auth_bp.route('/profile', methods=['GET'])
@jwt_required()
def profile():
    current_user_id = get_jwt_identity()
    user = User.query.get_or_404(current_user_id)
    
    return jsonify({
        'user': user.to_dict()
    }), 200

@auth_bp.route('/change-password', methods=['PUT'])
@jwt_required()
def change_password():
    current_user_id = get_jwt_identity()
    user = User.query.get_or_404(current_user_id)
    
    data = request.json
    
    # Check if required fields are present
    if not all(k in data for k in ('current_password', 'new_password')):
        return jsonify({'error': 'Missing current or new password'}), 400
    
    # Check if current password is correct
    if not user.check_password(data['current_password']):
        return jsonify({'error': 'Current password is incorrect'}), 401
    
    # Update password
    user.set_password(data['new_password'])
    db.session.commit()
    
    return jsonify({
        'message': 'Password updated successfully'
    }), 200

