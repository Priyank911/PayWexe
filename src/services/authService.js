// Authentication Service for ExePay Extension
class AuthService {
  constructor() {
    this.API_BASE = 'http://localhost:3001/api'; // Backend API URL
    this.currentUser = null;
  }

  // Generate unique user ID
  generateUserId() {
    return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  // Validate email format
  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Validate mobile number (Indian format)
  validateMobile(mobile) {
    const mobileRegex = /^[6-9]\d{9}$/;
    return mobileRegex.test(mobile);
  }

  // Hash password (basic implementation - in production use bcrypt)
  async hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
  }

  // Register new user
  async register(userData) {
    try {
      const { email, mobile, password, name } = userData;

      // Validate inputs
      if (!this.validateEmail(email)) {
        throw new Error('Invalid email format');
      }
      if (!this.validateMobile(mobile)) {
        throw new Error('Invalid mobile number format');
      }
      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }

      // Check if user already exists
      const existingUser = await this.getUserByEmailOrMobile(email, mobile);
      if (existingUser) {
        throw new Error('User already exists with this email or mobile');
      }

      // Generate unique user ID and hash password
      const userId = this.generateUserId();
      const hashedPassword = await this.hashPassword(password);

      // Create user object
      const newUser = {
        userId,
        name,
        email,
        mobile,
        password: hashedPassword,
        balance: 0,
        qrAddress: this.generateQRAddress(userId),
        transactions: [],
        createdAt: new Date().toISOString(),
        isVerified: false
      };

      // Store user in local storage (in production, send to backend)
      await this.storeUser(newUser);

      // Store current user session
      await chrome.storage.local.set({ currentUser: newUser });
      this.currentUser = newUser;

      return { success: true, user: newUser };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Login user
  async login(email, password) {
    try {
      // Get stored users
      const users = await this.getStoredUsers();
      
      // Find user by email
      const user = users.find(u => u.email === email);
      if (!user) {
        throw new Error('User not found');
      }

      // Verify password
      const hashedPassword = await this.hashPassword(password);
      if (user.password !== hashedPassword) {
        throw new Error('Invalid password');
      }

      // Store current user session
      await chrome.storage.local.set({ currentUser: user });
      this.currentUser = user;

      return { success: true, user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Logout user
  async logout() {
    try {
      await chrome.storage.local.remove('currentUser');
      this.currentUser = null;
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Get current logged-in user
  async getCurrentUser() {
    try {
      const result = await chrome.storage.local.get('currentUser');
      this.currentUser = result.currentUser || null;
      return this.currentUser;
    } catch (error) {
      return null;
    }
  }

  // Generate QR address for user
  generateQRAddress(userId) {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 10);
    return `36Wac9pxPHFtURiGQUkVnjxzKbs6${userId.substr(-8)}${timestamp.toString().substr(-4)}${random}`;
  }

  // Store user in local storage
  async storeUser(user) {
    try {
      const users = await this.getStoredUsers();
      users.push(user);
      await chrome.storage.local.set({ users });
      return true;
    } catch (error) {
      console.error('Error storing user:', error);
      return false;
    }
  }

  // Get all stored users
  async getStoredUsers() {
    try {
      const result = await chrome.storage.local.get('users');
      return result.users || [];
    } catch (error) {
      return [];
    }
  }

  // Check if user exists by email or mobile
  async getUserByEmailOrMobile(email, mobile) {
    const users = await this.getStoredUsers();
    return users.find(u => u.email === email || u.mobile === mobile);
  }

  // Update user profile
  async updateProfile(updates) {
    try {
      if (!this.currentUser) {
        throw new Error('No user logged in');
      }

      const users = await this.getStoredUsers();
      const userIndex = users.findIndex(u => u.userId === this.currentUser.userId);
      
      if (userIndex === -1) {
        throw new Error('User not found');
      }

      // Update user data
      users[userIndex] = { ...users[userIndex], ...updates };
      await chrome.storage.local.set({ users });

      // Update current user session
      this.currentUser = users[userIndex];
      await chrome.storage.local.set({ currentUser: this.currentUser });

      return { success: true, user: this.currentUser };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Add money to user balance
  async addMoney(amount) {
    try {
      if (!this.currentUser) {
        throw new Error('No user logged in');
      }

      const newBalance = this.currentUser.balance + amount;
      const transaction = {
        id: 'txn_' + Date.now(),
        type: 'credit',
        amount,
        description: 'Money added to wallet',
        timestamp: new Date().toISOString(),
        status: 'completed'
      };

      await this.updateProfile({
        balance: newBalance,
        transactions: [...(this.currentUser.transactions || []), transaction]
      });

      return { success: true, balance: newBalance, transaction };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Send money (for QR payments)
  async sendMoney(recipientQR, amount, description = '') {
    try {
      if (!this.currentUser) {
        throw new Error('No user logged in');
      }

      if (this.currentUser.balance < amount) {
        throw new Error('Insufficient balance');
      }

      const newBalance = this.currentUser.balance - amount;
      const transaction = {
        id: 'txn_' + Date.now(),
        type: 'debit',
        amount,
        description: description || 'Payment via QR',
        recipientQR,
        timestamp: new Date().toISOString(),
        status: 'completed'
      };

      await this.updateProfile({
        balance: newBalance,
        transactions: [...(this.currentUser.transactions || []), transaction]
      });

      return { success: true, balance: newBalance, transaction };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Reset password (basic implementation)
  async resetPassword(email) {
    try {
      const users = await this.getStoredUsers();
      const user = users.find(u => u.email === email);
      
      if (!user) {
        throw new Error('User not found');
      }

      // In production, send email with reset link
      // For now, return a success message
      return { 
        success: true, 
        message: 'Password reset instructions sent to your email' 
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

export default new AuthService();
