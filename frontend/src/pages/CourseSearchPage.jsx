import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, Filter, Sparkles, X, ChevronDown, ChevronUp } from 'lucide-react'
import { coursesAPI } from '../api/courses'
import { aiAPI } from '../api/ai'
import { useAuthStore } from '../store/authStore'
import PhoneModal from '../components/PhoneModal'
import CourseCard from '../components/CourseCard'
import toast from 'react-hot-toast'

export default function CourseSearchPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated } = useAuthStore()
  const [showPhoneModal, setShowPhoneModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [courses, setCourses] = useState([])
  const [recommendations, setRecommendations] = useState([])
  const [showFilters, setShowFilters] = useState(false)

  const [filters, setFilters] = useState({
    query: '',
    country: location.state?.country || '',
    category: location.state?.category || '',
    minBudget: '',
    maxBudget: '',
    level: location.state?.level || '',
    educationLevel: '',
    marks: { tenth: '', twelfth: '', degree: '' },
    ieltsScore: '',
    budget: '',
    preferredCourse: '',
    passedStatus: 'not_passed'
  })

  useEffect(() => {
    // Auto-search if filters are pre-filled from homepage
    if (location.state?.country || location.state?.category) {
      handleSearch()
    }
  }, [])

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
      if (response.courses?.length === 0) {
        toast.error('No courses found. Try adjusting your filters.')
      }
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

    if (!filters.category && !filters.preferredCourse) {
      toast.error('Please select a program category first')
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
        preferredCourse: filters.preferredCourse || filters.category,
        category: filters.category,
        passedStatus: filters.passedStatus
      })
      setRecommendations(response.recommendations || [])
      if (response.recommendations?.length > 0) {
        toast.success(`Found ${response.recommendations.length} AI recommendations!`)
      } else {
        toast.error('No recommendations found. Try adjusting your filters.')
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to get AI recommendations')
    } finally {
      setLoading(false)
    }
  }

  const clearFilters = () => {
    setFilters({
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
    setCourses([])
    setRecommendations([])
  }

  const countries = ['Canada', 'Switzerland', 'U.S.A', 'Australia', 'New Zealand', 'UK', 'Dubai', 'Saudi', 'France', 'Germany', 'Ireland', 'Finland', 'Sweden']
  const categories = ['Engineering & Technology', 'Health Sciences, Medicine, Nursing', 'Business, Management & Economics', 'Law, Politics, Social, Community Service', 'Arts', 'Sciences', 'English For Academic Studies']
  const levels = ['undergraduate', 'graduate', 'diploma']

  const displayCourses = recommendations.length > 0 
    ? recommendations.map(r => r.course).filter(Boolean) 
    : (courses || [])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2">Find Your Perfect Program</h1>
          <p className="text-sm sm:text-base text-gray-600">Search from thousands of courses worldwide</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Filters
                </h2>
                <button
                  onClick={clearFilters}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  Clear
                </button>
              </div>

              <div className="space-y-4">
                {/* Search Query */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                  <input
                    type="text"
                    value={filters.query}
                    onChange={(e) => setFilters({ ...filters, query: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    placeholder="Course or university name..."
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </div>

                {/* Country */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                  <select
                    value={filters.country}
                    onChange={(e) => setFilters({ ...filters, country: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  >
                    <option value="">All Countries</option>
                    {countries.map(country => (
                      <option key={country} value={country}>{country}</option>
                    ))}
                  </select>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Program Category</label>
                  <select
                    value={filters.category}
                    onChange={(e) => setFilters({ ...filters, category: e.target.value, preferredCourse: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  >
                    <option value="">All Categories</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Level */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Program Level</label>
                  <select
                    value={filters.level}
                    onChange={(e) => setFilters({ ...filters, level: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  >
                    <option value="">All Levels</option>
                    <option value="undergraduate">Undergraduate</option>
                    <option value="graduate">Graduate</option>
                    <option value="diploma">Diploma</option>
                  </select>
                </div>

                {/* Budget */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Budget (USD/year)</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      value={filters.minBudget}
                      onChange={(e) => setFilters({ ...filters, minBudget: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      placeholder="Min"
                    />
                    <input
                      type="number"
                      value={filters.maxBudget}
                      onChange={(e) => setFilters({ ...filters, maxBudget: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      placeholder="Max"
                    />
                  </div>
                </div>

                {/* Search Buttons */}
                <div className="space-y-2 pt-2">
                  <button
                    onClick={handleSearch}
                    disabled={loading}
                    className="w-full bg-gray-900 hover:bg-gray-800 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Searching...
                      </>
                    ) : (
                      <>
                        <Search className="h-4 w-4" />
                        Search Courses
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleAIFilter}
                    disabled={loading}
                    className="w-full bg-white border-2 border-gray-900 text-gray-900 hover:bg-gray-50 font-semibold py-2.5 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
                  >
                    <Sparkles className="h-4 w-4" />
                    AI Recommendations
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="lg:col-span-3">
            {/* Results Header */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {recommendations.length > 0 ? 'AI Recommendations' : 'Search Results'}
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    {displayCourses.length} {displayCourses.length === 1 ? 'course' : 'courses'} found
                  </p>
                </div>
                {recommendations.length > 0 && (
                  <button
                    onClick={() => {
                      setRecommendations([])
                      handleSearch()
                    }}
                    className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
                  >
                    <X className="h-4 w-4" />
                    Clear AI Results
                  </button>
                )}
              </div>
            </div>

            {/* Courses Grid */}
            {loading && displayCourses.length === 0 ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Searching courses...</p>
              </div>
            ) : displayCourses.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 sm:p-12 text-center">
                <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No courses found</h3>
                <p className="text-gray-600 mb-6">Try adjusting your filters or search terms</p>
                <button
                  onClick={clearFilters}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {displayCourses?.map((course, index) => (
                  <motion.div
                    key={course._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    {recommendations.length > 0 ? (
                      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 h-full">
                        <CourseCard course={course} />
                        {recommendations[index] && (
                          <div className="mt-4 pt-4 border-t border-gray-200">
                            <div className="flex items-center gap-2 mb-2">
                              <span className={`px-2 py-1 rounded text-xs font-medium ${
                                recommendations[index].acceptanceProbability === 'high' ? 'bg-green-100 text-green-800' :
                                recommendations[index].acceptanceProbability === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {recommendations[index].acceptanceProbability} chance
                              </span>
                              <span className="text-xs text-gray-600">
                                Fit Score: {recommendations[index].fitScore}/10
                              </span>
                            </div>
                            <p className="text-sm text-gray-700">{recommendations[index].justification}</p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <CourseCard course={course} />
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <PhoneModal
        isOpen={showPhoneModal}
        onClose={() => setShowPhoneModal(false)}
        onSuccess={() => navigate('/search')}
      />
    </div>
  )
}
