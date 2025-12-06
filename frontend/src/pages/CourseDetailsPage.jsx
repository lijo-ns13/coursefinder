import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MapPin, DollarSign, Clock, Book, TrendingUp, Heart } from 'lucide-react'
import { coursesAPI } from '../api/courses'
import { userAPI } from '../api/user'
import { useAuthStore } from '../store/authStore'
import { useCourseStore } from '../store/courseStore'
import PhoneModal from '../components/PhoneModal'
import CourseCard from '../components/CourseCard'
import toast from 'react-hot-toast'

export default function CourseDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuthStore()
  const { addToComparison } = useCourseStore()
  const [course, setCourse] = useState(null)
  const [similarCourses, setSimilarCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [showPhoneModal, setShowPhoneModal] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    loadCourse()
  }, [id])

  const loadCourse = async () => {
    try {
      setLoading(true)
      const response = await coursesAPI.getById(id)
      setCourse(response.course)
      setSimilarCourses(response.similarCourses || [])
    } catch (error) {
      toast.error('Failed to load course details')
      navigate('/search')
    } finally {
      setLoading(false)
    }
  }

  const handleSaveCourse = async () => {
    if (!isAuthenticated) {
      setShowPhoneModal(true)
      return
    }

    try {
      await userAPI.saveCourse(id)
      setSaved(true)
      toast.success('Course saved!')
    } catch (error) {
      toast.error('Failed to save course')
    }
  }

  const handleCompare = () => {
    if (course) {
      addToComparison(course)
      toast.success('Course added to comparison')
      navigate('/compare')
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-200 border-t-primary-600"></div>
        <p className="mt-4 text-gray-600 font-medium">Loading course details...</p>
      </div>
    )
  }

  if (!course) {
    return null
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-br from-primary-600 via-purple-600 to-pink-600 p-4 sm:p-6 md:p-8 lg:p-12"
      >
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start gap-4 sm:gap-6">
            <div className="flex-1 w-full">
              <div className="flex flex-wrap items-center gap-2 mb-3 sm:mb-4">
                {course.category && (
                  <span className="px-3 py-1.5 sm:px-4 sm:py-2 bg-white/20 backdrop-blur-sm text-white text-xs sm:text-sm font-bold rounded-full border border-white/30">
                    {course.category}
                  </span>
                )}
                {course.level && (
                  <span className="px-3 py-1.5 sm:px-4 sm:py-2 bg-white/20 backdrop-blur-sm text-white text-xs sm:text-sm font-bold rounded-full border border-white/30 capitalize">
                    {course.level}
                  </span>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-3 sm:mb-4 leading-tight">{course.name}</h1>
              <div className="flex flex-wrap items-center text-white/90 mb-3 sm:mb-4 gap-1">
                <MapPin className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 mr-1 sm:mr-2 flex-shrink-0" />
                <button
                  onClick={() => navigate(`/university/${encodeURIComponent(course.university?.name)}`)}
                  className="text-white font-bold hover:underline text-sm sm:text-base lg:text-lg break-words"
                >
                  {course.university?.name}
                </button>
                <span className="text-white/80 text-sm sm:text-base">, {course.university?.location?.country}</span>
              </div>
              {course.description && (
                <p className="text-white/90 text-sm sm:text-base lg:text-lg leading-relaxed">{course.description}</p>
              )}
            </div>
            <div className="flex gap-2 sm:gap-3 w-full md:w-auto mt-4 md:mt-0">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleSaveCourse}
                className={`p-3 sm:p-4 rounded-xl transition-all shadow-lg min-h-[44px] min-w-[44px] flex items-center justify-center ${saved
                    ? 'bg-green-500 text-white hover:bg-green-600'
                    : 'bg-white/20 backdrop-blur-sm text-white hover:bg-white/30'
                  }`}
                title={saved ? 'Unsave course' : 'Save course'}
              >
                <Heart className={`h-5 w-5 sm:h-6 sm:w-6 ${saved ? 'fill-current' : ''}`} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCompare}
                className="bg-white text-primary-600 px-4 py-3 sm:px-6 sm:py-4 rounded-xl font-bold text-sm sm:text-base shadow-xl hover:shadow-2xl transition-all flex-1 md:flex-none min-h-[44px]"
              >
                Compare
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Key Information */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {course.fees?.amount && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card-premium bg-gradient-to-br from-green-50 to-emerald-50 border-green-200"
          >
            <div className="p-4 bg-green-100 rounded-xl w-fit mb-4">
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-700 mb-2">Fees</h3>
            <p className="text-3xl font-extrabold text-gray-900 mb-1">
              {course.fees.currency} {course.fees.amount.toLocaleString()}
            </p>
            <p className="text-sm text-gray-600">per {course.fees.per}</p>
          </motion.div>
        )}
        {course.duration && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card-premium bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200"
          >
            <div className="p-4 bg-blue-100 rounded-xl w-fit mb-4">
              <Clock className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-700 mb-2">Duration</h3>
            <p className="text-2xl font-extrabold text-gray-900">{course.duration}</p>
          </motion.div>
        )}
        {course.university?.ranking && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card-premium bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200"
          >
            <div className="p-4 bg-purple-100 rounded-xl w-fit mb-4">
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-700 mb-2">Ranking</h3>
            <p className="text-2xl font-extrabold text-gray-900">#{course.university.ranking}</p>
          </motion.div>
        )}
        {course.aiFitScore && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="card-premium bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200"
          >
            <div className="p-4 bg-orange-100 rounded-xl w-fit mb-4">
              <Book className="h-8 w-8 text-orange-600" />
            </div>
            <h3 className="font-semibold text-gray-700 mb-2">Fit Score</h3>
            <p className="text-2xl font-extrabold text-gray-900">{course.aiFitScore}/10</p>
          </motion.div>
        )}
      </div>

      {/* Requirements */}
      {course.requirements && (
        <div className="card">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Requirements</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {course.requirements.educationLevel && (
              <div>
                <span className="text-sm text-gray-500">Education Level:</span>
                <p className="font-semibold">{course.requirements.educationLevel}</p>
              </div>
            )}
            {course.requirements.minMarks && (
              <div>
                <span className="text-sm text-gray-500">Minimum Marks:</span>
                <p className="font-semibold">{course.requirements.minMarks}%</p>
              </div>
            )}
            {course.requirements.ieltsMin && (
              <div>
                <span className="text-sm text-gray-500">IELTS Minimum:</span>
                <p className="font-semibold">{course.requirements.ieltsMin}</p>
              </div>
            )}
            {course.requirements.toeflMin && (
              <div>
                <span className="text-sm text-gray-500">TOEFL Minimum:</span>
                <p className="font-semibold">{course.requirements.toeflMin}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Course Content */}
      {course.courseContent && course.courseContent.length > 0 && (
        <div className="card">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Course Content</h2>
          <ul className="list-disc list-inside space-y-2">
            {course.courseContent?.map((content, index) => (
              <li key={index} className="text-gray-700">{content}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Job Outcomes */}
      {course.jobOutcomes && (
        <div className="card">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Career Outcomes & Placement</h2>
          <div className="grid md:grid-cols-3 gap-6 mb-6">
            {course.jobOutcomes.averageSalary && (
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <span className="text-sm text-gray-600 block mb-2">Average Starting Salary</span>
                <p className="text-2xl font-bold text-green-700">
                  {course.jobOutcomes.currency} {course.jobOutcomes.averageSalary.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500 mt-1">per year</p>
              </div>
            )}
            {course.jobOutcomes.placementRate && (
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <span className="text-sm text-gray-600 block mb-2">Placement Rate</span>
                <p className="text-2xl font-bold text-blue-700">
                  {course.jobOutcomes.placementRate}%
                </p>
                <p className="text-xs text-gray-500 mt-1">graduates employed</p>
              </div>
            )}
            {course.visaSuccessRate && (
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <span className="text-sm text-gray-600 block mb-2">Visa Success Rate</span>
                <p className="text-2xl font-bold text-purple-700">
                  {course.visaSuccessRate}%
                </p>
                <p className="text-xs text-gray-500 mt-1">international students</p>
              </div>
            )}
          </div>
          {course.jobOutcomes.topCompanies && course.jobOutcomes.topCompanies.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Top Recruiting Companies</h3>
              <div className="flex flex-wrap gap-2">
                {course.jobOutcomes?.topCompanies?.map((company, index) => (
                  <span key={index} className="px-4 py-2 bg-primary-100 text-primary-800 rounded-lg text-sm font-medium">
                    {company}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* University Info */}
      {course.university && (
        <div className="card">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">About {course.university.name}</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Location</h3>
              <p className="text-gray-700">
                {course.university.location?.city && `${course.university.location.city}, `}
                {course.university.location?.country}
              </p>
            </div>
            {course.university.ranking && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">World Ranking</h3>
                <p className="text-gray-700">#{course.university.ranking} globally</p>
              </div>
            )}
            {course.university.acceptanceRate && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Acceptance Rate</h3>
                <p className="text-gray-700">{course.university.acceptanceRate}%</p>
              </div>
            )}
            {course.university.website && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Website</h3>
                <a
                  href={course.university.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-600 hover:text-primary-700"
                >
                  Visit Official Website →
                </a>
              </div>
            )}
          </div>
          <div className="mt-4">
            <button
              onClick={() => navigate(`/university/${encodeURIComponent(course.university.name)}`)}
              className="btn-primary"
            >
              View All Courses from {course.university.name}
            </button>
          </div>
        </div>
      )}

      {/* Similar Courses */}
      {similarCourses.length > 0 && (
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 px-2">Similar Courses You Might Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {similarCourses.map((similarCourse) => (
              <motion.div
                key={similarCourse._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <CourseCard course={similarCourse} />
              </motion.div>
            ))}
          </div>
        </div>
      )}

      <PhoneModal
        isOpen={showPhoneModal}
        onClose={() => setShowPhoneModal(false)}
      />
    </div>
  )
}

