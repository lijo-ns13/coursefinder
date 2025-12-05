import api from './axios'

export const authAPI = {
  sendOTP: async (phone) => {
    const response = await api.post('/auth/send-otp', { phone })
    return response.data
  },
  
  verifyOTP: async (phone, otp) => {
    const response = await api.post('/auth/verify-otp', { phone, otp })
    return response.data
  },
  
  getMe: async () => {
    const response = await api.get('/auth/me')
    return response.data
  }
}

