'use client'

import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Plus, UserCheck } from 'lucide-react'
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
import { VisitorForm } from '@/components/forms/visitor-form'
import { LoadingSpinner } from '@/components/shared/loading-spinner'
import { useAuth } from '@/hooks/use-auth'
import { createVisitor, getMyVisitors } from '@/services/visitor-service'
import { getApiErrorMessage } from '@/lib/api-error'
import { formatDate } from '@/lib/format'
import type { VisitorSchema } from '@/validations/visitor-schema'
import type { VisitorStatus } from '@/types'

const statusVariant: Record<
  VisitorStatus,
  'default' | 'secondary' | 'destructive'
> = {
  PENDING: 'secondary',
  ACKNOWLEDGED: 'default',
}

export default function TenantVisitorsPage() {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const [open, setOpen] = useState(false)

  const { data: visitors, isLoading } = useQuery({
    queryKey: ['my-visitors'],
    queryFn: getMyVisitors,
    enabled: user?.role === 'TENANT',
  })

  const createMutation = useMutation({
    mutationFn: createVisitor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-visitors'] })
      toast.success('Landlord has been notified about your visitor')
      setOpen(false)
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Failed to notify landlord'))
    },
  })

  if (user?.role !== 'TENANT') {
    return <p className="text-muted-foreground">Tenants only.</p>
  }

  if (isLoading) return <LoadingSpinner label="Loading visitors..." variant="list" />

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold md:text-3xl">Visitor Notifications</h2>
          <p className="text-muted-foreground">
            Notify your landlord when you expect visitors
          </p>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" />
              Notify Visitor
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Notify Landlord of Visitor</DialogTitle>
              <p className="text-sm text-muted-foreground">
                Your landlord will see this notification in their portal.
              </p>
            </DialogHeader>
            <VisitorForm
              onSubmit={(data: VisitorSchema) => createMutation.mutate(data)}
              isLoading={createMutation.isPending}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:hidden">
        {visitors?.map((visitor) => (
          <Card key={visitor.id} className="rounded-2xl">
            <CardContent className="space-y-3 p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium">{visitor.visitorName}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(visitor.visitDate)}
                    {visitor.expectedArrival && ` · ${visitor.expectedArrival}`}
                  </p>
                  {visitor.purpose && (
                    <p className="text-sm text-muted-foreground">{visitor.purpose}</p>
                  )}
                </div>
                <Badge variant={statusVariant[visitor.status]}>
                  {visitor.status === 'ACKNOWLEDGED' ? 'Seen' : 'Pending'}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
        {!visitors?.length && (
          <Card className="rounded-2xl">
            <CardContent className="flex flex-col items-center py-12 text-center">
              <UserCheck className="mb-4 h-12 w-12 text-muted-foreground" />
              <p className="text-muted-foreground">No visitor notifications yet.</p>
            </CardContent>
          </Card>
        )}
      </div>

      <Card className="hidden rounded-2xl md:block">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Visitor</TableHead>
                <TableHead>Visit Date</TableHead>
                <TableHead>Arrival</TableHead>
                <TableHead>Purpose</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visitors?.map((visitor) => (
                <TableRow key={visitor.id}>
                  <TableCell className="font-medium">{visitor.visitorName}</TableCell>
                  <TableCell>{formatDate(visitor.visitDate)}</TableCell>
                  <TableCell>{visitor.expectedArrival || '—'}</TableCell>
                  <TableCell>{visitor.purpose || '—'}</TableCell>
                  <TableCell>
                    <Badge variant={statusVariant[visitor.status]}>
                      {visitor.status === 'ACKNOWLEDGED' ? 'Acknowledged' : 'Pending'}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
              {!visitors?.length && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    No visitor notifications yet.
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
