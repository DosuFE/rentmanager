'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { paymentSchema, type PaymentSchema } from '@/validations/payment-schema'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { Tenant } from '@/types'

interface PaymentFormProps {
  tenants: Tenant[]
  onSubmit: (data: PaymentSchema) => void
  isLoading?: boolean
}

export function PaymentForm({ tenants, onSubmit, isLoading }: PaymentFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PaymentSchema>({
    resolver: zodResolver(paymentSchema),
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="tenantId">Tenant</Label>
        <select
          id="tenantId"
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          {...register('tenantId', { valueAsNumber: true })}
        >
          <option value="">Select tenant</option>
          {tenants.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>
        {errors.tenantId && (
          <p className="text-sm text-destructive">{errors.tenantId.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="amount">Amount (₦)</Label>
        <Input
          id="amount"
          type="number"
          min={1}
          placeholder="50000"
          {...register('amount', { valueAsNumber: true })}
        />
        {errors.amount && (
          <p className="text-sm text-destructive">{errors.amount.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="dueDate">Due Date</Label>
        <Input id="dueDate" type="date" {...register('dueDate')} />
        {errors.dueDate && (
          <p className="text-sm text-destructive">{errors.dueDate.message}</p>
        )}
      </div>

      <Button type="submit" className="w-full cursor-pointer" disabled={isLoading}>
        {isLoading ? 'Creating...' : 'Create Payment'}
      </Button>
    </form>
  )
}
