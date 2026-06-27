'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LoadingSpinner } from '@/components/shared/loading-spinner'
import { useAuth } from '@/hooks/use-auth'
import { getBankDetails, updateBankDetails } from '@/services/payment-service'
import { getApiErrorMessage } from '@/lib/api-error'
import {
  bankDetailsSchema,
  type BankDetailsSchema,
} from '@/validations/bank-details-schema'

export default function SettingsPage() {
  const queryClient = useQueryClient()
  const { user } = useAuth()

  const { data, isLoading } = useQuery({
    queryKey: ['bank-details'],
    queryFn: getBankDetails,
    enabled: user?.role === 'LANDLORD',
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BankDetailsSchema>({
    resolver: zodResolver(bankDetailsSchema),
    values: data,
  })

  const mutation = useMutation({
    mutationFn: updateBankDetails,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bank-details'] })
      toast.success('Bank details saved')
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Failed to save bank details'))
    },
  })

  if (user?.role !== 'LANDLORD') {
    return (
      <p className="text-muted-foreground">
        Only landlords can manage payment settings.
      </p>
    )
  }

  if (isLoading) return <LoadingSpinner label="Loading settings..." variant="form" />

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold md:text-3xl">Payment Settings</h2>
        <p className="text-muted-foreground">
          Add your bank details so tenants can pay via bank transfer. Paystack
          payments are collected on the platform first, then settled to you.
        </p>
      </div>

      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>Bank account for transfers</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit((values) => mutation.mutate(values))}
            className="space-y-4"
          >
            <div>
              <Input placeholder="Bank name" {...register('bankName')} />
              {errors.bankName && (
                <p className="text-sm text-destructive">
                  {errors.bankName.message}
                </p>
              )}
            </div>
            <div>
              <Input placeholder="Account number" {...register('accountNumber')} />
              {errors.accountNumber && (
                <p className="text-sm text-destructive">
                  {errors.accountNumber.message}
                </p>
              )}
            </div>
            <div>
              <Input placeholder="Account name" {...register('accountName')} />
              {errors.accountName && (
                <p className="text-sm text-destructive">
                  {errors.accountName.message}
                </p>
              )}
            </div>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? 'Saving...' : 'Save bank details'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
