# ExePay - Next-Gen Payment System

A secure, AI-powere# ExePay - Digital Payment Extension

A comprehensive Chrome extension for digital payments with QR code scanning, user authentication, wallet functionality, and secure payment processing.

## Features

### 🔐 User Authentication
- **Registration**: Sign up with name, email, mobile number, and password
- **Login**: Secure login with email and password
- **Password Recovery**: Basic password reset functionality
- **Unique User ID**: Every user gets a unique identifier
- **Data Persistence**: User data stored securely in browser storage

### 💳 Digital Wallet
- **Balance Display**: View current wallet balance
- **Add Money**: Add funds to your ExePay wallet
- **Transaction History**: View all payment transactions
- **Real-time Updates**: Balance and transactions update in real-time

### 📱 QR Code Functionality
- **QR Scanning**: Scan any page for UPI payment QR codes
- **Payment Processing**: Process payments directly through the extension
- **Custom QR Generation**: Generate your own QR code for receiving payments
- **Amount Specification**: Set fixed amounts or let payers enter custom amounts

### 🎨 Creative Dashboard
- **Modern UI**: Beautiful, responsive design with animations
- **Dark/Light Theme**: Automatic theme adaptation
- **Profile Management**: Comprehensive user profile with avatar
- **Payment History**: Detailed transaction list with search/filter

### 🔒 Security Features
- **Encrypted Storage**: All sensitive data is encrypted
- **Secure Payments**: Payment processing with multiple security layers
- **Session Management**: Automatic logout and session handling
- **Privacy Protection**: No data sharing with third parties

## Installation

### Method 1: Load Unpacked Extension (Development)

1. **Build the Extension**:
   ```bash
   cd "d:\Yo Pro\Exepay\exepay-react"
   npm install
   npm run build:extension
   ```

2. **Load in Chrome**:
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top right)
   - Click "Load unpacked"
   - Select the `dist` folder: `d:\Yo Pro\Exepay\exepay-react\dist`

3. **Pin the Extension**:
   - Click the extensions icon (puzzle piece) in Chrome toolbar
   - Find "ExePay - Digital Payment Extension"
   - Click the pin icon to pin it to your toolbar

### Method 2: Chrome Web Store (Production)
*Coming soon - Extension will be published to Chrome Web Store*

## How to Use

### 1. First Time Setup

1. **Click the ExePay Icon** in your Chrome toolbar
2. **Register Your Account**:
   - Enter your full name
   - Provide a valid email address
   - Enter your 10-digit mobile number (starting with 6-9)
   - Create a secure password (minimum 6 characters)
   - Confirm your password
3. **Account Created**: You'll be automatically logged in

### 2. Dashboard Overview

After logging in, you'll see the main dashboard with:

- **Balance Card**: Shows your current wallet balance
- **Quick Actions**: 
  - "Scan QR" - Scan pages for payment QR codes
  - "Receive Money" - Generate your QR code for receiving payments
- **Recent Transactions**: List of your latest payment activities
- **Profile Access**: Click your avatar to access profile settings

### 3. Making Payments

#### Scan QR Code to Pay:

1. **Navigate to a Payment Page**: Go to any website with a UPI QR code
2. **Open ExePay**: Click the extension icon
3. **Click "Scan QR"**: This opens the QR scanner
4. **Click "Scan Page"**: The extension will automatically detect QR codes
5. **Review Payment**: 
   - Check merchant details
   - Verify amount (edit if not fixed)
   - Add description if needed
6. **Confirm Payment**: Click "Continue" then "Pay"
7. **Payment Processing**: Wait for confirmation
8. **Success**: Payment completed and balance updated

#### Receive Payments:

1. **Click "Receive Money"** from the dashboard
2. **Set Amount** (optional): Enter specific amount or leave blank
3. **Add Description** (optional): What's the payment for?
4. **Share QR Code**: 
   - Show the QR code to the payer
   - Use "Share QR" to send via apps
   - Use "Copy QR Data" to share the payment link
5. **Receive Payment**: Money will be added to your balance automatically

### 4. Profile Management

Access your profile by clicking your avatar:

- **View Personal Info**: Name, email, mobile number
- **Payment Address**: Your unique ExePay address
- **Transaction History**: Detailed payment records
- **Account Settings**: Change password, notifications, security
- **QR Code**: Generate and share your personal QR code

### 5. Adding Money to Wallet

1. **From Dashboard**: Click "+ Add Money" button
2. **Quick Add**: Currently adds ₹100 (customizable amounts coming soon)
3. **Balance Update**: Your balance updates immediately
4. **Transaction Record**: Addition recorded in transaction history

## Technical Details

### Tech Stack
- **Frontend**: React 19, Framer Motion for animations
- **Styling**: Custom CSS with responsive design
- **QR Processing**: jsQR library for QR code scanning
- **Storage**: Chrome Extension Storage API
- **Build Tool**: Vite for optimized builds

### Browser Permissions
- `activeTab`: To scan current page for QR codes
- `storage`: To save user data and preferences
- `tabs`: To capture screenshots for QR scanning
- `notifications`: To show payment confirmations
- `contextMenus`: For right-click QR scanning
- `alarms`: For periodic data cleanup

## Support & Contact

For support, feature requests, or bug reports:
- **Email**: support@exepay.com
- **GitHub**: [ExePay Repository]
- **Documentation**: [ExePay Docs]

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Version History

### v1.0.0 (Current)
- Initial release with core functionality
- User authentication and registration
- QR code scanning and payment processing
- Digital wallet with transaction history
- Profile management and settings
- Modern responsive UI with animations

---

**Made with ❤️ for secure, fast, and user-friendly digital payments** bucket' experience accessible directly from your browser.

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Build extension for Chrome
npm run build:extension
```

## Loading the Extension in Chrome

1. Build the extension:
   ```bash
   npm run build:extension
   ```

2. Open Chrome and navigate to `chrome://extensions/`

3. Enable "Developer mode" by toggling the switch in the top-right corner

4. Click "Load unpacked" and select the `dist` directory from this project

5. The ExePay extension should now be loaded and visible in your Chrome toolbar

## Extension Features

- Modern dark theme UI
- Secure payment processing
- Transaction history
- Settings management

## Troubleshooting

If you encounter the error "Manifest file is missing or unreadable":

1. Make sure you've run `npm run build:extension` to prepare the extension files
2. Verify that the `dist` directory contains:
   - manifest.json
   - background.js
   - icons/icon16.png
   - icons/icon48.png
   - icons/icon128.png
3. Try reloading the extension in Chrome

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
