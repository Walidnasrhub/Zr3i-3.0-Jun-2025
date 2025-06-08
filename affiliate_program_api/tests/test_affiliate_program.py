import unittest
import json
from decimal import Decimal
from datetime import datetime, timedelta
from unittest.mock import Mock, patch, MagicMock

# Import the services we're testing
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from src.services.revenue_sharing import (
    RevenueCalculationService, 
    CommissionApprovalService, 
    FraudDetectionService
)

class TestRevenueCalculationService(unittest.TestCase):
    """Test suite for RevenueCalculationService"""
    
    def setUp(self):
        """Set up test fixtures"""
        self.service = RevenueCalculationService()
        self.sample_payment_data = {
            'user_id': 123,
            'amount': 100.00,
            'subscription_type': 'standard',
            'payment_id': 'pay_test123'
        }
    
    def test_calculate_commission_standard_rate(self):
        """Test commission calculation with standard 20% rate"""
        commission = self.service.calculate_commission(100.00)
        self.assertEqual(commission, Decimal('20.00'))
    
    def test_calculate_commission_decimal_precision(self):
        """Test commission calculation with decimal precision"""
        commission = self.service.calculate_commission(99.99)
        self.assertEqual(commission, Decimal('20.00'))  # Rounded up
        
        commission = self.service.calculate_commission(99.94)
        self.assertEqual(commission, Decimal('19.99'))  # Rounded down
    
    def test_calculate_commission_zero_amount(self):
        """Test commission calculation with zero amount"""
        commission = self.service.calculate_commission(0.00)
        self.assertEqual(commission, Decimal('0.00'))
    
    def test_calculate_commission_negative_amount(self):
        """Test commission calculation with negative amount"""
        commission = self.service.calculate_commission(-50.00)
        self.assertEqual(commission, Decimal('-10.00'))
    
    @patch('src.services.revenue_sharing.RevenueCalculationService._get_user_referral')
    def test_process_subscription_payment_no_referral(self, mock_get_referral):
        """Test processing payment when user has no referral"""
        mock_get_referral.return_value = None
        
        result = self.service.process_subscription_payment(self.sample_payment_data)
        
        self.assertTrue(result['success'])
        self.assertFalse(result['commission_created'])
        self.assertEqual(result['message'], 'No referral found for user')
    
    @patch('src.services.revenue_sharing.RevenueCalculationService._get_user_referral')
    @patch('src.services.revenue_sharing.RevenueCalculationService._create_commission_record')
    @patch('src.services.revenue_sharing.RevenueCalculationService._update_referral_conversion')
    @patch('src.services.revenue_sharing.RevenueCalculationService._should_auto_approve')
    def test_process_subscription_payment_with_referral(self, mock_auto_approve, 
                                                       mock_update_referral, 
                                                       mock_create_commission, 
                                                       mock_get_referral):
        """Test processing payment when user has referral"""
        mock_get_referral.return_value = {
            'id': 1,
            'affiliate_id': 10,
            'referred_user_id': 123
        }
        mock_create_commission.return_value = 100
        mock_auto_approve.return_value = False
        
        result = self.service.process_subscription_payment(self.sample_payment_data)
        
        self.assertTrue(result['success'])
        self.assertTrue(result['commission_created'])
        self.assertEqual(result['commission_amount'], 20.0)
        self.assertEqual(result['commission_id'], 100)
        
        # Verify commission record was created with correct data
        mock_create_commission.assert_called_once()
        commission_data = mock_create_commission.call_args[0][0]
        self.assertEqual(commission_data['affiliate_id'], 10)
        self.assertEqual(commission_data['payment_amount'], 100.0)
        self.assertEqual(commission_data['commission_amount'], 20.0)
        self.assertEqual(commission_data['commission_rate'], 0.2)
    
    @patch('src.services.revenue_sharing.RevenueCalculationService._get_commission_by_payment_id')
    def test_process_refund_no_commission(self, mock_get_commission):
        """Test processing refund when no commission exists"""
        mock_get_commission.return_value = None
        
        refund_data = {
            'payment_id': 'pay_test123',
            'amount': 50.00
        }
        
        result = self.service.process_refund(refund_data)
        
        self.assertTrue(result['success'])
        self.assertFalse(result['commission_adjusted'])
        self.assertEqual(result['message'], 'No commission found for payment')
    
    @patch('src.services.revenue_sharing.RevenueCalculationService._get_commission_by_payment_id')
    @patch('src.services.revenue_sharing.RevenueCalculationService._create_commission_adjustment')
    @patch('src.services.revenue_sharing.RevenueCalculationService._update_commission_amount')
    def test_process_refund_with_commission(self, mock_update_commission, 
                                          mock_create_adjustment, 
                                          mock_get_commission):
        """Test processing refund when commission exists"""
        mock_get_commission.return_value = {
            'id': 100,
            'commission_amount': 20.00,
            'payment_amount': 100.00
        }
        
        refund_data = {
            'payment_id': 'pay_test123',
            'amount': 50.00  # 50% refund
        }
        
        result = self.service.process_refund(refund_data)
        
        self.assertTrue(result['success'])
        self.assertTrue(result['commission_adjusted'])
        self.assertEqual(result['adjustment_amount'], 10.0)  # 50% of 20.00
        self.assertEqual(result['new_commission_amount'], 10.0)  # 20.00 - 10.00
        
        # Verify adjustment was created
        mock_create_adjustment.assert_called_once()
        adjustment_data = mock_create_adjustment.call_args[0][0]
        self.assertEqual(adjustment_data['adjustment_amount'], -10.0)
        self.assertEqual(adjustment_data['adjustment_type'], 'refund')
    
    @patch('src.services.revenue_sharing.RevenueCalculationService._get_eligible_affiliates_for_payout')
    @patch('src.services.revenue_sharing.RevenueCalculationService._create_payout_record')
    @patch('src.services.revenue_sharing.RevenueCalculationService._mark_commissions_as_paid')
    def test_generate_monthly_payouts(self, mock_mark_paid, mock_create_payout, mock_get_affiliates):
        """Test monthly payout generation"""
        mock_get_affiliates.return_value = [
            {
                'affiliate_id': 1,
                'total_commission': 100.00,
                'referral_count': 5
            },
            {
                'affiliate_id': 2,
                'total_commission': 25.00,  # Below minimum threshold
                'referral_count': 1
            },
            {
                'affiliate_id': 3,
                'total_commission': 75.00,
                'referral_count': 3
            }
        ]
        mock_create_payout.side_effect = [1001, 1002]  # Payout IDs
        
        result = self.service.generate_monthly_payouts(2024, 1)
        
        self.assertTrue(result['success'])
        self.assertEqual(result['payouts_created'], 2)  # Only 2 above threshold
        self.assertEqual(result['total_amount'], 175.0)  # 100 + 75
        
        # Verify payouts were created for eligible affiliates only
        self.assertEqual(mock_create_payout.call_count, 2)
        self.assertEqual(mock_mark_paid.call_count, 2)


