import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { authAPI } from '../api/auth'
import toast from 'react-hot-toast'
import OTPModal from './OTPModal'

export default function PhoneModal({ isOpen, onClose, onSuccess }) {
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [showOTP, setShowOTP] = useState(false)

  const handleSendOTP = async (e) => {
    e.preventDefault()
    if (!phone) {
      toast.error('Please enter your phone number')
      return
    }

    setLoading(true)
    try {
      await authAPI.sendOTP(phone)
      toast.success('OTP sent successfully!')
      setShowOTP(true)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send OTP')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <AnimatePresence>
        {isOpen && !showOTP && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-50"
              onClick={onClose}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-gray-900">Sign In Required</h2>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
                
                <p className="text-gray-600 mb-6">
                  Please sign in to view complete course details or save courses.
                </p>

                <form onSubmit={handleSendOTP}>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="input-field mb-4"
                    placeholder="+1234567890"
                    required
                  />

                  <div className="flex space-x-3">
                    <button
                      type="button"
                      onClick={onClose}
                      className="btn-secondary flex-1"
                      disabled={loading}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn-primary flex-1"
                      disabled={loading || !phone}
                    >
                      {loading ? 'Sending...' : 'Send OTP'}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <OTPModal
        isOpen={showOTP}
        onClose={() => {
          setShowOTP(false)
          onClose()
        }}
        phone={phone}
        onSuccess={onSuccess}
      />
    </>
  )
}

