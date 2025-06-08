from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import secrets
import string

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)

    def __repr__(self):
        return f'<User {self.username}>'

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email
        }

class Affiliate(db.Model):
    __tablename__ = 'affiliates'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True)
    email = db.Column(db.String(255), unique=True, nullable=False)
    first_name = db.Column(db.String(100), nullable=False)
    last_name = db.Column(db.String(100), nullable=False)
    company_name = db.Column(db.String(255), nullable=True)
    phone = db.Column(db.String(20), nullable=True)
    website = db.Column(db.String(255), nullable=True)
    referral_code = db.Column(db.String(50), unique=True, nullable=False)
    commission_rate = db.Column(db.Numeric(5, 2), default=20.00)
    status = db.Column(db.String(20), default='pending')  # pending, active, suspended, terminated
    payout_method = db.Column(db.String(50), default='bank_transfer')
    payout_details = db.Column(db.Text, nullable=True)  # JSON string
    tax_id = db.Column(db.String(50), nullable=True)
    address_line1 = db.Column(db.String(255), nullable=True)
    address_line2 = db.Column(db.String(255), nullable=True)
    city = db.Column(db.String(100), nullable=True)
    state = db.Column(db.String(100), nullable=True)
    postal_code = db.Column(db.String(20), nullable=True)
    country = db.Column(db.String(100), nullable=True)
    notes = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    user = db.relationship('User', backref='affiliate_profile')
    referrals = db.relationship('Referral', backref='affiliate', lazy=True, cascade='all, delete-orphan')
    payouts = db.relationship('CommissionPayout', backref='affiliate', lazy=True, cascade='all, delete-orphan')
    activity_logs = db.relationship('AffiliateActivityLog', backref='affiliate', lazy=True, cascade='all, delete-orphan')
    
    def __init__(self, **kwargs):
        super(Affiliate, self).__init__(**kwargs)
        if not self.referral_code:
            self.referral_code = self.generate_referral_code()
    
    @staticmethod
    def generate_referral_code(length=8):
        """Generate a unique referral code"""
        characters = string.ascii_uppercase + string.digits
        while True:
            code = ''.join(secrets.choice(characters) for _ in range(length))
            if not Affiliate.query.filter_by(referral_code=code).first():
                return code
    
    def __repr__(self):
        return f'<Affiliate {self.email}>'
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'email': self.email,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'company_name': self.company_name,
            'phone': self.phone,
            'website': self.website,
            'referral_code': self.referral_code,
            'commission_rate': float(self.commission_rate),
            'status': self.status,
            'payout_method': self.payout_method,
            'tax_id': self.tax_id,
            'address_line1': self.address_line1,
            'address_line2': self.address_line2,
            'city': self.city,
            'state': self.state,
            'postal_code': self.postal_code,
            'country': self.country,
            'notes': self.notes,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

