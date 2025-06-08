from decimal import Decimal, ROUND_HALF_UP
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Tuple
import json
import logging

class RevenueCalculationService:
    """
    Service for calculating affiliate commissions and managing revenue sharing
    """
    
    def __init__(self, commission_rate: float = 0.20):
        self.commission_rate = Decimal(str(commission_rate))
        self.minimum_payout = Decimal('50.00')
        self.logger = logging.getLogger(__name__)
    
    def calculate_commission(self, payment_amount: float, subscription_type: str = 'standard') -> Decimal:
        """
        Calculate commission amount based on payment and subscription type
        
        Args:
            payment_amount: The subscription payment amount
            subscription_type: Type of subscription (standard, premium, enterprise)
            
        Returns:
            Calculated commission amount
        """
        try:
            amount = Decimal(str(payment_amount))
            
            # Apply commission rate
            commission = amount * self.commission_rate
            
            # Round to 2 decimal places
            commission = commission.quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)
            
            self.logger.info(f"Calculated commission: ${commission} for payment: ${amount}")
            return commission
            
        except Exception as e:
            self.logger.error(f"Error calculating commission: {str(e)}")
            return Decimal('0.00')
    
    def process_subscription_payment(self, payment_data: Dict) -> Dict:
        """
        Process a subscription payment and calculate affiliate commission
        
        Args:
            payment_data: Dictionary containing payment information
            
        Returns:
            Dictionary with commission calculation results
        """
        try:
            # Extract payment information
            user_id = payment_data.get('user_id')
            payment_amount = payment_data.get('amount', 0)
            subscription_type = payment_data.get('subscription_type', 'standard')
            payment_id = payment_data.get('payment_id')
            
            # Check if user was referred
            referral = self._get_user_referral(user_id)
            if not referral:
                return {
                    'success': True,
                    'commission_created': False,
                    'message': 'No referral found for user'
                }
            
            # Calculate commission
            commission_amount = self.calculate_commission(payment_amount, subscription_type)
            
            # Create commission record
            commission_data = {
                'referral_id': referral['id'],
                'affiliate_id': referral['affiliate_id'],
                'payment_id': payment_id,
                'payment_amount': float(payment_amount),
                'commission_amount': float(commission_amount),
                'commission_rate': float(self.commission_rate),
                'subscription_type': subscription_type,
                'status': 'pending',
                'created_at': datetime.utcnow().isoformat()
            }
            
            # Save commission record
            commission_id = self._create_commission_record(commission_data)
            
            # Update referral status
            self._update_referral_conversion(referral['id'], commission_amount)
            
            # Check for automatic approval
            if self._should_auto_approve(referral['affiliate_id']):
                self._approve_commission(commission_id)
                commission_data['status'] = 'approved'
            
            self.logger.info(f"Commission created: ${commission_amount} for affiliate {referral['affiliate_id']}")
            
            return {
                'success': True,
                'commission_created': True,
                'commission_id': commission_id,
                'commission_amount': float(commission_amount),
                'commission_data': commission_data
            }
            
        except Exception as e:
            self.logger.error(f"Error processing subscription payment: {str(e)}")
            return {
                'success': False,
                'error': str(e)
            }
    
    def process_refund(self, refund_data: Dict) -> Dict:
        """
        Process a refund and adjust affiliate commission
        
        Args:
            refund_data: Dictionary containing refund information
            
        Returns:
            Dictionary with refund processing results
        """
        try:
            payment_id = refund_data.get('payment_id')
            refund_amount = Decimal(str(refund_data.get('amount', 0)))
            
            # Find existing commission for this payment
            commission = self._get_commission_by_payment_id(payment_id)
            if not commission:
                return {
                    'success': True,
                    'commission_adjusted': False,
                    'message': 'No commission found for payment'
                }
            
            # Calculate commission adjustment
            original_commission = Decimal(str(commission['commission_amount']))
            original_payment = Decimal(str(commission['payment_amount']))
            
            # Calculate proportional commission reduction
            refund_commission = (refund_amount / original_payment) * original_commission
            refund_commission = refund_commission.quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)
            
            # Create commission adjustment record
            adjustment_data = {
                'commission_id': commission['id'],
                'adjustment_type': 'refund',
                'adjustment_amount': -float(refund_commission),
                'reason': f'Refund of ${refund_amount}',
                'created_at': datetime.utcnow().isoformat()
            }
            
            # Save adjustment record
            self._create_commission_adjustment(adjustment_data)
            
            # Update commission amount
            new_commission_amount = original_commission - refund_commission
            self._update_commission_amount(commission['id'], float(new_commission_amount))
            
            self.logger.info(f"Commission adjusted: -${refund_commission} for refund ${refund_amount}")
            
            return {
                'success': True,
                'commission_adjusted': True,
                'adjustment_amount': float(refund_commission),
                'new_commission_amount': float(new_commission_amount)
            }
            
        except Exception as e:
            self.logger.error(f"Error processing refund: {str(e)}")
            return {
                'success': False,
                'error': str(e)
            }
    
    def generate_monthly_payouts(self, year: int, month: int) -> Dict:
        """
        Generate monthly payouts for all eligible affiliates
        
        Args:
            year: Year for payout period
            month: Month for payout period
            
        Returns:
            Dictionary with payout generation results
        """
        try:
            # Calculate period dates
            period_start = datetime(year, month, 1).date()
            if month == 12:
                period_end = datetime(year + 1, 1, 1).date() - timedelta(days=1)
            else:
                period_end = datetime(year, month + 1, 1).date() - timedelta(days=1)
            
            # Get eligible affiliates
            eligible_affiliates = self._get_eligible_affiliates_for_payout(period_start, period_end)
            
            payouts_created = []
            total_payout_amount = Decimal('0.00')
            
            for affiliate_data in eligible_affiliates:
                affiliate_id = affiliate_data['affiliate_id']
                total_commission = Decimal(str(affiliate_data['total_commission']))
                referral_count = affiliate_data['referral_count']
                
                # Check minimum payout threshold
                if total_commission < self.minimum_payout:
                    self.logger.info(f"Skipping payout for affiliate {affiliate_id}: below minimum threshold")
                    continue
                
                # Create payout record
                payout_data = {
                    'affiliate_id': affiliate_id,
                    'period_start': period_start.isoformat(),
                    'period_end': period_end.isoformat(),
                    'total_commission': float(total_commission),
                    'referral_count': referral_count,
                    'status': 'pending',
                    'created_at': datetime.utcnow().isoformat()
                }
                
                payout_id = self._create_payout_record(payout_data)
                
                # Mark commissions as paid
                self._mark_commissions_as_paid(affiliate_id, period_start, period_end, payout_id)
                
                payouts_created.append({
                    'payout_id': payout_id,
                    'affiliate_id': affiliate_id,
                    'amount': float(total_commission),
                    'referral_count': referral_count
                })
                
                total_payout_amount += total_commission
                
                self.logger.info(f"Payout created: ${total_commission} for affiliate {affiliate_id}")
            
            return {
                'success': True,
                'payouts_created': len(payouts_created),
                'total_amount': float(total_payout_amount),
                'period_start': period_start.isoformat(),
                'period_end': period_end.isoformat(),
                'payouts': payouts_created
            }
            
        except Exception as e:
            self.logger.error(f"Error generating monthly payouts: {str(e)}")
            return {
                'success': False,
                'error': str(e)
            }
    
    def calculate_affiliate_lifetime_value(self, affiliate_id: int) -> Dict:
        """
        Calculate lifetime value metrics for an affiliate
        
        Args:
            affiliate_id: ID of the affiliate
            
        Returns:
            Dictionary with lifetime value metrics
        """
        try:
            # Get all referrals for the affiliate
            referrals = self._get_affiliate_referrals(affiliate_id)
            
            total_referrals = len(referrals)
            converted_referrals = len([r for r in referrals if r['status'] == 'converted'])
            total_commission_earned = sum(Decimal(str(r.get('commission_amount', 0))) for r in referrals)
            
            # Calculate conversion rate
            conversion_rate = (converted_referrals / total_referrals * 100) if total_referrals > 0 else 0
            
            # Calculate average commission per referral
            avg_commission = total_commission_earned / converted_referrals if converted_referrals > 0 else Decimal('0.00')
            
            # Get monthly performance data
            monthly_performance = self._get_monthly_performance(affiliate_id)
            
            return {
                'affiliate_id': affiliate_id,
                'total_referrals': total_referrals,
                'converted_referrals': converted_referrals,
                'conversion_rate': round(conversion_rate, 2),
                'total_commission_earned': float(total_commission_earned),
                'average_commission_per_referral': float(avg_commission),
                'monthly_performance': monthly_performance,
                'calculated_at': datetime.utcnow().isoformat()
            }
            
        except Exception as e:
            self.logger.error(f"Error calculating affiliate lifetime value: {str(e)}")
            return {
                'success': False,
                'error': str(e)
            }
    
    # Private helper methods (these would interact with the database)
    
    def _get_user_referral(self, user_id: int) -> Optional[Dict]:
        """Get referral record for a user"""
        # This would query the database for the referral record
        # For now, returning mock data
        return {
            'id': 1,
            'affiliate_id': 1,
            'referred_user_id': user_id,
            'status': 'pending'
        }
    
    def _create_commission_record(self, commission_data: Dict) -> int:
        """Create a new commission record"""
        # This would insert into the database
        return 1  # Mock commission ID
    
    def _update_referral_conversion(self, referral_id: int, commission_amount: Decimal):
        """Update referral status to converted"""
        # This would update the referral record in the database
        pass
    
    def _should_auto_approve(self, affiliate_id: int) -> bool:
        """Check if commission should be automatically approved"""
        # This would check affiliate status and history
        return True  # For demo purposes
    
    def _approve_commission(self, commission_id: int):
        """Approve a commission"""
        # This would update the commission status
        pass
    
    def _get_commission_by_payment_id(self, payment_id: str) -> Optional[Dict]:
        """Get commission record by payment ID"""
        # This would query the database
        return None
    
    def _create_commission_adjustment(self, adjustment_data: Dict):
        """Create a commission adjustment record"""
        # This would insert into the database
        pass
    
    def _update_commission_amount(self, commission_id: int, new_amount: float):
        """Update commission amount"""
        # This would update the database
        pass
    
    def _get_eligible_affiliates_for_payout(self, period_start, period_end) -> List[Dict]:
        """Get affiliates eligible for payout in the given period"""
        # This would query the database for eligible affiliates
        return []
    
    def _create_payout_record(self, payout_data: Dict) -> int:
        """Create a payout record"""
        # This would insert into the database
        return 1  # Mock payout ID
    
    def _mark_commissions_as_paid(self, affiliate_id: int, period_start, period_end, payout_id: int):
        """Mark commissions as paid"""
        # This would update commission records
        pass
    
    def _get_affiliate_referrals(self, affiliate_id: int) -> List[Dict]:
        """Get all referrals for an affiliate"""
        # This would query the database
        return []
    
    def _get_monthly_performance(self, affiliate_id: int) -> List[Dict]:
        """Get monthly performance data for an affiliate"""
        # This would query and aggregate monthly data
        return []


