// Background script for ExePay extension
// ExePay Extension Background Script
console.log('ExePay background script loaded');

// Handle extension installation
chrome.runtime.onInstalled.addListener(() => {
  console.log('ExePay extension installed');
  
  // Initialize default storage
  chrome.storage.local.set({
    users: [],
    currentUser: null,
    extensionSettings: {
      version: '1.0.0',
      installDate: new Date().toISOString()
    }
  });
});

// Handle tab capture permissions
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'captureTab') {
    chrome.tabs.captureVisibleTab(null, {format: 'png'}, (dataUrl) => {
      if (chrome.runtime.lastError) {
        sendResponse({
          success: false,
          error: chrome.runtime.lastError.message
        });
      } else {
        sendResponse({
          success: true,
          dataUrl: dataUrl
        });
      }
    });
    return true; // Keep message channel open for async response
  }
  
  if (request.action === 'getCurrentTab') {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      sendResponse({
        success: true,
        tab: tabs[0]
      });
    });
    return true;
  }
  
  if (request.action === 'openPaymentPage') {
    chrome.tabs.create({
      url: request.url
    });
    sendResponse({success: true});
  }
});

// Handle storage events for cross-tab synchronization
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'local') {
    // Broadcast storage changes to all extension pages
    chrome.runtime.sendMessage({
      action: 'storageChanged',
      changes: changes
    }).catch(() => {
      // Ignore if no listeners
    });
  }
});

// Handle notification permissions and display
async function showNotification(title, message, type = 'basic') {
  try {
    await chrome.notifications.create({
      type: type,
      iconUrl: 'icons/icon48.png',
      title: title,
      message: message,
      buttons: type === 'basic' ? [] : [
        {title: 'View Details'},
        {title: 'Dismiss'}
      ]
    });
  } catch (error) {
    console.error('Failed to show notification:', error);
  }
}

// Listen for payment completion events
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'paymentCompleted') {
    showNotification(
      'Payment Successful',
      `₹${request.amount} paid to ${request.recipient}`,
      'basic'
    );
    sendResponse({success: true});
  }
  
  if (request.action === 'paymentReceived') {
    showNotification(
      'Payment Received',
      `₹${request.amount} received from ${request.sender}`,
      'basic'
    );
    sendResponse({success: true});
  }
});

// Handle context menu for QR detection (optional feature)
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'scanQR') {
    chrome.tabs.sendMessage(tab.id, {
      action: 'scanPageForQR'
    });
  }
});

// Create context menu item
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'scanQR',
    title: 'Scan for Payment QR',
    contexts: ['page']
  });
});

// Handle badge updates for balance display
async function updateBadge(balance) {
  try {
    const formattedBalance = balance > 999 ? '999+' : balance.toString();
    await chrome.action.setBadgeText({
      text: formattedBalance
    });
    await chrome.action.setBadgeBackgroundColor({
      color: '#00cc6a'
    });
  } catch (error) {
    console.error('Failed to update badge:', error);
  }
}

// Listen for balance updates
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'local' && changes.currentUser) {
    const newUser = changes.currentUser.newValue;
    if (newUser && newUser.balance !== undefined) {
      updateBadge(newUser.balance);
    }
  }
});

// Periodic cleanup of old data (run every 24 hours)
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'dataCleanup') {
    cleanupOldData();
  }
});

// Set up periodic cleanup
chrome.runtime.onStartup.addListener(() => {
  chrome.alarms.create('dataCleanup', {
    delayInMinutes: 1440, // 24 hours
    periodInMinutes: 1440
  });
});

async function cleanupOldData() {
  try {
    const result = await chrome.storage.local.get(['users']);
    const users = result.users || [];
    
    // Clean up old transactions (keep only last 100 per user)
    const cleanedUsers = users.map(user => {
      if (user.transactions && user.transactions.length > 100) {
        user.transactions = user.transactions
          .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
          .slice(0, 100);
      }
      return user;
    });
    
    await chrome.storage.local.set({ users: cleanedUsers });
    console.log('Data cleanup completed');
  } catch (error) {
    console.error('Data cleanup failed:', error);
  }
}

// Handle extension updates
chrome.runtime.onUpdateAvailable.addListener((details) => {
  console.log('Extension update available:', details);
  // Optionally notify user about update
  showNotification(
    'ExePay Update Available',
    'A new version of ExePay is available. Restart to update.',
    'basic'
  );
});

console.log('ExePay background script initialized');

// Listen for installation
chrome.runtime.onInstalled.addListener(() => {
  console.log('ExePay extension installed');
  
  // Initialize storage with default values
  chrome.storage.local.set({
    balance: 0,
    transactions: [],
    settings: {
      theme: 'dark',
      currency: 'INR',
      notifications: true
    }
  });
});

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getData') {
    chrome.storage.local.get(request.keys, (data) => {
      sendResponse(data);
    });
    return true; // Required for async response
  }
  
  if (request.action === 'saveData') {
    chrome.storage.local.set(request.data, () => {
      sendResponse({ success: true });
    });
    return true; // Required for async response
  }
}); 