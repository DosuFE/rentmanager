import { z } from 'zod'

export const roomSchema = z.object({
  roomNumber: z.string().min(1, 'Room number is required'),
  floor: z.number().int().min(1, 'Floor must be at least 1'),
  capacity: z.number().int().min(1, 'Capacity must be at least 1'),
  propertyId: z.string().uuid('Select a property'),
})

export const updateRoomSchema = roomSchema.omit({ propertyId: true })

export type RoomSchema = z.infer<typeof roomSchema>
export type UpdateRoomSchema = z.infer<typeof updateRoomSchema>
