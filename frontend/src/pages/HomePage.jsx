import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, GraduationCap, TrendingUp, Users, Sparkles, Shield, Zap, Globe, GitCompare } from 'lucide-react'
import { coursesAPI } from '../api/courses'
import { useAuthStore } from '../store/authStore'
import PhoneModal from '../components/PhoneModal'
import CourseCard from '../components/CourseCard'
import Onboarding from '../components/Onboarding'
import QuickFilters from '../components/QuickFilters'
import Testimonials from '../components/Testimonials'
import FeatureHighlight from '../components/FeatureHighlight'
import StatsCard from '../components/StatsCard'
import toast from 'react-hot-toast'

export default function HomePage() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuthStore()
  const [showPhoneModal, setShowPhoneModal] = useState(false)
  const [popularCourses, setPopularCourses] = useState([])
  const [loading, setLoading] = useState(false)
  const [showOnboarding, setShowOnboarding] = useState(false)

  useEffect(() => {
    loadPopularCourses()
    // Show onboarding for new users
    const seen = localStorage.getItem('onboarding-seen')
    if (!seen) {
      setTimeout(() => setShowOnboarding(true), 1000)
    }
  }, [])

  const loadPopularCourses = async () => {
    try {
      const response = await coursesAPI.getPopular(6)
      setPopularCourses(response.courses || [])
    } catch (error) {
      console.error('Failed to load popular courses:', error)
      // Set empty array on error to prevent UI issues
      setPopularCourses([])
    }
  }

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate('/search')
    } else {
      setShowPhoneModal(true)
    }
  }

  return (
    <div className="space-y-16">
      {/* Onboarding */}
      {showOnboarding && (
        <Onboarding onComplete={() => setShowOnboarding(false)} />
      )}

      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-mesh"></div>
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>

        {/* Floating Orbs - Hidden on mobile for performance */}
        <motion.div
          className="hidden md:block absolute top-20 left-10 w-72 h-72 bg-primary-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="hidden md:block absolute bottom-20 right-10 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"
          animate={{
            x: [0, -100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        <div className="relative z-10 bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-12 md:p-16 lg:p-20 border border-white/20 shadow-2xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-block mb-4 sm:mb-6"
            >
              <span className="px-4 py-2 sm:px-6 sm:py-3 bg-gradient-to-r from-primary-100 to-purple-100 text-primary-700 rounded-full text-xs sm:text-sm font-bold shadow-lg border border-primary-200">
                🚀 AI-Powered Course Discovery Platform
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-gray-900 mb-4 sm:mb-6 leading-tight px-2"
            >
              Find Your Perfect Course
              <br />
              <span className="text-gradient animate-shimmer bg-clip-text">
                Worldwide
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 mb-8 sm:mb-12 max-w-3xl mx-auto leading-relaxed font-medium px-4"
            >
              Discover, compare, and apply to courses from top universities globally.
              <span className="text-primary-600 font-semibold"> Get AI-powered recommendations</span> tailored to your profile.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-8 sm:mb-12 px-4"
            >
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/search')}
                className="btn-primary w-full sm:w-auto text-base sm:text-lg px-6 sm:px-10 py-4 shadow-2xl"
              >
                <Search className="h-5 w-5" />
                Explore Courses
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleGetStarted}
                className="btn-secondary w-full sm:w-auto text-base sm:text-lg px-6 sm:px-10 py-4 shadow-xl"
              >
                <Sparkles className="h-5 w-5" />
                Get AI Recommendations
              </motion.button>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap justify-center gap-3 sm:gap-4 md:gap-8 px-4"
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 bg-white/60 backdrop-blur-sm rounded-lg sm:rounded-xl shadow-md"
              >
                <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-green-500 flex-shrink-0" />
                <span className="text-xs sm:text-sm font-semibold text-gray-700 whitespace-nowrap">100% Accurate</span>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 bg-white/60 backdrop-blur-sm rounded-lg sm:rounded-xl shadow-md"
              >
                <Zap className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-500 flex-shrink-0" />
                <span className="text-xs sm:text-sm font-semibold text-gray-700 whitespace-nowrap">AI-Powered</span>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 bg-white/60 backdrop-blur-sm rounded-lg sm:rounded-xl shadow-md"
              >
                <Globe className="h-5 w-5 sm:h-6 sm:w-6 text-blue-500 flex-shrink-0" />
                <span className="text-xs sm:text-sm font-semibold text-gray-700 whitespace-nowrap">50+ Countries</span>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6"
      >
        <StatsCard
          icon={GraduationCap}
          label="Universities"
          value="1000+"
          color="primary"
        />
        <StatsCard
          icon={TrendingUp}
          label="Courses"
          value="5000+"
          color="green"
        />
        <StatsCard
          icon={Users}
          label="Students Helped"
          value="10K+"
          color="blue"
        />
        <StatsCard
          icon={Sparkles}
          label="Success Rate"
          value="95%"
          trend={5}
          color="purple"
        />
      </motion.div>

      {/* Quick Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Quick Start</h2>
            <p className="text-gray-600 mt-1">Jumpstart your course search</p>
          </div>
        </div>
        <QuickFilters />
      </motion.div>

      {/* Features */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative"
      >
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
            Why Choose <span className="text-gradient">CourseFinder?</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Everything you need to make the right decision about your education
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <FeatureHighlight
            icon={Sparkles}
            title="AI-Powered Matching"
            description="Get personalized recommendations based on your profile, marks, IELTS score, and budget."
            delay={0.1}
          />
          <FeatureHighlight
            icon={GitCompare}
            title="Smart Comparison"
            description="Compare courses side-by-side with AI-generated insights on fees, ranking, and outcomes."
            delay={0.2}
          />
          <FeatureHighlight
            icon={Shield}
            title="Accurate Data"
            description="Real-time data from trusted sources. Fees, requirements, and job outcomes you can trust."
            delay={0.3}
          />
          <FeatureHighlight
            icon={Zap}
            title="Save & Track"
            description="Save favorite courses, track applications, and get reminders for deadlines."
            delay={0.4}
          />
        </div>
      </motion.div>

      {/* Testimonials */}
      <Testimonials />

      {/* Popular Courses */}
      {popularCourses.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6 px-2">Popular Courses</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {popularCourses.map((course, index) => (
              <motion.div
                key={course._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
              >
                <CourseCard course={course} />
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      <PhoneModal
        isOpen={showPhoneModal}
        onClose={() => setShowPhoneModal(false)}
        onSuccess={() => navigate('/search')}
      />
    </div>
  )
}

