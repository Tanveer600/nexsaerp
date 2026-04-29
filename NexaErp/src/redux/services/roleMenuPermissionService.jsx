import apiClient from './axios-instance'
import { API_ENDPOINTS } from './api-endpoints'

const roleMenuPermissionService = {
  // 1. Bulk Assign/Update
  assignPermissions: async (payload) => {
    const res = await apiClient.post(API_ENDPOINTS.ROLE_MENU_PERMISSION.ASSIGN_PERMISSIONS, payload)
    return res?.data
  },

  // 2. Role ID ke mutabiq assigned menus ki list mangwana
  // FIX: Template literals use karein agar endpoint function nahi hai
  getByRole: async (roleId) => {
    // Agar API_ENDPOINTS mein GET_BY_ROLE aik function hai toh theek,
    // warna niche wala URL format use karein:
    const url =
      typeof API_ENDPOINTS.ROLE_MENU_PERMISSION.GET_BY_ROLE === 'function'
        ? API_ENDPOINTS.ROLE_MENU_PERMISSION.GET_BY_ROLE(roleId)
        : `${API_ENDPOINTS.ROLE_MENU_PERMISSION.GET_BY_ROLE}?roleId=${roleId}`

    const res = await apiClient.get(url)
    return res?.data?.result || res?.data?.data || [] // Backend model ke mutabiq result check karein
  },

  // 3. System mein mojood tamam assignments ki list
  getAll: async () => {
    const res = await apiClient.get(API_ENDPOINTS.ROLE_MENU_PERMISSION.GET_ALL)
    return res?.data?.result || res?.data?.data || []
  },

  // 4. Specific record delete karna
  delete: async (id) => {
    const url =
      typeof API_ENDPOINTS.ROLE_MENU_PERMISSION.DELETE === 'function'
        ? API_ENDPOINTS.ROLE_MENU_PERMISSION.DELETE(id)
        : `${API_ENDPOINTS.ROLE_MENU_PERMISSION.DELETE}/${id}`

    const res = await apiClient.delete(url)
    return res?.data
  },
}

export default roleMenuPermissionService
