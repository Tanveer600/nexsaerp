// src/services/companyService.js

import apiClient from './axios-instance'
import { API_ENDPOINTS } from './api-endpoints'

const companyService = {
  getCompany: async (companyId) => {
    const res = await apiClient.get(API_ENDPOINTS.SETTINGS.COMPANY.GET_BY_COMPANY_ID(companyId))
    return res?.data?.data || res?.data
  },
  getAll: async () => {
    const res = await apiClient.get(API_ENDPOINTS.SETTINGS.COMPANY.GET_ALL)
    return res?.data?.data || res?.data || []
  },
  saveOrUpdateCompany: async (payload) => {
    const res = await apiClient.post(API_ENDPOINTS.SETTINGS.COMPANY.SAVE_OR_UPDATE, payload)
    return res?.data
  },

  getProfile: async (userId) => {
    const res = await apiClient.get(API_ENDPOINTS.SETTINGS.PROFILE.GET_BY_USER_ID(userId))
    return res?.data?.data || res?.data
  },

  // companyService.jsx
  saveOrUpdateProfile: async (formData) => {
    const res = await apiClient.post(API_ENDPOINTS.SETTINGS.PROFILE.SAVE_OR_UPDATE, formData, {
      headers: {
        'Content-Type': 'multipart/form-data', // Zaroori hai image ke liye
      },
    })
    return res?.data
  },
}

export default companyService
