import { api } from '@/lib/axios'
import type { AuthTokens, AuthUser } from '@/types'
import type { LoginSchema, RegisterSchema } from '@/validations/auth-schema'

export async function registerUser(data: RegisterSchema) {
  const response = await api.post('/auth/register', data)
  return response.data
}

export async function loginUser(data: LoginSchema): Promise<AuthTokens> {
  const response = await api.post('/auth/login', data)
  return response.data
}

export async function getMe(): Promise<AuthUser> {
  const response = await api.get('/auth/me')
  return response.data
}

export async function refreshToken(
  refreshToken: string,
): Promise<AuthTokens> {
  const response = await api.post('/auth/refresh', { refreshToken })
  return response.data
}
