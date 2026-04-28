// src/services/tenantService.js

import apiClient from './axios-instance'
import { API_ENDPOINTS } from './api-endpoints'

const userService = {
  getAll: async () => {
    const res = await apiClient.get(API_ENDPOINTS.USERS.GET_ALL)
    return res?.data?.data || res?.data || []
  },

  getById: async (id) => {
    const res = await apiClient.get(API_ENDPOINTS.USERS.BY_ID(id))
    return res?.data?.data || res?.data
  },

  create: async (payload) => {
    const res = await apiClient.post(API_ENDPOINTS.USERS.CREATE, payload)
    return res?.data
  },

  update: async (payload) => {
    const res = await apiClient.put(API_ENDPOINTS.USERS.UPDATE(payload.Id), payload)
    return res?.data
  },
  delete: async (id) => {
    const res = await apiClient.delete(API_ENDPOINTS.USERS.DELETE(id))
    return res?.data
  },
  login: async (payload) => {
    console.log('LOGIN PAYLOAD', payload)
    const res = await apiClient.post(API_ENDPOINTS.USERS.LOGIN, payload)
    return res?.data
  },
}

export default userService
