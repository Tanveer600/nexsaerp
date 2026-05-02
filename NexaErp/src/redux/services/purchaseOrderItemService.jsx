import apiClient from './axios-instance'
import { API_ENDPOINTS } from './api-endpoints'

const purchaseOrderItemService = {
  // Pattern match: params object (page, size) receive karna
  getAll: async (params) => {
    const pageNumber = params?.page || 1
    const pageSize = params?.size || 10

    // FIX: Function ko params pass karein taake wo sahi string return kare
    // Ab ye generate karega: /api/PurchaseOrder?pageNumber=1&pageSize=10
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

  // YAHAN FIX HAI:
  update: async (payload) => {
    // 1. Pehle check karein ID dono formats mein (ID ya id)
    const orderId = payload.ID || payload.id

    // 2. Agar ID phir bhi nahi milti to error throw karein bajaye API hit karne ke
    if (!orderId) {
      console.error('Payload missing ID:', payload)
      throw new Error('Update failed: Purchase Order ID is missing in payload.')
    }

    // 3. URL mein orderId pass karein
    const res = await apiClient.put(API_ENDPOINTS.PURCHASE_ORDER.UPDATE(orderId), payload)
    return res?.data
  },

  delete: async (id) => {
    const res = await apiClient.delete(API_ENDPOINTS.PURCHASE_ORDER.DELETE(id))
    return res?.data
  },
}

export default purchaseOrderItemService
