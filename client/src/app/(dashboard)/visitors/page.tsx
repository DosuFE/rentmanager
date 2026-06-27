'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { CheckCircle, UserCheck } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { LoadingSpinner } from '@/components/shared/loading-spinner'
import { useAuth } from '@/hooks/use-auth'
import { acknowledgeVisitor, getVisitors } from '@/services/visitor-service'
import { getApiErrorMessage } from '@/lib/api-error'
import { formatDate } from '@/lib/format'
import type { VisitorStatus } from '@/types'

const statusVariant: Record<
  VisitorStatus,
  'default' | 'secondary' | 'destructive'
> = {
  PENDING: 'secondary',
  ACKNOWLEDGED: 'default',
}

export default function LandlordVisitorsPage() {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  const { data: visitors, isLoading } = useQuery({
    queryKey: ['visitors'],
    queryFn: getVisitors,
    enabled: user?.role === 'LANDLORD',
  })

  const acknowledgeMutation = useMutation({
    mutationFn: acknowledgeVisitor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['visitors'] })
      toast.success('Visitor notification acknowledged')
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Failed to acknowledge'))
    },
  })

  if (user?.role !== 'LANDLORD') {
    return <p className="text-muted-foreground">Landlords only.</p>
  }

  if (isLoading) return <LoadingSpinner label="Loading visitor notifications..." variant="list" />

  const pendingCount = visitors?.filter((v) => v.status === 'PENDING').length ?? 0

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold md:text-3xl">Visitor Notifications</h2>
        <p className="text-muted-foreground">
          {pendingCount > 0
            ? `${pendingCount} pending notification${pendingCount > 1 ? 's' : ''} from tenants`
            : 'All visitor notifications have been acknowledged'}
        </p>
      </div>

      <div className="grid gap-4 md:hidden">
        {visitors?.map((visitor) => (
          <Card key={visitor.id} className="rounded-2xl">
            <CardContent className="space-y-3 p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium">{visitor.visitorName}</p>
                  <p className="text-sm text-muted-foreground">
                    Tenant: {visitor.tenant?.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(visitor.visitDate)}
                    {visitor.expectedArrival && ` · ${visitor.expectedArrival}`}
                  </p>
                  {visitor.tenant?.room?.roomNumber && (
                    <p className="text-sm text-muted-foreground">
                      Room {visitor.tenant.room.roomNumber}
                    </p>
                  )}
                </div>
                <Badge variant={statusVariant[visitor.status]}>
                  {visitor.status === 'ACKNOWLEDGED' ? 'Seen' : 'New'}
                </Badge>
              </div>
              {visitor.status === 'PENDING' && (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => acknowledgeMutation.mutate(visitor.id)}
                  disabled={acknowledgeMutation.isPending}
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Acknowledge
                </Button>
              )}
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
                <TableHead>Tenant</TableHead>
                <TableHead>Room</TableHead>
                <TableHead>Visitor</TableHead>
                <TableHead>Visit Date</TableHead>
                <TableHead>Purpose</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visitors?.map((visitor) => (
                <TableRow key={visitor.id}>
                  <TableCell className="font-medium">
                    {visitor.tenant?.name}
                  </TableCell>
                  <TableCell>
                    {visitor.tenant?.room?.roomNumber
                      ? `Room ${visitor.tenant.room.roomNumber}`
                      : '—'}
                  </TableCell>
                  <TableCell>{visitor.visitorName}</TableCell>
                  <TableCell>{formatDate(visitor.visitDate)}</TableCell>
                  <TableCell>{visitor.purpose || '—'}</TableCell>
                  <TableCell>
                    <Badge variant={statusVariant[visitor.status]}>
                      {visitor.status === 'ACKNOWLEDGED' ? 'Acknowledged' : 'Pending'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {visitor.status === 'PENDING' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => acknowledgeMutation.mutate(visitor.id)}
                        disabled={acknowledgeMutation.isPending}
                      >
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Acknowledge
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {!visitors?.length && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground">
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
