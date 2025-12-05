import api from './axios'

export const universitiesAPI = {
  getDetails: async (universityName) => {
    const response = await api.get(`/universities/${encodeURIComponent(universityName)}`)
    return response.data
  },
  
  getCourses: async (universityName) => {
    const response = await api.get(`/universities/${encodeURIComponent(universityName)}/courses`)
    return response.data
  }
}

