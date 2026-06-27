import { api } from '@/lib/axios'
import type {
  CreatePropertyInput,
  Property,
  UpdatePropertyInput,
} from '@/types'

export async function getProperties(): Promise<Property[]> {
  const response = await api.get('/properties')
  return response.data
}

export async function getProperty(id: string): Promise<Property> {
  const response = await api.get(`/properties/${id}`)
  return response.data
}

export async function createProperty(
  data: CreatePropertyInput,
): Promise<Property> {
  const response = await api.post('/properties', data)
  return response.data
}

export async function updateProperty(
  id: string,
  data: UpdatePropertyInput,
): Promise<Property> {
  const response = await api.patch(`/properties/${id}`, data)
  return response.data
}

export async function deleteProperty(id: string): Promise<{ message: string }> {
  const response = await api.delete(`/properties/${id}`)
  return response.data
}
