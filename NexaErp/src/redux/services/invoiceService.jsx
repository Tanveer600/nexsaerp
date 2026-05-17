// src/services/invoiceService.js

import apiClient from './axios-instance'
import { API_ENDPOINTS } from './api-endpoints'

const invoiceService = {
  getAll: async (params) => {
    const { page, size } = params || { page: 1, size: 10 }
    const res = await apiClient.get(API_ENDPOINTS.INVOICES.GET_ALL(page, size))
    console.log('API Response for getAll Invoices:', res)
    return res?.data?.data || res?.data
  },

  getList: async () => {
    const res = await apiClient.get(API_ENDPOINTS.INVOICES.GET_LIST)
    return res?.data?.data || res?.data
  },

  getById: async (id) => {
    const res = await apiClient.get(API_ENDPOINTS.INVOICES.BY_ID(id))
    return res?.data?.data || res?.data
  },

  create: async (payload) => {
    const res = await apiClient.post(API_ENDPOINTS.INVOICES.CREATE, payload)
    return res?.data
  },

  update: async (payload) => {
    const res = await apiClient.put(API_ENDPOINTS.INVOICES.UPDATE(payload.id), payload)
    return res?.data
  },
  delete: async (id) => {
    const res = await apiClient.delete(API_ENDPOINTS.INVOICES.DELETE(id))
    return res?.data
  },
}

export default invoiceService
