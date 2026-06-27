'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  complaintSchema,
  type ComplaintSchema,
} from '@/validations/complaint-schema'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

interface ComplaintFormProps {
  onSubmit: (data: ComplaintSchema) => void
  isLoading?: boolean
}

const categories = [
  { value: 'MAINTENANCE', label: 'Maintenance' },
  { value: 'NOISE', label: 'Noise' },
  { value: 'SECURITY', label: 'Security' },
  { value: 'UTILITIES', label: 'Utilities' },
  { value: 'OTHER', label: 'Other' },
] as const

export function ComplaintForm({ onSubmit, isLoading }: ComplaintFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ComplaintSchema>({
    resolver: zodResolver(complaintSchema),
    defaultValues: { category: 'OTHER' },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Subject</Label>
        <Input
          id="title"
          placeholder="Leaking pipe in bathroom"
          {...register('title')}
        />
        {errors.title && (
          <p className="text-sm text-destructive">{errors.title.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <select
          id="category"
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          {...register('category')}
        >
          {categories.map((cat) => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Describe the issue in detail..."
          rows={4}
          {...register('description')}
        />
        {errors.description && (
          <p className="text-sm text-destructive">{errors.description.message}</p>
        )}
      </div>

      <Button type="submit" className="w-full cursor-pointer" disabled={isLoading}>
        {isLoading ? 'Submitting...' : 'Submit Complaint'}
      </Button>
    </form>
  )
}
