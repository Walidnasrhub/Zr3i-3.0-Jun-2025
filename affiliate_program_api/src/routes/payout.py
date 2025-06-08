from flask import Blueprint, request, jsonify
from src.models.user import db, CommissionPayout, PayoutLineItem, Referral, Affiliate
from datetime import datetime, date
from dateutil.relativedelta import relativedelta
import json

payout_bp = Blueprint('payout', __name__)

@payout_bp.route('/payouts', methods=['POST'])
def create_payout():
    """Create a new commission payout for an affiliate"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['affiliate_id', 'payout_period_start', 'payout_period_end']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'{field} is required'}), 400
        
        # Verify affiliate exists
        affiliate = Affiliate.query.get(data['affiliate_id'])
        if not affiliate:
            return jsonify({'error': 'Invalid affiliate ID'}), 404
        
        # Parse dates
        period_start = datetime.fromisoformat(data['payout_period_start']).date()
        period_end = datetime.fromisoformat(data['payout_period_end']).date()
        
        # Get approved referrals for the period that haven't been paid
        approved_referrals = Referral.query.filter(
            Referral.affiliate_id == data['affiliate_id'],
            Referral.commission_status == 'approved',
            Referral.approved_at >= period_start,
            Referral.approved_at <= period_end
        ).all()
        
        if not approved_referrals:
            return jsonify({'error': 'No approved commissions found for the specified period'}), 400
        
        # Calculate total commission
        total_commission = sum(referral.commission_amount for referral in approved_referrals)
        referral_count = len(approved_referrals)
        
        # Create payout record
        payout = CommissionPayout(
            affiliate_id=data['affiliate_id'],
            payout_period_start=period_start,
            payout_period_end=period_end,
            total_commission=total_commission,
            referral_count=referral_count,
            payout_method=data.get('payout_method', affiliate.payout_method),
            payout_reference=data.get('payout_reference'),
            payout_status='pending'
        )
        
        db.session.add(payout)
        db.session.flush()  # Get the payout ID
        
        # Create line items for each referral
        for referral in approved_referrals:
            line_item = PayoutLineItem(
                payout_id=payout.id,
                referral_id=referral.id,
                commission_amount=referral.commission_amount
            )
            db.session.add(line_item)
            
            # Update referral status to paid
            referral.commission_status = 'paid'
            referral.paid_at = datetime.utcnow()
        
        db.session.commit()
        
        # Log the payout creation activity
        from src.routes.affiliate import log_activity
        log_activity(
            affiliate.id,
            'payout_created',
            f'Payout created for ${total_commission} covering {referral_count} referrals',
            request,
            {
                'payout_id': payout.id,
                'total_commission': float(total_commission),
                'referral_count': referral_count
            }
        )
        
        return jsonify({
            'message': 'Payout created successfully',
            'payout': payout.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@payout_bp.route('/payouts', methods=['GET'])
def get_payouts():
    """Get payouts with optional filtering"""
    try:
        # Query parameters for filtering
        affiliate_id = request.args.get('affiliate_id', type=int)
        status = request.args.get('status')
        page = int(request.args.get('page', 1))
        per_page = int(request.args.get('per_page', 20))
        
        query = CommissionPayout.query
        
        if affiliate_id:
            query = query.filter(CommissionPayout.affiliate_id == affiliate_id)
        
        if status:
            query = query.filter(CommissionPayout.payout_status == status)
        
        # Order by most recent first
        query = query.order_by(CommissionPayout.created_at.desc())
        
        # Paginate results
        payouts = query.paginate(
            page=page,
            per_page=per_page,
            error_out=False
        )
        
        return jsonify({
            'payouts': [payout.to_dict() for payout in payouts.items],
            'pagination': {
                'page': page,
                'per_page': per_page,
                'total': payouts.total,
                'pages': payouts.pages,
                'has_next': payouts.has_next,
                'has_prev': payouts.has_prev
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@payout_bp.route('/payouts/<int:payout_id>', methods=['GET'])
def get_payout(payout_id):
    """Get a specific payout by ID with line items"""
    try:
        payout = CommissionPayout.query.get_or_404(payout_id)
        
        # Get line items with referral details
        line_items = db.session.query(PayoutLineItem, Referral).join(
            Referral, PayoutLineItem.referral_id == Referral.id
        ).filter(PayoutLineItem.payout_id == payout_id).all()
        
        payout_data = payout.to_dict()
        payout_data['line_items'] = []
        
        for line_item, referral in line_items:
            line_item_data = line_item.to_dict()
            line_item_data['referral'] = referral.to_dict()
            payout_data['line_items'].append(line_item_data)
        
        return jsonify({'payout': payout_data}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@payout_bp.route('/payouts/<int:payout_id>/status', methods=['PUT'])
def update_payout_status(payout_id):
    """Update payout status (processing, completed, failed)"""
    try:
        payout = CommissionPayout.query.get_or_404(payout_id)
        data = request.get_json()
        
        if 'status' not in data:
            return jsonify({'error': 'Status is required'}), 400
        
        valid_statuses = ['pending', 'processing', 'completed', 'failed']
        if data['status'] not in valid_statuses:
            return jsonify({'error': f'Invalid status. Must be one of: {valid_statuses}'}), 400
        
        old_status = payout.payout_status
        payout.payout_status = data['status']
        payout.updated_at = datetime.utcnow()
        
        if data['status'] == 'completed':
            payout.payout_date = datetime.utcnow()
            payout.payout_reference = data.get('payout_reference', payout.payout_reference)
        elif data['status'] == 'failed':
            payout.failure_reason = data.get('failure_reason')
        
        db.session.commit()
        
        # Log the status change
        from src.routes.affiliate import log_activity
        log_activity(
            payout.affiliate_id,
            'payout_status_changed',
            f'Payout status changed from {old_status} to {data["status"]}',
            request,
            {
                'payout_id': payout.id,
                'old_status': old_status,
                'new_status': data['status'],
                'payout_reference': payout.payout_reference,
                'failure_reason': payout.failure_reason
            }
        )
        
        return jsonify({
            'message': 'Payout status updated successfully',
            'payout': payout.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@payout_bp.route('/payouts/generate-monthly', methods=['POST'])
def generate_monthly_payouts():
    """Generate monthly payouts for all eligible affiliates"""
    try:
        data = request.get_json()
        
        # Get the month to process (default to previous month)
        if data and data.get('month') and data.get('year'):
            target_month = int(data['month'])
            target_year = int(data['year'])
        else:
            # Default to previous month
            today = date.today()
            first_day_current_month = today.replace(day=1)
            last_month = first_day_current_month - relativedelta(months=1)
            target_month = last_month.month
            target_year = last_month.year
        
        # Calculate period dates
        period_start = date(target_year, target_month, 1)
        if target_month == 12:
            period_end = date(target_year + 1, 1, 1) - relativedelta(days=1)
        else:
            period_end = date(target_year, target_month + 1, 1) - relativedelta(days=1)
        
        # Get all active affiliates with approved commissions in the period
        affiliates_with_commissions = db.session.query(
            Affiliate.id,
            db.func.count(Referral.id).label('referral_count'),
            db.func.sum(Referral.commission_amount).label('total_commission')
        ).join(
            Referral, Affiliate.id == Referral.affiliate_id
        ).filter(
            Affiliate.status == 'active',
            Referral.commission_status == 'approved',
            Referral.approved_at >= period_start,
            Referral.approved_at <= period_end
        ).group_by(Affiliate.id).all()
        
        created_payouts = []
        
        for affiliate_id, referral_count, total_commission in affiliates_with_commissions:
            affiliate = Affiliate.query.get(affiliate_id)
            
            # Check if payout already exists for this period
            existing_payout = CommissionPayout.query.filter(
                CommissionPayout.affiliate_id == affiliate_id,
                CommissionPayout.payout_period_start == period_start,
                CommissionPayout.payout_period_end == period_end
            ).first()
            
            if existing_payout:
                continue  # Skip if payout already exists
            
            # Create payout
            payout = CommissionPayout(
                affiliate_id=affiliate_id,
                payout_period_start=period_start,
                payout_period_end=period_end,
                total_commission=total_commission,
                referral_count=referral_count,
                payout_method=affiliate.payout_method,
                payout_status='pending'
            )
            
            db.session.add(payout)
            db.session.flush()  # Get the payout ID
            
            # Get approved referrals for this affiliate in the period
            approved_referrals = Referral.query.filter(
                Referral.affiliate_id == affiliate_id,
                Referral.commission_status == 'approved',
                Referral.approved_at >= period_start,
                Referral.approved_at <= period_end
            ).all()
            
            # Create line items and update referral status
            for referral in approved_referrals:
                line_item = PayoutLineItem(
                    payout_id=payout.id,
                    referral_id=referral.id,
                    commission_amount=referral.commission_amount
                )
                db.session.add(line_item)
                
                # Update referral status to paid
                referral.commission_status = 'paid'
                referral.paid_at = datetime.utcnow()
            
            created_payouts.append(payout.to_dict())
            
            # Log the payout creation
            from src.routes.affiliate import log_activity
            log_activity(
                affiliate_id,
                'monthly_payout_generated',
                f'Monthly payout generated for {period_start.strftime("%B %Y")} - ${total_commission}',
                request,
                {
                    'payout_id': payout.id,
                    'period_start': period_start.isoformat(),
                    'period_end': period_end.isoformat(),
                    'total_commission': float(total_commission),
                    'referral_count': referral_count
                }
            )
        
        db.session.commit()
        
        return jsonify({
            'message': f'Generated {len(created_payouts)} payouts for {period_start.strftime("%B %Y")}',
            'period_start': period_start.isoformat(),
            'period_end': period_end.isoformat(),
            'payouts': created_payouts
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@payout_bp.route('/payouts/stats', methods=['GET'])
def get_payout_stats():
    """Get payout statistics"""
    try:
        # Query parameters for filtering
        affiliate_id = request.args.get('affiliate_id', type=int)
        start_date = request.args.get('start_date')
        end_date = request.args.get('end_date')
        
        query = CommissionPayout.query
        
        if affiliate_id:
            query = query.filter(CommissionPayout.affiliate_id == affiliate_id)
        
        if start_date:
            start_date = datetime.fromisoformat(start_date).date()
            query = query.filter(CommissionPayout.payout_period_start >= start_date)
        
        if end_date:
            end_date = datetime.fromisoformat(end_date).date()
            query = query.filter(CommissionPayout.payout_period_end <= end_date)
        
        # Calculate statistics
        total_payouts = query.count()
        
        pending_amount = query.filter_by(payout_status='pending').with_entities(
            db.func.sum(CommissionPayout.total_commission)
        ).scalar() or 0
        
        processing_amount = query.filter_by(payout_status='processing').with_entities(
            db.func.sum(CommissionPayout.total_commission)
        ).scalar() or 0
        
        completed_amount = query.filter_by(payout_status='completed').with_entities(
            db.func.sum(CommissionPayout.total_commission)
        ).scalar() or 0
        
        failed_amount = query.filter_by(payout_status='failed').with_entities(
            db.func.sum(CommissionPayout.total_commission)
        ).scalar() or 0
        
        total_amount = pending_amount + processing_amount + completed_amount + failed_amount
        
        stats = {
            'total_payouts': total_payouts,
            'total_amount': float(total_amount),
            'pending_amount': float(pending_amount),
            'processing_amount': float(processing_amount),
            'completed_amount': float(completed_amount),
            'failed_amount': float(failed_amount)
        }
        
        return jsonify({'stats': stats}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

