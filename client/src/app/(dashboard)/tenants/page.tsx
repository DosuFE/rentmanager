'use client'

import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Plus, UserPlus } from 'lucide-react'
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
import { TenantForm } from '@/components/forms/tenant-form'
import { LoadingSpinner } from '@/components/shared/loading-spinner'
import { useAuth } from '@/hooks/use-auth'
import { createTenant, getTenants } from '@/services/tenant-service'
import { getApiErrorMessage } from '@/lib/api-error'
import { assignTenantToRoom } from '@/services/room-service'
import { getVacantRooms } from '@/services/room-service'
import type { TenantSchema } from '@/validations/tenant-schema'

export default function TenantsPage() {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const [createOpen, setCreateOpen] = useState(false)
  const [assignTenantId, setAssignTenantId] = useState<number | null>(null)
  const [selectedRoomId, setSelectedRoomId] = useState('')

  const { data: tenants, isLoading } = useQuery({
    queryKey: ['tenants'],
    queryFn: getTenants,
    enabled: user?.role === 'LANDLORD',
  })

  const { data: vacantRooms } = useQuery({
    queryKey: ['vacant-rooms'],
    queryFn: getVacantRooms,
    enabled: user?.role === 'LANDLORD',
  })

  const createMutation = useMutation({
    mutationFn: createTenant,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenants'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] })
      toast.success('Tenant created')
      setCreateOpen(false)
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Failed to create tenant'))
    },
  })

  const assignMutation = useMutation({
    mutationFn: ({ roomId, tenantId }: { roomId: string; tenantId: number }) =>
      assignTenantToRoom(roomId, { tenantId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenants'] })
      queryClient.invalidateQueries({ queryKey: ['rooms'] })
      queryClient.invalidateQueries({ queryKey: ['vacant-rooms'] })
      toast.success('Tenant assigned to room')
      setAssignTenantId(null)
      setSelectedRoomId('')
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Failed to assign tenant'))
    },
  })

  if (user?.role !== 'LANDLORD') {
    return <p className="text-muted-foreground">Only landlords can manage tenants.</p>
  }

  if (isLoading) return <LoadingSpinner label="Loading tenants..." variant="list" />

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold md:text-3xl">Tenants</h2>
          <p className="text-muted-foreground">Manage tenant accounts and assignments</p>
        </div>

        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" />
              Add Tenant
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create Tenant Account</DialogTitle>
              <p className="text-sm text-muted-foreground">
                Create login credentials for your tenant. Share the email and
                password with them so they can sign in to their portal.
              </p>
            </DialogHeader>
            <TenantForm
              onSubmit={(data: TenantSchema) => createMutation.mutate(data)}
              isLoading={createMutation.isPending}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:hidden">
        {tenants?.map((tenant) => (
          <Card key={tenant.id} className="rounded-2xl">
            <CardContent className="space-y-3 p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium">{tenant.name}</p>
                  <p className="text-sm text-muted-foreground">{tenant.phoneNumber}</p>
                  <p className="text-sm text-muted-foreground">{tenant.user?.email}</p>
                </div>
                <Badge variant={tenant.room ? 'default' : 'secondary'}>
                  {tenant.room ? `Room ${tenant.room.roomNumber}` : 'Unassigned'}
                </Badge>
              </div>
              {!tenant.room && (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => setAssignTenantId(tenant.id)}
                >
                  <UserPlus className="mr-2 h-4 w-4" />
                  Assign Room
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="hidden rounded-2xl md:block">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Room</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tenants?.map((tenant) => (
                <TableRow key={tenant.id}>
                  <TableCell className="font-medium">{tenant.name}</TableCell>
                  <TableCell>{tenant.phoneNumber}</TableCell>
                  <TableCell>{tenant.user?.email}</TableCell>
                  <TableCell>
                    {tenant.room ? (
                      <Badge>Room {tenant.room.roomNumber}</Badge>
                    ) : (
                      <Badge variant="secondary">Unassigned</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {!tenant.room && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setAssignTenantId(tenant.id)}
                      >
                        <UserPlus className="mr-2 h-4 w-4" />
                        Assign
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {!tenants?.length && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    No tenants yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={!!assignTenantId} onOpenChange={() => setAssignTenantId(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Assign to Room</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <select
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={selectedRoomId}
              onChange={(e) => setSelectedRoomId(e.target.value)}
            >
              <option value="">Select vacant room</option>
              {vacantRooms?.map((room) => (
                <option key={room.id} value={room.id}>
                  {room.property?.name} — Room {room.roomNumber}
                </option>
              ))}
            </select>
            <Button
              className="w-full"
              disabled={!selectedRoomId || assignMutation.isPending}
              onClick={() =>
                assignTenantId &&
                assignMutation.mutate({
                  roomId: selectedRoomId,
                  tenantId: assignTenantId,
                })
              }
            >
              {assignMutation.isPending ? 'Assigning...' : 'Assign Tenant'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
