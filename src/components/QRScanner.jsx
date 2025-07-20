import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import qrService from '../services/qrService';
import './QRScanner.css';

const QRScanner = ({ onQRScan, onBack }) => {
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState('');
  const [scanAnimation, setScanAnimation] = useState(false);

  const handleScan = async () => {
    setScanning(true);
    setError('');
    setScanAnimation(true);

    try {
      // Request permission to capture the visible tab
      const qrData = await qrService.scanPageForPaymentQR();
      
      if (qrData) {
        onQRScan(qrData);
      } else {
        setError('No payment QR code found on this page. Please make sure a UPI QR code is visible.');
      }
    } catch (error) {
      console.error('Scan error:', error);
      setError('Failed to scan. Please ensure the extension has permission to access the current tab.');
    } finally {
      setScanning(false);
      setScanAnimation(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="qr-scanner"
    >
      <div className="scanner-header">
        <button className="back-btn" onClick={onBack}>
          ← Back
        </button>
        <h2>Scan QR Code</h2>
      </div>

      <div className="scanner-content">
        <div className="scanner-window">
          <div className={`scan-overlay ${scanAnimation ? 'scanning' : ''}`}>
            <div className="scan-line"></div>
            <div className="corner-markers">
              <div className="corner top-left"></div>
              <div className="corner top-right"></div>
              <div className="corner bottom-left"></div>
              <div className="corner bottom-right"></div>
            </div>
          </div>
          
          <div className="scanner-icon">
            <motion.div
              animate={{
                scale: scanning ? [1, 1.1, 1] : 1,
                rotate: scanning ? [0, 5, -5, 0] : 0
              }}
              transition={{
                duration: 2,
                repeat: scanning ? Infinity : 0,
                ease: "easeInOut"
              }}
            >
              ⚡
            </motion.div>
          </div>
        </div>

        <div className="scanner-instructions">
          <h3>How to scan:</h3>
          <ol>
            <li>Navigate to a page with a UPI payment QR code</li>
            <li>Make sure the QR code is visible on your screen</li>
            <li>Click the "Scan Page" button below</li>
            <li>The extension will automatically detect payment QR codes</li>
          </ol>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="error-message"
          >
            <div className="error-icon">⚠️</div>
            <p>{error}</p>
          </motion.div>
        )}

        <div className="scanner-actions">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`scan-btn ${scanning ? 'scanning' : ''}`}
            onClick={handleScan}
            disabled={scanning}
          >
            {scanning ? (
              <>
                <div className="spinner"></div>
                Scanning...
              </>
            ) : (
              <>
                <span className="scan-icon">🔍</span>
                Scan Page
              </>
            )}
          </motion.button>
        </div>

        <div className="scanner-tips">
          <div className="tip-card">
            <div className="tip-icon">💡</div>
            <div className="tip-content">
              <h4>Tip</h4>
              <p>Make sure the QR code is clearly visible and not obscured by other elements on the page.</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default QRScanner;
