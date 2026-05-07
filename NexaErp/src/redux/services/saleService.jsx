import apiClient from './axios-instance'
import { API_ENDPOINTS } from './api-endpoints'

const saleService = {
  getAll: async (params) => {
    const pageNumber = params?.page || 1
    const pageSize = params?.size || 10

    const url = API_ENDPOINTS.SALE.GET_ALL(pageNumber, pageSize)

    const res = await apiClient.get(url)
    return res.data
  },

  getById: async (id) => {
    const res = await apiClient.get(API_ENDPOINTS.SALE.BY_ID(id))
    return res?.data?.data || res?.data
  },

  create: async (payload) => {
    const res = await apiClient.post(API_ENDPOINTS.SALE.CREATE, payload)
    return res?.data
  },

  update: async (payload) => {
    const saleId = payload.SaleId || payload.saleId

    if (!saleId) {
      throw new Error('Update failed: Sale ID is missing in payload.')
    }

    const res = await apiClient.put(API_ENDPOINTS.SALE.UPDATE(saleId), payload)
    return res?.data
  },

  delete: async (id) => {
    const res = await apiClient.delete(API_ENDPOINTS.SALE.DELETE(id))
    return res?.data
  },
  convertToSale: async (quotationId) => {
    const url = API_ENDPOINTS.SALE.APPROVE_QUOTATION(quotationId)
    const res = await apiClient.post(url)
    return res?.data
  },
}

export default saleService
