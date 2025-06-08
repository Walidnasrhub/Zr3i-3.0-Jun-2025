from flask import Blueprint, request, jsonify
from src.services.revenue_sharing import RevenueCalculationService, FraudDetectionService
from src.models.user import db, Referral, Affiliate
import json
import hmac
import hashlib
from datetime import datetime

webhook_bp = Blueprint('webhook', __name__)

# Initialize services
revenue_service = RevenueCalculationService()
fraud_service = FraudDetectionService()

@webhook_bp.route('/webhooks/stripe/payment-success', methods=['POST'])
def handle_stripe_payment_success():
    """
    Handle Stripe payment success webhook
    Process affiliate commissions for successful payments
    """
    try:
        # Verify webhook signature (in production)
        # signature = request.headers.get('Stripe-Signature')
        # if not verify_stripe_signature(request.data, signature):
        #     return jsonify({'error': 'Invalid signature'}), 401
        
        event_data = request.get_json()
        
        # Extract payment information
        if event_data.get('type') != 'payment_intent.succeeded':
            return jsonify({'message': 'Event type not handled'}), 200
        
        payment_intent = event_data.get('data', {}).get('object', {})
        
        # Extract relevant payment data
        payment_data = {
            'payment_id': payment_intent.get('id'),
            'amount': payment_intent.get('amount') / 100,  # Convert from cents
            'currency': payment_intent.get('currency'),
            'customer_id': payment_intent.get('customer'),
            'metadata': payment_intent.get('metadata', {})
        }
        
        # Get user ID from metadata or customer lookup
        user_id = payment_data['metadata'].get('user_id')
        if not user_id:
            user_id = get_user_id_from_customer(payment_data['customer_id'])
        
        if not user_id:
            return jsonify({'message': 'User ID not found'}), 200
        
        # Add user_id to payment data
        payment_data['user_id'] = user_id
        payment_data['subscription_type'] = payment_data['metadata'].get('subscription_type', 'standard')
        
        # Process commission
        result = revenue_service.process_subscription_payment(payment_data)
        
        if result['success'] and result['commission_created']:
            # Run fraud detection
            referral = get_referral_by_user_id(user_id)
            if referral:
                fraud_analysis = fraud_service.analyze_referral_pattern(referral['affiliate_id'])
                
                # Log fraud analysis if suspicious
                if fraud_analysis.get('requires_review'):
                    log_fraud_alert(referral['affiliate_id'], fraud_analysis)
        
        return jsonify({
            'message': 'Payment processed successfully',
            'commission_created': result.get('commission_created', False),
            'commission_amount': result.get('commission_amount', 0)
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@webhook_bp.route('/webhooks/stripe/payment-refunded', methods=['POST'])
def handle_stripe_payment_refunded():
    """
    Handle Stripe payment refund webhook
    Adjust affiliate commissions for refunded payments
    """
    try:
        event_data = request.get_json()
        
        if event_data.get('type') != 'charge.dispute.created' and event_data.get('type') != 'payment_intent.payment_failed':
            return jsonify({'message': 'Event type not handled'}), 200
        
        # Extract refund information
        refund_object = event_data.get('data', {}).get('object', {})
        
        refund_data = {
            'payment_id': refund_object.get('payment_intent') or refund_object.get('id'),
            'amount': refund_object.get('amount') / 100,  # Convert from cents
            'reason': refund_object.get('reason', 'unknown'),
            'refunded_at': datetime.utcnow().isoformat()
        }
        
        # Process refund
        result = revenue_service.process_refund(refund_data)
        
        return jsonify({
            'message': 'Refund processed successfully',
            'commission_adjusted': result.get('commission_adjusted', False),
            'adjustment_amount': result.get('adjustment_amount', 0)
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@webhook_bp.route('/webhooks/paypal/payment-success', methods=['POST'])
def handle_paypal_payment_success():
    """
    Handle PayPal payment success webhook
    """
    try:
        # Verify PayPal webhook signature (in production)
        # if not verify_paypal_signature(request):
        #     return jsonify({'error': 'Invalid signature'}), 401
        
        event_data = request.get_json()
        
        # Extract payment information from PayPal webhook
        if event_data.get('event_type') != 'PAYMENT.CAPTURE.COMPLETED':
            return jsonify({'message': 'Event type not handled'}), 200
        
        resource = event_data.get('resource', {})
        
        payment_data = {
            'payment_id': resource.get('id'),
            'amount': float(resource.get('amount', {}).get('value', 0)),
            'currency': resource.get('amount', {}).get('currency_code'),
            'payer_id': resource.get('payer', {}).get('payer_id'),
            'custom_id': resource.get('custom_id')  # Should contain user_id
        }
        
        # Get user ID from custom_id
        user_id = payment_data.get('custom_id')
        if not user_id:
            return jsonify({'message': 'User ID not found'}), 200
        
        payment_data['user_id'] = user_id
        payment_data['subscription_type'] = 'standard'  # Default for PayPal
        
        # Process commission
        result = revenue_service.process_subscription_payment(payment_data)
        
        return jsonify({
            'message': 'PayPal payment processed successfully',
            'commission_created': result.get('commission_created', False),
            'commission_amount': result.get('commission_amount', 0)
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@webhook_bp.route('/webhooks/subscription/created', methods=['POST'])
def handle_subscription_created():
    """
    Handle subscription creation webhook
    Track new subscriptions for affiliate attribution
    """
    try:
        subscription_data = request.get_json()
        
        user_id = subscription_data.get('user_id')
        subscription_type = subscription_data.get('subscription_type', 'standard')
        plan_amount = subscription_data.get('plan_amount', 0)
        
        if not user_id:
            return jsonify({'message': 'User ID required'}), 400
        
        # Check if user was referred
        referral = get_referral_by_user_id(user_id)
        if referral:
            # Update referral with subscription information
            update_referral_subscription_info(referral['id'], {
                'subscription_type': subscription_type,
                'plan_amount': plan_amount,
                'subscribed_at': datetime.utcnow().isoformat()
            })
            
            # Log subscription event
            log_affiliate_activity(
                referral['affiliate_id'],
                'subscription_created',
                f'Referred user {user_id} created {subscription_type} subscription',
                request,
                {
                    'user_id': user_id,
                    'subscription_type': subscription_type,
                    'plan_amount': plan_amount
                }
            )
        
        return jsonify({'message': 'Subscription tracked successfully'}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@webhook_bp.route('/webhooks/subscription/cancelled', methods=['POST'])
def handle_subscription_cancelled():
    """
    Handle subscription cancellation webhook
    Track cancellations for affiliate analytics
    """
    try:
        cancellation_data = request.get_json()
        
        user_id = cancellation_data.get('user_id')
        cancellation_reason = cancellation_data.get('reason', 'user_requested')
        
        if not user_id:
            return jsonify({'message': 'User ID required'}), 400
        
        # Check if user was referred
        referral = get_referral_by_user_id(user_id)
        if referral:
            # Update referral with cancellation information
            update_referral_cancellation_info(referral['id'], {
                'cancelled_at': datetime.utcnow().isoformat(),
                'cancellation_reason': cancellation_reason
            })
            
            # Log cancellation event
            log_affiliate_activity(
                referral['affiliate_id'],
                'subscription_cancelled',
                f'Referred user {user_id} cancelled subscription: {cancellation_reason}',
                request,
                {
                    'user_id': user_id,
                    'cancellation_reason': cancellation_reason
                }
            )
        
        return jsonify({'message': 'Cancellation tracked successfully'}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@webhook_bp.route('/webhooks/user/registered', methods=['POST'])
def handle_user_registered():
    """
    Handle user registration webhook
    Create referral record if user registered with referral code
    """
    try:
        registration_data = request.get_json()
        
        user_id = registration_data.get('user_id')
        referral_code = registration_data.get('referral_code')
        user_ip = registration_data.get('ip_address')
        user_agent = registration_data.get('user_agent')
        
        if not user_id:
            return jsonify({'message': 'User ID required'}), 400
        
        if not referral_code:
            return jsonify({'message': 'No referral code provided'}), 200
        
        # Find affiliate by referral code
        affiliate = get_affiliate_by_referral_code(referral_code)
        if not affiliate:
            return jsonify({'message': 'Invalid referral code'}), 200
        
        # Check if affiliate is active
        if affiliate['status'] != 'active':
            return jsonify({'message': 'Affiliate not active'}), 200
        
        # Create referral record
        referral_data = {
            'affiliate_id': affiliate['id'],
            'referred_user_id': user_id,
            'referral_code': referral_code,
            'ip_address': user_ip,
            'user_agent': user_agent,
            'referred_at': datetime.utcnow().isoformat(),
            'status': 'pending'
        }
        
        referral_id = create_referral_record(referral_data)
        
        # Log referral activity
        log_affiliate_activity(
            affiliate['id'],
            'referral_created',
            f'New user {user_id} registered with referral code {referral_code}',
            request,
            {
                'user_id': user_id,
                'referral_id': referral_id,
                'ip_address': user_ip
            }
        )
        
        # Run fraud detection on new referral
        fraud_analysis = fraud_service.analyze_referral_pattern(affiliate['id'])
        if fraud_analysis.get('requires_review'):
            log_fraud_alert(affiliate['id'], fraud_analysis)
        
        return jsonify({
            'message': 'Referral created successfully',
            'referral_id': referral_id,
            'affiliate_id': affiliate['id']
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Helper functions

def verify_stripe_signature(payload, signature):
    """Verify Stripe webhook signature"""
    # In production, implement proper signature verification
    return True

def verify_paypal_signature(request):
    """Verify PayPal webhook signature"""
    # In production, implement proper signature verification
    return True

def get_user_id_from_customer(customer_id):
    """Get user ID from Stripe customer ID"""
    # This would query your user database
    return None

def get_referral_by_user_id(user_id):
    """Get referral record by user ID"""
    try:
        referral = Referral.query.filter_by(referred_user_id=user_id).first()
        return referral.to_dict() if referral else None
    except:
        return None

def get_affiliate_by_referral_code(referral_code):
    """Get affiliate by referral code"""
    try:
        affiliate = Affiliate.query.filter_by(referral_code=referral_code).first()
        return affiliate.to_dict() if affiliate else None
    except:
        return None

def create_referral_record(referral_data):
    """Create a new referral record"""
    try:
        referral = Referral(
            affiliate_id=referral_data['affiliate_id'],
            referred_user_id=referral_data['referred_user_id'],
            referral_code=referral_data['referral_code'],
            ip_address=referral_data.get('ip_address'),
            user_agent=referral_data.get('user_agent'),
            referred_at=datetime.fromisoformat(referral_data['referred_at'].replace('Z', '+00:00')),
            commission_status='pending'
        )
        
        db.session.add(referral)
        db.session.commit()
        
        return referral.id
    except Exception as e:
        db.session.rollback()
        raise e

def update_referral_subscription_info(referral_id, subscription_info):
    """Update referral with subscription information"""
    try:
        referral = Referral.query.get(referral_id)
        if referral:
            referral.subscription_type = subscription_info.get('subscription_type')
            referral.plan_amount = subscription_info.get('plan_amount')
            if subscription_info.get('subscribed_at'):
                referral.converted_at = datetime.fromisoformat(subscription_info['subscribed_at'].replace('Z', '+00:00'))
            
            db.session.commit()
    except Exception as e:
        db.session.rollback()
        raise e

def update_referral_cancellation_info(referral_id, cancellation_info):
    """Update referral with cancellation information"""
    try:
        referral = Referral.query.get(referral_id)
        if referral:
            referral.cancelled_at = datetime.fromisoformat(cancellation_info['cancelled_at'].replace('Z', '+00:00'))
            referral.cancellation_reason = cancellation_info.get('cancellation_reason')
            
            db.session.commit()
    except Exception as e:
        db.session.rollback()
        raise e

def log_affiliate_activity(affiliate_id, activity_type, description, request_obj, metadata=None):
    """Log affiliate activity"""
    try:
        from src.routes.affiliate import log_activity
        log_activity(affiliate_id, activity_type, description, request_obj, metadata)
    except Exception as e:
        print(f"Failed to log activity: {str(e)}")

def log_fraud_alert(affiliate_id, fraud_analysis):
    """Log fraud alert"""
    try:
        # This would create a fraud alert record
        print(f"FRAUD ALERT: Affiliate {affiliate_id} - Risk Level: {fraud_analysis.get('risk_level')}")
        print(f"Indicators: {fraud_analysis.get('fraud_indicators')}")
    except Exception as e:
        print(f"Failed to log fraud alert: {str(e)}")

