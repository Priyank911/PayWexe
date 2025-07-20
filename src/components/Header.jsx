import { motion } from 'framer-motion';
import './Header.css';

const Header = () => {
  return (
    <motion.header 
      className="header"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="header-content">
        <div className="logo">
          <motion.div 
            className="logo-icon"
            animate={{ 
              scale: [1, 1.05, 1],
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 8V5c0-1.1.9-2 2-2h3" stroke="currentColor" strokeLinecap="round"/>
              <path d="M4 16v3c0 1.1.9 2 2 2h3" stroke="currentColor" strokeLinecap="round"/>
              <path d="M20 8V5c0-1.1-.9-2-2-2h-3" stroke="currentColor" strokeLinecap="round"/>
              <path d="M20 16v3c0 1.1-.9 2-2 2h-3" stroke="currentColor" strokeLinecap="round"/>
              <path d="M12 4L8 8l4 4 4-4-4-4z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M8 16l4 4 4-4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </motion.div>
          <h1>ExePay</h1>
        </div>
        
        <div className="header-actions">
          <motion.button 
            className="notification-btn"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z" />
              <path d="M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21" />
            </svg>
          </motion.button>
          
          <motion.button 
            className="profile-btn"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </motion.button>
        </div>
      </div>
    </motion.header>
  );
};

export default Header; 