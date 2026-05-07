import apiClient from './axios-instance'
import { API_ENDPOINTS } from './api-endpoints'

const quotationService = {
  getAll: async (params) => {
    const pageNumber = params?.page || 1
    const pageSize = params?.size || 10

    const url = API_ENDPOINTS.QUOTATION.GET_ALL(pageNumber, pageSize)

    const res = await apiClient.get(url)
    return res.data
  },

  getById: async (id) => {
    const res = await apiClient.get(API_ENDPOINTS.QUOTATION.BY_ID(id))
    return res?.data?.data || res?.data
  },

  create: async (payload) => {
    const res = await apiClient.post(API_ENDPOINTS.QUOTATION.CREATE, payload)
    return res?.data
  },

  update: async (payload) => {
    const quotationId = payload.QuotationId || payload.quotationId

    if (!quotationId) {
      throw new Error('Update failed: Quotation ID is missing in payload.')
    }

    const res = await apiClient.put(API_ENDPOINTS.QUOTATION.UPDATE(quotationId), payload)
    return res?.data
  },

  delete: async (id) => {
    const res = await apiClient.delete(API_ENDPOINTS.QUOTATION.DELETE(id))
    return res?.data
  },
}

export default quotationService
