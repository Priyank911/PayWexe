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
            {/* Balance Card */}
            <div className="balance-card">
              <div className="balance-header">
                <h2>Current Balance</h2>
                <button
                  className="profile-btn"
                  onClick={() => setActiveView('profile')}
                >
                  <img
                    src={`https://ui-avatars.com/api/?name=${user?.name}&background=667eea&color=fff&size=32`}
                    alt="Profile"
                    className="profile-avatar"
                  />
                </button>
              </div>
              <div className="balance-amount">
                {formatCurrency(balance)}
              </div>
              <button
                className="add-money-btn"
                onClick={() => handleAddMoney(100)}
              >
                + Add Money
              </button>
            </div>

            {/* Action Buttons */}
            <div className="action-buttons">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="action-btn scan-btn"
                onClick={() => setActiveView('scan')}
              >
                <div className="action-icon">⚡</div>
                <span>Scan QR</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="action-btn send-btn"
                onClick={() => setActiveView('receive')}
              >
                <div className="action-icon">↓</div>
                <span>Receive</span>
              </motion.button>
            </div>

            {/* Recent Transactions */}
            <div className="transactions-section">
              <h3>Recent Transactions</h3>
              {transactions.length === 0 ? (
                <div className="no-transactions">
                  <p>No transactions yet</p>
                  <p className="empty-subtitle">Your payment history will appear here</p>
                </div>
              ) : (
                <div className="transactions-list">
                  {transactions.slice(0, 5).map((transaction) => (
                    <motion.div
                      key={transaction.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="transaction-item"
                    >
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
      <div className="dashboard-header">
        <div className="header-left">
          <div className="app-logo">
            <span className="logo-icon">■</span>
            <span className="app-name">ExePay</span>
          </div>
        </div>
        <div className="header-right">
          <span className="user-greeting">Hi, {user?.name?.split(' ')[0]}!</span>
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
