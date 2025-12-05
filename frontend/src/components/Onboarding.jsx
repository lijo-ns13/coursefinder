import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ArrowRight, Search, GitCompare, Heart, TrendingUp } from 'lucide-react'

export default function Onboarding({ onComplete }) {
  const [step, setStep] = useState(0)
  const [show, setShow] = useState(true)

  useEffect(() => {
    const seen = localStorage.getItem('onboarding-seen')
    if (seen === 'true') {
      setShow(false)
    }
  }, [])

  const steps = [
    {
      title: 'Welcome to CourseFinder! 🎓',
      content: 'Your AI-powered platform to discover and compare courses from top universities worldwide.',
      icon: '🎯',
      position: 'center'
    },
    {
      title: 'Search Courses',
      content: 'Use our powerful search to find courses by country, category, budget, and more.',
      icon: <Search className="h-8 w-8 text-primary-600" />,
      position: 'top-left',
      highlight: '.search-section'
    },
    {
      title: 'AI Recommendations',
      content: 'Get personalized course recommendations based on your profile, marks, and preferences.',
      icon: <TrendingUp className="h-8 w-8 text-primary-600" />,
      position: 'top-center',
      highlight: '.ai-section'
    },
    {
      title: 'Save & Compare',
      content: 'Save your favorite courses and compare them side-by-side with AI-powered insights.',
      icon: <GitCompare className="h-8 w-8 text-primary-600" />,
      position: 'top-right',
      highlight: '.compare-section'
    },
    {
      title: 'You\'re All Set!',
      content: 'Start exploring courses and find your perfect match. Need help? Click the help icon anytime.',
      icon: '🚀',
      position: 'center'
    }
  ]

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1)
    } else {
      handleComplete()
    }
  }

  const handleComplete = () => {
    localStorage.setItem('onboarding-seen', 'true')
    setShow(false)
    onComplete?.()
  }

  const handleSkip = () => {
    handleComplete()
  }

  if (!show) return null

  return (
    <AnimatePresence>
      {show && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-50"
            onClick={handleSkip}
          />

          {/* Onboarding Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed z-50 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <div className="text-4xl mb-2">{steps[step].icon}</div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {steps[step].title}
                </h2>
                <p className="text-gray-600">{steps[step].content}</p>
              </div>
              <button
                onClick={handleSkip}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex justify-between text-sm text-gray-500 mb-2">
                <span>Step {step + 1} of {steps.length}</span>
                <span>{Math.round(((step + 1) / steps.length) * 100)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${((step + 1) / steps.length) * 100}%` }}
                  className="bg-primary-600 h-2 rounded-full"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={handleSkip}
                className="btn-secondary flex-1"
              >
                Skip Tour
              </button>
              <button
                onClick={handleNext}
                className="btn-primary flex-1 flex items-center justify-center"
              >
                {step === steps.length - 1 ? 'Get Started' : 'Next'}
                {step < steps.length - 1 && <ArrowRight className="h-4 w-4 ml-2" />}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