class TestCommissionApprovalService(unittest.TestCase):
    """Test suite for CommissionApprovalService"""
    
    def setUp(self):
        """Set up test fixtures"""
        self.service = CommissionApprovalService()
    
    @patch('src.services.revenue_sharing.CommissionApprovalService._get_commission')
    def test_approve_commission_not_found(self, mock_get_commission):
        """Test approving non-existent commission"""
        mock_get_commission.return_value = None
        
        result = self.service.approve_commission(999, 1, 'Test approval')
        
        self.assertFalse(result['success'])
        self.assertEqual(result['error'], 'Commission not found')
    
    @patch('src.services.revenue_sharing.CommissionApprovalService._get_commission')
    def test_approve_commission_already_approved(self, mock_get_commission):
        """Test approving already approved commission"""
        mock_get_commission.return_value = {
            'id': 100,
            'status': 'approved'
        }
        
        result = self.service.approve_commission(100, 1, 'Test approval')
        
        self.assertFalse(result['success'])
        self.assertEqual(result['error'], 'Commission is already approved')
    
    @patch('src.services.revenue_sharing.CommissionApprovalService._get_commission')
    @patch('src.services.revenue_sharing.CommissionApprovalService._update_commission_status')
    @patch('src.services.revenue_sharing.CommissionApprovalService._log_approval_activity')
    def test_approve_commission_success(self, mock_log_activity, mock_update_status, mock_get_commission):
        """Test successful commission approval"""
        mock_get_commission.return_value = {
            'id': 100,
            'status': 'pending'
        }
        
        result = self.service.approve_commission(100, 1, 'Approved by admin')
        
        self.assertTrue(result['success'])
        self.assertEqual(result['commission_id'], 100)
        self.assertEqual(result['status'], 'approved')
        
        # Verify status was updated
        mock_update_status.assert_called_once()
        approval_data = mock_update_status.call_args[0][0]
        self.assertEqual(approval_data['commission_id'], 100)
        self.assertEqual(approval_data['status'], 'approved')
        self.assertEqual(approval_data['approved_by'], 1)
        self.assertEqual(approval_data['approval_notes'], 'Approved by admin')
    
    @patch('src.services.revenue_sharing.CommissionApprovalService.approve_commission')
    def test_bulk_approve_commissions(self, mock_approve):
        """Test bulk commission approval"""
        # Mock individual approvals
        mock_approve.side_effect = [
            {'success': True, 'commission_id': 1},
            {'success': False, 'error': 'Commission not found'},
            {'success': True, 'commission_id': 3}
        ]
        
        commission_ids = [1, 2, 3]
        result = self.service.bulk_approve_commissions(commission_ids, 1)
        
        self.assertTrue(result['success'])
        self.assertEqual(result['approved_count'], 2)
        self.assertEqual(result['failed_count'], 1)
        self.assertEqual(len(result['failed_approvals']), 1)
        self.assertEqual(result['failed_approvals'][0]['commission_id'], 2)


