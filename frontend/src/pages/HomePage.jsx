import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Search, GraduationCap, Sparkles, ArrowRight, 
  Globe, TrendingUp, Users, Shield, Zap, CheckCircle,
  Target, GitCompare, Star, ChevronRight
} from 'lucide-react'
import { coursesAPI } from '../api/courses'
import { useAuthStore } from '../store/authStore'
import PhoneModal from '../components/PhoneModal'
import CourseCard from '../components/CourseCard'
import Onboarding from '../components/Onboarding'
import toast from 'react-hot-toast'

export default function HomePage() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuthStore()
  const [showPhoneModal, setShowPhoneModal] = useState(false)
  const [popularCourses, setPopularCourses] = useState([])
  const [selectedCountry, setSelectedCountry] = useState('')
  const [selectedProgram, setSelectedProgram] = useState('')
  const [selectedLevel, setSelectedLevel] = useState('')
  const [showOnboarding, setShowOnboarding] = useState(false)

  const countries = ['Canada', 'Switzerland', 'U.S.A', 'Australia', 'New Zealand', 'UK', 'Dubai', 'Saudi', 'France', 'Germany', 'Ireland', 'Finland', 'Sweden']
  const programs = ['Health Sciences, Medicine, Nursing', 'Business, Management & Economics', 'Law, Politics, Social, Community Service', 'Arts', 'Sciences', 'Engineering & Technology', 'English For Academic Studies']
  const levels = ['2 Year - Undergraduate Diploma', '3 Year - Undergraduate Advanced Diploma', '3 Year - Bachelor\'s Degree', '4 Year - Bachelor\'s Degree', 'Post Graduate Certificate/Masters Degree', '1 Year - Post Secondary Certificate']

  useEffect(() => {
    loadPopularCourses()
    // Check if onboarding should be shown
    const seen = localStorage.getItem('onboarding-seen')
    if (!seen) {
      setTimeout(() => setShowOnboarding(true), 1000)
    }
    
    // Listen for show tour event from HelpButton
    const handleShowTour = () => {
      setShowOnboarding(true)
    }
    window.addEventListener('show-onboarding-tour', handleShowTour)
    document.addEventListener('show-onboarding-tour', handleShowTour)
    
    return () => {
      window.removeEventListener('show-onboarding-tour', handleShowTour)
      document.removeEventListener('show-onboarding-tour', handleShowTour)
    }
  }, [])

  const loadPopularCourses = async () => {
    try {
      const response = await coursesAPI.getPopular(6)
      setPopularCourses(response.courses || [])
    } catch (error) {
      console.error('Failed to load popular courses:', error)
      setPopularCourses([])
    }
  }

  const handleSearch = () => {
    if (!selectedCountry || !selectedProgram || !selectedLevel) {
      toast.error('Please select all fields to search')
      return
    }
    navigate('/search', { 
      state: { 
        country: selectedCountry,
        category: selectedProgram,
        level: selectedLevel
      }
    })
  }

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate('/search')
    } else {
      setShowPhoneModal(true)
    }
  }

  const features = [
    {
      icon: Sparkles,
      title: 'AI-Powered Matching',
      description: 'Get personalized recommendations based on your profile, marks, IELTS score, and budget.'
    },
    {
      icon: Globe,
      title: 'Global Database',
      description: 'Access 675+ courses from 15+ countries. Real-time data from top universities worldwide.'
    },
    {
      icon: GitCompare,
      title: 'Smart Comparison',
      description: 'Compare courses side-by-side with AI-generated insights on fees, rankings, and outcomes.'
    },
    {
      icon: Shield,
      title: 'Accurate Data',
      description: 'Real-time data from trusted sources. Fees, requirements, and outcomes you can trust.'
    }
  ]

  const steps = [
    {
      number: '01',
      title: 'Tell Us About Yourself',
      description: 'Enter your profile details: marks, IELTS score, budget, and preferred country.'
    },
    {
      number: '02',
      title: 'Get AI Recommendations',
      description: 'Receive personalized course suggestions ranked by acceptance probability.'
    },
    {
      number: '03',
      title: 'Compare & Decide',
      description: 'Compare courses side-by-side with AI insights on fees, rankings, and outcomes.'
    },
    {
      number: '04',
      title: 'Save & Apply',
      description: 'Save your favorite courses and track your applications with our dashboard.'
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-white pt-12 sm:pt-16 md:pt-20 lg:pt-24 pb-12 sm:pb-16 md:pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center mb-6 sm:mb-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gray-50 rounded-full border border-gray-200">
              <Sparkles className="h-3.5 w-3.5 text-gray-600" />
              <span className="text-xs sm:text-sm font-medium text-gray-700">AI-Powered Course Discovery</span>
            </div>
          </motion.div>

          {/* Main Heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-center mb-8 sm:mb-12 max-w-4xl mx-auto"
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight tracking-tight">
              Find Your Perfect
              <br />
              <span className="text-gray-900">Study Abroad Course</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed px-4">
              Get AI-powered recommendations tailored to your profile. Compare courses, check acceptance rates, and make informed decisions.
            </p>
          </motion.div>

          {/* Search Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-4xl mx-auto mb-8 sm:mb-12"
          >
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 sm:p-6 md:p-8">
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1.5 sm:mb-2">Country</label>
                    <select
                      value={selectedCountry}
                      onChange={(e) => setSelectedCountry(e.target.value)}
                      className="w-full px-3 py-2.5 sm:px-4 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 text-sm sm:text-base bg-white transition-all"
                    >
                      <option value="">Select Country</option>
                      {countries.map(country => (
                        <option key={country} value={country}>{country}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1.5 sm:mb-2">Program</label>
                    <select
                      value={selectedProgram}
                      onChange={(e) => setSelectedProgram(e.target.value)}
                      className="w-full px-3 py-2.5 sm:px-4 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 text-sm sm:text-base bg-white transition-all"
                    >
                      <option value="">Select Program</option>
                      {programs.map(program => (
                        <option key={program} value={program}>{program}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1.5 sm:mb-2">Level</label>
                    <select
                      value={selectedLevel}
                      onChange={(e) => setSelectedLevel(e.target.value)}
                      className="w-full px-3 py-2.5 sm:px-4 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 text-sm sm:text-base bg-white transition-all"
                    >
                      <option value="">Select Level</option>
                      {levels.map(level => (
                        <option key={level} value={level}>{level}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleSearch}
                    className="flex-1 bg-gray-900 hover:bg-gray-800 text-white font-semibold py-3 sm:py-3.5 px-6 rounded-lg transition-all flex items-center justify-center gap-2 text-sm sm:text-base"
                  >
                    <Search className="h-4 w-4 sm:h-5 sm:w-5" />
                    Search Courses
                  </button>
                  <button
                    onClick={handleGetStarted}
                    className="sm:w-auto bg-white border-2 border-gray-900 text-gray-900 hover:bg-gray-50 font-semibold py-3 sm:py-3.5 px-6 rounded-lg transition-all flex items-center justify-center gap-2 text-sm sm:text-base"
                  >
                    <Sparkles className="h-4 w-4 sm:h-5 sm:w-5" />
                    Get AI Recommendations
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap justify-center items-center gap-3 sm:gap-4 md:gap-6"
          >
            {[
              { icon: Shield, text: '100% Accurate Data' },
              { icon: Sparkles, text: 'AI-Powered' },
              { icon: Globe, text: '15+ Countries' },
              { icon: Zap, text: 'Instant Results' }
            ].map((item, index) => {
              const Icon = item.icon
              return (
                <div key={index} className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-gray-50 rounded-lg border border-gray-200">
                  <Icon className="h-4 w-4 text-gray-600" />
                  <span className="text-xs sm:text-sm font-medium text-gray-700">{item.text}</span>
                </div>
              )
            })}
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 sm:py-16 bg-gray-50 border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 md:gap-12">
            {[
              { icon: GraduationCap, value: '675+', label: 'Courses', color: 'text-gray-900' },
              { icon: Globe, value: '15+', label: 'Countries', color: 'text-gray-900' },
              { icon: Users, value: '100K+', label: 'Students', color: 'text-gray-900' },
              { icon: TrendingUp, value: '95%', label: 'Success Rate', color: 'text-gray-900' }
            ].map((stat, index) => {
              const Icon = stat.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="inline-flex p-2 sm:p-3 bg-white rounded-lg mb-2 sm:mb-3 border border-gray-200">
                    <Icon className={`h-5 w-5 sm:h-6 sm:w-6 ${stat.color}`} />
                  </div>
                  <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-1">{stat.value}</div>
                  <div className="text-xs sm:text-sm text-gray-600 font-medium">{stat.label}</div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-20 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              Why Choose CourseFinder?
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
              The platform that combines AI intelligence with comprehensive course data
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl p-6 border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all"
                >
                  <div className="inline-flex p-3 bg-gray-50 rounded-lg mb-4 border border-gray-200">
                    <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-gray-900" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{feature.description}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 sm:py-20 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              How It Works
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
              Get your perfect course match in 4 simple steps
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                <div className="bg-white rounded-xl p-6 border border-gray-200 h-full">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-gray-900 text-white rounded-lg flex items-center justify-center font-bold text-sm">
                        {step.number}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
                      <p className="text-sm text-gray-600 leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                    <ChevronRight className="h-6 w-6 text-gray-300" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Courses */}
      {popularCourses.length > 0 && (
        <section className="py-16 sm:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
                Popular Courses
              </h2>
              <p className="text-base sm:text-lg text-gray-600">
                Explore trending courses from top universities
              </p>
            </motion.div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
              {popularCourses?.map((course, index) => (
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
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 sm:py-20 md:py-24 bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-6">
              Ready to Find Your Perfect Course?
            </h2>
            <p className="text-base sm:text-lg text-gray-300 mb-8 sm:mb-10 max-w-2xl mx-auto">
              Join thousands of students who found their dream course with AI-powered recommendations.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <button
                onClick={handleGetStarted}
                className="bg-white text-gray-900 font-semibold py-3 sm:py-3.5 px-6 sm:px-8 rounded-lg hover:bg-gray-100 transition-all flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                Get Started Free
                <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
              <button
                onClick={() => navigate('/search')}
                className="bg-gray-800 text-white border border-gray-700 font-semibold py-3 sm:py-3.5 px-6 sm:px-8 rounded-lg hover:bg-gray-700 transition-all flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                <Search className="h-4 w-4 sm:h-5 sm:w-5" />
                Browse Courses
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Onboarding */}
      {showOnboarding && (
        <Onboarding onComplete={() => setShowOnboarding(false)} />
      )}

      <PhoneModal
        isOpen={showPhoneModal}
        onClose={() => setShowPhoneModal(false)}
        onSuccess={() => navigate('/search')}
      />
    </div>
  )
}
