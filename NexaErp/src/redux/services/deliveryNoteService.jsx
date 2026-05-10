// src/services/customerService.js

import apiClient from './axios-instance'
import { API_ENDPOINTS } from './api-endpoints'

const deliveryNoteService = {
  getAll: async (params) => {
    const { page, size } = params || { page: 1, size: 10 }
    const res = await apiClient.get(API_ENDPOINTS.DELIVERY_NOTE.GET_ALL(page, size))
    console.log('API Response for getAll delivery notes:', res)
    return res?.data?.data || res?.data
  },

  create: async (payload) => {
    const res = await apiClient.post(API_ENDPOINTS.DELIVERY_NOTE.CREATE, payload)
    return res?.data
  },

  //   update: async (payload) => {
  //     const res = await apiClient.put(API_ENDPOINTS.DELIVERY_NOTE.UPDATE(payload.id), payload)
  //     return res?.data
  //   },
  delete: async (id) => {
    const res = await apiClient.delete(API_ENDPOINTS.DELIVERY_NOTE.DELETE(id))
    return res?.data
  },
}

export default deliveryNoteService
