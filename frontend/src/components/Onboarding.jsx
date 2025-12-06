import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ArrowRight, Search, GitCompare, Sparkles, TrendingUp, GraduationCap } from 'lucide-react'

export default function Onboarding({ onComplete, forceShow = false }) {
  const [step, setStep] = useState(0)
  const [show, setShow] = useState(false)

  useEffect(() => {
    // Check if tour should be shown
    const checkTour = () => {
      const seen = localStorage.getItem('onboarding-seen')
      if (forceShow || seen !== 'true') {
        setShow(true)
        setStep(0)
      } else {
        setShow(false)
      }
    }
    
    checkTour()
    
    // Listen for storage changes (when HelpButton removes the flag)
    const handleStorageChange = (e) => {
      if (e.key === 'onboarding-seen') {
        if (!e.newValue) {
          setShow(true)
          setStep(0)
        } else {
          setShow(false)
        }
      }
    }
    
    // Listen for custom event from HelpButton
    const handleShowTour = () => {
      setShow(true)
      setStep(0)
    }
    
    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('show-onboarding-tour', handleShowTour)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('show-onboarding-tour', handleShowTour)
    }
  }, [forceShow])

  const steps = [
    {
      title: 'Welcome to CourseFinder!',
      content: 'Your AI-powered platform to discover and compare courses from top universities worldwide.',
      icon: <GraduationCap className="h-12 w-12 text-gray-900" />,
      position: 'center'
    },
    {
      title: 'Search Courses',
      content: 'Use the search form to filter courses by country, program category, and level. Find exactly what you need.',
      icon: <Search className="h-12 w-12 text-gray-900" />,
      position: 'center'
    },
    {
      title: 'AI Recommendations',
      content: 'Click "Get AI Recommendations" to receive personalized course suggestions based on your profile, marks, IELTS score, and budget.',
      icon: <Sparkles className="h-12 w-12 text-gray-900" />,
      position: 'center'
    },
    {
      title: 'Compare Courses',
      content: 'Save courses and compare them side-by-side with AI-generated insights on fees, rankings, and job outcomes.',
      icon: <GitCompare className="h-12 w-12 text-gray-900" />,
      position: 'center'
    },
    {
      title: 'You\'re All Set!',
      content: 'Start exploring courses and find your perfect match. Need help? Click the help icon in the bottom-right corner anytime.',
      icon: <TrendingUp className="h-12 w-12 text-gray-900" />,
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
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed z-50 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl sm:rounded-2xl shadow-2xl max-w-md w-[calc(100vw-2rem)] mx-4 p-4 sm:p-6 border border-gray-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-4 sm:mb-6">
              <div className="flex-1 pr-2">
                <div className="flex justify-center mb-3 sm:mb-4">
                  {steps[step].icon}
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3 text-center">
                  {steps[step].title}
                </h2>
                <p className="text-sm sm:text-base text-gray-600 text-center leading-relaxed">{steps[step].content}</p>
              </div>
              <button
                onClick={handleSkip}
                className="flex-shrink-0 p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Close tour"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            {/* Progress Bar */}
            <div className="mb-4 sm:mb-6">
              <div className="flex justify-between text-xs sm:text-sm text-gray-500 mb-2">
                <span>Step {step + 1} of {steps.length}</span>
                <span>{Math.round(((step + 1) / steps.length) * 100)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${((step + 1) / steps.length) * 100}%` }}
                  className="bg-gray-900 h-2 rounded-full transition-all"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <button
                onClick={handleSkip}
                className="bg-white border-2 border-gray-300 text-gray-700 hover:border-gray-900 hover:text-gray-900 font-semibold py-2.5 px-4 rounded-lg transition-all text-sm flex-1"
              >
                Skip Tour
              </button>
              <button
                onClick={handleNext}
                className="bg-gray-900 hover:bg-gray-800 text-white font-semibold py-2.5 px-4 rounded-lg transition-all text-sm flex-1 flex items-center justify-center gap-2"
              >
                {step === steps.length - 1 ? 'Get Started' : 'Next'}
                {step < steps.length - 1 && <ArrowRight className="h-4 w-4" />}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

