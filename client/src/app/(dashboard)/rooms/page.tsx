'use client'

import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Plus, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { RoomForm } from '@/components/forms/room-form'
import { LoadingSpinner } from '@/components/shared/loading-spinner'
import { useAuth } from '@/hooks/use-auth'
import { createRoom, deleteRoom, getRooms } from '@/services/room-service'
import { getProperties } from '@/services/property-service'
import type { RoomSchema } from '@/validations/room-schema'

export default function RoomsPage() {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const [open, setOpen] = useState(false)

  const { data: rooms, isLoading } = useQuery({
    queryKey: ['rooms'],
    queryFn: getRooms,
    enabled: user?.role === 'LANDLORD',
  })

  const { data: properties } = useQuery({
    queryKey: ['properties'],
    queryFn: getProperties,
    enabled: user?.role === 'LANDLORD',
  })

  const createMutation = useMutation({
    mutationFn: createRoom,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] })
      toast.success('Room created')
      setOpen(false)
    },
    onError: () => toast.error('Failed to create room'),
  })

  const deleteMutation = useMutation({
    mutationFn: deleteRoom,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] })
      toast.success('Room deleted')
    },
    onError: () => toast.error('Failed to delete room'),
  })

  if (user?.role !== 'LANDLORD') {
    return <p className="text-muted-foreground">Only landlords can manage rooms.</p>
  }

  if (isLoading) return <LoadingSpinner label="Loading rooms..." variant="table" />

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold md:text-3xl">Rooms</h2>
          <p className="text-muted-foreground">Manage rooms across your properties</p>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" />
              Add Room
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Room</DialogTitle>
            </DialogHeader>
            <RoomForm
              properties={properties ?? []}
              onSubmit={(data: RoomSchema) => createMutation.mutate(data)}
              isLoading={createMutation.isPending}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:hidden">
        {rooms?.map((room) => (
          <Card key={room.id} className="rounded-2xl">
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <p className="font-medium">Room {room.roomNumber}</p>
                <p className="text-sm text-muted-foreground">
                  {room.property?.name} · Floor {room.floor}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={room.isAvailable ? 'secondary' : 'default'}>
                  {room.isAvailable ? 'Vacant' : 'Occupied'}
                </Badge>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => deleteMutation.mutate(room.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="hidden rounded-2xl md:block">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Room</TableHead>
                <TableHead>Property</TableHead>
                <TableHead>Floor</TableHead>
                <TableHead>Capacity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rooms?.map((room) => (
                <TableRow key={room.id}>
                  <TableCell className="font-medium">{room.roomNumber}</TableCell>
                  <TableCell>{room.property?.name}</TableCell>
                  <TableCell>{room.floor}</TableCell>
                  <TableCell>{room.capacity}</TableCell>
                  <TableCell>
                    <Badge variant={room.isAvailable ? 'secondary' : 'default'}>
                      {room.isAvailable ? 'Vacant' : 'Occupied'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive"
                      onClick={() => deleteMutation.mutate(room.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {!rooms?.length && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    No rooms yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
