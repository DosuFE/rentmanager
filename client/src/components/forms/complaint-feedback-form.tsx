'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  complaintFeedbackSchema,
  type ComplaintFeedbackSchema,
} from '@/validations/complaint-schema'
import type { ComplaintStatus } from '@/types'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

interface ComplaintFeedbackFormProps {
  onSubmit: (data: ComplaintFeedbackSchema) => void
  isLoading?: boolean
  defaultStatus?: ComplaintStatus
}

export function ComplaintFeedbackForm({
  onSubmit,
  isLoading,
  defaultStatus = 'IN_PROGRESS',
}: ComplaintFeedbackFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ComplaintFeedbackSchema>({
    resolver: zodResolver(complaintFeedbackSchema),
    defaultValues: { status: defaultStatus },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="landlordFeedback">Your Feedback</Label>
        <Textarea
          id="landlordFeedback"
          placeholder="Respond to the tenant about this complaint..."
          rows={4}
          {...register('landlordFeedback')}
        />
        {errors.landlordFeedback && (
          <p className="text-sm text-destructive">
            {errors.landlordFeedback.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">Update Status</Label>
        <select
          id="status"
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          {...register('status')}
        >
          <option value="OPEN">Open</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="RESOLVED">Resolved</option>
        </select>
      </div>

      <Button type="submit" className="w-full cursor-pointer" disabled={isLoading}>
        {isLoading ? 'Sending...' : 'Send Feedback'}
      </Button>
    </form>
  )
}
