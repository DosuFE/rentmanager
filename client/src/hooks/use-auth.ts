'use client'

import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { clearAuthSession, getAuthToken } from '@/lib/auth-session'
import { getMe } from '@/services/auth-service'
import type { Role } from '@/types'

export function useAuth(requiredRole?: Role) {
  const router = useRouter()
  const queryClient = useQueryClient()
  const token = typeof window !== 'undefined' ? getAuthToken() : null

  const query = useQuery({
    queryKey: ['auth', 'me', token],
    queryFn: getMe,
    enabled: !!token,
    retry: false,
    staleTime: 0,
  })

  useEffect(() => {
    if (typeof window === 'undefined') return

    if (!token) {
      router.replace('/login')
      return
    }

    if (query.isError) {
      clearAuthSession(queryClient)
      router.replace('/login')
    }
  }, [query.isError, queryClient, router, token])

  useEffect(() => {
    if (!query.data || !requiredRole) return
    if (query.data.role !== requiredRole) {
      router.replace(
        query.data.role === 'LANDLORD' ? '/dashboard' : '/tenant/dashboard',
      )
    }
  }, [query.data, requiredRole, router])

  const logout = () => {
    clearAuthSession(queryClient)
    router.replace('/login')
  }

  return { ...query, logout, user: query.data }
}
