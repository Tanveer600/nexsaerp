// src/services/customerService.js

import apiClient from './axios-instance'
import { API_ENDPOINTS } from './api-endpoints'

const warehouseService = {
  getAll: async (params) => {
    const { page, size } = params || { page: 1, size: 10 }
    const res = await apiClient.get(API_ENDPOINTS.WAREHOUSE.GET_ALL(page, size))
    console.log('API Response for getAll Products:', res)
    return res?.data?.data || res?.data
  },

  getList: async () => {
    const res = await apiClient.get(API_ENDPOINTS.WAREHOUSE.GET_LIST)
    return res?.data?.data || res?.data
  },

  getById: async (id) => {
    const res = await apiClient.get(API_ENDPOINTS.WAREHOUSE.BY_ID(id))
    return res?.data?.data || res?.data
  },

  create: async (payload) => {
    const res = await apiClient.post(API_ENDPOINTS.WAREHOUSE.CREATE, payload)
    return res?.data
  },

  update: async (payload) => {
    const res = await apiClient.put(API_ENDPOINTS.WAREHOUSE.UPDATE(payload.id), payload)
    return res?.data
  },
  delete: async (id) => {
    const res = await apiClient.delete(API_ENDPOINTS.WAREHOUSE.DELETE(id))
    return res?.data
  },
}

export default warehouseService
