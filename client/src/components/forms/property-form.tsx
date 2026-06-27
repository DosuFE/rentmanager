'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  propertySchema,
  type PropertySchema,
} from '@/validations/property-schema'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { Property } from '@/types'

interface PropertyFormProps {
  defaultValues?: Partial<Property>
  onSubmit: (data: PropertySchema) => void
  isLoading?: boolean
  submitLabel?: string
}

export function PropertyForm({
  defaultValues,
  onSubmit,
  isLoading,
  submitLabel = 'Save Property',
}: PropertyFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PropertySchema>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      name: defaultValues?.name ?? '',
      address: defaultValues?.address ?? '',
      city: defaultValues?.city ?? '',
      state: defaultValues?.state ?? '',
    },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Property Name</Label>
        <Input id="name" placeholder="Sunrise Apartments" {...register('name')} />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Address</Label>
        <Input id="address" placeholder="12 Main Street" {...register('address')} />
        {errors.address && (
          <p className="text-sm text-destructive">{errors.address.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="city">City</Label>
          <Input id="city" placeholder="Lagos" {...register('city')} />
          {errors.city && (
            <p className="text-sm text-destructive">{errors.city.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="state">State</Label>
          <Input id="state" placeholder="Lagos" {...register('state')} />
          {errors.state && (
            <p className="text-sm text-destructive">{errors.state.message}</p>
          )}
        </div>
      </div>

      <Button type="submit" className="w-full cursor-pointer" disabled={isLoading}>
        {isLoading ? 'Saving...' : submitLabel}
      </Button>
    </form>
  )
}
