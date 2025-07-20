import jsQR from 'jsqr';

// QR Service for scanning and generating QR codes
class QRService {
  constructor() {
    this.jsQR = jsQR;
    console.log('jsQR imported successfully:', typeof this.jsQR);
  }

  // Check if jsQR is available
  isJsQRReady() {
    return typeof this.jsQR === 'function';
  }

  // Check if QR data is a UPI payment QR
  isUPIPaymentQR(data) {
    return data && data.startsWith('upi://pay?');
  }

  // Parse UPI QR code data
  parseUPIQRData(data) {
    if (!this.isUPIPaymentQR(data)) {
      return null;
    }
    
    // Remove the 'upi://pay?' prefix
    const queryString = data.substring(9);
    
    // Parse the query parameters
    const params = {};
    queryString.split('&').forEach(param => {
      const [key, value] = param.split('=');
      if (key && value) {
        params[key] = decodeURIComponent(value);
      }
    });
    
    // Extract relevant payment information
    return {
      merchantName: params.pn || 'Unknown Merchant',
      amount: params.am || '0',
      currency: params.cu || 'INR',
      transactionNote: params.tn || '',
      merchantId: params.pa || '',
      transactionId: params.tr || '',
      rawQR: data,
      timestamp: new Date().toLocaleString()
    };
  }

  // Capture the visible tab for QR scanning
  async captureVisibleTab() {
    return new Promise((resolve, reject) => {
      try {
        // Use chrome.runtime.sendMessage to communicate with background script
        chrome.runtime.sendMessage({action: 'captureTab'}, (response) => {
          if (response && response.success) {
            resolve(response.dataUrl);
          } else {
            reject(new Error(response?.error || 'Failed to capture tab'));
          }
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  // Scan image for QR codes
  async scanImageForQR(imageUrl) {
    return new Promise((resolve, reject) => {
      // Check if jsQR is ready
      if (!this.isJsQRReady()) {
        reject(new Error('jsQR library not available'));
        return;
      }

      const img = new Image();
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);
          
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          
          // Use jsQR to scan for QR codes
          const code = this.jsQR(imageData.data, imageData.width, imageData.height);
          if (code) {
            resolve(code.data);
          } else {
            resolve(null);
          }
        } catch (error) {
          reject(error);
        }
      };
      
      img.onerror = function() {
        reject(new Error('Failed to load image'));
      };
      
      img.src = imageUrl;
    });
  }

  // Main function to scan page for payment QR codes
  async scanPageForPaymentQR() {
    try {
      // Check if jsQR is ready
      if (!this.isJsQRReady()) {
        throw new Error('jsQR library not available');
      }

      console.log('jsQR is ready, proceeding with scan');

      // Capture the visible tab
      const dataUrl = await this.captureVisibleTab();
      
      // Scan the captured image for QR codes
      const qrData = await this.scanImageForQR(dataUrl);
      
      if (qrData && this.isUPIPaymentQR(qrData)) {
        return this.parseUPIQRData(qrData);
      }
      
      return null;
    } catch (error) {
      console.error('Error scanning page:', error);
      throw error;
    }
  }

  // Generate QR code for receiving payments
  generateReceiveQR(userId, amount = null) {
    const baseUPI = 'upi://pay?';
    const params = new URLSearchParams({
      pa: `exepay.${userId}@paytm`, // UPI ID format
      pn: 'ExePay Wallet',
      cu: 'INR',
      tn: 'Payment to ExePay Wallet'
    });

    if (amount && amount > 0) {
      params.append('am', amount.toString());
    }

    return baseUPI + params.toString();
  }

  // Generate QR code data URL for display
  async generateQRCodeImage(data, size = 256) {
    return new Promise((resolve, reject) => {
      try {
        // Create a simple QR code using canvas
        // In production, use a proper QR code library like qrcode.js
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = size;
        canvas.height = size;

        // Simple placeholder QR pattern
        // Replace with actual QR generation library
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, size, size);
        
        ctx.fillStyle = '#FFFFFF';
        const moduleSize = size / 25;
        
        // Create a simple pattern (this is just a placeholder)
        for (let i = 0; i < 25; i++) {
          for (let j = 0; j < 25; j++) {
            if ((i + j) % 3 === 0) {
              ctx.fillRect(i * moduleSize, j * moduleSize, moduleSize, moduleSize);
            }
          }
        }

        // Add ExePay logo placeholder in center
        ctx.fillStyle = '#00FF88';
        const centerStart = size / 2 - 30;
        ctx.fillRect(centerStart, centerStart, 60, 60);
        
        ctx.fillStyle = '#000000';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('ExePay', size / 2, size / 2 + 4);

        resolve(canvas.toDataURL());
      } catch (error) {
        reject(error);
      }
    });
  }

  // Format currency for display
  formatCurrency(amount, currency = 'INR') {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount)) return '₹0.00';
    
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(numAmount);
  }

  // Validate UPI ID format
  validateUPIId(upiId) {
    const upiRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+$/;
    return upiRegex.test(upiId);
  }

  // Extract amount from UPI QR if present
  extractAmountFromQR(qrData) {
    const parsedData = this.parseUPIQRData(qrData);
    return parsedData ? parseFloat(parsedData.amount) || 0 : 0;
  }

  // Check if QR contains fixed amount
  hasFixedAmount(qrData) {
    const amount = this.extractAmountFromQR(qrData);
    return amount > 0;
  }
}

export default new QRService();
