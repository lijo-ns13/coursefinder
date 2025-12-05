import api from './axios'

export const aiAPI = {
  filterCourses: async (profile) => {
    const response = await api.post('/ai/filter', profile)
    return response.data
  },
  
  compareCourses: async (courseId1, courseId2) => {
    const response = await api.post('/ai/compare', { courseId1, courseId2 })
    return response.data
  },
  
  getRecommendations: async (profile) => {
    const response = await api.post('/ai/recommend', profile)
    return response.data
  }
}

