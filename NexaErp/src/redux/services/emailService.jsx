import apiClient from './axios-instance'
import { API_ENDPOINTS } from './api-endpoints'

const emailService = {
  getInbox: async () => {
    const res = await apiClient.get(API_ENDPOINTS.EMAIL.GET_INBOX)
    return res?.data?.data || res?.data || []
  },

  sendEmail: async (payload) => {
    const res = await apiClient.post(API_ENDPOINTS.EMAIL.SEND, payload)
    return res?.data
  },
  syncInbox: async (payload) => {
    const res = await apiClient.post(API_ENDPOINTS.EMAIL.SYNC, payload)
    return res?.data
  },
}

export default emailService
