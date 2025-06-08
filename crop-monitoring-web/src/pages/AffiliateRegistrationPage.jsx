import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AffiliateRegistrationPage.css';

const AffiliateRegistrationPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    first_name: '',
    last_name: '',
    company_name: '',
    phone: '',
    website: '',
    tax_id: '',
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    postal_code: '',
    country: '',
    payout_method: 'bank_transfer',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/affiliates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Affiliate application submitted successfully! You will receive an email once your application is reviewed.');
        setTimeout(() => {
          navigate('/affiliate/dashboard');
        }, 3000);
      } else {
        setError(data.error || 'Failed to submit application');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="affiliate-registration-page">
      <div className="container">
        <div className="registration-header">
          <h1>Join the Zr3i Affiliate Program</h1>
          <p>Earn 20% commission on every subscription you refer</p>
        </div>

        <div className="program-benefits">
          <h2>Why Join Our Affiliate Program?</h2>
          <div className="benefits-grid">
            <div className="benefit-card">
              <div className="benefit-icon">💰</div>
              <h3>20% Commission</h3>
              <p>Earn 20% of every subscription payment from your referrals</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">📈</div>
              <h3>Growing Market</h3>
              <p>Agricultural technology is a rapidly expanding market</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">🎯</div>
              <h3>Marketing Support</h3>
              <p>Access to promotional materials and marketing resources</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">📊</div>
              <h3>Real-time Tracking</h3>
              <p>Monitor your referrals and earnings in real-time</p>
            </div>
          </div>
        </div>

        <div className="registration-form-container">
          <h2>Affiliate Application Form</h2>
          
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          <form onSubmit={handleSubmit} className="registration-form">
            <div className="form-section">
              <h3>Personal Information</h3>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="first_name">First Name *</label>
                  <input
                    type="text"
                    id="first_name"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="last_name">Last Name *</label>
                  <input
                    type="text"
                    id="last_name"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Email Address *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="company_name">Company Name</label>
                  <input
                    type="text"
                    id="company_name"
                    name="company_name"
                    value={formData.company_name}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="website">Website</label>
                <input
                  type="url"
                  id="website"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  placeholder="https://your-website.com"
                />
              </div>
            </div>

            <div className="form-section">
              <h3>Address Information</h3>
              <div className="form-group">
                <label htmlFor="address_line1">Address Line 1</label>
                <input
                  type="text"
                  id="address_line1"
                  name="address_line1"
                  value={formData.address_line1}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="address_line2">Address Line 2</label>
                <input
                  type="text"
                  id="address_line2"
                  name="address_line2"
                  value={formData.address_line2}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="city">City</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="state">State/Province</label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="postal_code">Postal Code</label>
                  <input
                    type="text"
                    id="postal_code"
                    name="postal_code"
                    value={formData.postal_code}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="country">Country</label>
                  <input
                    type="text"
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3>Payment Information</h3>
              <div className="form-group">
                <label htmlFor="payout_method">Preferred Payout Method</label>
                <select
                  id="payout_method"
                  name="payout_method"
                  value={formData.payout_method}
                  onChange={handleInputChange}
                >
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="paypal">PayPal</option>
                  <option value="stripe">Stripe</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="tax_id">Tax ID (Optional)</label>
                <input
                  type="text"
                  id="tax_id"
                  name="tax_id"
                  value={formData.tax_id}
                  onChange={handleInputChange}
                  placeholder="For tax reporting purposes"
                />
              </div>
            </div>

            <div className="form-section">
              <h3>Additional Information</h3>
              <div className="form-group">
                <label htmlFor="notes">Tell us about yourself and your marketing experience</label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows="4"
                  placeholder="Describe your marketing channels, audience, and experience..."
                />
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" disabled={loading} className="submit-btn">
                {loading ? 'Submitting...' : 'Submit Application'}
              </button>
            </div>
          </form>
        </div>

        <div className="program-terms">
          <h3>Program Terms</h3>
          <ul>
            <li>20% commission on all referred subscription payments</li>
            <li>Commissions are paid monthly for approved referrals</li>
            <li>Minimum payout threshold of $50</li>
            <li>Referrals must result in active subscriptions to earn commission</li>
            <li>Self-referrals and fraudulent activities are prohibited</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AffiliateRegistrationPage;

