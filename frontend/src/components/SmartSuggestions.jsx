import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Lightbulb, X } from 'lucide-react'

export default function SmartSuggestions({ onSuggestionClick }) {
  const [suggestions, setSuggestions] = useState([])
  const [dismissed, setDismissed] = useState([])

  useEffect(() => {
    // Smart suggestions based on time, user behavior, etc.
    const smartSuggestions = [
      {
        id: 1,
        text: '🎓 Looking for MBA? Check out top-ranked programs',
        action: { category: 'MBA', country: 'US' }
      },
      {
        id: 2,
        text: '💡 Popular this week: AI & Machine Learning courses',
        action: { category: 'AI' }
      },
      {
        id: 3,
        text: '💰 Budget-friendly options available in Canada',
        action: { country: 'CA', maxBudget: 30000 }
      }
    ]
    setSuggestions(smartSuggestions.filter(s => !dismissed.includes(s.id)))
  }, [dismissed])

  const handleDismiss = (id) => {
    setDismissed([...dismissed, id])
  }

  if (suggestions.length === 0) return null

  return (
    <div className="space-y-2">
      {suggestions.map((suggestion, index) => (
        <motion.div
          key={suggestion.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-gradient-to-r from-primary-50 to-purple-50 border border-primary-200 rounded-lg p-4 flex items-center justify-between"
        >
          <div className="flex items-center space-x-3 flex-1">
            <Lightbulb className="h-5 w-5 text-primary-600" />
            <button
              onClick={() => onSuggestionClick?.(suggestion.action)}
              className="text-sm text-gray-700 hover:text-primary-600 transition-colors text-left"
            >
              {suggestion.text}
            </button>
          </div>
          <button
            onClick={() => handleDismiss(suggestion.id)}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        </motion.div>
      ))}
    </div>
  )
}

