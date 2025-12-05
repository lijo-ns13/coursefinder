import api from './axios'

export const userAPI = {
  getProfile: async () => {
    const response = await api.get('/user/profile')
    return response.data
  },
  
  updateProfile: async (profile) => {
    const response = await api.put('/user/profile', { profile })
    return response.data
  },
  
  saveCourse: async (courseId) => {
    const response = await api.post('/user/save-course', { courseId })
    return response.data
  },
  
  unsaveCourse: async (courseId) => {
    const response = await api.delete(`/user/unsave-course/${courseId}`)
    return response.data
  },
  
  getSavedCourses: async () => {
    const response = await api.get('/user/saved-courses')
    return response.data
  },
  
  getSavedComparisons: async () => {
    const response = await api.get('/user/saved-comparisons')
    return response.data
  },
  
  getRecentViews: async () => {
    const response = await api.get('/user/recent-views')
    return response.data
  }
}

