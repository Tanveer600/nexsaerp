// src/services/customerService.js

import apiClient from './axios-instance'
import { API_ENDPOINTS } from './api-endpoints'

const customerService = {
  getAll: async (params) => {
    const { page, size } = params || { page: 1, size: 10 }
    const res = await apiClient.get(API_ENDPOINTS.CUSTOMER.GET_ALL(page, size))
    //console.log('API Response for getAll Customers:', res)
    return res?.data?.data || res?.data
  },
  getList: async () => {
    const res = await apiClient.get(API_ENDPOINTS.CUSTOMER.GET_LIST)
    return res?.data?.data || res?.data
  },
  getById: async (id) => {
    const res = await apiClient.get(API_ENDPOINTS.CUSTOMER.BY_ID(id))
    return res?.data?.data || res?.data
  },

  create: async (payload) => {
    const res = await apiClient.post(API_ENDPOINTS.CUSTOMER.CREATE, payload)
    return res?.data
  },

  update: async (payload) => {
    const res = await apiClient.put(API_ENDPOINTS.CUSTOMER.UPDATE(payload.id), payload)
    return res?.data
  },
  delete: async (id) => {
    const res = await apiClient.delete(API_ENDPOINTS.CUSTOMER.DELETE(id))
    return res?.data
  },
}

export default customerService
