import { useState } from 'react';
import { motion } from 'framer-motion';
import ReceiveQR from './ReceiveQR';
import authService from '../services/authService';
import './ProfilePage.css';

const ProfilePage = ({ user, onBack, onLogout }) => {
  const [showQR, setShowQR] = useState(false);
  const [copying, setCopying] = useState('');

  const copyToClipboard = async (text, type) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopying(type);
      setTimeout(() => setCopying(''), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const handleLogout = async () => {
    const confirmed = window.confirm('Are you sure you want to logout?');
    if (confirmed) {
      await authService.logout();
      onLogout();
    }
  };

  if (showQR) {
    return <ReceiveQR user={user} onBack={() => setShowQR(false)} />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="profile-page"
    >
      <div className="profile-header">
        <button className="back-btn" onClick={onBack}>
          ← Back
        </button>
        <h2>Profile</h2>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className="profile-content">
        {/* Profile Card */}
        <div className="profile-card">
          <div className="profile-avatar-section">
            <div className="profile-avatar-large">
              <img
                src={`https://ui-avatars.com/api/?name=${user?.name}&background=667eea&color=fff&size=120`}
                alt="Profile"
                className="avatar-image"
              />
            </div>
            <div className="profile-info">
              <h3>{user?.name}</h3>
              <p className="user-id">ID: {user?.userId}</p>
            </div>
          </div>

          <div className="profile-stats">
            <div className="stat-item">
              <div className="stat-value">{formatCurrency(user?.balance || 0)}</div>
              <div className="stat-label">Current Balance</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{user?.transactions?.length || 0}</div>
              <div className="stat-label">Transactions</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
              </div>
              <div className="stat-label">Member Since</div>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="info-section">
          <h4>Contact Information</h4>
          <div className="info-item">
            <div className="info-label">
              <span className="info-icon">📧</span>
              Email
            </div>
            <div className="info-value">
              <span>{user?.email}</span>
              <button
                className={`copy-btn ${copying === 'email' ? 'copied' : ''}`}
                onClick={() => copyToClipboard(user?.email, 'email')}
              >
                {copying === 'email' ? '✓' : '📋'}
              </button>
            </div>
          </div>

          <div className="info-item">
            <div className="info-label">
              <span className="info-icon">📱</span>
              Mobile
            </div>
            <div className="info-value">
              <span>+91 {user?.mobile}</span>
              <button
                className={`copy-btn ${copying === 'mobile' ? 'copied' : ''}`}
                onClick={() => copyToClipboard(`+91${user?.mobile}`, 'mobile')}
              >
                {copying === 'mobile' ? '✓' : '📋'}
              </button>
            </div>
          </div>
        </div>

        {/* Payment Information */}
        <div className="info-section">
          <h4>Payment Information</h4>
          <div className="info-item">
            <div className="info-label">
              <span className="info-icon">🔗</span>
              Payment Address
            </div>
            <div className="info-value">
              <span className="payment-address">{user?.qrAddress}</span>
              <button
                className={`copy-btn ${copying === 'address' ? 'copied' : ''}`}
                onClick={() => copyToClipboard(user?.qrAddress, 'address')}
              >
                {copying === 'address' ? '✓' : '📋'}
              </button>
            </div>
          </div>

          <div className="qr-section">
            <button className="show-qr-btn" onClick={() => setShowQR(true)}>
              <span className="qr-icon">📱</span>
              Show My QR Code
            </button>
          </div>
        </div>

        {/* Account Settings */}
        <div className="info-section">
          <h4>Account Settings</h4>
          <div className="settings-grid">
            <button className="setting-btn">
              <span className="setting-icon">🔐</span>
              <span>Change Password</span>
              <span className="arrow">→</span>
            </button>
            <button className="setting-btn">
              <span className="setting-icon">🔔</span>
              <span>Notifications</span>
              <span className="arrow">→</span>
            </button>
            <button className="setting-btn">
              <span className="setting-icon">🛡️</span>
              <span>Security</span>
              <span className="arrow">→</span>
            </button>
            <button className="setting-btn">
              <span className="setting-icon">❓</span>
              <span>Help & Support</span>
              <span className="arrow">→</span>
            </button>
          </div>
        </div>

        {/* Recent Transactions */}
        {user?.transactions && user.transactions.length > 0 && (
          <div className="info-section">
            <h4>Recent Transactions</h4>
            <div className="recent-transactions">
              {user.transactions.slice(0, 3).map((transaction) => (
                <div key={transaction.id} className="transaction-item">
                  <div className="transaction-icon">
                    {transaction.type === 'credit' ? '⬇️' : '⬆️'}
                  </div>
                  <div className="transaction-details">
                    <div className="transaction-description">
                      {transaction.description}
                    </div>
                    <div className="transaction-time">
                      {new Date(transaction.timestamp).toLocaleDateString()}
                    </div>
                  </div>
                  <div className={`transaction-amount ${transaction.type}`}>
                    {transaction.type === 'credit' ? '+' : '-'}
                    {formatCurrency(transaction.amount)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Account Actions */}
        <div className="account-actions">
          <button className="danger-btn" onClick={handleLogout}>
            <span className="danger-icon">🚪</span>
            Logout from ExePay
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProfilePage;
