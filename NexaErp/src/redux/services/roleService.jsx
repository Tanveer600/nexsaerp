// src/services/tenantService.js

import apiClient from './axios-instance'
import { API_ENDPOINTS } from './api-endpoints'

const roleService = {
  getAll: async () => {
    const res = await apiClient.get(API_ENDPOINTS.ROLES.GET_ALL)
    return res?.data?.data || res?.data || []
  },

  getById: async (id) => {
    const res = await apiClient.get(API_ENDPOINTS.ROLES.BY_ID(id))
    return res?.data?.data || res?.data
  },

  create: async (payload) => {
    const res = await apiClient.post(API_ENDPOINTS.ROLES.CREATE, payload)
    return res?.data
  },

  update: async (payload) => {
    const res = await apiClient.put(API_ENDPOINTS.ROLES.UPDATE(payload.id), payload)
    return res?.data
  },

  delete: async (id) => {
    const res = await apiClient.delete(API_ENDPOINTS.ROLES.DELETE(id))
    return res?.data
  },
}

export default roleService