class Subscription(db.Model):
    __tablename__ = 'subscriptions'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    plan_name = db.Column(db.String(100), nullable=False)
    amount = db.Column(db.Numeric(10, 2), nullable=False)
    currency = db.Column(db.String(3), default='USD')
    billing_cycle = db.Column(db.String(20), default='monthly')  # monthly, yearly
    status = db.Column(db.String(20), default='active')  # active, cancelled, expired
    started_at = db.Column(db.DateTime, default=datetime.utcnow)
    expires_at = db.Column(db.DateTime, nullable=True)
    cancelled_at = db.Column(db.DateTime, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    user = db.relationship('User', backref='subscriptions')
    referrals = db.relationship('Referral', backref='subscription', lazy=True)
    
    def __repr__(self):
        return f'<Subscription {self.plan_name} for User {self.user_id}>'
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'plan_name': self.plan_name,
            'amount': float(self.amount),
            'currency': self.currency,
            'billing_cycle': self.billing_cycle,
            'status': self.status,
            'started_at': self.started_at.isoformat() if self.started_at else None,
            'expires_at': self.expires_at.isoformat() if self.expires_at else None,
            'cancelled_at': self.cancelled_at.isoformat() if self.cancelled_at else None,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

class Referral(db.Model):
    __tablename__ = 'referrals'
    
    id = db.Column(db.Integer, primary_key=True)
    affiliate_id = db.Column(db.Integer, db.ForeignKey('affiliates.id'), nullable=False)
    referred_user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    subscription_id = db.Column(db.Integer, db.ForeignKey('subscriptions.id'), nullable=True)
    referral_source = db.Column(db.String(100), nullable=True)
    ip_address = db.Column(db.String(45), nullable=True)
    user_agent = db.Column(db.Text, nullable=True)
    utm_source = db.Column(db.String(100), nullable=True)
    utm_medium = db.Column(db.String(100), nullable=True)
    utm_campaign = db.Column(db.String(100), nullable=True)
    utm_content = db.Column(db.String(100), nullable=True)
    utm_term = db.Column(db.String(100), nullable=True)
    conversion_value = db.Column(db.Numeric(10, 2), nullable=True)
    commission_amount = db.Column(db.Numeric(10, 2), nullable=True)
    commission_status = db.Column(db.String(20), default='pending')  # pending, approved, paid, cancelled
    referred_at = db.Column(db.DateTime, default=datetime.utcnow)
    converted_at = db.Column(db.DateTime, nullable=True)
    approved_at = db.Column(db.DateTime, nullable=True)
    paid_at = db.Column(db.DateTime, nullable=True)
    notes = db.Column(db.Text, nullable=True)
    
    # Relationships
    referred_user = db.relationship('User', backref='referrals')
    payout_line_items = db.relationship('PayoutLineItem', backref='referral', lazy=True, cascade='all, delete-orphan')
    
    def __repr__(self):
        return f'<Referral {self.id} by Affiliate {self.affiliate_id}>'
    
    def calculate_commission(self):
        """Calculate commission based on conversion value and affiliate commission rate"""
        if self.conversion_value and self.affiliate:
            commission_rate = self.affiliate.commission_rate / 100
            self.commission_amount = self.conversion_value * commission_rate
            return self.commission_amount
        return 0
    
    def to_dict(self):
        return {
            'id': self.id,
            'affiliate_id': self.affiliate_id,
            'referred_user_id': self.referred_user_id,
            'subscription_id': self.subscription_id,
            'referral_source': self.referral_source,
            'ip_address': self.ip_address,
            'user_agent': self.user_agent,
            'utm_source': self.utm_source,
            'utm_medium': self.utm_medium,
            'utm_campaign': self.utm_campaign,
            'utm_content': self.utm_content,
            'utm_term': self.utm_term,
            'conversion_value': float(self.conversion_value) if self.conversion_value else None,
            'commission_amount': float(self.commission_amount) if self.commission_amount else None,
            'commission_status': self.commission_status,
            'referred_at': self.referred_at.isoformat() if self.referred_at else None,
            'converted_at': self.converted_at.isoformat() if self.converted_at else None,
            'approved_at': self.approved_at.isoformat() if self.approved_at else None,
            'paid_at': self.paid_at.isoformat() if self.paid_at else None,
            'notes': self.notes
        }

class CommissionPayout(db.Model):
    __tablename__ = 'commission_payouts'
    
    id = db.Column(db.Integer, primary_key=True)
    affiliate_id = db.Column(db.Integer, db.ForeignKey('affiliates.id'), nullable=False)
    payout_period_start = db.Column(db.Date, nullable=False)
    payout_period_end = db.Column(db.Date, nullable=False)
    total_commission = db.Column(db.Numeric(10, 2), nullable=False)
    referral_count = db.Column(db.Integer, nullable=False)
    payout_method = db.Column(db.String(50), nullable=False)
    payout_reference = db.Column(db.String(255), nullable=True)
    payout_status = db.Column(db.String(20), default='pending')  # pending, processing, completed, failed
    payout_date = db.Column(db.DateTime, nullable=True)
    failure_reason = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    line_items = db.relationship('PayoutLineItem', backref='payout', lazy=True, cascade='all, delete-orphan')
    
    def __repr__(self):
        return f'<CommissionPayout {self.id} for Affiliate {self.affiliate_id}>'
    
    def to_dict(self):
        return {
            'id': self.id,
            'affiliate_id': self.affiliate_id,
            'payout_period_start': self.payout_period_start.isoformat() if self.payout_period_start else None,
            'payout_period_end': self.payout_period_end.isoformat() if self.payout_period_end else None,
            'total_commission': float(self.total_commission),
            'referral_count': self.referral_count,
            'payout_method': self.payout_method,
            'payout_reference': self.payout_reference,
            'payout_status': self.payout_status,
            'payout_date': self.payout_date.isoformat() if self.payout_date else None,
            'failure_reason': self.failure_reason,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

class PayoutLineItem(db.Model):
    __tablename__ = 'payout_line_items'
    
    id = db.Column(db.Integer, primary_key=True)
    payout_id = db.Column(db.Integer, db.ForeignKey('commission_payouts.id'), nullable=False)
    referral_id = db.Column(db.Integer, db.ForeignKey('referrals.id'), nullable=False)
    commission_amount = db.Column(db.Numeric(10, 2), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Unique constraint to prevent duplicate line items
    __table_args__ = (db.UniqueConstraint('payout_id', 'referral_id', name='unique_payout_referral'),)
    
    def __repr__(self):
        return f'<PayoutLineItem {self.id}>'
    
    def to_dict(self):
        return {
            'id': self.id,
            'payout_id': self.payout_id,
            'referral_id': self.referral_id,
            'commission_amount': float(self.commission_amount),
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class AffiliateMarketingMaterial(db.Model):
    __tablename__ = 'affiliate_marketing_materials'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=True)
    material_type = db.Column(db.String(50), nullable=False)  # banner, email_template, social_post, video, etc.
    file_url = db.Column(db.String(500), nullable=True)
    thumbnail_url = db.Column(db.String(500), nullable=True)
    dimensions = db.Column(db.String(20), nullable=True)  # e.g., "300x250"
    file_size = db.Column(db.Integer, nullable=True)  # in bytes
    download_count = db.Column(db.Integer, default=0)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def __repr__(self):
        return f'<AffiliateMarketingMaterial {self.title}>'
    
    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'material_type': self.material_type,
            'file_url': self.file_url,
            'thumbnail_url': self.thumbnail_url,
            'dimensions': self.dimensions,
            'file_size': self.file_size,
            'download_count': self.download_count,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

class AffiliateActivityLog(db.Model):
    __tablename__ = 'affiliate_activity_log'
    
    id = db.Column(db.Integer, primary_key=True)
    affiliate_id = db.Column(db.Integer, db.ForeignKey('affiliates.id'), nullable=False)
    activity_type = db.Column(db.String(50), nullable=False)  # registration, login, referral, commission_earned, etc.
    description = db.Column(db.Text, nullable=True)
    activity_metadata = db.Column(db.Text, nullable=True)  # JSON string
    ip_address = db.Column(db.String(45), nullable=True)
    user_agent = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def __repr__(self):
        return f'<AffiliateActivityLog {self.activity_type} for Affiliate {self.affiliate_id}>'
    
    def to_dict(self):
        return {
            'id': self.id,
            'affiliate_id': self.affiliate_id,
            'activity_type': self.activity_type,
            'description': self.description,
            'activity_metadata': self.activity_metadata,
            'ip_address': self.ip_address,
            'user_agent': self.user_agent,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

