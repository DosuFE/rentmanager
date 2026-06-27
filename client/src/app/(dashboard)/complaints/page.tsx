'use client'

import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { MessageSquare, MessageSquareWarning } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ComplaintFeedbackForm } from '@/components/forms/complaint-feedback-form'
import { LoadingSpinner } from '@/components/shared/loading-spinner'
import { useAuth } from '@/hooks/use-auth'
import { addComplaintFeedback, getComplaints } from '@/services/complaint-service'
import { getApiErrorMessage } from '@/lib/api-error'
import { formatDate } from '@/lib/format'
import type { Complaint, ComplaintStatus } from '@/types'
import type { ComplaintFeedbackSchema } from '@/validations/complaint-schema'

const statusVariant: Record<
  ComplaintStatus,
  'default' | 'secondary' | 'destructive'
> = {
  OPEN: 'destructive',
  IN_PROGRESS: 'secondary',
  RESOLVED: 'default',
}

const categoryLabels: Record<string, string> = {
  MAINTENANCE: 'Maintenance',
  NOISE: 'Noise',
  SECURITY: 'Security',
  UTILITIES: 'Utilities',
  OTHER: 'Other',
}

export default function LandlordComplaintsPage() {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(
    null,
  )

  const { data: complaints, isLoading } = useQuery({
    queryKey: ['complaints'],
    queryFn: getComplaints,
    enabled: user?.role === 'LANDLORD',
  })

  const feedbackMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string
      data: ComplaintFeedbackSchema
    }) => addComplaintFeedback(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['complaints'] })
      toast.success('Feedback sent to tenant')
      setSelectedComplaint(null)
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Failed to send feedback'))
    },
  })

  if (user?.role !== 'LANDLORD') {
    return <p className="text-muted-foreground">Landlords only.</p>
  }

  if (isLoading) return <LoadingSpinner label="Loading complaints..." variant="list" />

  const openCount = complaints?.filter((c) => c.status === 'OPEN').length ?? 0

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold md:text-3xl">Tenant Complaints</h2>
        <p className="text-muted-foreground">
          {openCount > 0
            ? `${openCount} open complaint${openCount > 1 ? 's' : ''} need attention`
            : 'Review and respond to tenant complaints'}
        </p>
      </div>

      <div className="grid gap-4">
        {complaints?.map((complaint) => (
          <Card key={complaint.id} className="rounded-2xl">
            <CardContent className="space-y-4 p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="mb-1 flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold">{complaint.title}</h3>
                    <Badge variant={statusVariant[complaint.status]}>
                      {complaint.status.replace('_', ' ')}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    From:{' '}
                    <span className="font-medium text-foreground">
                      {complaint.tenant?.name}
                    </span>
                    {complaint.tenant?.room?.roomNumber &&
                      ` · Room ${complaint.tenant.room.roomNumber}`}
                    {complaint.tenant?.user?.email &&
                      ` · ${complaint.tenant.user.email}`}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {categoryLabels[complaint.category]} ·{' '}
                    {formatDate(complaint.createdAt)}
                  </p>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedComplaint(complaint)}
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  {complaint.landlordFeedback ? 'Update Feedback' : 'Respond'}
                </Button>
              </div>

              <p className="text-sm">{complaint.description}</p>

              {complaint.landlordFeedback && (
                <div className="rounded-lg border bg-muted/30 p-4">
                  <p className="mb-1 text-xs font-medium uppercase text-muted-foreground">
                    Your Previous Feedback
                  </p>
                  <p className="text-sm">{complaint.landlordFeedback}</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}

        {!complaints?.length && (
          <Card className="rounded-2xl">
            <CardContent className="flex flex-col items-center py-12 text-center">
              <MessageSquareWarning className="mb-4 h-12 w-12 text-muted-foreground" />
              <p className="text-muted-foreground">No complaints from tenants yet.</p>
            </CardContent>
          </Card>
        )}
      </div>

      <Dialog
        open={!!selectedComplaint}
        onOpenChange={() => setSelectedComplaint(null)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Respond to Complaint</DialogTitle>
            {selectedComplaint && (
              <p className="text-sm text-muted-foreground">
                Tenant: {selectedComplaint.tenant?.name} —{' '}
                {selectedComplaint.title}
              </p>
            )}
          </DialogHeader>
          {selectedComplaint && (
            <ComplaintFeedbackForm
              defaultStatus={
                selectedComplaint.status === 'OPEN'
                  ? 'IN_PROGRESS'
                  : selectedComplaint.status
              }
              onSubmit={(data) =>
                feedbackMutation.mutate({ id: selectedComplaint.id, data })
              }
              isLoading={feedbackMutation.isPending}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
