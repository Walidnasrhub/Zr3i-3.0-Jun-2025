from flask import Blueprint, request, jsonify
from src.models.user import db, Affiliate, AffiliateActivityLog
import json
from datetime import datetime

affiliate_bp = Blueprint('affiliate', __name__)

@affiliate_bp.route('/affiliates', methods=['POST'])
def create_affiliate():
    """Create a new affiliate"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['email', 'first_name', 'last_name']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'{field} is required'}), 400
        
        # Check if email already exists
        existing_affiliate = Affiliate.query.filter_by(email=data['email']).first()
        if existing_affiliate:
            return jsonify({'error': 'Email already registered as affiliate'}), 409
        
        # Create new affiliate
        affiliate = Affiliate(
            user_id=data.get('user_id'),
            email=data['email'],
            first_name=data['first_name'],
            last_name=data['last_name'],
            company_name=data.get('company_name'),
            phone=data.get('phone'),
            website=data.get('website'),
            commission_rate=data.get('commission_rate', 20.00),
            payout_method=data.get('payout_method', 'bank_transfer'),
            payout_details=json.dumps(data.get('payout_details', {})),
            tax_id=data.get('tax_id'),
            address_line1=data.get('address_line1'),
            address_line2=data.get('address_line2'),
            city=data.get('city'),
            state=data.get('state'),
            postal_code=data.get('postal_code'),
            country=data.get('country'),
            notes=data.get('notes')
        )
        
        db.session.add(affiliate)
        db.session.commit()
        
        # Log the registration activity
        log_activity(affiliate.id, 'registration', 'Affiliate account created', request)
        
        return jsonify({
            'message': 'Affiliate created successfully',
            'affiliate': affiliate.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@affiliate_bp.route('/affiliates', methods=['GET'])
def get_affiliates():
    """Get all affiliates with optional filtering"""
    try:
        # Query parameters for filtering
        status = request.args.get('status')
        page = int(request.args.get('page', 1))
        per_page = int(request.args.get('per_page', 20))
        
        query = Affiliate.query
        
        if status:
            query = query.filter(Affiliate.status == status)
        
        # Paginate results
        affiliates = query.paginate(
            page=page, 
            per_page=per_page, 
            error_out=False
        )
        
        return jsonify({
            'affiliates': [affiliate.to_dict() for affiliate in affiliates.items],
            'pagination': {
                'page': page,
                'per_page': per_page,
                'total': affiliates.total,
                'pages': affiliates.pages,
                'has_next': affiliates.has_next,
                'has_prev': affiliates.has_prev
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@affiliate_bp.route('/affiliates/<int:affiliate_id>', methods=['GET'])
def get_affiliate(affiliate_id):
    """Get a specific affiliate by ID"""
    try:
        affiliate = Affiliate.query.get_or_404(affiliate_id)
        return jsonify({'affiliate': affiliate.to_dict()}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@affiliate_bp.route('/affiliates/<int:affiliate_id>', methods=['PUT'])
def update_affiliate(affiliate_id):
    """Update an affiliate"""
    try:
        affiliate = Affiliate.query.get_or_404(affiliate_id)
        data = request.get_json()
        
        # Update fields if provided
        updatable_fields = [
            'first_name', 'last_name', 'company_name', 'phone', 'website',
            'commission_rate', 'status', 'payout_method', 'tax_id',
            'address_line1', 'address_line2', 'city', 'state', 'postal_code',
            'country', 'notes'
        ]
        
        for field in updatable_fields:
            if field in data:
                if field == 'payout_details':
                    setattr(affiliate, field, json.dumps(data[field]))
                else:
                    setattr(affiliate, field, data[field])
        
        affiliate.updated_at = datetime.utcnow()
        db.session.commit()
        
        # Log the update activity
        log_activity(affiliate.id, 'profile_update', 'Affiliate profile updated', request)
        
        return jsonify({
            'message': 'Affiliate updated successfully',
            'affiliate': affiliate.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@affiliate_bp.route('/affiliates/<int:affiliate_id>/status', methods=['PUT'])
def update_affiliate_status(affiliate_id):
    """Update affiliate status (approve, suspend, etc.)"""
    try:
        affiliate = Affiliate.query.get_or_404(affiliate_id)
        data = request.get_json()
        
        if 'status' not in data:
            return jsonify({'error': 'Status is required'}), 400
        
        valid_statuses = ['pending', 'active', 'suspended', 'terminated']
        if data['status'] not in valid_statuses:
            return jsonify({'error': f'Invalid status. Must be one of: {valid_statuses}'}), 400
        
        old_status = affiliate.status
        affiliate.status = data['status']
        affiliate.updated_at = datetime.utcnow()
        
        db.session.commit()
        
        # Log the status change
        log_activity(
            affiliate.id, 
            'status_change', 
            f'Status changed from {old_status} to {data["status"]}',
            request
        )
        
        return jsonify({
            'message': 'Affiliate status updated successfully',
            'affiliate': affiliate.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@affiliate_bp.route('/affiliates/<int:affiliate_id>', methods=['DELETE'])
def delete_affiliate(affiliate_id):
    """Delete an affiliate (soft delete by setting status to terminated)"""
    try:
        affiliate = Affiliate.query.get_or_404(affiliate_id)
        
        # Soft delete by setting status to terminated
        affiliate.status = 'terminated'
        affiliate.updated_at = datetime.utcnow()
        
        db.session.commit()
        
        # Log the deletion activity
        log_activity(affiliate.id, 'account_terminated', 'Affiliate account terminated', request)
        
        return jsonify({'message': 'Affiliate account terminated successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@affiliate_bp.route('/affiliates/referral-code/<referral_code>', methods=['GET'])
def get_affiliate_by_referral_code(referral_code):
    """Get affiliate by referral code"""
    try:
        affiliate = Affiliate.query.filter_by(referral_code=referral_code).first()
        
        if not affiliate:
            return jsonify({'error': 'Invalid referral code'}), 404
        
        if affiliate.status != 'active':
            return jsonify({'error': 'Affiliate account is not active'}), 403
        
        return jsonify({'affiliate': affiliate.to_dict()}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@affiliate_bp.route('/affiliates/<int:affiliate_id>/stats', methods=['GET'])
def get_affiliate_stats(affiliate_id):
    """Get affiliate performance statistics"""
    try:
        affiliate = Affiliate.query.get_or_404(affiliate_id)
        
        # Import here to avoid circular imports
        from src.models.user import Referral
        
        # Calculate statistics
        total_referrals = Referral.query.filter_by(affiliate_id=affiliate_id).count()
        converted_referrals = Referral.query.filter_by(
            affiliate_id=affiliate_id
        ).filter(Referral.subscription_id.isnot(None)).count()
        
        pending_commission = db.session.query(db.func.sum(Referral.commission_amount)).filter_by(
            affiliate_id=affiliate_id,
            commission_status='pending'
        ).scalar() or 0
        
        approved_commission = db.session.query(db.func.sum(Referral.commission_amount)).filter_by(
            affiliate_id=affiliate_id,
            commission_status='approved'
        ).scalar() or 0
        
        paid_commission = db.session.query(db.func.sum(Referral.commission_amount)).filter_by(
            affiliate_id=affiliate_id,
            commission_status='paid'
        ).scalar() or 0
        
        total_commission = pending_commission + approved_commission + paid_commission
        conversion_rate = (converted_referrals / total_referrals * 100) if total_referrals > 0 else 0
        
        stats = {
            'total_referrals': total_referrals,
            'converted_referrals': converted_referrals,
            'conversion_rate': round(conversion_rate, 2),
            'total_commission_earned': float(total_commission),
            'pending_commission': float(pending_commission),
            'approved_commission': float(approved_commission),
            'paid_commission': float(paid_commission)
        }
        
        return jsonify({'stats': stats}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@affiliate_bp.route('/affiliates/<int:affiliate_id>/activity', methods=['GET'])
def get_affiliate_activity(affiliate_id):
    """Get affiliate activity log"""
    try:
        affiliate = Affiliate.query.get_or_404(affiliate_id)
        
        page = int(request.args.get('page', 1))
        per_page = int(request.args.get('per_page', 20))
        
        activities = AffiliateActivityLog.query.filter_by(
            affiliate_id=affiliate_id
        ).order_by(AffiliateActivityLog.created_at.desc()).paginate(
            page=page,
            per_page=per_page,
            error_out=False
        )
        
        return jsonify({
            'activities': [activity.to_dict() for activity in activities.items],
            'pagination': {
                'page': page,
                'per_page': per_page,
                'total': activities.total,
                'pages': activities.pages,
                'has_next': activities.has_next,
                'has_prev': activities.has_prev
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

def log_activity(affiliate_id, activity_type, description, request_obj, metadata=None):
    """Helper function to log affiliate activities"""
    try:
        activity = AffiliateActivityLog(
            affiliate_id=affiliate_id,
            activity_type=activity_type,
            description=description,
            activity_metadata=json.dumps(metadata) if metadata else None,
            ip_address=request_obj.remote_addr,
            user_agent=request_obj.headers.get('User-Agent')
        )
        
        db.session.add(activity)
        db.session.commit()
        
    except Exception as e:
        # Log the error but don't fail the main operation
        print(f"Failed to log activity: {str(e)}")
        db.session.rollback()

