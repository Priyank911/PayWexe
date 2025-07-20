import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import qrService from '../services/qrService';
import './ReceiveQR.css';

const ReceiveQR = ({ user, onBack }) => {
  const [qrCode, setQrCode] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [qrImage, setQrImage] = useState('');
  const [copying, setCopying] = useState(false);

  useEffect(() => {
    generateQR();
  }, [amount, description]);

  const generateQR = async () => {
    try {
      const qrData = qrService.generateReceiveQR(
        user.userId,
        amount ? parseFloat(amount) : null
      );
      setQrCode(qrData);
      
      // Generate QR image
      const qrImageData = await qrService.generateQRCodeImage(qrData);
      setQrImage(qrImageData);
    } catch (error) {
      console.error('Error generating QR:', error);
    }
  };

  const handleAmountChange = (e) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setAmount(value);
    }
  };

  const copyQRData = async () => {
    try {
      await navigator.clipboard.writeText(qrCode);
      setCopying(true);
      setTimeout(() => setCopying(false), 2000);
    } catch (error) {
      console.error('Failed to copy QR data:', error);
    }
  };

  const shareQR = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'ExePay Payment QR',
          text: `Pay to ${user.name} via ExePay`,
          url: qrCode
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback to copying
      copyQRData();
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(value || 0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="receive-qr"
    >
      <div className="receive-header">
        <button className="back-btn" onClick={onBack}>
          ← Back
        </button>
        <h2>Receive Money</h2>
      </div>

      <div className="receive-content">
        {/* User Info */}
        <div className="receiver-info">
          <div className="receiver-avatar">
            <img
              src={`https://ui-avatars.com/api/?name=${user?.name}&background=667eea&color=fff&size=60`}
              alt="Profile"
              className="avatar-image"
            />
          </div>
          <div className="receiver-details">
            <h3>{user?.name}</h3>
            <p>ExePay ID: {user?.userId?.split('_')[1]}</p>
          </div>
        </div>

        {/* Amount Input */}
        <div className="amount-section">
          <label htmlFor="amount">Amount (Optional)</label>
          <div className="amount-input-group">
            <span className="currency-symbol">₹</span>
            <input
              type="text"
              id="amount"
              value={amount}
              onChange={handleAmountChange}
              placeholder="Enter amount"
              className="amount-input"
            />
          </div>
          {amount && (
            <div className="amount-preview">
              Amount: {formatCurrency(parseFloat(amount))}
            </div>
          )}
        </div>

        {/* Description Input */}
        <div className="description-section">
          <label htmlFor="description">Description (Optional)</label>
          <input
            type="text"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What's this payment for?"
            className="description-input"
            maxLength="50"
          />
        </div>

        {/* QR Code Display */}
        <div className="qr-display">
          <div className="qr-container">
            <div className="qr-code">
              {qrImage ? (
                <img src={qrImage} alt="Payment QR Code" className="qr-image" />
              ) : (
                <div className="qr-placeholder">
                  <div className="qr-loading">
                    <div className="spinner"></div>
                    <p>Generating QR...</p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="qr-overlay">
              <div className="qr-logo">
                <span>■</span>
              </div>
            </div>
          </div>

          <div className="qr-info">
            <h4>Scan to Pay</h4>
            <p>Show this QR code to receive payments</p>
            {amount && (
              <div className="qr-amount">
                {formatCurrency(parseFloat(amount))}
              </div>
            )}
          </div>
        </div>

        {/* Payment Address */}
        <div className="address-section">
          <div className="address-header">
            <h4>Your Payment Address</h4>
            <button
              className={`copy-btn ${copying ? 'copied' : ''}`}
              onClick={copyQRData}
            >
              {copying ? '✓ Copied' : '📋 Copy'}
            </button>
          </div>
          <div className="address-display">
            <div className="address-text">
              {user?.qrAddress}
            </div>
          </div>
          <p className="address-note">
            This address can only be used to receive compatible tokens.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="receive-actions">
          <button className="action-btn share-btn" onClick={shareQR}>
            <span className="btn-icon">📤</span>
            Share QR
          </button>
          <button className="action-btn copy-btn-full" onClick={copyQRData}>
            <span className="btn-icon">📋</span>
            Copy QR Data
          </button>
        </div>

        {/* Tips */}
        <div className="receive-tips">
          <div className="tip-card">
            <div className="tip-icon">💡</div>
            <div className="tip-content">
              <h5>Tips for receiving payments</h5>
              <ul>
                <li>Share your QR code with the person who wants to pay you</li>
                <li>You can set a specific amount or let the payer enter it</li>
                <li>Payments are instant and secure</li>
                <li>You'll get a notification when payment is received</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ReceiveQR;
