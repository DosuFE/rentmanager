import { api } from '@/lib/axios'
import type { CreateVisitorInput, Visitor } from '@/types'

export async function getMyVisitors(): Promise<Visitor[]> {
  const response = await api.get('/visitors/my')
  return response.data
}

export async function getVisitors(): Promise<Visitor[]> {
  const response = await api.get('/visitors')
  return response.data
}

export async function createVisitor(data: CreateVisitorInput): Promise<Visitor> {
  const response = await api.post('/visitors', data)
  return response.data
}

export async function acknowledgeVisitor(id: string): Promise<Visitor> {
  const response = await api.patch(`/visitors/${id}/acknowledge`)
  return response.data
}