class CommissionApprovalService:
    """
    Service for managing commission approval workflow
    """
    
    def __init__(self):
        self.logger = logging.getLogger(__name__)
    
    def approve_commission(self, commission_id: int, approver_id: int, notes: str = '') -> Dict:
        """
        Approve a commission
        
        Args:
            commission_id: ID of the commission to approve
            approver_id: ID of the user approving the commission
            notes: Optional approval notes
            
        Returns:
            Dictionary with approval results
        """
        try:
            # Get commission details
            commission = self._get_commission(commission_id)
            if not commission:
                return {
                    'success': False,
                    'error': 'Commission not found'
                }
            
            if commission['status'] != 'pending':
                return {
                    'success': False,
                    'error': f'Commission is already {commission["status"]}'
                }
            
            # Update commission status
            approval_data = {
                'commission_id': commission_id,
                'status': 'approved',
                'approved_by': approver_id,
                'approved_at': datetime.utcnow().isoformat(),
                'approval_notes': notes
            }
            
            self._update_commission_status(approval_data)
            
            # Log approval activity
            self._log_approval_activity(commission_id, approver_id, 'approved', notes)
            
            self.logger.info(f"Commission {commission_id} approved by user {approver_id}")
            
            return {
                'success': True,
                'commission_id': commission_id,
                'status': 'approved',
                'approved_at': approval_data['approved_at']
            }
            
        except Exception as e:
            self.logger.error(f"Error approving commission: {str(e)}")
            return {
                'success': False,
                'error': str(e)
            }
    
    def reject_commission(self, commission_id: int, rejector_id: int, reason: str) -> Dict:
        """
        Reject a commission
        
        Args:
            commission_id: ID of the commission to reject
            rejector_id: ID of the user rejecting the commission
            reason: Reason for rejection
            
        Returns:
            Dictionary with rejection results
        """
        try:
            # Get commission details
            commission = self._get_commission(commission_id)
            if not commission:
                return {
                    'success': False,
                    'error': 'Commission not found'
                }
            
            if commission['status'] != 'pending':
                return {
                    'success': False,
                    'error': f'Commission is already {commission["status"]}'
                }
            
            # Update commission status
            rejection_data = {
                'commission_id': commission_id,
                'status': 'rejected',
                'rejected_by': rejector_id,
                'rejected_at': datetime.utcnow().isoformat(),
                'rejection_reason': reason
            }
            
            self._update_commission_status(rejection_data)
            
            # Log rejection activity
            self._log_approval_activity(commission_id, rejector_id, 'rejected', reason)
            
            self.logger.info(f"Commission {commission_id} rejected by user {rejector_id}")
            
            return {
                'success': True,
                'commission_id': commission_id,
                'status': 'rejected',
                'rejected_at': rejection_data['rejected_at'],
                'reason': reason
            }
            
        except Exception as e:
            self.logger.error(f"Error rejecting commission: {str(e)}")
            return {
                'success': False,
                'error': str(e)
            }
    
    def bulk_approve_commissions(self, commission_ids: List[int], approver_id: int) -> Dict:
        """
        Bulk approve multiple commissions
        
        Args:
            commission_ids: List of commission IDs to approve
            approver_id: ID of the user approving the commissions
            
        Returns:
            Dictionary with bulk approval results
        """
        try:
            approved_count = 0
            failed_approvals = []
            
            for commission_id in commission_ids:
                result = self.approve_commission(commission_id, approver_id, 'Bulk approval')
                if result['success']:
                    approved_count += 1
                else:
                    failed_approvals.append({
                        'commission_id': commission_id,
                        'error': result['error']
                    })
            
            return {
                'success': True,
                'approved_count': approved_count,
                'failed_count': len(failed_approvals),
                'failed_approvals': failed_approvals
            }
            
        except Exception as e:
            self.logger.error(f"Error in bulk approval: {str(e)}")
            return {
                'success': False,
                'error': str(e)
            }
    
    # Private helper methods
    
    def _get_commission(self, commission_id: int) -> Optional[Dict]:
        """Get commission by ID"""
        # This would query the database
        return None
    
    def _update_commission_status(self, approval_data: Dict):
        """Update commission status"""
        # This would update the database
        pass
    
    def _log_approval_activity(self, commission_id: int, user_id: int, action: str, notes: str):
        """Log approval activity"""
        # This would log to the activity table
        pass


