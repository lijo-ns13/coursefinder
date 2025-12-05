import api from './axios'

export const coursesAPI = {
  search: async (params) => {
    const response = await api.get('/courses/search', { params })
    return response.data
  },
  
  getById: async (id) => {
    const response = await api.get(`/courses/${id}`)
    return response.data
  },
  
  getPopular: async (limit = 10) => {
    const response = await api.get('/courses/popular', { params: { limit } })
    return response.data
  }
}

