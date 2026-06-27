'use client'

import { use } from 'react'
import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, BedDouble, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { LoadingSpinner } from '@/components/shared/loading-spinner'
import { ChartCard } from '@/components/charts/chart-card'
import { OccupancyDonutChart } from '@/components/charts/occupancy-donut-chart'
import { getProperty } from '@/services/property-service'
import { getPropertyRoomStats } from '@/services/room-service'

export default function PropertyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)

  const { data: property, isLoading } = useQuery({
    queryKey: ['property', id],
    queryFn: () => getProperty(id),
  })

  const { data: stats } = useQuery({
    queryKey: ['property-stats', id],
    queryFn: () => getPropertyRoomStats(id),
    enabled: !!id,
  })

  if (isLoading) return <LoadingSpinner label="Loading property..." />
  if (!property) return <p>Property not found.</p>

  return (
    <div className="space-y-6">
      <Button variant="ghost" asChild className="pl-0">
        <Link href="/properties">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Properties
        </Link>
      </Button>

      <div>
        <h2 className="text-2xl font-bold md:text-3xl">{property.name}</h2>
        <p className="mt-1 flex items-center gap-2 text-muted-foreground">
          <MapPin className="h-4 w-4" />
          {property.address}, {property.city}, {property.state}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartCard
          title="Room Occupancy"
          description="Occupied vs vacant rooms in this property"
        >
          <OccupancyDonutChart
            occupied={stats?.occupiedRooms ?? 0}
            vacant={stats?.vacantRooms ?? 0}
          />
        </ChartCard>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-1">
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground">Total Rooms</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{stats?.totalRooms ?? 0}</p>
            </CardContent>
          </Card>
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground">Occupied</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{stats?.occupiedRooms ?? 0}</p>
            </CardContent>
          </Card>
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground">Vacant</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{stats?.vacantRooms ?? 0}</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BedDouble className="h-5 w-5" />
            Rooms
          </CardTitle>
        </CardHeader>
        <CardContent>
          {property.rooms?.length ? (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {property.rooms.map((room) => (
                <div
                  key={room.id}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div>
                    <p className="font-medium">Room {room.roomNumber}</p>
                    <p className="text-sm text-muted-foreground">
                      Floor {room.floor} · Cap. {room.capacity}
                    </p>
                  </div>
                  <Badge variant={room.isAvailable ? 'secondary' : 'default'}>
                    {room.isAvailable ? 'Vacant' : 'Occupied'}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No rooms added yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
