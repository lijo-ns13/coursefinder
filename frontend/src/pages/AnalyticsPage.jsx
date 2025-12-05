import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, Eye, Heart, GitCompare, Target, Award } from 'lucide-react'
import { userAPI } from '../api/user'
import { useAuthStore } from '../store/authStore'
import InsightsCard from '../components/InsightsCard'
import ProgressTracker from '../components/ProgressTracker'

export default function AnalyticsPage() {
  const { isAuthenticated } = useAuthStore()
  const [stats, setStats] = useState({
    savedCourses: 0,
    comparisons: 0,
    views: 0,
    profileComplete: 0
  })

  useEffect(() => {
    if (!isAuthenticated) return
    loadStats()
  }, [isAuthenticated])

  const loadStats = async () => {
    try {
      const [coursesRes, comparisonsRes, viewsRes, profileRes] = await Promise.all([
        userAPI.getSavedCourses(),
        userAPI.getSavedComparisons(),
        userAPI.getRecentViews(),
        userAPI.getProfile()
      ])
      
      setStats({
        savedCourses: coursesRes.courses?.length || 0,
        comparisons: comparisonsRes.comparisons?.length || 0,
        views: viewsRes.recentViews?.length || 0,
        profileComplete: profileRes.user?.profile ? Object.keys(profileRes.user.profile).filter(k => profileRes.user.profile[k]).length * 10 : 0
      })
    } catch (error) {
      console.error('Failed to load stats')
    }
  }

  const currentStep = stats.savedCourses > 0 ? (stats.comparisons > 0 ? 4 : 3) : 2

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Your Insights</h1>
        <p className="text-gray-600 mt-1">Track your progress and discover opportunities</p>
      </div>

      {/* Key Metrics */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <InsightsCard
          title="Saved Courses"
          value={stats.savedCourses}
          change="+2 this week"
          trend="up"
          icon={Heart}
        />
        <InsightsCard
          title="Comparisons"
          value={stats.comparisons}
          change="+1 today"
          trend="up"
          icon={GitCompare}
        />
        <InsightsCard
          title="Courses Viewed"
          value={stats.views}
          change="+5 this week"
          trend="up"
          icon={Eye}
        />
        <InsightsCard
          title="Profile Complete"
          value={`${stats.profileComplete}%`}
          change={stats.profileComplete < 100 ? 'Complete profile' : 'Done'}
          trend={stats.profileComplete === 100 ? 'up' : 'neutral'}
          icon={Target}
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <ProgressTracker currentStep={currentStep} />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Achievements</h3>
          <div className="space-y-3">
            {[
              { icon: '🎯', title: 'First Course Saved', earned: stats.savedCourses > 0 },
              { icon: '🔍', title: 'Explorer', earned: stats.views >= 5 },
              { icon: '⚖️', title: 'Comparer', earned: stats.comparisons > 0 },
              { icon: '⭐', title: 'Power User', earned: stats.savedCourses >= 5 }
            ].map((achievement, index) => (
              <div
                key={index}
                className={`flex items-center space-x-3 p-3 rounded-lg ${
                  achievement.earned ? 'bg-green-50 border border-green-200' : 'bg-gray-50'
                }`}
              >
                <span className="text-2xl">{achievement.icon}</span>
                <div className="flex-1">
                  <p className={`font-medium ${achievement.earned ? 'text-gray-900' : 'text-gray-400'}`}>
                    {achievement.title}
                  </p>
                </div>
                {achievement.earned && (
                  <Award className="h-5 w-5 text-yellow-500" />
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

