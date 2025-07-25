import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import qrService from '../services/qrService';
import './QRScannerCompact.css';

const QRScanner = ({ onBack, onQRScan }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [pagePreview, setPagePreview] = useState(null);
  const [scanStatus, setScanStatus] = useState('ready'); // ready, scanning, found, error
  const [error, setError] = useState('');

  // Remove auto-scan on mount to prevent immediate scanning
  // useEffect(() => {
  //   handleScan();
  // }, []);

  const handleScan = async () => {
    setIsScanning(true);
    setScanStatus('scanning');
    setError('');

    try {
      // Capture current tab
      const dataUrl = await qrService.captureVisibleTab();
      setPagePreview(dataUrl);

      // Scan for QR codes
      const qrData = await qrService.scanPageForPaymentQR();
      
      if (qrData) {
        setScanStatus('found');
        // Small delay for animation then navigate to payment
        setTimeout(() => {
          onQRScan(qrData);
        }, 800);
      } else {
        setScanStatus('ready');
        setError('No payment QR code found on this page');
      }
    } catch (error) {
      console.error('Scan error:', error);
      setScanStatus('error');
      setError('Failed to scan page: ' + error.message);
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="qr-scanner-compact"
    >
      <div className="scanner-header">
        <div className="ambient-light-left"></div>
        <div className="ambient-light-right"></div>
        <button className="back-btn" onClick={onBack}>
          <span className="back-icon">←</span>
        </button>
        <h3>Payment Scanner</h3>
        <div className="status-indicator">
          <div className={`status-dot ${isScanning ? 'active' : 'inactive'}`}></div>
        </div>
      </div>

      <div className="scanner-content">
        {/* Premium Page Preview */}
        <div className="preview-container">
          {pagePreview ? (
            <div className="page-preview">
              <div className="preview-frame">
                <img src={pagePreview} alt="Page preview" className="preview-image" />
                <div className={`scan-overlay ${isScanning ? 'scanning' : ''}`}>
                  <div className="scan-grid">
                    <div className="grid-line vertical-1"></div>
                    <div className="grid-line vertical-2"></div>
                    <div className="grid-line horizontal-1"></div>
                    <div className="grid-line horizontal-2"></div>
                  </div>
                  <div className="scan-focus">
                    <div className="focus-corner tl"></div>
                    <div className="focus-corner tr"></div>
                    <div className="focus-corner bl"></div>
                    <div className="focus-corner br"></div>
                  </div>
                  {isScanning && <div className="scan-beam"></div>}
                </div>
              </div>
              <div className="preview-info">
                <span className="preview-label">Page Capture</span>
                <span className="preview-status">{isScanning ? 'Analyzing...' : 'Ready'}</span>
              </div>
            </div>
          ) : (
            <div className="scanner-placeholder">
              <motion.div
                animate={{
                  scale: isScanning ? [1, 1.02, 1] : 1,
                }}
                transition={{
                  duration: 2,
                  repeat: isScanning ? Infinity : 0,
                  ease: "easeInOut"
                }}
                className="placeholder-icon"
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3 7V5a2 2 0 0 1 2-2h2v2H5v2H3zM17 3h2a2 2 0 0 1 2 2v2h-2V5h-2V3zM21 17v2a2 2 0 0 1-2 2h-2v-2h2v-2h2zM7 21H5a2 2 0 0 1-2-2v-2h2v2h2v2z"/>
                  <rect x="7" y="7" width="10" height="10" rx="1" fill="none" stroke="currentColor" strokeWidth="1.5"/>
                  <rect x="9" y="9" width="6" height="6" rx="1"/>
                </svg>
              </motion.div>
              <div className="placeholder-title">Ready to scan page</div>
              <div className="placeholder-subtitle">Click the button below to scan the current page for payment QR codes</div>
            </div>
          )}
        </div>

        {/* Professional Status Messages */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="status-card error"
            >
              <div className="status-content">
                <div className="status-icon">⚠</div>
                <div className="status-info">
                  <span className="status-title">Scan Failed</span>
                  <span className="status-detail">{error}</span>
                </div>
              </div>
            </motion.div>
          )}

          {scanStatus === 'found' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="status-card success"
            >
              <div className="status-content">
                <div className="status-icon">✓</div>
                <div className="status-info">
                  <span className="status-title">Payment QR Detected</span>
                  <span className="status-detail">Processing payment request</span>
                </div>
              </div>
            </motion.div>
          )}

          {scanStatus === 'scanning' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="status-card scanning"
            >
              <div className="status-content">
                <div className="status-icon rotating">⟲</div>
                <div className="status-info">
                  <span className="status-title">Scanning Page</span>
                  <span className="status-detail">Looking for QR codes</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Professional Action Button */}
        <div className="scan-action-container">
          <motion.button
            whileHover={{ scale: 1.01, y: -2 }}
            whileTap={{ scale: 1.0 }}
            onClick={handleScan}
            disabled={isScanning}
            className="scan-btn-professional"
          >
            <div className="scan-btn-icon">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M9.5 3A6.5 6.5 0 0 1 16 9.5c0 1.61-.59 3.09-1.56 4.23l.27.27h.79l5 5-1.5 1.5-5-5v-.79l-.27-.27A6.516 6.516 0 0 1 9.5 16 6.5 6.5 0 0 1 3 9.5 6.5 6.5 0 0 1 9.5 3m0 2C7 5 5 7 5 9.5S7 14 9.5 14 14 12 14 9.5 12 5 9.5 5z"/>
              </svg>
            </div>
            <div className="scan-btn-text">
              <span className="scan-btn-title">
                {isScanning ? 'Scanning...' : scanStatus === 'found' ? 'QR Detected' : 'Scan Page'}
              </span>
              <span className="scan-btn-subtitle">
                {isScanning ? 'PLEASE WAIT' : scanStatus === 'found' ? 'TAP TO PROCEED' : 'DETECT PAYMENT QR'}
              </span>
            </div>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default QRScanner;
