'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { BedDouble, Building2, MapPin } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { LoadingSpinner } from '@/components/shared/loading-spinner'
import { useAuth } from '@/hooks/use-auth'
import { getMyRoom } from '@/services/tenant-service'

export default function MyRoomPage() {
  const router = useRouter()
  const { user } = useAuth()

  useEffect(() => {
    if (user?.role === 'LANDLORD') {
      router.replace('/dashboard')
    }
  }, [user, router])

  const { data: room, isLoading, isError } = useQuery({
    queryKey: ['my-room'],
    queryFn: getMyRoom,
    enabled: user?.role === 'TENANT',
    retry: false,
  })

  if (!user || user.role !== 'TENANT') {
    return <LoadingSpinner />
  }

  if (isLoading) return <LoadingSpinner label="Loading your room..." />

  if (isError || !room) {
    return (
      <div className="flex min-h-[300px] flex-col items-center justify-center text-center">
        <BedDouble className="mb-4 h-12 w-12 text-muted-foreground" />
        <h2 className="text-xl font-semibold">No Room Assigned</h2>
        <p className="mt-2 max-w-sm text-muted-foreground">
          You have not been assigned to a room yet. Contact your landlord.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold md:text-3xl">My Room</h2>
        <p className="text-muted-foreground">Your assigned accommodation details</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BedDouble className="h-5 w-5" />
              Room Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Room Number</p>
              <p className="text-2xl font-bold">{room.roomNumber}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Floor</p>
                <p className="text-lg font-medium">{room.floor}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Capacity</p>
                <p className="text-lg font-medium">{room.capacity}</p>
              </div>
            </div>
            <Badge variant={room.isAvailable ? 'secondary' : 'default'}>
              {room.isAvailable ? 'Available' : 'Occupied'}
            </Badge>
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Property
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-xl font-bold">{room.property?.name}</p>
            <p className="flex items-start gap-2 text-muted-foreground">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
              {room.property?.address}, {room.property?.city},{' '}
              {room.property?.state}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
