import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { BookOpen, GitCompare, Clock, User, Heart, TrendingUp, Target, Award } from 'lucide-react'
import { userAPI } from '../api/user'
import { useAuthStore } from '../store/authStore'
import StatsCard from '../components/StatsCard'
import CourseCard from '../components/CourseCard'
import toast from 'react-hot-toast'

export default function DashboardPage() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuthStore()
  const [profile, setProfile] = useState(null)
  const [savedCourses, setSavedCourses] = useState([])
  const [savedComparisons, setSavedComparisons] = useState([])
  const [recentViews, setRecentViews] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('saved')

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/')
      return
    }
    loadDashboard()
  }, [isAuthenticated])

  const loadDashboard = async () => {
    try {
      setLoading(true)
      const [profileRes, coursesRes, comparisonsRes, viewsRes] = await Promise.all([
        userAPI.getProfile(),
        userAPI.getSavedCourses(),
        userAPI.getSavedComparisons(),
        userAPI.getRecentViews()
      ])
      setProfile(profileRes.user)
      setSavedCourses(coursesRes.courses || [])
      setSavedComparisons(comparisonsRes.comparisons || [])
      setRecentViews(viewsRes.recentViews || [])
    } catch (error) {
      toast.error('Failed to load dashboard')
    } finally {
      setLoading(false)
    }
  }

  const handleUnsaveCourse = async (courseId) => {
    try {
      await userAPI.unsaveCourse(courseId)
      setSavedCourses(savedCourses.filter(c => c._id !== courseId))
      toast.success('Course unsaved')
    } catch (error) {
      toast.error('Failed to unsave course')
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Dashboard</h1>
          <p className="text-gray-600 mt-1">Track your course search and applications</p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatsCard
          icon={Heart}
          label="Saved Courses"
          value={savedCourses.length}
          color="red"
        />
        <StatsCard
          icon={GitCompare}
          label="Comparisons"
          value={savedComparisons.length}
          color="blue"
        />
        <StatsCard
          icon={Clock}
          label="Recent Views"
          value={recentViews.length}
          color="purple"
        />
        <StatsCard
          icon={TrendingUp}
          label="Progress"
          value={savedCourses.length > 0 ? 'Active' : 'Start'}
          color="green"
        />
      </div>

      {/* Profile Card */}
      {profile && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card bg-gradient-to-r from-primary-50 to-purple-50"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="h-16 w-16 rounded-full bg-primary-600 flex items-center justify-center text-white text-2xl font-bold">
                {profile.phone?.[profile.phone.length - 1] || 'U'}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{profile.phone}</h2>
                {profile.profile?.name && (
                  <p className="text-gray-600">{profile.profile.name}</p>
                )}
                <p className="text-sm text-gray-500">Member since {new Date(profile.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
            {profile.profile && (
              <div className="text-right">
                <p className="text-sm text-gray-500">Profile Completion</p>
                <div className="w-32 bg-gray-200 rounded-full h-2 mt-1">
                  <div 
                    className="bg-primary-600 h-2 rounded-full"
                    style={{ width: `${Object.keys(profile.profile).filter(k => profile.profile[k]).length * 10}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('saved')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'saved'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Heart className="inline-block h-5 w-5 mr-2" />
            Saved Courses ({savedCourses.length})
          </button>
          <button
            onClick={() => setActiveTab('comparisons')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'comparisons'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <GitCompare className="inline-block h-5 w-5 mr-2" />
            Comparisons ({savedComparisons.length})
          </button>
          <button
            onClick={() => setActiveTab('recent')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'recent'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Clock className="inline-block h-5 w-5 mr-2" />
            Recent Views ({recentViews.length})
          </button>
        </nav>
      </div>

      {/* Saved Courses */}
      {activeTab === 'saved' && (
        <div>
          {savedCourses.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No saved courses yet</p>
              <button onClick={() => navigate('/search')} className="btn-primary mt-4">
                Search Courses
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedCourses.map((course, index) => (
                <motion.div
                  key={course._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <CourseCard course={course} onSaveChange={loadDashboard} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Comparisons */}
      {activeTab === 'comparisons' && (
        <div>
          {savedComparisons.length === 0 ? (
            <div className="text-center py-12">
              <GitCompare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No saved comparisons yet</p>
              <button onClick={() => navigate('/compare')} className="btn-primary mt-4">
                Compare Courses
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {savedComparisons.map((comp, index) => (
                <div key={index} className="card">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-semibold">{comp.course1?.name}</h3>
                      <p className="text-sm text-gray-600">{comp.course1?.university?.name}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold">{comp.course2?.name}</h3>
                      <p className="text-sm text-gray-600">{comp.course2?.university?.name}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Recent Views */}
      {activeTab === 'recent' && (
        <div>
          {recentViews.length === 0 ? (
            <div className="text-center py-12">
              <Clock className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No recent views</p>
              <button onClick={() => navigate('/search')} className="btn-primary mt-4">
                Search Courses
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentViews.map((view) => (
                <motion.div
                  key={view._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="card cursor-pointer hover:shadow-xl transition-shadow"
                  onClick={() => navigate(`/course/${view.course?._id}`)}
                >
                  <h3 className="text-lg font-semibold mb-2">{view.course?.name}</h3>
                  <p className="text-gray-600 mb-2">{view.course?.university?.name}</p>
                  <p className="text-sm text-gray-500">
                    Viewed {new Date(view.viewedAt).toLocaleDateString()}
                  </p>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