class TestFraudDetectionService(unittest.TestCase):
    """Test suite for FraudDetectionService"""
    
    def setUp(self):
        """Set up test fixtures"""
        self.service = FraudDetectionService()
    
    @patch('src.services.revenue_sharing.FraudDetectionService._get_recent_referrals')
    @patch('src.services.revenue_sharing.FraudDetectionService._group_referrals_by_hour')
    @patch('src.services.revenue_sharing.FraudDetectionService._count_referrals_by_ip')
    @patch('src.services.revenue_sharing.FraudDetectionService._calculate_conversion_rate')
    @patch('src.services.revenue_sharing.FraudDetectionService._calculate_payment_velocity')
    def test_analyze_referral_pattern_minimal_risk(self, mock_payment_velocity, mock_conversion_rate,
                                                  mock_ip_counts, mock_hourly_groups, mock_recent_referrals):
        """Test fraud analysis with minimal risk indicators"""
        mock_recent_referrals.return_value = []
        mock_hourly_groups.return_value = {'2024-01-01 10:00': 2}
        mock_ip_counts.return_value = {'192.168.1.1': 2}
        mock_conversion_rate.return_value = 15.0
        mock_payment_velocity.return_value = 25.0
        
        result = self.service.analyze_referral_pattern(1)
        
        self.assertEqual(result['affiliate_id'], 1)
        self.assertEqual(result['risk_level'], 'MINIMAL')
        self.assertEqual(result['risk_score'], 0)
        self.assertEqual(len(result['fraud_indicators']), 0)
        self.assertFalse(result['requires_review'])
    
    @patch('src.services.revenue_sharing.FraudDetectionService._get_recent_referrals')
    @patch('src.services.revenue_sharing.FraudDetectionService._group_referrals_by_hour')
    @patch('src.services.revenue_sharing.FraudDetectionService._count_referrals_by_ip')
    @patch('src.services.revenue_sharing.FraudDetectionService._calculate_conversion_rate')
    @patch('src.services.revenue_sharing.FraudDetectionService._calculate_payment_velocity')
    def test_analyze_referral_pattern_high_risk(self, mock_payment_velocity, mock_conversion_rate,
                                               mock_ip_counts, mock_hourly_groups, mock_recent_referrals):
        """Test fraud analysis with high risk indicators"""
        mock_recent_referrals.return_value = []
        mock_hourly_groups.return_value = {'2024-01-01 10:00': 15}  # Rapid signups
        mock_ip_counts.return_value = {'192.168.1.1': 10}  # Same IP
        mock_conversion_rate.return_value = 95.0  # High conversion
        mock_payment_velocity.return_value = 150.0  # High velocity
        
        result = self.service.analyze_referral_pattern(1)
        
        self.assertEqual(result['affiliate_id'], 1)
        self.assertEqual(result['risk_level'], 'HIGH')
        self.assertGreaterEqual(result['risk_score'], 70)
        self.assertGreater(len(result['fraud_indicators']), 0)
        self.assertTrue(result['requires_review'])
        
        # Check specific fraud indicators
        indicators = result['fraud_indicators']
        self.assertTrue(any('Rapid signups' in indicator for indicator in indicators))
        self.assertTrue(any('Multiple signups from same IP' in indicator for indicator in indicators))
        self.assertTrue(any('Unusually high conversion rate' in indicator for indicator in indicators))
        self.assertTrue(any('High payment velocity' in indicator for indicator in indicators))
    
    @patch('src.services.revenue_sharing.FraudDetectionService._create_fraud_flag')
    @patch('src.services.revenue_sharing.FraudDetectionService._suspend_affiliate_if_needed')
    @patch('src.services.revenue_sharing.FraudDetectionService._log_fraud_activity')
    def test_flag_suspicious_activity(self, mock_log_activity, mock_suspend, mock_create_flag):
        """Test flagging suspicious activity"""
        mock_create_flag.return_value = 500
        
        result = self.service.flag_suspicious_activity(1, 'Unusual referral pattern', 10)
        
        self.assertTrue(result['success'])
        self.assertEqual(result['flag_id'], 500)
        self.assertEqual(result['affiliate_id'], 1)
        
        # Verify flag was created
        mock_create_flag.assert_called_once()
        flag_data = mock_create_flag.call_args[0][0]
        self.assertEqual(flag_data['affiliate_id'], 1)
        self.assertEqual(flag_data['reason'], 'Unusual referral pattern')
        self.assertEqual(flag_data['flagged_by'], 10)


