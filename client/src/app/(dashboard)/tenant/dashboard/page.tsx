'use client'

import Link from 'next/link'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import {
  AlertCircle,
  BedDouble,
  Building2,
  CreditCard,
  Mail,
  MapPin,
  User,
  Wallet,
} from 'lucide-react'
import { StatsCards } from '@/components/dashboard/stats-cards'
import { ChartCard } from '@/components/charts/chart-card'
import { PaymentStatusPieChart } from '@/components/charts/payment-status-pie-chart'
import { PaymentAmountBarChart } from '@/components/charts/payment-amount-bar-chart'
import { LoadingSpinner } from '@/components/shared/loading-spinner'
import { TenantPaymentsPanel } from '@/components/payments/tenant-payments-panel'
import { useAuth } from '@/hooks/use-auth'
import { getMyProfile } from '@/services/tenant-service'
import { getMyPayments } from '@/services/payment-service'
import { buildPaymentAmountData, buildPaymentStatusFromCounts } from '@/lib/chart-utils'
import { formatCurrency } from '@/lib/format'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function TenantDashboardPage() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { user } = useAuth()

  useEffect(() => {
    if (user?.role === 'LANDLORD') {
      router.replace('/dashboard')
    }
  }, [user, router])

  const { data, isLoading, isError } = useQuery({
    queryKey: ['tenant-profile'],
    queryFn: getMyProfile,
    enabled: user?.role === 'TENANT',
  })

  const { data: payments } = useQuery({
    queryKey: ['my-payments'],
    queryFn: getMyPayments,
    enabled: user?.role === 'TENANT',
  })

  if (!user || user.role !== 'TENANT') {
    return <LoadingSpinner />
  }

  if (isLoading) return <LoadingSpinner label="Loading your dashboard..." variant="dashboard" />

  if (isError || !data) {
    return (
      <div className="flex min-h-[300px] flex-col items-center justify-center text-center">
        <User className="mb-4 h-12 w-12 text-muted-foreground" />
        <h2 className="text-xl font-semibold">Profile Not Found</h2>
        <p className="mt-2 max-w-sm text-muted-foreground">
          Your tenant profile is not set up yet. Ask your landlord to create
          your account.
        </p>
      </div>
    )
  }

  const stats = [
    {
      title: 'Outstanding Balance',
      value: formatCurrency(data.stats.outstandingBalance),
      icon: Wallet,
    },
    {
      title: 'Pending Payments',
      value: data.stats.pendingCount,
      icon: CreditCard,
    },
    {
      title: 'Overdue',
      value: data.stats.overdueCount,
      icon: AlertCircle,
    },
    {
      title: 'Paid',
      value: data.stats.paidCount,
      icon: BedDouble,
    },
  ]

  const paymentStatusChart = buildPaymentStatusFromCounts(data.stats)
  const paymentAmountChart = buildPaymentAmountData(payments ?? [])

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold md:text-3xl">
          Welcome, {data.profile.name}
        </h2>
        <p className="text-muted-foreground">
          Track your room, landlord, and rent payments in one place.
        </p>
      </div>

      <StatsCards stats={stats} />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartCard
          title="My Payment Status"
          description="Overview of your rent payment history"
        >
          <PaymentStatusPieChart data={paymentStatusChart} />
        </ChartCard>

        <ChartCard
          title="Amount Breakdown"
          description="Rent amounts by payment status"
        >
          <PaymentAmountBarChart data={paymentAmountChart} />
        </ChartCard>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <User className="h-5 w-5" />
              Your Landlord
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground">Name</p>
              <p className="text-lg font-semibold">{data.landlord.fullName}</p>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Mail className="h-4 w-4" />
              <a
                href={`mailto:${data.landlord.email}`}
                className="hover:text-foreground hover:underline"
              >
                {data.landlord.email}
              </a>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Building2 className="h-5 w-5" />
              Your Accommodation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.room && data.property ? (
              <>
                <div>
                  <p className="text-sm text-muted-foreground">Property</p>
                  <p className="font-semibold">{data.property.name}</p>
                </div>
                <p className="flex items-start gap-2 text-sm text-muted-foreground">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                  {data.property.address}, {data.property.city},{' '}
                  {data.property.state}
                </p>
                <div className="flex items-center justify-between">
                  <p className="text-sm">
                    Room <span className="font-semibold">{data.room.roomNumber}</span>{' '}
                    · Floor {data.room.floor}
                  </p>
                  <Badge>Assigned</Badge>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/tenant/my-room">View room details</Link>
                </Button>
              </>
            ) : (
              <div className="text-center py-4">
                <BedDouble className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
                <p className="font-medium">No room assigned yet</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Contact {data.landlord.fullName} to get a room assignment.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-2xl">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Rent payments</CardTitle>
          <Button variant="outline" size="sm" asChild>
            <Link href="/tenant/my-payments">My Payments</Link>
          </Button>
        </CardHeader>
        <CardContent>
          <TenantPaymentsPanel
            payments={payments ?? []}
            compact
            onPaymentUpdated={() => {
              queryClient.invalidateQueries({ queryKey: ['my-payments'] })
              queryClient.invalidateQueries({ queryKey: ['tenant-profile'] })
            }}
          />
        </CardContent>
      </Card>
    </div>
  )
}
