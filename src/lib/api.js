import axios from 'axios'
import { getToken, logoutAndRedirect } from './auth'

export const apiClient = axios.create({
  baseURL: 'https://rccs-backend-production.up.railway.app/api',
})

apiClient.interceptors.request.use((config) => {
  const token = getToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

apiClient.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error.response?.status
    const url = error.config?.url || ''
    const isAuthCall = url.includes('/login') || url.includes('/register')

    if (status === 401 && !isAuthCall && typeof window !== 'undefined') {
      logoutAndRedirect()
    }

    return Promise.reject(error)
  }
)
