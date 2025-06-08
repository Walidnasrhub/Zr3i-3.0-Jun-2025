# Database Schema Design for Zr3i 3.0 Affiliate Program

## Overview

This document outlines the database schema design for implementing the affiliate program with 20% revenue sharing for referred subscriptions in the Zr3i 3.0 platform. The schema is designed to support comprehensive affiliate management, accurate referral tracking, commission calculations, and payout processing.

## Core Tables

### 1. Affiliates Table

The `affiliates` table stores information about registered affiliate partners.

```sql
CREATE TABLE affiliates (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,  -- Reference to existing user if affiliate is also a platform user
    email VARCHAR(255) NOT NULL UNIQUE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    company_name VARCHAR(255),
    phone VARCHAR(20),
    website VARCHAR(255),
    referral_code VARCHAR(50) NOT NULL UNIQUE,
    commission_rate DECIMAL(5,2) DEFAULT 20.00,  -- Default 20% commission
    status VARCHAR(20) DEFAULT 'pending',  -- pending, active, suspended, terminated
    payout_method VARCHAR(50) DEFAULT 'bank_transfer',  -- bank_transfer, paypal, stripe
    payout_details TEXT,  -- JSON string with payout account details
    tax_id VARCHAR(50),
    address_line1 VARCHAR(255),
    address_line2 VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(100),
    postal_code VARCHAR(20),
    country VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);
```

### 2. Referrals Table

The `referrals` table tracks all referral activities and links them to subscriptions.

```sql
CREATE TABLE referrals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    affiliate_id INTEGER NOT NULL,
    referred_user_id INTEGER NOT NULL,
    subscription_id INTEGER,  -- Links to subscription when user subscribes
    referral_source VARCHAR(100),  -- web, mobile, direct_link, social_media, etc.
    ip_address VARCHAR(45),
    user_agent TEXT,
    utm_source VARCHAR(100),
    utm_medium VARCHAR(100),
    utm_campaign VARCHAR(100),
    utm_content VARCHAR(100),
    utm_term VARCHAR(100),
    conversion_value DECIMAL(10,2),  -- Subscription amount
    commission_amount DECIMAL(10,2),  -- Calculated commission (20% of conversion_value)
    commission_status VARCHAR(20) DEFAULT 'pending',  -- pending, approved, paid, cancelled
    referred_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    converted_at TIMESTAMP,  -- When user actually subscribed
    approved_at TIMESTAMP,  -- When commission was approved
    paid_at TIMESTAMP,  -- When commission was paid
    notes TEXT,
    FOREIGN KEY (affiliate_id) REFERENCES affiliates(id) ON DELETE CASCADE,
    FOREIGN KEY (referred_user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (subscription_id) REFERENCES subscriptions(id) ON DELETE SET NULL
);
```

### 3. Commission Payouts Table

The `commission_payouts` table manages batch payouts to affiliates.

```sql
CREATE TABLE commission_payouts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    affiliate_id INTEGER NOT NULL,
    payout_period_start DATE NOT NULL,
    payout_period_end DATE NOT NULL,
    total_commission DECIMAL(10,2) NOT NULL,
    referral_count INTEGER NOT NULL,
    payout_method VARCHAR(50) NOT NULL,
    payout_reference VARCHAR(255),  -- Transaction ID or reference number
    payout_status VARCHAR(20) DEFAULT 'pending',  -- pending, processing, completed, failed
    payout_date TIMESTAMP,
    failure_reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (affiliate_id) REFERENCES affiliates(id) ON DELETE CASCADE
);
```

### 4. Payout Line Items Table

The `payout_line_items` table links individual referrals to specific payouts.

```sql
CREATE TABLE payout_line_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    payout_id INTEGER NOT NULL,
    referral_id INTEGER NOT NULL,
    commission_amount DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (payout_id) REFERENCES commission_payouts(id) ON DELETE CASCADE,
    FOREIGN KEY (referral_id) REFERENCES referrals(id) ON DELETE CASCADE,
    UNIQUE(payout_id, referral_id)
);
```

### 5. Affiliate Marketing Materials Table

The `affiliate_marketing_materials` table stores promotional materials for affiliates.

```sql
CREATE TABLE affiliate_marketing_materials (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    material_type VARCHAR(50) NOT NULL,  -- banner, email_template, social_post, video, etc.
    file_url VARCHAR(500),
    thumbnail_url VARCHAR(500),
    dimensions VARCHAR(20),  -- e.g., "300x250" for banners
    file_size INTEGER,  -- in bytes
    download_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 6. Affiliate Activity Log Table

The `affiliate_activity_log` table tracks important events and activities.

```sql
CREATE TABLE affiliate_activity_log (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    affiliate_id INTEGER NOT NULL,
    activity_type VARCHAR(50) NOT NULL,  -- registration, login, referral, commission_earned, payout_requested, etc.
    description TEXT,
    metadata TEXT,  -- JSON string with additional data
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (affiliate_id) REFERENCES affiliates(id) ON DELETE CASCADE
);
```

## Indexes for Performance

```sql
-- Indexes for better query performance
CREATE INDEX idx_affiliates_referral_code ON affiliates(referral_code);
CREATE INDEX idx_affiliates_status ON affiliates(status);
CREATE INDEX idx_affiliates_email ON affiliates(email);

CREATE INDEX idx_referrals_affiliate_id ON referrals(affiliate_id);
CREATE INDEX idx_referrals_referred_user_id ON referrals(referred_user_id);
CREATE INDEX idx_referrals_subscription_id ON referrals(subscription_id);
CREATE INDEX idx_referrals_commission_status ON referrals(commission_status);
CREATE INDEX idx_referrals_referred_at ON referrals(referred_at);
CREATE INDEX idx_referrals_converted_at ON referrals(converted_at);

CREATE INDEX idx_commission_payouts_affiliate_id ON commission_payouts(affiliate_id);
CREATE INDEX idx_commission_payouts_status ON commission_payouts(payout_status);
CREATE INDEX idx_commission_payouts_period ON commission_payouts(payout_period_start, payout_period_end);

CREATE INDEX idx_payout_line_items_payout_id ON payout_line_items(payout_id);
CREATE INDEX idx_payout_line_items_referral_id ON payout_line_items(referral_id);

CREATE INDEX idx_affiliate_activity_log_affiliate_id ON affiliate_activity_log(affiliate_id);
CREATE INDEX idx_affiliate_activity_log_activity_type ON affiliate_activity_log(activity_type);
CREATE INDEX idx_affiliate_activity_log_created_at ON affiliate_activity_log(created_at);
```

## Integration with Existing Schema

The affiliate program schema integrates with the existing Zr3i 3.0 database through foreign key relationships:

1. **Users Table**: The `affiliates.user_id` and `referrals.referred_user_id` reference the existing `users` table.
2. **Subscriptions Table**: The `referrals.subscription_id` references the existing `subscriptions` table to link referrals to actual paid subscriptions.

## Data Flow and Relationships

1. **Affiliate Registration**: New affiliates are created in the `affiliates` table with a unique `referral_code`.
2. **Referral Tracking**: When a user signs up via an affiliate link/code, a record is created in the `referrals` table.
3. **Conversion Tracking**: When the referred user subscribes, the `referrals` record is updated with `subscription_id`, `conversion_value`, and `commission_amount`.
4. **Commission Approval**: Commissions move from 'pending' to 'approved' status after validation.
5. **Payout Processing**: Approved commissions are batched into `commission_payouts` with corresponding `payout_line_items`.

This schema provides a robust foundation for the affiliate program while maintaining data integrity and supporting efficient queries for reporting and analytics.

