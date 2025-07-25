import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import QRScanner from './QRScanner';
import ProfilePage from './ProfilePage';
import ReceiveQR from './ReceiveQR';
import PaymentProcessor from './PaymentProcessor';
import authService from '../services/authService';
import './Dashboard.css';

const Dashboard = ({ user, onLogout }) => {
  const [activeView, setActiveView] = useState('home');
  const [balance, setBalance] = useState(user?.balance || 0);
  const [transactions, setTransactions] = useState(user?.transactions || []);
  const [scannedQR, setScannedQR] = useState(null);
  const [showPayment, setShowPayment] = useState(false);

  useEffect(() => {
    // Update balance and transactions when user data changes
    if (user) {
      setBalance(user.balance || 0);
      setTransactions(user.transactions || []);
    }
  }, [user]);

  const handleQRScan = (qrData) => {
    setScannedQR(qrData);
    setShowPayment(true);
  };

  const handlePaymentComplete = async (paymentData) => {
    try {
      const result = await authService.sendMoney(
        paymentData.recipientQR,
        paymentData.amount,
        paymentData.description
      );

      if (result.success) {
        setBalance(result.balance);
        setTransactions(prev => [result.transaction, ...prev]);
        setShowPayment(false);
        setScannedQR(null);
        // Show success message
        alert('Payment successful!');
      } else {
        alert('Payment failed: ' + result.error);
      }
    } catch (error) {
      alert('Payment error: ' + error.message);
    }
  };

  const handleAddMoney = async (amount) => {
    try {
      const result = await authService.addMoney(amount);
      if (result.success) {
        setBalance(result.balance);
        setTransactions(prev => [result.transaction, ...prev]);
        alert('Money added successfully!');
      } else {
        alert('Failed to add money: ' + result.error);
      }
    } catch (error) {
      alert('Error adding money: ' + error.message);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const renderContent = () => {
    switch (activeView) {
      case 'scan':
        return <QRScanner onQRScan={handleQRScan} onBack={() => setActiveView('home')} />;
      case 'profile':
        return <ProfilePage user={user} onBack={() => setActiveView('home')} onLogout={onLogout} />;
      case 'receive':
        return <ReceiveQR user={user} onBack={() => setActiveView('home')} />;
      default:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="home-view"
          >
            {/* Premium Balance Card */}
            <div className="balance-card-premium">
              <div className="balance-content">
                <div className="balance-header">
                  <div className="balance-info">
                    <span className="balance-label">Available Balance</span>
                    <div className="balance-amount">
                      {formatCurrency(balance)}
                    </div>
                    <div className="balance-actions">
                      <motion.button
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        className="add-money-btn-professional"
                        onClick={() => handleAddMoney(100)}
                      >
                        <div className="btn-icon-container">
                          <svg viewBox="0 0 24 24" fill="currentColor" className="btn-icon-svg">
                            <path d="M12 2v20M2 12h20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                          </svg>
                        </div>
                        <span className="btn-text">Add Money</span>
                      </motion.button>
                    </div>
                  </div>
                  <button
                    className="profile-btn-premium"
                    onClick={() => setActiveView('profile')}
                  >
                    <div className="profile-avatar-premium">
                      {user?.name?.charAt(0).toUpperCase()}
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* Premium Action Grid */}
    <div className="action-grid-extension">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="action-btn-extension scan-btn"
        onClick={() => setActiveView('scan')}
      >
        <div className="btn-content">
          <div className="icon-container">
            <svg viewBox="0 0 24 24" fill="none" className="btn-icon">
              <path 
                d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
              <rect x="7" y="7" width="10" height="10" rx="1" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </div>
          <span className="btn-text">Scan QR</span>
        </div>
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="action-btn-extension receive-btn"
        onClick={() => setActiveView('receive')}
      >
        <div className="btn-content">
          <div className="icon-container">
            <svg viewBox="0 0 24 24" fill="none" className="btn-icon">
              <path 
                d="M12 5v14M5 12l7 7 7-7" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
              <path 
                d="M3 17h18v3a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-3z" 
                stroke="currentColor" 
                strokeWidth="2"
              />
            </svg>
          </div>
          <span className="btn-text">Receive</span>
        </div>
      </motion.button>
    </div>

            {/* Premium Transactions Section */}
            <div className="transactions-section-premium">
              <div className="section-header">
                <h3 className="section-title">Recent Activity</h3>
                <button className="view-all-btn">View All</button>
              </div>
              
              {transactions.length === 0 ? (
                <div className="no-transactions-premium">
                  <div className="empty-state">
                    <div className="empty-icon">💳</div>
                    <div className="empty-content">
                      <h4>No transactions yet</h4>
                      <p>Your payment history will appear here</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="transactions-list-premium">
                  {transactions.slice(0, 4).map((transaction, index) => (
                    <motion.div
                      key={transaction.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="transaction-card-premium"
                    >
                      <div className="transaction-left">
                        <div className={`transaction-icon-premium ${transaction.type}`}>
                          <span className="transaction-symbol">
                            {transaction.type === 'credit' ? '↓' : '↑'}
                          </span>
                        </div>
                        <div className="transaction-info">
                          <div className="transaction-title">
                            {transaction.description}
                          </div>
                          <div className="transaction-date">
                            {new Date(transaction.timestamp).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                        </div>
                      </div>
                      <div className="transaction-right">
                        <div className={`transaction-amount-premium ${transaction.type}`}>
                          {transaction.type === 'credit' ? '+' : '-'}
                          {formatCurrency(transaction.amount)}
                        </div>
                        <div className="transaction-status">
                          <span className="status-dot completed"></span>
                          <span className="status-text">Completed</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        );
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header-premium">
        <div className="header-content">
          <div className="app-brand">
            <div className="brand-icon">■</div>
            <span className="brand-name">ExePay</span>
          </div>
          <div className="header-user">
            <span className="user-greeting">Hi, {user?.name?.split(' ')[0]}!</span>
            <div className="notification-indicator">
              <span className="notification-dot"></span>
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <AnimatePresence mode="wait">
          {renderContent()}
        </AnimatePresence>
      </div>

      {/* Payment Modal */}
      <AnimatePresence>
        {showPayment && scannedQR && (
          <PaymentProcessor
            qrData={scannedQR}
            userBalance={balance}
            onPayment={handlePaymentComplete}
            onCancel={() => {
              setShowPayment(false);
              setScannedQR(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;