class TestWebhookIntegration(unittest.TestCase):
    """Test suite for webhook integration"""
    
    def setUp(self):
        """Set up test fixtures"""
        self.app = self.create_test_app()
        self.client = self.app.test_client()
    
    def create_test_app(self):
        """Create test Flask app"""
        from flask import Flask
        from src.routes.webhook import webhook_bp
        
        app = Flask(__name__)
        app.config['TESTING'] = True
        app.register_blueprint(webhook_bp, url_prefix='/api')
        
        return app
    
    @patch('src.routes.webhook.revenue_service.process_subscription_payment')
    @patch('src.routes.webhook.get_referral_by_user_id')
    def test_stripe_payment_success_webhook(self, mock_get_referral, mock_process_payment):
        """Test Stripe payment success webhook"""
        mock_process_payment.return_value = {
            'success': True,
            'commission_created': True,
            'commission_amount': 20.0
        }
        mock_get_referral.return_value = {'affiliate_id': 1}
        
        webhook_data = {
            'type': 'payment_intent.succeeded',
            'data': {
                'object': {
                    'id': 'pi_test123',
                    'amount': 10000,  # $100.00 in cents
                    'currency': 'usd',
                    'customer': 'cus_test123',
                    'metadata': {
                        'user_id': '123',
                        'subscription_type': 'premium'
                    }
                }
            }
        }
        
        response = self.client.post('/api/webhooks/stripe/payment-success',
                                  data=json.dumps(webhook_data),
                                  content_type='application/json')
        
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertEqual(data['message'], 'Payment processed successfully')
        self.assertTrue(data['commission_created'])
        self.assertEqual(data['commission_amount'], 20.0)
    
    @patch('src.routes.webhook.get_affiliate_by_referral_code')
    @patch('src.routes.webhook.create_referral_record')
    def test_user_registration_webhook(self, mock_create_referral, mock_get_affiliate):
        """Test user registration webhook with referral code"""
        mock_get_affiliate.return_value = {
            'id': 1,
            'status': 'active'
        }
        mock_create_referral.return_value = 100
        
        registration_data = {
            'user_id': 123,
            'referral_code': 'REF123',
            'ip_address': '192.168.1.1',
            'user_agent': 'Mozilla/5.0...'
        }
        
        response = self.client.post('/api/webhooks/user/registered',
                                  data=json.dumps(registration_data),
                                  content_type='application/json')
        
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertEqual(data['message'], 'Referral created successfully')
        self.assertEqual(data['referral_id'], 100)
        self.assertEqual(data['affiliate_id'], 1)


