import React from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '../layout';
import './HomePage.css';

const HomePage = () => {
  return (
    <Layout>
      <div className="home-page">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-content">
            <h1 className="hero-title">Welcome to Zr3i</h1>
            <p className="hero-subtitle">
              Cutting-edge crop monitoring and management platform powered by Sentinel-2 satellite imagery
            </p>
            <p className="hero-description">
              Empower your agricultural practices with actionable insights derived from satellite data and 
              environmental monitoring. Make informed decisions, improve crop yields, reduce costs, and 
              promote sustainable farming practices.
            </p>
            <div className="hero-actions">
              <Link to="/fields" className="btn btn-primary">
                Manage Your Fields
              </Link>
              <Link to="/monitoring" className="btn btn-secondary">
                View Monitoring
              </Link>
            </div>
            
            {/* Social Media Registration */}
            <div className="social-registration">
              <p className="social-text">Quick Registration with Social Media:</p>
              <div className="social-buttons">
                <button className="social-btn facebook-btn">
                  <i className="fab fa-facebook-f"></i>
                  Continue with Facebook
                </button>
                <button className="social-btn google-btn">
                  <i className="fab fa-google"></i>
                  Continue with Google
                </button>
                <button className="social-btn linkedin-btn">
                  <i className="fab fa-linkedin-in"></i>
                  Continue with LinkedIn
                </button>
              </div>
            </div>
          </div>
          <div className="hero-image">
            <img src="/api/placeholder/600/400" alt="Satellite crop monitoring" />
          </div>
        </section>

        {/* Referral Program Section */}
        <section className="referral-section">
          <div className="container">
            <div className="referral-card">
              <h2 className="referral-title">🎁 Refer Friends & Earn Rewards</h2>
              <p className="referral-description">
                Share Zr3i with fellow farmers and earn exclusive benefits! For every successful referral, 
                both you and your friend receive premium features and discounts.
              </p>
              <div className="referral-benefits">
                <div className="benefit-item">
                  <span className="benefit-icon">💰</span>
                  <span>Earn $50 credit for each referral</span>
                </div>
                <div className="benefit-item">
                  <span className="benefit-icon">🎯</span>
                  <span>Your friend gets 30% off first subscription</span>
                </div>
                <div className="benefit-item">
                  <span className="benefit-icon">🏆</span>
                  <span>Unlock premium features early</span>
                </div>
              </div>
              <div className="referral-actions">
                <Link to="/affiliate/register" className="btn btn-primary">
                  Join Referral Program
                </Link>
                <button className="btn btn-outline share-btn">
                  <i className="fas fa-share-alt"></i>
                  Share Now
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Key Benefits Section */}
        <section className="benefits-section">
          <div className="container">
            <h2 className="section-title">Key Benefits of Zr3i</h2>
            <div className="benefits-grid">
              <div className="benefit-card">
                <div className="benefit-icon">📊</div>
                <h3>Improved Decision Making</h3>
                <p>
                  Gain access to timely and accurate data to make informed decisions about 
                  irrigation, fertilization, pest control, and harvesting.
                </p>
              </div>
              <div className="benefit-card">
                <div className="benefit-icon">💧</div>
                <h3>Optimized Resource Management</h3>
                <p>
                  Use insights from satellite imagery and weather data to optimize the use of 
                  water, fertilizers, and pesticides, leading to cost savings.
                </p>
              </div>
              <div className="benefit-card">
                <div className="benefit-icon">🌱</div>
                <h3>Increased Crop Yields</h3>
                <p>
                  Monitor crop health and identify potential issues early on, allowing for 
                  timely interventions to maximize yields.
                </p>
              </div>
              <div className="benefit-card">
                <div className="benefit-icon">⚠️</div>
                <h3>Risk Mitigation</h3>
                <p>
                  Assess and mitigate risks related to drought, floods, and other 
                  environmental factors affecting your crops.
                </p>
              </div>
              <div className="benefit-card">
                <div className="benefit-icon">🤝</div>
                <h3>Enhanced Collaboration</h3>
                <p>
                  Share data and insights with agronomists, consultants, and other 
                  stakeholders for better coordination.
                </p>
              </div>
              <div className="benefit-card">
                <div className="benefit-icon">📱</div>
                <h3>Anytime, Anywhere Access</h3>
                <p>
                  Monitor your fields and access critical information from anywhere using 
                  our mobile application.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Overview Section */}
        <section className="features-section">
          <div className="container">
            <h2 className="section-title">Core Features</h2>
            <div className="features-grid">
              <div className="feature-card">
                <h3>Field Management</h3>
                <p>
                  Define, track, and manage all your agricultural fields with precise 
                  boundary mapping and comprehensive field information.
                </p>
                <Link to="/fields" className="feature-link">
                  Manage Fields →
                </Link>
              </div>
              <div className="feature-card">
                <h3>Satellite Imagery</h3>
                <p>
                  Access high-resolution Sentinel-2 satellite imagery with vegetation 
                  indices and advanced analysis tools.
                </p>
                <Link to="/monitoring/satellite" className="feature-link">
                  View Imagery →
                </Link>
              </div>
              <div className="feature-card">
                <h3>Vegetation Indices</h3>
                <p>
                  Comprehensive spectral analysis with NDVI, EVI, SAVI, and 15+ other 
                  vegetation indices for precise crop monitoring.
                </p>
                <Link to="/monitoring/vegetation-indices" className="feature-link">
                  View Indices →
                </Link>
              </div>
              <div className="feature-card">
                <h3>Crop Health Analysis</h3>
                <p>
                  Monitor crop health with advanced algorithms that detect stress, 
                  disease, and growth patterns.
                </p>
                <Link to="/monitoring/crop-health" className="feature-link">
                  Analyze Health →
                </Link>
              </div>
              <div className="feature-card">
                <h3>Risk Assessment</h3>
                <p>
                  Comprehensive risk analysis for drought, floods, and other 
                  environmental factors affecting your crops.
                </p>
                <Link to="/monitoring/risk-analysis" className="feature-link">
                  Assess Risks →
                </Link>
              </div>
              <div className="feature-card">
                <h3>Reports & Analytics</h3>
                <p>
                  Generate detailed reports and analytics to track performance 
                  and make data-driven decisions.
                </p>
                <Link to="/monitoring/reports" className="feature-link">
                  View Reports →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Getting Started Section */}
        <section className="getting-started-section">
          <div className="container">
            <h2 className="section-title">Getting Started</h2>
            <div className="steps-grid">
              <div className="step-card">
                <div className="step-number">1</div>
                <h3>Add Your Fields</h3>
                <p>
                  Start by defining your field boundaries using our interactive mapping tools. 
                  This provides the foundation for all monitoring activities.
                </p>
              </div>
              <div className="step-card">
                <div className="step-number">2</div>
                <h3>Configure Monitoring</h3>
                <p>
                  Set up monitoring preferences for each field, including crop types, 
                  planting dates, and alert thresholds.
                </p>
              </div>
              <div className="step-card">
                <div className="step-number">3</div>
                <h3>Analyze & Act</h3>
                <p>
                  Review satellite imagery, weather data, and health analytics to make 
                  informed decisions about your crops.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Social Media & Community Section */}
        <section className="community-section">
          <div className="container">
            <h2 className="section-title">Join Our Community</h2>
            <p className="community-description">
              Connect with fellow farmers, get the latest updates, and share your success stories
            </p>
            <div className="social-links">
              <a 
                href="https://www.facebook.com/Zr3iCropMonitoring" 
                target="_blank" 
                rel="noopener noreferrer"
                className="social-link facebook"
              >
                <i className="fab fa-facebook-f"></i>
                <span>Follow us on Facebook</span>
                <small>Get daily tips and updates</small>
              </a>
              <a 
                href="https://www.linkedin.com/company/zr3i-crop-monitoring" 
                target="_blank" 
                rel="noopener noreferrer"
                className="social-link linkedin"
              >
                <i className="fab fa-linkedin-in"></i>
                <span>Connect on LinkedIn</span>
                <small>Professional agricultural insights</small>
              </a>
              <a 
                href="https://twitter.com/Zr3iMonitoring" 
                target="_blank" 
                rel="noopener noreferrer"
                className="social-link twitter"
              >
                <i className="fab fa-twitter"></i>
                <span>Follow on Twitter</span>
                <small>Real-time updates and news</small>
              </a>
              <a 
                href="https://www.youtube.com/c/Zr3iCropMonitoring" 
                target="_blank" 
                rel="noopener noreferrer"
                className="social-link youtube"
              >
                <i className="fab fa-youtube"></i>
                <span>Subscribe to YouTube</span>
                <small>Tutorials and case studies</small>
              </a>
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="cta-section">
          <div className="container">
            <div className="cta-content">
              <h2>Ready to Transform Your Farming?</h2>
              <p>
                Join thousands of farmers who are already using Zr3i to optimize their 
                agricultural practices and increase their yields.
              </p>
              <div className="cta-actions">
                <Link to="/fields/add" className="btn btn-primary">
                  Add Your First Field
                </Link>
                <Link to="/subscription/plans" className="btn btn-outline">
                  View Pricing Plans
                </Link>
              </div>
              <div className="cta-social-share">
                <p>Share Zr3i with your network:</p>
                <div className="share-buttons">
                  <button className="share-btn facebook" title="Share on Facebook">
                    <i className="fab fa-facebook-f"></i>
                  </button>
                  <button className="share-btn twitter" title="Share on Twitter">
                    <i className="fab fa-twitter"></i>
                  </button>
                  <button className="share-btn linkedin" title="Share on LinkedIn">
                    <i className="fab fa-linkedin-in"></i>
                  </button>
                  <button className="share-btn whatsapp" title="Share on WhatsApp">
                    <i className="fab fa-whatsapp"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default HomePage;

