import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HelpCircle, X, BookOpen, Video, MessageCircle } from 'lucide-react'

export default function HelpButton() {
  const [show, setShow] = useState(false)

  const helpItems = [
    {
      icon: <BookOpen className="h-5 w-5" />,
      title: 'How to Search Courses',
      content: 'Use the search bar or filters to find courses by country, category, or budget.'
    },
    {
      icon: <Video className="h-5 w-5" />,
      title: 'AI Recommendations',
      content: 'Fill in your profile details and get personalized course recommendations.'
    },
    {
      icon: <MessageCircle className="h-5 w-5" />,
      title: 'Compare Courses',
      content: 'Select courses and click Compare to see side-by-side analysis.'
    }
  ]

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setShow(true)}
        className="fixed bottom-6 right-6 bg-primary-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl z-40"
      >
        <HelpCircle className="h-6 w-6" />
      </motion.button>

      <AnimatePresence>
        {show && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShow(false)}
              className="fixed inset-0 bg-black bg-opacity-50 z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed bottom-24 right-6 bg-white rounded-xl shadow-2xl max-w-sm w-full z-50 p-6"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900">Need Help?</h3>
                <button
                  onClick={() => setShow(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="space-y-3">
                {helpItems.map((item, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg">
                    <div className="text-primary-600 mt-1">{item.icon}</div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{item.title}</p>
                      <p className="text-xs text-gray-600">{item.content}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => {
                  localStorage.removeItem('onboarding-seen')
                  window.location.reload()
                }}
                className="w-full mt-4 btn-primary text-sm"
              >
                Show Tour Again
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

