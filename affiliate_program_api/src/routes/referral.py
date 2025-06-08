from flask import Blueprint, request, jsonify
from src.models.user import db, Referral, Affiliate, User, Subscription
import json
from datetime import datetime

referral_bp = Blueprint('referral', __name__)

@referral_bp.route('/referrals', methods=['POST'])
def create_referral():
    """Create a new referral when a user signs up via affiliate link/code"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['affiliate_id', 'referred_user_id']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'{field} is required'}), 400
        
        # Verify affiliate exists and is active
        affiliate = Affiliate.query.get(data['affiliate_id'])
        if not affiliate:
            return jsonify({'error': 'Invalid affiliate ID'}), 404
        
        if affiliate.status != 'active':
            return jsonify({'error': 'Affiliate account is not active'}), 403
        
        # Verify user exists
        user = User.query.get(data['referred_user_id'])
        if not user:
            return jsonify({'error': 'Invalid user ID'}), 404
        
        # Check if referral already exists for this user
        existing_referral = Referral.query.filter_by(
            referred_user_id=data['referred_user_id']
        ).first()
        
        if existing_referral:
            return jsonify({'error': 'User already has a referral record'}), 409
        
        # Create new referral
        referral = Referral(
            affiliate_id=data['affiliate_id'],
            referred_user_id=data['referred_user_id'],
            referral_source=data.get('referral_source'),
            ip_address=request.remote_addr,
            user_agent=request.headers.get('User-Agent'),
            utm_source=data.get('utm_source'),
            utm_medium=data.get('utm_medium'),
            utm_campaign=data.get('utm_campaign'),
            utm_content=data.get('utm_content'),
            utm_term=data.get('utm_term'),
            notes=data.get('notes')
        )
        
        db.session.add(referral)
        db.session.commit()
        
        # Log the referral activity
        from src.routes.affiliate import log_activity
        log_activity(
            affiliate.id, 
            'referral_created', 
            f'New referral created for user {user.email}',
            request,
            {'referral_id': referral.id, 'user_email': user.email}
        )
        
        return jsonify({
            'message': 'Referral created successfully',
            'referral': referral.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@referral_bp.route('/referrals/<int:referral_id>/convert', methods=['PUT'])
def convert_referral():
    """Convert a referral when the referred user subscribes"""
    try:
        data = request.get_json()
        referral_id = request.view_args['referral_id']
        
        # Validate required fields
        if not data.get('subscription_id'):
            return jsonify({'error': 'subscription_id is required'}), 400
        
        # Get the referral
        referral = Referral.query.get_or_404(referral_id)
        
        # Verify subscription exists
        subscription = Subscription.query.get(data['subscription_id'])
        if not subscription:
            return jsonify({'error': 'Invalid subscription ID'}), 404
        
        # Verify subscription belongs to the referred user
        if subscription.user_id != referral.referred_user_id:
            return jsonify({'error': 'Subscription does not belong to referred user'}), 400
        
        # Update referral with conversion data
        referral.subscription_id = subscription.id
        referral.conversion_value = subscription.amount
        referral.converted_at = datetime.utcnow()
        
        # Calculate commission (20% of subscription amount)
        referral.calculate_commission()
        referral.commission_status = 'pending'  # Pending approval
        
        db.session.commit()
        
        # Log the conversion activity
        from src.routes.affiliate import log_activity
        log_activity(
            referral.affiliate_id,
            'referral_converted',
            f'Referral converted - subscription {subscription.plan_name} for ${subscription.amount}',
            request,
            {
                'referral_id': referral.id,
                'subscription_id': subscription.id,
                'commission_amount': float(referral.commission_amount)
            }
        )
        
        return jsonify({
            'message': 'Referral converted successfully',
            'referral': referral.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@referral_bp.route('/referrals', methods=['GET'])
def get_referrals():
    """Get referrals with optional filtering"""
    try:
        # Query parameters for filtering
        affiliate_id = request.args.get('affiliate_id', type=int)
        commission_status = request.args.get('commission_status')
        page = int(request.args.get('page', 1))
        per_page = int(request.args.get('per_page', 20))
        
        query = Referral.query
        
        if affiliate_id:
            query = query.filter(Referral.affiliate_id == affiliate_id)
        
        if commission_status:
            query = query.filter(Referral.commission_status == commission_status)
        
        # Order by most recent first
        query = query.order_by(Referral.referred_at.desc())
        
        # Paginate results
        referrals = query.paginate(
            page=page,
            per_page=per_page,
            error_out=False
        )
        
        return jsonify({
            'referrals': [referral.to_dict() for referral in referrals.items],
            'pagination': {
                'page': page,
                'per_page': per_page,
                'total': referrals.total,
                'pages': referrals.pages,
                'has_next': referrals.has_next,
                'has_prev': referrals.has_prev
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@referral_bp.route('/referrals/<int:referral_id>', methods=['GET'])
def get_referral(referral_id):
    """Get a specific referral by ID"""
    try:
        referral = Referral.query.get_or_404(referral_id)
        return jsonify({'referral': referral.to_dict()}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@referral_bp.route('/referrals/<int:referral_id>/approve', methods=['PUT'])
def approve_referral_commission(referral_id):
    """Approve a referral commission"""
    try:
        referral = Referral.query.get_or_404(referral_id)
        
        if referral.commission_status != 'pending':
            return jsonify({'error': 'Only pending commissions can be approved'}), 400
        
        if not referral.commission_amount:
            return jsonify({'error': 'Commission amount not calculated'}), 400
        
        referral.commission_status = 'approved'
        referral.approved_at = datetime.utcnow()
        
        db.session.commit()
        
        # Log the approval activity
        from src.routes.affiliate import log_activity
        log_activity(
            referral.affiliate_id,
            'commission_approved',
            f'Commission approved for ${referral.commission_amount}',
            request,
            {
                'referral_id': referral.id,
                'commission_amount': float(referral.commission_amount)
            }
        )
        
        return jsonify({
            'message': 'Commission approved successfully',
            'referral': referral.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@referral_bp.route('/referrals/<int:referral_id>/reject', methods=['PUT'])
def reject_referral_commission(referral_id):
    """Reject a referral commission"""
    try:
        data = request.get_json()
        referral = Referral.query.get_or_404(referral_id)
        
        if referral.commission_status not in ['pending', 'approved']:
            return jsonify({'error': 'Only pending or approved commissions can be rejected'}), 400
        
        referral.commission_status = 'cancelled'
        referral.notes = data.get('reason', 'Commission rejected')
        
        db.session.commit()
        
        # Log the rejection activity
        from src.routes.affiliate import log_activity
        log_activity(
            referral.affiliate_id,
            'commission_rejected',
            f'Commission rejected: {referral.notes}',
            request,
            {
                'referral_id': referral.id,
                'reason': referral.notes
            }
        )
        
        return jsonify({
            'message': 'Commission rejected successfully',
            'referral': referral.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@referral_bp.route('/referrals/by-code/<referral_code>', methods=['POST'])
def create_referral_by_code():
    """Create a referral using a referral code (for user signup flow)"""
    try:
        data = request.get_json()
        referral_code = request.view_args['referral_code']
        
        # Validate required fields
        if not data.get('referred_user_id'):
            return jsonify({'error': 'referred_user_id is required'}), 400
        
        # Find affiliate by referral code
        affiliate = Affiliate.query.filter_by(referral_code=referral_code).first()
        if not affiliate:
            return jsonify({'error': 'Invalid referral code'}), 404
        
        if affiliate.status != 'active':
            return jsonify({'error': 'Affiliate account is not active'}), 403
        
        # Create referral data with affiliate ID
        referral_data = {
            'affiliate_id': affiliate.id,
            'referred_user_id': data['referred_user_id'],
            'referral_source': data.get('referral_source', 'referral_code'),
            'utm_source': data.get('utm_source'),
            'utm_medium': data.get('utm_medium'),
            'utm_campaign': data.get('utm_campaign'),
            'utm_content': data.get('utm_content'),
            'utm_term': data.get('utm_term'),
            'notes': data.get('notes')
        }
        
        # Use the existing create_referral logic
        request.json = referral_data
        return create_referral()
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@referral_bp.route('/referrals/stats', methods=['GET'])
def get_referral_stats():
    """Get overall referral statistics"""
    try:
        # Query parameters for filtering
        affiliate_id = request.args.get('affiliate_id', type=int)
        start_date = request.args.get('start_date')
        end_date = request.args.get('end_date')
        
        query = Referral.query
        
        if affiliate_id:
            query = query.filter(Referral.affiliate_id == affiliate_id)
        
        if start_date:
            start_date = datetime.fromisoformat(start_date)
            query = query.filter(Referral.referred_at >= start_date)
        
        if end_date:
            end_date = datetime.fromisoformat(end_date)
            query = query.filter(Referral.referred_at <= end_date)
        
        # Calculate statistics
        total_referrals = query.count()
        converted_referrals = query.filter(Referral.subscription_id.isnot(None)).count()
        
        pending_commission = query.filter_by(commission_status='pending').with_entities(
            db.func.sum(Referral.commission_amount)
        ).scalar() or 0
        
        approved_commission = query.filter_by(commission_status='approved').with_entities(
            db.func.sum(Referral.commission_amount)
        ).scalar() or 0
        
        paid_commission = query.filter_by(commission_status='paid').with_entities(
            db.func.sum(Referral.commission_amount)
        ).scalar() or 0
        
        total_commission = pending_commission + approved_commission + paid_commission
        conversion_rate = (converted_referrals / total_referrals * 100) if total_referrals > 0 else 0
        
        stats = {
            'total_referrals': total_referrals,
            'converted_referrals': converted_referrals,
            'conversion_rate': round(conversion_rate, 2),
            'total_commission': float(total_commission),
            'pending_commission': float(pending_commission),
            'approved_commission': float(approved_commission),
            'paid_commission': float(paid_commission)
        }
        
        return jsonify({'stats': stats}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

