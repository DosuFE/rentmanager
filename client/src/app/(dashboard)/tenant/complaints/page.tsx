'use client'

import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { MessageSquareWarning, Plus } from 'lucide-react'
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
import { ComplaintForm } from '@/components/forms/complaint-form'
import { LoadingSpinner } from '@/components/shared/loading-spinner'
import { useAuth } from '@/hooks/use-auth'
import { createComplaint, getMyComplaints } from '@/services/complaint-service'
import { getApiErrorMessage } from '@/lib/api-error'
import { formatDate } from '@/lib/format'
import type { ComplaintSchema } from '@/validations/complaint-schema'
import type { ComplaintStatus } from '@/types'

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

export default function TenantComplaintsPage() {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const [open, setOpen] = useState(false)

  const { data: complaints, isLoading } = useQuery({
    queryKey: ['my-complaints'],
    queryFn: getMyComplaints,
    enabled: user?.role === 'TENANT',
  })

  const createMutation = useMutation({
    mutationFn: createComplaint,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-complaints'] })
      toast.success('Complaint submitted to your landlord')
      setOpen(false)
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Failed to submit complaint'))
    },
  })

  if (user?.role !== 'TENANT') {
    return <p className="text-muted-foreground">Tenants only.</p>
  }

  if (isLoading) return <LoadingSpinner label="Loading complaints..." variant="list" />

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold md:text-3xl">My Complaints</h2>
          <p className="text-muted-foreground">
            Report issues to your landlord and view their feedback
          </p>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" />
              New Complaint
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Submit a Complaint</DialogTitle>
              <p className="text-sm text-muted-foreground">
                Only your landlord can see this. Their response will appear here.
              </p>
            </DialogHeader>
            <ComplaintForm
              onSubmit={(data: ComplaintSchema) => createMutation.mutate(data)}
              isLoading={createMutation.isPending}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {complaints?.map((complaint) => (
          <Card key={complaint.id} className="rounded-2xl">
            <CardContent className="space-y-4 p-5">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h3 className="font-semibold">{complaint.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {categoryLabels[complaint.category]} ·{' '}
                    {formatDate(complaint.createdAt)}
                  </p>
                </div>
                <Badge variant={statusVariant[complaint.status]}>
                  {complaint.status.replace('_', ' ')}
                </Badge>
              </div>

              <p className="text-sm text-muted-foreground">{complaint.description}</p>

              {complaint.landlordFeedback ? (
                <div className="rounded-lg border bg-muted/50 p-4">
                  <p className="mb-1 text-xs font-medium uppercase text-muted-foreground">
                    Landlord Feedback
                  </p>
                  <p className="text-sm">{complaint.landlordFeedback}</p>
                  {complaint.feedbackAt && (
                    <p className="mt-2 text-xs text-muted-foreground">
                      {formatDate(complaint.feedbackAt)}
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-sm italic text-muted-foreground">
                  Waiting for landlord response...
                </p>
              )}
            </CardContent>
          </Card>
        ))}

        {!complaints?.length && (
          <Card className="rounded-2xl">
            <CardContent className="flex flex-col items-center py-12 text-center">
              <MessageSquareWarning className="mb-4 h-12 w-12 text-muted-foreground" />
              <p className="font-medium">No complaints yet</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Use the button above to report an issue to your landlord.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
