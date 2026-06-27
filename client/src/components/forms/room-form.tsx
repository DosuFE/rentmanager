'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { roomSchema, type RoomSchema } from '@/validations/room-schema'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { Property } from '@/types'

interface RoomFormProps {
  properties: Property[]
  defaultPropertyId?: string
  onSubmit: (data: RoomSchema) => void
  isLoading?: boolean
}

export function RoomForm({
  properties,
  defaultPropertyId,
  onSubmit,
  isLoading,
}: RoomFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RoomSchema>({
    resolver: zodResolver(roomSchema),
    defaultValues: {
      roomNumber: '',
      floor: 1,
      capacity: 1,
      propertyId: defaultPropertyId ?? '',
    },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="propertyId">Property</Label>
        <select
          id="propertyId"
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          {...register('propertyId')}
        >
          <option value="">Select property</option>
          {properties.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
        {errors.propertyId && (
          <p className="text-sm text-destructive">{errors.propertyId.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="roomNumber">Room Number</Label>
        <Input id="roomNumber" placeholder="A101" {...register('roomNumber')} />
        {errors.roomNumber && (
          <p className="text-sm text-destructive">{errors.roomNumber.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="floor">Floor</Label>
          <Input
            id="floor"
            type="number"
            min={1}
            {...register('floor', { valueAsNumber: true })}
          />
          {errors.floor && (
            <p className="text-sm text-destructive">{errors.floor.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="capacity">Capacity</Label>
          <Input
            id="capacity"
            type="number"
            min={1}
            {...register('capacity', { valueAsNumber: true })}
          />
          {errors.capacity && (
            <p className="text-sm text-destructive">{errors.capacity.message}</p>
          )}
        </div>
      </div>

      <Button type="submit" className="w-full cursor-pointer" disabled={isLoading}>
        {isLoading ? 'Creating...' : 'Create Room'}
      </Button>
    </form>
  )
}
