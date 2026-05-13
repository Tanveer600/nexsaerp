import apiClient from './axios-instance'
import { API_ENDPOINTS } from './api-endpoints'

const purchaseOrderItemService = {
  getAll: async (params) => {
    const pageNumber = params?.page || 1
    const pageSize = params?.size || 10
    const url = API_ENDPOINTS.PURCHASE_ORDER.GET_ALL(pageNumber, pageSize)

    const res = await apiClient.get(url)
    return res.data
  },

  getById: async (id) => {
    const res = await apiClient.get(API_ENDPOINTS.PURCHASE_ORDER.BY_ID(id))
    return res?.data?.data || res?.data
  },

  create: async (payload) => {
    const res = await apiClient.post(API_ENDPOINTS.PURCHASE_ORDER.CREATE, payload)
    return res?.data
  },

  update: async (payload) => {
    const orderId = payload.ID || payload.id
    if (!orderId) {
      console.error('Payload missing ID:', payload)
      throw new Error('Update failed: Purchase Order ID is missing in payload.')
    }
    const res = await apiClient.put(API_ENDPOINTS.PURCHASE_ORDER.UPDATE(orderId), payload)
    return res?.data
  },

  delete: async (id) => {
    const res = await apiClient.delete(API_ENDPOINTS.PURCHASE_ORDER.DELETE(id))
    return res?.data
  },
  convertToPurchase: async (quotationId) => {
    const url = API_ENDPOINTS.PURCHASE_ORDER.APPROVE_VENDOR_QUOTATION(quotationId)
    const res = await apiClient.post(url)
    return res?.data
  },
}

export default purchaseOrderItemService
