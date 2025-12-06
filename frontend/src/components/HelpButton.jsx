import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HelpCircle, X, BookOpen, Sparkles, GitCompare, Search, ArrowRight } from 'lucide-react'

export default function HelpButton() {
  const [show, setShow] = useState(false)

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setShow(false)
      }
    }
    if (show) {
      document.addEventListener('keydown', handleEscape)
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [show])

  const helpItems = [
    {
      icon: Search,
      title: 'How to Search Courses',
      content: 'Use the search form on the homepage or go to Search page. Filter by country, program category, and level to find courses that match your needs.'
    },
    {
      icon: Sparkles,
      title: 'Get AI Recommendations',
      content: 'Click "Get AI Recommendations" and fill in your profile (marks, IELTS score, budget). Our AI will suggest courses ranked by acceptance probability.'
    },
    {
      icon: GitCompare,
      title: 'Compare Courses',
      content: 'Click "Compare" on any course card to add it to comparison. Select 2 courses to see side-by-side analysis with AI insights.'
    },
    {
      icon: BookOpen,
      title: 'Save Favorite Courses',
      content: 'Click the heart icon on any course to save it. Access your saved courses from the Dashboard page.'
    }
  ]

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShow(true)}
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 bg-gray-900 text-white p-3 sm:p-4 rounded-full shadow-lg hover:shadow-xl z-40 transition-all min-w-[56px] min-h-[56px] flex items-center justify-center"
        aria-label="Help"
      >
        <HelpCircle className="h-5 w-5 sm:h-6 sm:w-6" />
      </motion.button>

      <AnimatePresence>
        {show && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShow(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60]"
            />
            
            {/* Help Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed bottom-4 right-4 sm:bottom-24 sm:right-6 bg-white rounded-xl sm:rounded-2xl shadow-2xl max-w-sm w-[calc(100vw-2rem)] sm:w-full z-[70] p-4 sm:p-6 border border-gray-200 max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex justify-between items-center mb-4 sm:mb-6">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900">Need Help?</h3>
                <button
                  onClick={() => setShow(false)}
                  className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label="Close help"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>

              {/* Help Items */}
              <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                {helpItems.map((item, index) => {
                  const Icon = item.icon
                  return (
                    <div key={index} className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors border border-gray-100">
                      <div className="flex-shrink-0 p-2 bg-gray-100 rounded-lg">
                        <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-900" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 text-sm sm:text-base mb-1">{item.title}</p>
                        <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">{item.content}</p>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Actions */}
              <div className="space-y-2 pt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    localStorage.removeItem('onboarding-seen')
                    setShow(false)
                    // Dispatch custom event to trigger onboarding
                    const event = new CustomEvent('show-onboarding-tour', { bubbles: true })
                    window.dispatchEvent(event)
                    // Also dispatch to document for better compatibility
                    document.dispatchEvent(event)
                  }}
                  className="w-full bg-gray-900 hover:bg-gray-800 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors text-sm flex items-center justify-center gap-2"
                >
                  <BookOpen className="h-4 w-4" />
                  Show Tour Again
                </button>
                <button
                  onClick={() => setShow(false)}
                  className="w-full bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium py-2.5 px-4 rounded-lg transition-colors text-sm"
                >
                  Got it, thanks!
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}


