'use client'

import type { QueryClient } from '@tanstack/react-query'

const TOKEN_KEY = 'token'
const REFRESH_TOKEN_KEY = 'refreshToken'

export function clearAuthSession(queryClient?: QueryClient) {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(REFRESH_TOKEN_KEY)
  }

  queryClient?.clear()
}

export function setAuthTokens(
  accessToken: string,
  refreshToken: string,
  queryClient?: QueryClient,
) {
  if (typeof window !== 'undefined') {
    queryClient?.clear()
    localStorage.setItem(TOKEN_KEY, accessToken)
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
  }
}

export function getAuthToken() {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(TOKEN_KEY)
}
