import axios from 'axios'
import { clearAuthSession } from '@/lib/auth-session'

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
})

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token')

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }

  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      typeof window !== 'undefined' &&
      error.response?.status === 401 &&
      !error.config?.url?.includes('/auth/login')
    ) {
      clearAuthSession()
      window.location.href = '/login'
    }

    return Promise.reject(error)
  },
)
