import api from './axios'

export const adminAPI = {
  getDashboard: async () => {
    const response = await api.get('/admin/dashboard')
    return response.data
  },
  
  getAllUsers: async (page = 1, limit = 20) => {
    const response = await api.get('/admin/users', { params: { page, limit } })
    return response.data
  },
  
  getAllCourses: async (page = 1, limit = 20) => {
    const response = await api.get('/admin/courses', { params: { page, limit } })
    return response.data
  },
  
  createCourse: async (courseData) => {
    const response = await api.post('/admin/courses', courseData)
    return response.data
  },
  
  updateCourse: async (id, courseData) => {
    const response = await api.put(`/admin/courses/${id}`, courseData)
    return response.data
  }
}

