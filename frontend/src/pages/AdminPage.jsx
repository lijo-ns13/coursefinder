import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Users, BookOpen, TrendingUp, BarChart3 } from 'lucide-react'
import { adminAPI } from '../api/admin'
import toast from 'react-hot-toast'

export default function AdminPage() {
  const [dashboard, setDashboard] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboard()
  }, [])

  const loadDashboard = async () => {
    try {
      setLoading(true)
      const response = await adminAPI.getDashboard()
      setDashboard(response.dashboard)
    } catch (error) {
      toast.error('Failed to load admin dashboard')
    } finally {
      setLoading(false)
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
      <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-6">
        <div className="card">
          <Users className="h-8 w-8 text-primary-600 mb-2" />
          <h3 className="text-sm text-gray-500">Total Users</h3>
          <p className="text-2xl font-bold text-gray-900">
            {dashboard?.stats?.totalUsers || 0}
          </p>
        </div>
        <div className="card">
          <BookOpen className="h-8 w-8 text-primary-600 mb-2" />
          <h3 className="text-sm text-gray-500">Total Courses</h3>
          <p className="text-2xl font-bold text-gray-900">
            {dashboard?.stats?.totalCourses || 0}
          </p>
        </div>
        <div className="card">
          <TrendingUp className="h-8 w-8 text-primary-600 mb-2" />
          <h3 className="text-sm text-gray-500">Popular Courses</h3>
          <p className="text-2xl font-bold text-gray-900">
            {dashboard?.popularCourses?.length || 0}
          </p>
        </div>
        <div className="card">
          <BarChart3 className="h-8 w-8 text-primary-600 mb-2" />
          <h3 className="text-sm text-gray-500">Analytics</h3>
          <p className="text-2xl font-bold text-gray-900">Coming Soon</p>
        </div>
      </div>

      {/* Recent Users */}
      {dashboard?.recentUsers && dashboard.recentUsers.length > 0 && (
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Recent Users</h2>
          <div className="space-y-2">
            {dashboard.recentUsers.map((user) => (
              <div key={user._id} className="flex justify-between items-center py-2 border-b">
                <span>{user.phone}</span>
                <span className="text-sm text-gray-500">
                  {new Date(user.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

