// src/services/customerService.js

import apiClient from './axios-instance'
import { API_ENDPOINTS } from './api-endpoints'

const goodReceivedService = {
  getAll: async (params) => {
    const { page, size } = params || { page: 1, size: 10 }
    const res = await apiClient.get(API_ENDPOINTS.GOOD_RECEIVED.GET_ALL(page, size))
    console.log('API Response for getAll good received notes:', res)
    return res?.data?.data || res?.data
  },

  create: async (payload) => {
    const res = await apiClient.post(API_ENDPOINTS.GOOD_RECEIVED.CREATE, payload)
    return res?.data
  },

  //   update: async (payload) => {
  //     const res = await apiClient.put(API_ENDPOINTS.DELIVERY_NOTE.UPDATE(payload.id), payload)
  //     return res?.data
  //   },
  delete: async (id) => {
    const res = await apiClient.delete(API_ENDPOINTS.GOOD_RECEIVED.DELETE(id))
    return res?.data
  },
}

export default goodReceivedService
