import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import qrService from '../services/qrService';
import './PaymentProcessor.css';

const PaymentProcessor = ({ qrData, userBalance, onPayment, onCancel }) => {
  const [amount, setAmount] = useState('');
  const [processing, setProcessing] = useState(false);
  const [step, setStep] = useState('review'); // review, confirm, processing, success
  const [customAmount, setCustomAmount] = useState(false);

  useEffect(() => {
    // Set initial amount if QR has fixed amount
    if (qrData && qrData.amount && parseFloat(qrData.amount) > 0) {
      setAmount(qrData.amount);
    } else {
      setCustomAmount(true);
    }
  }, [qrData]);

  const formatCurrency = (value) => {
    return qrService.formatCurrency(value);
  };

  const handleAmountChange = (e) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setAmount(value);
    }
  };

  const validatePayment = () => {
    const paymentAmount = parseFloat(amount);
    
    if (!paymentAmount || paymentAmount <= 0) {
      alert('Please enter a valid amount');
      return false;
    }
    
    if (paymentAmount > userBalance) {
      alert('Insufficient balance');
      return false;
    }
    
    return true;
  };

  const handleConfirm = () => {
    if (validatePayment()) {
      setStep('confirm');
    }
  };

  const handlePayment = async () => {
    if (!validatePayment()) return;

    setStep('processing');
    setProcessing(true);

    try {
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      await onPayment({
        recipientQR: qrData.rawQR,
        amount: parseFloat(amount),
        description: `Payment to ${qrData.merchantName}`,
        merchantName: qrData.merchantName,
        merchantId: qrData.merchantId
      });
      
      setStep('success');
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed: ' + error.message);
      setStep('review');
    } finally {
      setProcessing(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 'review':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="payment-review"
          >
            <div className="merchant-info">
              <div className="merchant-avatar">
                <span>{qrData.merchantName.charAt(0).toUpperCase()}</span>
              </div>
              <div className="merchant-details">
                <h3>{qrData.merchantName}</h3>
                <p>{qrData.merchantId}</p>
              </div>
            </div>

            <div className="amount-section">
              <label htmlFor="amount">Amount to Pay</label>
              {customAmount ? (
                <div className="amount-input-group">
                  <span className="currency-symbol">₹</span>
                  <input
                    type="text"
                    id="amount"
                    value={amount}
                    onChange={handleAmountChange}
                    placeholder="0.00"
                    className="amount-input"
                    autoFocus
                  />
                </div>
              ) : (
                <div className="fixed-amount">
                  {formatCurrency(amount)}
                </div>
              )}
            </div>

            {qrData.transactionNote && (
              <div className="transaction-note">
                <label>Description</label>
                <p>{qrData.transactionNote}</p>
              </div>
            )}

            <div className="balance-info">
              <div className="balance-row">
                <span>Your Balance</span>
                <span>{formatCurrency(userBalance)}</span>
              </div>
              <div className="balance-row">
                <span>After Payment</span>
                <span className={parseFloat(amount) > userBalance ? 'insufficient' : ''}>
                  {formatCurrency(userBalance - (parseFloat(amount) || 0))}
                </span>
              </div>
            </div>

            <div className="payment-actions">
              <button className="cancel-btn" onClick={onCancel}>
                Cancel
              </button>
              <button className="continue-btn" onClick={handleConfirm}>
                Continue
              </button>
            </div>
          </motion.div>
        );

      case 'confirm':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="payment-confirm"
          >
            <div className="confirm-header">
              <div className="confirm-icon">🔒</div>
              <h3>Confirm Payment</h3>
              <p>Please review your payment details</p>
            </div>

            <div className="payment-summary">
              <div className="summary-row">
                <span>To</span>
                <span>{qrData.merchantName}</span>
              </div>
              <div className="summary-row">
                <span>Amount</span>
                <span className="amount-highlight">{formatCurrency(amount)}</span>
              </div>
              <div className="summary-row">
                <span>From</span>
                <span>ExePay Wallet</span>
              </div>
            </div>

            <div className="security-note">
              <div className="security-icon">🛡️</div>
              <p>This payment is secured by ExePay encryption</p>
            </div>

            <div className="payment-actions">
              <button className="back-btn" onClick={() => setStep('review')}>
                Back
              </button>
              <button className="pay-btn" onClick={handlePayment}>
                Pay {formatCurrency(amount)}
              </button>
            </div>
          </motion.div>
        );

      case 'processing':
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="payment-processing"
          >
            <div className="processing-animation">
              <div className="processing-circle"></div>
              <div className="processing-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
            <h3>Processing Payment</h3>
            <p>Please wait while we process your payment...</p>
            <div className="processing-amount">{formatCurrency(amount)}</div>
          </motion.div>
        );

      case 'success':
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="payment-success"
          >
            <div className="success-icon">✓</div>
            <h3>Payment Successful</h3>
            <p>Your payment has been processed successfully</p>
            <div className="success-amount">{formatCurrency(amount)}</div>
            <div className="success-details">
              <p>Paid to {qrData.merchantName}</p>
              <p>Transaction ID: {Date.now()}</p>
            </div>
            <button className="done-btn" onClick={onCancel}>
              Done
            </button>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="payment-overlay"
      onClick={(e) => e.target === e.currentTarget && onCancel()}
    >
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 50, scale: 0.9 }}
        transition={{ duration: 0.3 }}
        className="payment-modal"
      >
        <div className="modal-header">
          <h2>Payment</h2>
          {step === 'review' && (
            <button className="close-btn" onClick={onCancel}>
              ×
            </button>
          )}
        </div>

        <div className="modal-content">
          <AnimatePresence mode="wait">
            {renderStep()}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PaymentProcessor;
