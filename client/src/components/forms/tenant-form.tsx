'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { tenantSchema, type TenantSchema } from '@/validations/tenant-schema'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface TenantFormProps {
  onSubmit: (data: TenantSchema) => void
  isLoading?: boolean
}

export function TenantForm({ onSubmit, isLoading }: TenantFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TenantSchema>({
    resolver: zodResolver(tenantSchema),
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="fullName">Full Name</Label>
        <Input id="fullName" placeholder="John Doe" {...register('fullName')} />
        {errors.fullName && (
          <p className="text-sm text-destructive">{errors.fullName.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="phoneNumber">Phone Number</Label>
        <Input id="phoneNumber" placeholder="08012345678" {...register('phoneNumber')} />
        {errors.phoneNumber && (
          <p className="text-sm text-destructive">{errors.phoneNumber.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" placeholder="tenant@email.com" {...register('email')} />
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" type="password" placeholder="••••••••" {...register('password')} />
        {errors.password && (
          <p className="text-sm text-destructive">{errors.password.message}</p>
        )}
      </div>

      <p className="text-xs text-muted-foreground">
        Use a unique email. Minimum 8 characters for password.
      </p>

      <Button type="submit" className="w-full cursor-pointer" disabled={isLoading}>
        {isLoading ? 'Creating...' : 'Create Tenant'}
      </Button>
    </form>
  )
}
