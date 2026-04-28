// src/services/tenantService.js

import apiClient from './axios-instance'
import { API_ENDPOINTS } from './api-endpoints'

const tenantService = {
  getAll: async () => {
    const res = await apiClient.get(API_ENDPOINTS.TENANTS.GET_ALL)
    return res?.data?.data || res?.data || []
  },

  getById: async (id) => {
    const res = await apiClient.get(API_ENDPOINTS.TENANTS.BY_ID(id))
    return res?.data?.data || res?.data
  },

  create: async (payload) => {
    const res = await apiClient.post(API_ENDPOINTS.TENANTS.CREATE, payload)
    return res?.data
  },

  update: async (payload) => {
    const res = await apiClient.put(API_ENDPOINTS.TENANTS.UPDATE(payload.id), payload)
    return res?.data
  },

  delete: async (id) => {
    const res = await apiClient.delete(API_ENDPOINTS.TENANTS.DELETE(id))
    return res?.data
  },
}

export default tenantService
