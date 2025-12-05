import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { GitCompare, X, TrendingUp, Sparkles } from 'lucide-react'
import { useCourseStore } from '../store/courseStore'
import { aiAPI } from '../api/ai'
import { useAuthStore } from '../store/authStore'
import PhoneModal from '../components/PhoneModal'
import toast from 'react-hot-toast'

export default function ComparisonPage() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuthStore()
  const { selectedCourses, clearComparison, setComparisonData, comparisonData } = useCourseStore()
  const [loading, setLoading] = useState(false)
  const [showPhoneModal, setShowPhoneModal] = useState(false)

  useEffect(() => {
    if (selectedCourses.length === 2 && !comparisonData) {
      handleCompare()
    }
  }, [selectedCourses])

  const handleCompare = async () => {
    if (selectedCourses.length !== 2) {
      toast.error('Please select exactly 2 courses to compare')
      return
    }

    if (!isAuthenticated) {
      setShowPhoneModal(true)
      return
    }

    setLoading(true)
    try {
      const response = await aiAPI.compareCourses(
        selectedCourses[0]._id,
        selectedCourses[1]._id
      )
      setComparisonData(response.comparison)
      toast.success('Comparison generated!')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to generate comparison')
    } finally {
      setLoading(false)
    }
  }

  const removeCourse = (index) => {
    const newCourses = selectedCourses.filter((_, i) => i !== index)
    clearComparison()
    newCourses.forEach(course => {
      useCourseStore.getState().addToComparison(course)
    })
  }

  if (selectedCourses.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-20"
      >
        <div className="inline-block p-6 bg-gradient-to-br from-primary-100 to-purple-100 rounded-full mb-6">
          <GitCompare className="h-20 w-20 text-primary-600" />
        </div>
        <h2 className="text-4xl font-bold text-gray-900 mb-3">No Courses Selected</h2>
        <p className="text-xl text-gray-600 mb-8 max-w-md mx-auto">
          Select courses from search results to compare them side-by-side
        </p>
        <button onClick={() => navigate('/search')} className="btn-primary text-lg px-8 py-4">
          Search Courses
        </button>
      </motion.div>
    )
  }

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-r from-primary-600 via-purple-600 to-pink-600 p-4 sm:p-6 md:p-8"
      >
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="relative z-10">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-2 flex items-center gap-2 sm:gap-3">
            <GitCompare className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 flex-shrink-0" />
            <span>Compare Courses</span>
          </h1>
          <p className="text-white/90 text-sm sm:text-base lg:text-lg">Side-by-side comparison with AI insights</p>
        </div>
      </motion.div>

      {/* Selected Courses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {selectedCourses.map((course, index) => (
          <motion.div
            key={course._id}
            initial={{ opacity: 0, x: index === 0 ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="card-premium relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 via-purple-500 to-pink-500"></div>
            <button
              onClick={() => removeCourse(index)}
              className="absolute top-4 right-4 p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors z-10"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="pr-12">
              <h3 className="text-2xl font-bold text-gray-900 mb-3 line-clamp-2">{course.name}</h3>
              <p className="text-primary-600 font-semibold mb-2 text-lg">{course.university?.name}</p>
              <p className="text-sm text-gray-600 mb-4">{course.university?.location?.country}</p>
              {course.fees?.amount && (
                <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200">
                  <p className="text-sm text-gray-600 mb-1">Fees</p>
                  <p className="text-2xl font-extrabold text-green-700">
                    {course.fees.currency} {course.fees.amount.toLocaleString()} / {course.fees.per}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {selectedCourses.length < 2 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12 card-premium"
        >
          <p className="text-xl text-gray-700 mb-6 font-medium">Select one more course to compare</p>
          <button onClick={() => navigate('/search')} className="btn-primary text-lg px-8 py-4">
            Search Courses
          </button>
        </motion.div>
      )}

      {selectedCourses.length === 2 && !comparisonData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <button
            onClick={handleCompare}
            className="bg-gradient-to-r from-purple-600 via-pink-600 to-primary-600 text-white text-lg px-10 py-4 rounded-xl font-bold shadow-xl hover:shadow-2xl transition-all transform hover:scale-105"
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white inline-block mr-2"></div>
                Generating Comparison...
              </>
            ) : (
              'Generate AI Comparison'
            )}
          </button>
        </motion.div>
      )}

      {/* Comparison Results */}
      {comparisonData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div className="card-premium bg-gradient-to-br from-purple-50 via-pink-50 to-primary-50 border-2 border-purple-200">
            <div className="flex items-center gap-3 mb-6">
              <Sparkles className="h-8 w-8 text-purple-600" />
              <h2 className="text-3xl font-bold text-gray-900">AI Comparison Analysis</h2>
            </div>

            {comparisonData.aiAnalysis && (
              <div className="space-y-6">
                {comparisonData.aiAnalysis.comparison && (
                  <div className="space-y-4">
                    {Object.entries(comparisonData.aiAnalysis.comparison).map(([key, value], index) => (
                      <motion.div
                        key={key}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-4 bg-white rounded-xl border border-gray-200"
                      >
                        <h3 className="font-bold text-gray-900 capitalize mb-2 text-lg">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </h3>
                        <p className="text-gray-700 leading-relaxed">{value}</p>
                      </motion.div>
                    ))}
                  </div>
                )}

                {comparisonData.aiAnalysis.verdict && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-6 bg-gradient-to-r from-primary-500 to-purple-500 rounded-xl text-white shadow-xl"
                  >
                    <h3 className="font-bold text-white mb-3 text-xl flex items-center gap-2">
                      <TrendingUp className="h-6 w-6" />
                      AI Verdict
                    </h3>
                    <p className="text-white/95 text-lg leading-relaxed">{comparisonData.aiAnalysis.verdict}</p>
                  </motion.div>
                )}

                {comparisonData.aiAnalysis.recommendation && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-6 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl text-white shadow-xl"
                  >
                    <h3 className="font-bold text-white mb-3 text-xl">Recommendation</h3>
                    <p className="text-white/95 text-lg leading-relaxed">{comparisonData.aiAnalysis.recommendation}</p>
                  </motion.div>
                )}
              </div>
            )}
          </div>

          {/* Side by Side Comparison */}
          <div className="grid md:grid-cols-2 gap-6">
            {selectedCourses.map((course, index) => (
              <div key={course._id} className="card">
                <h3 className="text-xl font-semibold mb-4">{course.name}</h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm text-gray-500">University:</span>
                    <p className="font-semibold">{course.university?.name}</p>
                  </div>
                  {course.fees?.amount && (
                    <div>
                      <span className="text-sm text-gray-500">Fees:</span>
                      <p className="font-semibold">
                        {course.fees.currency} {course.fees.amount.toLocaleString()} / {course.fees.per}
                      </p>
                    </div>
                  )}
                  {course.university?.ranking && (
                    <div>
                      <span className="text-sm text-gray-500">Ranking:</span>
                      <p className="font-semibold">#{course.university.ranking}</p>
                    </div>
                  )}
                  {course.university?.acceptanceRate && (
                    <div>
                      <span className="text-sm text-gray-500">Acceptance Rate:</span>
                      <p className="font-semibold">{course.university.acceptanceRate}%</p>
                    </div>
                  )}
                  {course.jobOutcomes?.averageSalary && (
                    <div>
                      <span className="text-sm text-gray-500">Avg Salary:</span>
                      <p className="font-semibold">
                        {course.jobOutcomes.currency} {course.jobOutcomes.averageSalary.toLocaleString()}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      <PhoneModal
        isOpen={showPhoneModal}
        onClose={() => setShowPhoneModal(false)}
      />
    </div>
  )
}

