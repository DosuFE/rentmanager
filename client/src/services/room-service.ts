import { api } from '@/lib/axios'
import type {
  AssignTenantInput,
  CreateRoomInput,
  Room,
  RoomStats,
  Tenant,
  UpdateRoomInput,
} from '@/types'

export async function getRooms(): Promise<Room[]> {
  const response = await api.get('/rooms')
  return response.data
}

export async function getVacantRooms(): Promise<Room[]> {
  const response = await api.get('/rooms/vacant')
  return response.data
}

export async function getOccupiedRooms(): Promise<Room[]> {
  const response = await api.get('/rooms/occupied')
  return response.data
}

export async function getRoom(id: string): Promise<Room> {
  const response = await api.get(`/rooms/${id}`)
  return response.data
}

export async function createRoom(data: CreateRoomInput): Promise<Room> {
  const response = await api.post('/rooms', data)
  return response.data
}

export async function updateRoom(
  id: string,
  data: UpdateRoomInput,
): Promise<Room> {
  const response = await api.patch(`/rooms/${id}`, data)
  return response.data
}

export async function deleteRoom(id: string): Promise<Room> {
  const response = await api.delete(`/rooms/${id}`)
  return response.data
}

export async function assignTenantToRoom(
  roomId: string,
  data: AssignTenantInput,
): Promise<Tenant> {
  const response = await api.patch(`/rooms/${roomId}/assign-tenant`, data)
  return response.data
}

export async function getPropertyRoomStats(
  propertyId: string,
): Promise<RoomStats> {
  const response = await api.get(`/rooms/property/${propertyId}/stats`)
  return response.data
}
