import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { GraduationCap, Menu, X, User, LogOut } from 'lucide-react'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Layout({ children }) {
  const { isAuthenticated, user, logout } = useAuthStore()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
    setMobileMenuOpen(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <nav className="bg-white/80 backdrop-blur-lg shadow-lg sticky top-0 z-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link to="/" className="flex items-center space-x-3 group">
              <motion.div
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.5 }}
                className="p-2 bg-gradient-to-br from-primary-500 to-purple-500 rounded-xl shadow-lg"
              >
                <GraduationCap className="h-7 w-7 text-white" />
              </motion.div>
              <span className="text-2xl font-extrabold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent group-hover:from-primary-700 group-hover:to-purple-700 transition-all">
                CourseFinder
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
              <Link 
                to="/search" 
                className="px-3 py-2 lg:px-4 lg:py-2 text-gray-700 hover:text-primary-600 font-medium rounded-lg hover:bg-primary-50 transition-all text-sm lg:text-base min-h-[44px] flex items-center"
              >
                Search Courses
              </Link>
              <Link 
                to="/compare" 
                className="px-3 py-2 lg:px-4 lg:py-2 text-gray-700 hover:text-primary-600 font-medium rounded-lg hover:bg-primary-50 transition-all text-sm lg:text-base min-h-[44px] flex items-center"
              >
                Compare
              </Link>
              {isAuthenticated ? (
                <>
                  <Link 
                    to="/dashboard" 
                    className="px-3 py-2 lg:px-4 lg:py-2 text-gray-700 hover:text-primary-600 font-medium rounded-lg hover:bg-primary-50 transition-all text-sm lg:text-base min-h-[44px] flex items-center"
                  >
                    Dashboard
                  </Link>
                  <Link 
                    to="/analytics" 
                    className="px-3 py-2 lg:px-4 lg:py-2 text-gray-700 hover:text-primary-600 font-medium rounded-lg hover:bg-primary-50 transition-all text-sm lg:text-base min-h-[44px] flex items-center"
                  >
                    Analytics
                  </Link>
                  <div className="flex items-center space-x-2 lg:space-x-4 ml-2 lg:ml-4 pl-2 lg:pl-4 border-l border-gray-200">
                    <div className="flex items-center space-x-1 lg:space-x-2 px-2 lg:px-3 py-2 bg-primary-50 rounded-lg">
                      <User className="h-4 w-4 lg:h-5 lg:w-5 text-primary-600 flex-shrink-0" />
                      <span className="text-xs lg:text-sm font-semibold text-gray-700 truncate max-w-[100px] lg:max-w-none">{user?.phone || 'User'}</span>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-1 lg:space-x-2 px-3 lg:px-4 py-2 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all font-medium text-sm lg:text-base min-h-[44px]"
                    >
                      <LogOut className="h-4 w-4 lg:h-5 lg:w-5" />
                      <span className="hidden lg:inline">Logout</span>
                    </button>
                  </div>
                </>
              ) : (
                <span className="text-xs lg:text-sm text-gray-500 px-3 lg:px-4 py-2">Sign in to save courses</span>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded-md text-gray-700 min-h-[44px] min-w-[44px] flex items-center justify-center touch-manipulation"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-gray-200"
            >
              <div className="px-4 py-4 space-y-2">
                <Link
                  to="/search"
                  className="block px-4 py-3 text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors font-medium min-h-[44px] flex items-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Search Courses
                </Link>
                <Link
                  to="/compare"
                  className="block px-4 py-3 text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors font-medium min-h-[44px] flex items-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Compare
                </Link>
                {isAuthenticated ? (
                  <>
                    <Link
                      to="/dashboard"
                      className="block px-4 py-3 text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors font-medium min-h-[44px] flex items-center"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/analytics"
                      className="block px-4 py-3 text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors font-medium min-h-[44px] flex items-center"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Analytics
                    </Link>
                    <div className="pt-2 border-t border-gray-200 mt-2">
                      <div className="px-4 py-2 mb-2">
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <User className="h-4 w-4" />
                          <span className="font-medium">{user?.phone || 'User'}</span>
                        </div>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-3 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium min-h-[44px] flex items-center"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                      </button>
                    </div>
                  </>
                ) : null}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <main className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
        {children}
      </main>

      <footer className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white mt-20 border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <GraduationCap className="h-6 w-6 text-primary-400" />
                <span className="text-xl font-bold">CourseFinder</span>
              </div>
              <p className="text-gray-400 text-sm">
                AI-Powered Course Discovery Platform. Find your perfect course worldwide.
              </p>
            </div>
            <div>
              <h3 className="font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link to="/search" className="hover:text-primary-400 transition-colors">Search Courses</Link></li>
                <li><Link to="/compare" className="hover:text-primary-400 transition-colors">Compare Courses</Link></li>
                <li><Link to="/dashboard" className="hover:text-primary-400 transition-colors">Dashboard</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Features</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="hover:text-primary-400 transition-colors">AI Recommendations</li>
                <li className="hover:text-primary-400 transition-colors">Smart Comparison</li>
                <li className="hover:text-primary-400 transition-colors">Accurate Data</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-8 text-center">
            <p className="text-gray-400 text-sm">
              © 2024 CourseFinder. All rights reserved. AI-Powered Course Discovery Platform.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