class TestEndToEndScenarios(unittest.TestCase):
    """End-to-end test scenarios for the affiliate program"""
    
    def setUp(self):
        """Set up test fixtures"""
        self.revenue_service = RevenueCalculationService()
        self.approval_service = CommissionApprovalService()
        self.fraud_service = FraudDetectionService()
    
    @patch('src.services.revenue_sharing.RevenueCalculationService._get_user_referral')
    @patch('src.services.revenue_sharing.RevenueCalculationService._create_commission_record')
    @patch('src.services.revenue_sharing.RevenueCalculationService._update_referral_conversion')
    @patch('src.services.revenue_sharing.RevenueCalculationService._should_auto_approve')
    @patch('src.services.revenue_sharing.RevenueCalculationService._approve_commission')
    def test_complete_referral_to_payout_flow(self, mock_approve, mock_auto_approve,
                                            mock_update_referral, mock_create_commission,
                                            mock_get_referral):
        """Test complete flow from referral to payout"""
        # Setup mocks
        mock_get_referral.return_value = {
            'id': 1,
            'affiliate_id': 10,
            'referred_user_id': 123
        }
        mock_create_commission.return_value = 100
        mock_auto_approve.return_value = True
        
        # Step 1: Process subscription payment
        payment_data = {
            'user_id': 123,
            'amount': 100.00,
            'subscription_type': 'premium',
            'payment_id': 'pay_test123'
        }
        
        result = self.revenue_service.process_subscription_payment(payment_data)
        
        # Verify commission was created and auto-approved
        self.assertTrue(result['success'])
        self.assertTrue(result['commission_created'])
        self.assertEqual(result['commission_amount'], 20.0)
        
        # Verify commission record was created with correct data
        mock_create_commission.assert_called_once()
        commission_data = mock_create_commission.call_args[0][0]
        self.assertEqual(commission_data['affiliate_id'], 10)
        self.assertEqual(commission_data['commission_amount'], 20.0)
        self.assertEqual(commission_data['status'], 'approved')
        
        # Verify auto-approval was triggered
        mock_approve.assert_called_once_with(100)
    
    def test_fraud_detection_integration(self):
        """Test fraud detection integration with commission processing"""
        # This would test the integration between fraud detection and commission approval
        # In a real scenario, high-risk affiliates would have their commissions held for review
        pass
    
    def test_refund_adjustment_scenario(self):
        """Test refund processing and commission adjustment"""
        # This would test the complete refund flow including commission adjustments
        pass


if __name__ == '__main__':
    # Create test suite
    test_suite = unittest.TestSuite()
    
    # Add test classes
    test_suite.addTest(unittest.makeSuite(TestRevenueCalculationService))
    test_suite.addTest(unittest.makeSuite(TestCommissionApprovalService))
    test_suite.addTest(unittest.makeSuite(TestFraudDetectionService))
    test_suite.addTest(unittest.makeSuite(TestWebhookIntegration))
    test_suite.addTest(unittest.makeSuite(TestEndToEndScenarios))
    
    # Run tests
    runner = unittest.TextTestRunner(verbosity=2)
    result = runner.run(test_suite)
    
    # Print summary
    print(f"\n{'='*50}")
    print(f"AFFILIATE PROGRAM TEST SUMMARY")
    print(f"{'='*50}")
    print(f"Tests run: {result.testsRun}")
    print(f"Failures: {len(result.failures)}")
    print(f"Errors: {len(result.errors)}")
    print(f"Success rate: {((result.testsRun - len(result.failures) - len(result.errors)) / result.testsRun * 100):.1f}%")
    
    if result.failures:
        print(f"\nFAILURES:")
        for test, traceback in result.failures:
            print(f"- {test}: {traceback}")
    
    if result.errors:
        print(f"\nERRORS:")
        for test, traceback in result.errors:
            print(f"- {test}: {traceback}")

