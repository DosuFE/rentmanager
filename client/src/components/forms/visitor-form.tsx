'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { visitorSchema, type VisitorSchema } from '@/validations/visitor-schema'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

interface VisitorFormProps {
  onSubmit: (data: VisitorSchema) => void
  isLoading?: boolean
}

export function VisitorForm({ onSubmit, isLoading }: VisitorFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VisitorSchema>({
    resolver: zodResolver(visitorSchema),
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="visitorName">Visitor Name</Label>
        <Input
          id="visitorName"
          placeholder="John Doe"
          {...register('visitorName')}
        />
        {errors.visitorName && (
          <p className="text-sm text-destructive">{errors.visitorName.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="visitorPhone">Visitor Phone (optional)</Label>
        <Input
          id="visitorPhone"
          placeholder="08012345678"
          {...register('visitorPhone')}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="visitDate">Visit Date</Label>
          <Input id="visitDate" type="date" {...register('visitDate')} />
          {errors.visitDate && (
            <p className="text-sm text-destructive">{errors.visitDate.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="expectedArrival">Expected Arrival (optional)</Label>
          <Input
            id="expectedArrival"
            type="time"
            {...register('expectedArrival')}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="purpose">Purpose (optional)</Label>
        <Input
          id="purpose"
          placeholder="Family visit, delivery, etc."
          {...register('purpose')}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Additional Notes (optional)</Label>
        <Textarea
          id="notes"
          placeholder="Any details your landlord should know..."
          rows={3}
          {...register('notes')}
        />
      </div>

      <Button type="submit" className="w-full cursor-pointer" disabled={isLoading}>
        {isLoading ? 'Sending...' : 'Notify Landlord'}
      </Button>
    </form>
  )
}
