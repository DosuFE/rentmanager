'use client'

import { Suspense, useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { LoadingSpinner } from '@/components/shared/loading-spinner'
import { ChartCard } from '@/components/charts/chart-card'
import { PaymentStatusPieChart } from '@/components/charts/payment-status-pie-chart'
import { PaymentAmountBarChart } from '@/components/charts/payment-amount-bar-chart'
import { TenantPaymentsPanel } from '@/components/payments/tenant-payments-panel'
import { useAuth } from '@/hooks/use-auth'
import { getMyPayments, verifyPaystackPayment } from '@/services/payment-service'
import { buildPaymentAmountData, buildPaymentStatusData } from '@/lib/chart-utils'

export default function MyPaymentsPage() {
  return (
    <Suspense fallback={<LoadingSpinner label="Loading payments..." />}>
      <MyPaymentsContent />
    </Suspense>
  )
}

function MyPaymentsContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const queryClient = useQueryClient()
  const { user } = useAuth()
  const verifiedReference = useRef<string | null>(null)

  useEffect(() => {
    if (user?.role === 'LANDLORD') {
      router.replace('/payments')
    }
  }, [user, router])

  const { data: payments, isLoading } = useQuery({
    queryKey: ['my-payments'],
    queryFn: getMyPayments,
    enabled: user?.role === 'TENANT',
  })

  const verifyMutation = useMutation({
    mutationFn: verifyPaystackPayment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-payments'] })
      toast.success('Payment confirmed successfully')
      router.replace('/tenant/my-payments')
    },
    onError: () => {
      toast.error('Payment verification failed')
      router.replace('/tenant/my-payments')
    },
  })

  useEffect(() => {
    const reference = searchParams.get('reference')
    if (
      !reference ||
      user?.role !== 'TENANT' ||
      verifiedReference.current === reference
    ) {
      return
    }

    verifiedReference.current = reference
    verifyMutation.mutate(reference)
  }, [searchParams, user?.role, verifyMutation])

  if (!user || user.role !== 'TENANT') {
    return <LoadingSpinner variant="table" />
  }

  if (isLoading) {
    return <LoadingSpinner label="Loading payments..." />
  }

  const paymentList = payments ?? []
  const outstandingCount = paymentList.filter(
    (p) => p.status === 'PENDING' || p.status === 'OVERDUE',
  ).length

  const paymentStatusChart = buildPaymentStatusData(paymentList).map((item) => ({
    name: item.name,
    value: item.count,
    fill: item.fill,
  }))
  const paymentAmountChart = buildPaymentAmountData(paymentList)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold md:text-3xl">My Payments</h2>
        <p className="text-muted-foreground">
          {outstandingCount > 0
            ? `You have ${outstandingCount} payment${outstandingCount > 1 ? 's' : ''} to complete. Use Paystack or bank transfer below.`
            : paymentList.length
              ? 'You have no outstanding payments right now.'
              : 'Waiting for your landlord to add a rent due.'}
        </p>
      </div>

      <TenantPaymentsPanel
        payments={paymentList}
        onPaymentUpdated={() =>
          queryClient.invalidateQueries({ queryKey: ['my-payments'] })
        }
      />

      {paymentList.length > 0 && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <ChartCard title="Payment Status" description="Your rent payments at a glance">
            <PaymentStatusPieChart data={paymentStatusChart} />
          </ChartCard>
          <ChartCard title="Amount by Status" description="How much you owe or have paid">
            <PaymentAmountBarChart data={paymentAmountChart} />
          </ChartCard>
        </div>
      )}

      {verifyMutation.isPending && (
        <p className="text-center text-sm text-muted-foreground">
          Confirming your Paystack payment...
        </p>
      )}
    </div>
  )
}
