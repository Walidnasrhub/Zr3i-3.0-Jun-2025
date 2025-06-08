import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import './AffiliateDashboardPage.css';

const AffiliateDashboardPage = () => {
  const [affiliateData, setAffiliateData] = useState(null);
  const [stats, setStats] = useState(null);
  const [referrals, setReferrals] = useState([]);
  const [payouts, setPayouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  // Mock affiliate ID - in real app, this would come from authentication
  const affiliateId = 1;

  useEffect(() => {
    fetchAffiliateData();
  }, []);

  const fetchAffiliateData = async () => {
    try {
      setLoading(true);
      
      // Fetch affiliate profile
      const affiliateResponse = await fetch(`/api/affiliates/${affiliateId}`);
      if (affiliateResponse.ok) {
        const affiliateResult = await affiliateResponse.json();
        setAffiliateData(affiliateResult.affiliate);
      }

      // Fetch affiliate stats
      const statsResponse = await fetch(`/api/affiliates/${affiliateId}/stats`);
      if (statsResponse.ok) {
        const statsResult = await statsResponse.json();
        setStats(statsResult.stats);
      }

      // Fetch referrals
      const referralsResponse = await fetch(`/api/referrals?affiliate_id=${affiliateId}&per_page=10`);
      if (referralsResponse.ok) {
        const referralsResult = await referralsResponse.json();
        setReferrals(referralsResult.referrals);
      }

      // Fetch payouts
      const payoutsResponse = await fetch(`/api/payouts?affiliate_id=${affiliateId}&per_page=10`);
      if (payoutsResponse.ok) {
        const payoutsResult = await payoutsResponse.json();
        setPayouts(payoutsResult.payouts);
      }

    } catch (err) {
      setError('Failed to load affiliate data');
    } finally {
      setLoading(false);
    }
  };

  const generateReferralLink = () => {
    if (affiliateData) {
      return `${window.location.origin}/register?ref=${affiliateData.referral_code}`;
    }
    return '';
  };

  const copyReferralLink = () => {
    const link = generateReferralLink();
    navigator.clipboard.writeText(link);
    alert('Referral link copied to clipboard!');
  };

  // Mock data for charts
  const monthlyData = [
    { month: 'Jan', referrals: 12, commissions: 240 },
    { month: 'Feb', referrals: 19, commissions: 380 },
    { month: 'Mar', referrals: 15, commissions: 300 },
    { month: 'Apr', referrals: 25, commissions: 500 },
    { month: 'May', referrals: 22, commissions: 440 },
    { month: 'Jun', referrals: 30, commissions: 600 },
  ];

  if (loading) {
    return (
      <div className="affiliate-dashboard-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="affiliate-dashboard-page">
        <div className="error-container">
          <p>{error}</p>
          <button onClick={fetchAffiliateData}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="affiliate-dashboard-page">
      <div className="container">
        <div className="dashboard-header">
          <h1>Affiliate Dashboard</h1>
          <div className="affiliate-info">
            <p>Welcome back, {affiliateData?.first_name} {affiliateData?.last_name}</p>
            <span className={`status-badge ${affiliateData?.status}`}>
              {affiliateData?.status?.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-content">
              <h3>Total Referrals</h3>
              <p className="stat-number">{stats?.total_referrals || 0}</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-content">
              <h3>Converted Referrals</h3>
              <p className="stat-number">{stats?.converted_referrals || 0}</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">📈</div>
            <div className="stat-content">
              <h3>Conversion Rate</h3>
              <p className="stat-number">{stats?.conversion_rate || 0}%</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">💰</div>
            <div className="stat-content">
              <h3>Total Earnings</h3>
              <p className="stat-number">${stats?.total_commission_earned || 0}</p>
            </div>
          </div>
        </div>

        {/* Referral Link Section */}
        <div className="referral-link-section">
          <h2>Your Referral Link</h2>
          <div className="referral-link-container">
            <input
              type="text"
              value={generateReferralLink()}
              readOnly
              className="referral-link-input"
            />
            <button onClick={copyReferralLink} className="copy-btn">
              Copy Link
            </button>
          </div>
          <p className="referral-code">
            Your referral code: <strong>{affiliateData?.referral_code}</strong>
          </p>
        </div>

        {/* Tabs */}
        <div className="dashboard-tabs">
          <button
            className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            className={`tab-btn ${activeTab === 'referrals' ? 'active' : ''}`}
            onClick={() => setActiveTab('referrals')}
          >
            Referrals
          </button>
          <button
            className={`tab-btn ${activeTab === 'payouts' ? 'active' : ''}`}
            onClick={() => setActiveTab('payouts')}
          >
            Payouts
          </button>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {activeTab === 'overview' && (
            <div className="overview-tab">
              <div className="charts-grid">
                <div className="chart-container">
                  <h3>Monthly Referrals</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="referrals" fill="#667eea" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="chart-container">
                  <h3>Monthly Commissions</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`$${value}`, 'Commission']} />
                      <Line type="monotone" dataKey="commissions" stroke="#764ba2" strokeWidth={3} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="commission-breakdown">
                <h3>Commission Breakdown</h3>
                <div className="commission-cards">
                  <div className="commission-card pending">
                    <h4>Pending</h4>
                    <p>${stats?.pending_commission || 0}</p>
                  </div>
                  <div className="commission-card approved">
                    <h4>Approved</h4>
                    <p>${stats?.approved_commission || 0}</p>
                  </div>
                  <div className="commission-card paid">
                    <h4>Paid</h4>
                    <p>${stats?.paid_commission || 0}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'referrals' && (
            <div className="referrals-tab">
              <h3>Recent Referrals</h3>
              <div className="table-container">
                <table className="referrals-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>User</th>
                      <th>Status</th>
                      <th>Commission</th>
                      <th>Conversion Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {referrals.map((referral) => (
                      <tr key={referral.id}>
                        <td>{new Date(referral.referred_at).toLocaleDateString()}</td>
                        <td>User #{referral.referred_user_id}</td>
                        <td>
                          <span className={`status-badge ${referral.commission_status}`}>
                            {referral.commission_status}
                          </span>
                        </td>
                        <td>${referral.commission_amount || 0}</td>
                        <td>
                          {referral.converted_at 
                            ? new Date(referral.converted_at).toLocaleDateString()
                            : '-'
                          }
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'payouts' && (
            <div className="payouts-tab">
              <h3>Payout History</h3>
              <div className="table-container">
                <table className="payouts-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Period</th>
                      <th>Amount</th>
                      <th>Referrals</th>
                      <th>Status</th>
                      <th>Method</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payouts.map((payout) => (
                      <tr key={payout.id}>
                        <td>{new Date(payout.created_at).toLocaleDateString()}</td>
                        <td>
                          {new Date(payout.payout_period_start).toLocaleDateString()} - 
                          {new Date(payout.payout_period_end).toLocaleDateString()}
                        </td>
                        <td>${payout.total_commission}</td>
                        <td>{payout.referral_count}</td>
                        <td>
                          <span className={`status-badge ${payout.payout_status}`}>
                            {payout.payout_status}
                          </span>
                        </td>
                        <td>{payout.payout_method}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AffiliateDashboardPage;

