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
    <div className="space-y-12 sm:space-y-16 md:space-y-20">
      {/* Onboarding */}
      {showOnboarding && (
        <Onboarding onComplete={() => setShowOnboarding(false)} />
      )}

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-purple-50 -z-10"></div>
        <div className="absolute inset-0 bg-grid-pattern opacity-5 -z-10"></div>

        {/* Floating Orbs - Hidden on mobile for performance */}
        <motion.div
          className="hidden lg:block absolute top-20 left-10 w-72 h-72 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float"
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
          className="hidden lg:block absolute bottom-20 right-10 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float"
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

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20 lg:py-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            {/* Badge */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-block mb-6 sm:mb-8"
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 bg-primary-100 text-primary-700 rounded-full text-xs sm:text-sm font-semibold shadow-sm border border-primary-200">
                <Sparkles className="h-4 w-4" />
                AI-Powered Course Discovery
              </span>
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight tracking-tight"
            >
              Find Your Perfect
              <br />
              <span className="text-gradient bg-clip-text text-transparent">
                Course Worldwide
              </span>
            </motion.h1>

            {/* Subheading */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-base sm:text-lg md:text-xl text-gray-600 mb-8 sm:mb-10 max-w-2xl mx-auto leading-relaxed"
            >
              Discover, compare, and apply to courses from top universities globally.
              <span className="text-primary-600 font-semibold"> Get AI-powered recommendations</span> tailored to your profile, marks, and budget.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-10 sm:mb-12 md:mb-16"
            >
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/search')}
                className="btn-primary px-6 sm:px-8 py-3 sm:py-4 shadow-xl hover:shadow-2xl"
              >
                <Search className="h-5 w-5" />
                Explore Courses
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleGetStarted}
                className="btn-secondary px-6 sm:px-8 py-3 sm:py-4 shadow-lg hover:shadow-xl"
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
              className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 md:gap-8"
            >
              <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm border border-gray-100">
                <Shield className="h-5 w-5 text-green-500 flex-shrink-0" />
                <span className="text-sm font-semibold text-gray-700">100% Accurate Data</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm border border-gray-100">
                <Zap className="h-5 w-5 text-yellow-500 flex-shrink-0" />
                <span className="text-sm font-semibold text-gray-700">AI-Powered</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm border border-gray-100">
                <Globe className="h-5 w-5 text-blue-500 flex-shrink-0" />
                <span className="text-sm font-semibold text-gray-700">50+ Countries</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-8 sm:py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6"
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
      </section>

      {/* Quick Filters Section */}
      <section className="py-8 sm:py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-8 sm:mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Quick Start</h2>
            <p className="text-base sm:text-lg text-gray-600">Jumpstart your course search with popular filters</p>
          </div>
          <QuickFilters />
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 bg-gray-50 rounded-2xl sm:rounded-3xl">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          <div className="text-center mb-10 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Why Choose <span className="text-gradient">CourseFinder?</span>
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
              Everything you need to make the right decision about your education
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
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
      </section>

      {/* Testimonials Section */}
      <section className="py-12 sm:py-16">
        <Testimonials />
      </section>

      {/* Popular Courses Section */}
      {popularCourses.length > 0 && (
        <section className="py-12 sm:py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center mb-8 sm:mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Popular Courses</h2>
              <p className="text-base sm:text-lg text-gray-600">Explore trending courses from top universities</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {popularCourses.map((course, index) => (
                <motion.div
                  key={course._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <CourseCard course={course} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-12 sm:py-16 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-r from-primary-600 via-purple-600 to-pink-600 p-8 sm:p-12 md:p-16"
        >
          <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
          <div className="relative z-10 text-center max-w-3xl mx-auto">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-5">
              Ready to Find Your Perfect Course?
            </h2>
            <p className="text-base sm:text-lg text-white/90 mb-6 sm:mb-8">
              Join thousands of students who found their dream course with AI-powered recommendations
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/search')}
                className="bg-white text-primary-600 px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold shadow-xl hover:shadow-2xl transition-all"
              >
                <Search className="inline-block h-5 w-5 mr-2" />
                Start Searching
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleGetStarted}
                className="bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold hover:bg-white/20 transition-all"
              >
                <Sparkles className="inline-block h-5 w-5 mr-2" />
                Get AI Recommendations
              </motion.button>
            </div>
          </div>
        </motion.div>
      </section>

      <PhoneModal
        isOpen={showPhoneModal}
        onClose={() => setShowPhoneModal(false)}
        onSuccess={() => navigate('/search')}
      />
    </div>
  )
}

