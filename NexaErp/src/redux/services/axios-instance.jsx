// src/services/axios-instance.js

import axios from 'axios'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:7016',
  timeout: Number(import.meta.env.VITE_API_TIMEOUT) || 30000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'ngrok-skip-browser-warning': 'true',
  },
})
// ================= REQUEST INTERCEPTOR (🔥 ADD THIS) =================
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)
// ================= RESPONSE INTERCEPTOR =================
apiClient.interceptors.response.use(
  (res) => res,
  (err) => {
    const isNetworkError =
      ['ERR_NETWORK', 'ECONNREFUSED', 'ECONNABORTED'].includes(err.code) ||
      err.message === 'Network Error'

    if (!isNetworkError) return Promise.reject(err)

    const isGet = err.config?.method === 'get'

    return Promise.resolve({
      data: isGet ? [] : {},
      status: 200,
      config: err.config,
    })
  },
)

export default apiClient
