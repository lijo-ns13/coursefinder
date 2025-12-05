import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, Filter, Sparkles, TrendingUp } from 'lucide-react'
import { coursesAPI } from '../api/courses'
import { aiAPI } from '../api/ai'
import { useAuthStore } from '../store/authStore'
import PhoneModal from '../components/PhoneModal'
import CourseCard from '../components/CourseCard'
import Tooltip from '../components/Tooltip'
import SmartSuggestions from '../components/SmartSuggestions'
import toast from 'react-hot-toast'

export default function CourseSearchPage() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuthStore()
  const [showPhoneModal, setShowPhoneModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [courses, setCourses] = useState([])
  const [recommendations, setRecommendations] = useState([])
  const [showFilters, setShowFilters] = useState(false)

  const [filters, setFilters] = useState({
    query: '',
    country: '',
    category: '',
    minBudget: '',
    maxBudget: '',
    level: '',
    educationLevel: '',
    marks: { tenth: '', twelfth: '', degree: '' },
    ieltsScore: '',
    budget: '',
    preferredCourse: '',
    passedStatus: 'not_passed'
  })

  const handleSearch = async () => {
    setLoading(true)
    try {
      const response = await coursesAPI.search({
        query: filters.query,
        country: filters.country,
        category: filters.category,
        minBudget: filters.minBudget,
        maxBudget: filters.maxBudget,
        level: filters.level
      })
      setCourses(response.courses || [])
    } catch (error) {
      toast.error('Failed to search courses')
    } finally {
      setLoading(false)
    }
  }

  const handleAIFilter = async () => {
    if (!isAuthenticated) {
      setShowPhoneModal(true)
      return
    }

    setLoading(true)
    try {
      const response = await aiAPI.filterCourses({
        country: filters.country,
        educationLevel: filters.educationLevel,
        marks: filters.marks,
        ieltsScore: filters.ieltsScore,
        budget: filters.budget,
        preferredCourse: filters.preferredCourse,
        passedStatus: filters.passedStatus
      })
      setRecommendations(response.recommendations || [])
      toast.success('AI recommendations generated!')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to get AI recommendations')
    } finally {
      setLoading(false)
    }
  }

  const handleSuggestionClick = (action) => {
    setFilters({ ...filters, ...action })
    handleSearch()
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-r from-primary-600 via-purple-600 to-pink-600 p-6 sm:p-8 md:p-12"
      >
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="relative z-10">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-2 sm:mb-3">
            Search Courses
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-white/90 mb-4 sm:mb-6">
            Find your perfect course from thousands of options worldwide
          </p>
          <Tooltip text="Use filters to narrow down your search. Click 'Get AI Recommendations' for personalized suggestions.">
            <span className="inline-flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 bg-white/20 backdrop-blur-sm rounded-lg text-white text-xs sm:text-sm cursor-help hover:bg-white/30 transition-colors">
              Need help?
            </span>
          </Tooltip>
        </div>
      </motion.div>

      {/* Smart Suggestions */}
      <SmartSuggestions onSuggestionClick={handleSuggestionClick} />

      {/* Search Bar */}
      <div className="card-premium">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 sm:h-5 sm:w-5 z-10" />
            <input
              type="text"
              value={filters.query}
              onChange={(e) => setFilters({ ...filters, query: e.target.value })}
              className="input-field pl-10 sm:pl-12 text-sm sm:text-base"
              placeholder="Search courses, universities..."
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <div className="flex gap-2 sm:gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSearch}
              className="btn-primary flex-1 sm:flex-none"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white"></div>
                  <span className="hidden sm:inline">Searching...</span>
                </>
              ) : (
                <>
                  <Search className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="hidden sm:inline">Search</span>
                </>
              )}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowFilters(!showFilters)}
              className={`btn-secondary ${showFilters ? 'bg-primary-50 border-primary-300' : ''}`}
            >
              <Filter className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="hidden sm:inline">Filters</span>
            </motion.button>
          </div>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t-2 border-gray-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
              <input
                type="text"
                value={filters.country}
                onChange={(e) => setFilters({ ...filters, country: e.target.value })}
                className="input-field"
                placeholder="e.g., Canada, UK"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={filters.category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                className="input-field"
              >
                <option value="">All Categories</option>
                <option value="AI">Artificial Intelligence</option>
                <option value="CS">Computer Science</option>
                <option value="MBA">MBA</option>
                <option value="Nursing">Nursing</option>
                <option value="Engineering">Engineering</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Budget (Max)</label>
              <input
                type="number"
                value={filters.maxBudget}
                onChange={(e) => setFilters({ ...filters, maxBudget: e.target.value })}
                className="input-field"
                placeholder="USD"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Education Level</label>
              <select
                value={filters.educationLevel}
                onChange={(e) => setFilters({ ...filters, educationLevel: e.target.value })}
                className="input-field"
              >
                <option value="">Select</option>
                <option value="10th">10th Grade</option>
                <option value="12th">12th Grade</option>
                <option value="degree">Degree</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">IELTS Score</label>
              <input
                type="number"
                value={filters.ieltsScore}
                onChange={(e) => setFilters({ ...filters, ieltsScore: e.target.value })}
                className="input-field"
                placeholder="e.g., 7.5"
                min="0"
                max="9"
                step="0.5"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={filters.passedStatus}
                onChange={(e) => setFilters({ ...filters, passedStatus: e.target.value })}
                className="input-field"
              >
                <option value="not_passed">Not Passed Yet</option>
                <option value="passed">Passed</option>
              </select>
            </div>
          </motion.div>
        )}

        {/* AI Filter Button */}
        <div className="mt-4 sm:mt-6">
          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleAIFilter}
            className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-primary-600 text-white px-4 py-3 sm:px-8 sm:py-4 rounded-xl font-bold text-sm sm:text-base lg:text-lg shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-2 sm:gap-3 min-h-[44px]"
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 sm:h-6 sm:w-6 border-b-2 border-white"></div>
                <span className="text-xs sm:text-sm lg:text-base">Analyzing...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5 sm:h-6 sm:w-6" />
                <span className="hidden sm:inline">Get AI-Powered Recommendations</span>
                <span className="sm:hidden">AI Recommendations</span>
                <Tooltip text="Our AI analyzes your profile, marks, IELTS score, and budget to recommend the best courses for you.">
                  <span className="text-xs sm:text-sm opacity-75 bg-white/20 px-2 py-1 rounded-full">?</span>
                </Tooltip>
              </>
            )}
          </motion.button>
        </div>
      </div>

      {/* Results */}
      {recommendations.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-50 via-pink-50 to-primary-50 p-6 border-2 border-purple-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3 mb-2">
                  <Sparkles className="h-8 w-8 text-purple-600" />
                  AI-Powered Recommendations
                </h2>
                <p className="text-gray-700 font-medium">Personalized just for you based on your profile</p>
              </div>
              <Tooltip text="These recommendations are generated by AI analyzing your profile, marks, IELTS score, and budget preferences.">
                <span className="text-sm text-gray-600 cursor-help hover:text-purple-600 transition-colors font-medium">How it works?</span>
              </Tooltip>
            </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {recommendations.map((rec, index) => (
                <motion.div
                  key={rec.course._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="card border-2 border-purple-200 hover:border-purple-400 transition-all bg-white">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-lg font-bold text-gray-900 line-clamp-2 flex-1 pr-2">{rec.course.name}</h3>
                      <span className={`badge ${rec.acceptanceProbability === 'high' ? 'badge-success' :
                          rec.acceptanceProbability === 'medium' ? 'badge-warning' :
                            'badge-danger'
                        }`}>
                        {rec.acceptanceProbability}
                      </span>
                    </div>
                    <p className="text-primary-600 font-semibold mb-2">{rec.course.university?.name}</p>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{rec.justification}</p>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div>
                        <span className="text-xs text-gray-500 block">Fit Score</span>
                        <span className="text-primary-600 font-bold text-lg">{rec.fitScore}/10</span>
                      </div>
                      <button
                        onClick={() => navigate(`/course/${rec.course._id}`)}
                        className="btn-primary text-sm px-4 py-2"
                      >
                        View Details →
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {courses.length > 0 && recommendations.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Search Results</h2>
              <p className="text-gray-600 mt-1">Found {courses.length} courses matching your criteria</p>
            </div>
            <span className="px-4 py-2 bg-primary-100 text-primary-700 rounded-full font-semibold">
              {courses.length} results
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {courses.map((course, index) => (
              <motion.div
                key={course._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <CourseCard course={course} />
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {courses.length === 0 && recommendations.length === 0 && !loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-900 mb-2">No courses found</h3>
          <p className="text-gray-600 mb-6">Try adjusting your search criteria or filters</p>
          <button onClick={() => setShowFilters(true)} className="btn-primary">
            Adjust Filters
          </button>
        </motion.div>
      )}

      <PhoneModal
        isOpen={showPhoneModal}
        onClose={() => setShowPhoneModal(false)}
      />
    </div>
  )
}

