import { api } from '@/lib/axios'
import type { CreateTenantInput, Room, Tenant, TenantDashboardProfile } from '@/types'

export async function getTenants(): Promise<Tenant[]> {
  const response = await api.get('/tenants')
  return response.data
}

export async function getTenant(id: number): Promise<Tenant> {
  const response = await api.get(`/tenants/${id}`)
  return response.data
}

export async function createTenant(data: CreateTenantInput): Promise<Tenant> {
  const response = await api.post('/tenants', data)
  return response.data
}

export async function getMyProfile(): Promise<TenantDashboardProfile> {
  const response = await api.get('/tenants/me')
  return response.data
}

export async function getMyRoom(): Promise<Room> {
  const response = await api.get('/tenants/my-room')
  return response.data
}
