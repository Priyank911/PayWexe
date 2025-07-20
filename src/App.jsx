import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import AuthPage from './components/AuthPage'
import Dashboard from './components/Dashboard'
import authService from './services/authService'
import './App.css'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      const currentUser = await authService.getCurrentUser()
      if (currentUser) {
        setUser(currentUser)
        setIsAuthenticated(true)
      }
    } catch (error) {
      console.error('Error checking auth status:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAuthSuccess = (userData) => {
    setUser(userData)
    setIsAuthenticated(true)
  }

  const handleLogout = () => {
    setUser(null)
    setIsAuthenticated(false)
  }

  if (loading) {
    return (
      <div className="app-loading">
        <div className="loading-container">
          <div className="loader"></div>
          <p>Loading ExePay...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="app">
      <AnimatePresence mode="wait">
        {!isAuthenticated ? (
          <motion.div
            key="auth"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <AuthPage onAuthSuccess={handleAuthSuccess} />
          </motion.div>
        ) : (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Dashboard user={user} onLogout={handleLogout} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default App