class FraudDetectionService:
    """
    Service for detecting and preventing affiliate fraud
    """
    
    def __init__(self):
        self.logger = logging.getLogger(__name__)
        self.suspicious_patterns = {
            'rapid_signups': 10,  # More than 10 signups in an hour
            'same_ip_limit': 5,   # More than 5 signups from same IP
            'conversion_rate_threshold': 90,  # Conversion rate above 90%
            'payment_velocity': 100  # More than $100 in payments per hour
        }
    
    def analyze_referral_pattern(self, affiliate_id: int) -> Dict:
        """
        Analyze referral patterns for potential fraud
        
        Args:
            affiliate_id: ID of the affiliate to analyze
            
        Returns:
            Dictionary with fraud analysis results
        """
        try:
            # Get recent referral activity
            recent_referrals = self._get_recent_referrals(affiliate_id, hours=24)
            
            fraud_indicators = []
            risk_score = 0
            
            # Check for rapid signups
            hourly_signups = self._group_referrals_by_hour(recent_referrals)
            max_hourly_signups = max(hourly_signups.values()) if hourly_signups else 0
            
            if max_hourly_signups > self.suspicious_patterns['rapid_signups']:
                fraud_indicators.append(f'Rapid signups: {max_hourly_signups} in one hour')
                risk_score += 30
            
            # Check for same IP addresses
            ip_counts = self._count_referrals_by_ip(recent_referrals)
            max_ip_count = max(ip_counts.values()) if ip_counts else 0
            
            if max_ip_count > self.suspicious_patterns['same_ip_limit']:
                fraud_indicators.append(f'Multiple signups from same IP: {max_ip_count}')
                risk_score += 25
            
            # Check conversion rate
            conversion_rate = self._calculate_conversion_rate(affiliate_id)
            if conversion_rate > self.suspicious_patterns['conversion_rate_threshold']:
                fraud_indicators.append(f'Unusually high conversion rate: {conversion_rate}%')
                risk_score += 20
            
            # Check payment velocity
            payment_velocity = self._calculate_payment_velocity(affiliate_id, hours=1)
            if payment_velocity > self.suspicious_patterns['payment_velocity']:
                fraud_indicators.append(f'High payment velocity: ${payment_velocity}/hour')
                risk_score += 25
            
            # Determine risk level
            if risk_score >= 70:
                risk_level = 'HIGH'
            elif risk_score >= 40:
                risk_level = 'MEDIUM'
            elif risk_score >= 20:
                risk_level = 'LOW'
            else:
                risk_level = 'MINIMAL'
            
            # Log analysis
            if fraud_indicators:
                self.logger.warning(f"Fraud indicators detected for affiliate {affiliate_id}: {fraud_indicators}")
            
            return {
                'affiliate_id': affiliate_id,
                'risk_score': risk_score,
                'risk_level': risk_level,
                'fraud_indicators': fraud_indicators,
                'analysis_timestamp': datetime.utcnow().isoformat(),
                'requires_review': risk_score >= 40
            }
            
        except Exception as e:
            self.logger.error(f"Error analyzing referral pattern: {str(e)}")
            return {
                'success': False,
                'error': str(e)
            }
    
    def flag_suspicious_activity(self, affiliate_id: int, reason: str, flagged_by: int) -> Dict:
        """
        Flag an affiliate for suspicious activity
        
        Args:
            affiliate_id: ID of the affiliate to flag
            reason: Reason for flagging
            flagged_by: ID of the user flagging the activity
            
        Returns:
            Dictionary with flagging results
        """
        try:
            flag_data = {
                'affiliate_id': affiliate_id,
                'flag_type': 'suspicious_activity',
                'reason': reason,
                'flagged_by': flagged_by,
                'flagged_at': datetime.utcnow().isoformat(),
                'status': 'active'
            }
            
            # Create flag record
            flag_id = self._create_fraud_flag(flag_data)
            
            # Suspend affiliate if high risk
            self._suspend_affiliate_if_needed(affiliate_id, reason)
            
            # Log activity
            self._log_fraud_activity(affiliate_id, 'flagged', reason, flagged_by)
            
            self.logger.warning(f"Affiliate {affiliate_id} flagged for suspicious activity: {reason}")
            
            return {
                'success': True,
                'flag_id': flag_id,
                'affiliate_id': affiliate_id,
                'flagged_at': flag_data['flagged_at']
            }
            
        except Exception as e:
            self.logger.error(f"Error flagging suspicious activity: {str(e)}")
            return {
                'success': False,
                'error': str(e)
            }
    
    # Private helper methods
    
    def _get_recent_referrals(self, affiliate_id: int, hours: int) -> List[Dict]:
        """Get recent referrals for an affiliate"""
        # This would query the database
        return []
    
    def _group_referrals_by_hour(self, referrals: List[Dict]) -> Dict[str, int]:
        """Group referrals by hour"""
        # This would group referrals by hour
        return {}
    
    def _count_referrals_by_ip(self, referrals: List[Dict]) -> Dict[str, int]:
        """Count referrals by IP address"""
        # This would count referrals by IP
        return {}
    
    def _calculate_conversion_rate(self, affiliate_id: int) -> float:
        """Calculate conversion rate for an affiliate"""
        # This would calculate the conversion rate
        return 0.0
    
    def _calculate_payment_velocity(self, affiliate_id: int, hours: int) -> float:
        """Calculate payment velocity"""
        # This would calculate payment velocity
        return 0.0
    
    def _create_fraud_flag(self, flag_data: Dict) -> int:
        """Create a fraud flag record"""
        # This would insert into the database
        return 1
    
    def _suspend_affiliate_if_needed(self, affiliate_id: int, reason: str):
        """Suspend affiliate if needed"""
        # This would update affiliate status
        pass
    
    def _log_fraud_activity(self, affiliate_id: int, action: str, reason: str, user_id: int):
        """Log fraud-related activity"""
        # This would log to the activity table
        pass

