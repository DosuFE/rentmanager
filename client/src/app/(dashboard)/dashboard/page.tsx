'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { Building2, Wallet, Users, BedDouble, AlertCircle } from 'lucide-react'
import { StatsCards } from '@/components/dashboard/stats-cards'
import { ChartCard } from '@/components/charts/chart-card'
import { OccupancyDonutChart } from '@/components/charts/occupancy-donut-chart'
import { PaymentStatusPieChart } from '@/components/charts/payment-status-pie-chart'
import { RevenueOverviewChart } from '@/components/charts/revenue-overview-chart'
import { LoadingSpinner } from '@/components/shared/loading-spinner'
import { useAuth } from '@/hooks/use-auth'
import {
  getDashboardStats,
  getPaymentAnalytics,
} from '@/services/analytics-service'
import { getPayments } from '@/services/payment-service'
import {
  buildPaymentStatusData,
  buildRevenueOverviewData,
} from '@/lib/chart-utils'
import { formatCurrency } from '@/lib/format'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function DashboardPage() {
  const router = useRouter()
  const { user } = useAuth()

  useEffect(() => {
    if (user?.role === 'TENANT') {
      router.replace('/tenant/dashboard')
    }
  }, [user, router])

  const { data, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: getDashboardStats,
    enabled: user?.role === 'LANDLORD',
  })

  const { data: analytics } = useQuery({
    queryKey: ['payment-analytics'],
    queryFn: getPaymentAnalytics,
    enabled: user?.role === 'LANDLORD',
  })

  const { data: payments } = useQuery({
    queryKey: ['payments'],
    queryFn: getPayments,
    enabled: user?.role === 'LANDLORD',
  })

  if (!user || user.role === 'TENANT') {
    return <LoadingSpinner />
  }

  if (isLoading) {
    return <LoadingSpinner label="Loading dashboard..." variant="dashboard" />
  }

  const paymentStatusChart = buildPaymentStatusData(payments ?? []).map(
    (item) => ({
      name: item.name,
      value: item.count,
      fill: item.fill,
    }),
  )

  const revenueChart = analytics
    ? buildRevenueOverviewData(analytics)
    : []

  const stats = [
    { title: 'Properties', value: data?.totalProperties ?? 0, icon: Building2 },
    {
      title: 'Monthly Income',
      value: formatCurrency(data?.monthlyIncome ?? 0),
      icon: Wallet,
    },
    { title: 'Tenants', value: data?.totalTenants ?? 0, icon: Users },
    { title: 'Occupied Rooms', value: data?.occupiedRooms ?? 0, icon: BedDouble },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold md:text-3xl">Dashboard</h2>
        <p className="text-muted-foreground">Welcome back, landlord.</p>
      </div>

      <StatsCards stats={stats} />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
        <ChartCard
          title="Room Occupancy"
          description="Occupied vs vacant rooms across your portfolio"
        >
          <OccupancyDonutChart
            occupied={data?.occupiedRooms ?? 0}
            vacant={data?.vacantRooms ?? 0}
          />
        </ChartCard>

        <ChartCard
          title="Payment Status"
          description="Breakdown of rent payments by status"
        >
          <PaymentStatusPieChart data={paymentStatusChart} />
        </ChartCard>

        <ChartCard
          title="Revenue Overview"
          description="Total collected vs this month's income"
          className="lg:col-span-2 xl:col-span-1"
        >
          <RevenueOverviewChart data={revenueChart} />
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Total Rooms</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{data?.totalRooms ?? 0}</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Vacant Rooms</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{data?.vacantRooms ?? 0}</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm text-muted-foreground">Overdue Payments</CardTitle>
            <AlertCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-destructive">
              {data?.overduePayments ?? 0}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
