// src/services/tenantService.js

import apiClient from './axios-instance'
import { API_ENDPOINTS } from './api-endpoints'

const menuService = {
  getAll: async () => {
    const res = await apiClient.get(API_ENDPOINTS.MENU.GET_ALL)
    return res?.data?.data || res?.data || []
  },

  getById: async (id) => {
    const res = await apiClient.get(API_ENDPOINTS.MENU.Get_BY_ID(id))
    return res?.data?.data || res?.data
  },

  create: async (payload) => {
    const res = await apiClient.post(API_ENDPOINTS.MENU.CREATE, payload)
    return res?.data
  },

  update: async (payload) => {
    const res = await apiClient.put(API_ENDPOINTS.MENU.UPDATE, payload)
    return res?.data
  },

  delete: async (id) => {
    const res = await apiClient.delete(API_ENDPOINTS.MENU.DELETE(id))
    return res?.data
  },
  getMenusByRole: async (id) => {
    const res = await apiClient.get(API_ENDPOINTS.MENU.GetMenus_By_Role(id))
    return res?.data
  },
}

export default menuService
