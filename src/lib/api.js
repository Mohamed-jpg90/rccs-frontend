import axios from 'axios'
 
// Central axios instance so every request shares the same base URL
// and picks up the auth token automatically, instead of hardcoding
// tokens/URLs in individual pages.
import { getToken } from './auth'

export const apiClient = axios.create({
  baseURL:  'http://localhost:5000/api',
})
 
apiClient.interceptors.request.use((config) => {
  const token = getToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})