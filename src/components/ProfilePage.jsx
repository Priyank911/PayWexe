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
      className="profile-page-professional"
    >
      {/* Professional Header */}
      <div className="profile-header-professional">
        <button className="back-btn-professional" onClick={onBack}>
          <svg viewBox="0 0 24 24" fill="none" className="back-icon">
            <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <h2 className="profile-title">Account</h2>
        <button className="logout-btn-professional" onClick={handleLogout}>
          <svg viewBox="0 0 24 24" fill="none" className="logout-icon">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      <div className="profile-content-professional">
        {/* Professional Profile Section */}
        <div className="profile-card-professional">
          <div className="profile-avatar-professional">
            <span className="avatar-letter">{user?.name?.charAt(0).toUpperCase()}</span>
            <div className="avatar-glow"></div>
          </div>
          <div className="profile-details">
            <h3 className="profile-name">{user?.name}</h3>
            <div className="profile-id-container">
              <span className="id-label">ID:</span>
              <span className="profile-id">{user?.userId}</span>
            </div>
          </div>
        </div>

        {/* Professional Balance Display */}
        <div className="balance-display-professional">
          <div className="balance-icon-container">
            <svg viewBox="0 0 24 24" fill="none" className="balance-icon">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="balance-amount-professional">
            {formatCurrency(user?.balance || 0)}
          </div>
          <div className="balance-label-professional">Available Balance</div>
        </div>

        {/* Professional Action Buttons */}
        <div className="profile-actions-professional">
          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="action-btn-professional primary"
            onClick={() => setShowQR(true)}
          >
            <div className="btn-icon-container">
              <svg viewBox="0 0 24 24" fill="none" className="action-icon">
                <rect x="3" y="3" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.1"/>
                <rect x="13" y="3" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.1"/>
                <rect x="3" y="13" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.1"/>
                <rect x="13" y="16" width="2" height="2" fill="currentColor"/>
                <rect x="16" y="13" width="2" height="2" fill="currentColor"/>
                <rect x="19" y="16" width="2" height="2" fill="currentColor"/>
                <rect x="16" y="19" width="2" height="2" fill="currentColor"/>
                <path d="M13 21h2M19 13v2M21 19h-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <div className="btn-content">
              <span className="btn-title">Receive Payment</span>
              <span className="btn-subtitle">Show QR Code</span>
            </div>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="action-btn-professional secondary"
            onClick={() => copyToClipboard(user?.email, 'email')}
          >
            <div className="btn-icon-container">
              <svg viewBox="0 0 24 24" fill="none" className="action-icon">
                <rect x="9" y="9" width="13" height="13" rx="2" stroke="currentColor" strokeWidth="2"/>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" stroke="currentColor" strokeWidth="2"/>
                <path d="M12 12l3 3M15 12l-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <div className="btn-content">
              <span className="btn-title">{copying === 'email' ? 'Copied!' : 'Copy Email'}</span>
              <span className="btn-subtitle">{copying === 'email' ? 'Email copied to clipboard' : 'Copy to clipboard'}</span>
            </div>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProfilePage;
