import type { Payment, PaymentStatus } from '@/types'

export const CHART_COLORS = {
  paid: '#16a34a',
  pending: '#f59e0b',
  overdue: '#dc2626',
  occupied: '#171717',
  vacant: '#d4d4d4',
  revenue: '#2563eb',
  monthly: '#7c3aed',
} as const

const STATUS_LABELS: Record<PaymentStatus, string> = {
  PAID: 'Paid',
  PENDING: 'Pending',
  PENDING_VERIFICATION: 'Awaiting verification',
  OVERDUE: 'Overdue',
}

export function buildOccupancyData(occupied: number, vacant: number) {
  return [
    { name: 'Occupied', value: occupied, fill: CHART_COLORS.occupied },
    { name: 'Vacant', value: vacant, fill: CHART_COLORS.vacant },
  ].filter((item) => item.value > 0)
}

export function buildPaymentStatusData(payments: Payment[]) {
  const statuses: PaymentStatus[] = [
    'PAID',
    'PENDING',
    'PENDING_VERIFICATION',
    'OVERDUE',
  ]

  return statuses
    .map((status) => ({
      name: STATUS_LABELS[status],
      status,
      count: payments.filter((payment) => payment.status === status).length,
      fill:
        status === 'PAID'
          ? CHART_COLORS.paid
          : status === 'PENDING'
            ? CHART_COLORS.pending
            : status === 'PENDING_VERIFICATION'
              ? '#6366f1'
              : CHART_COLORS.overdue,
    }))
    .filter((item) => item.count > 0)
}

export function buildPaymentAmountData(payments: Payment[]) {
  const statuses: PaymentStatus[] = [
    'PAID',
    'PENDING',
    'PENDING_VERIFICATION',
    'OVERDUE',
  ]

  return statuses.map((status) => ({
    name: STATUS_LABELS[status],
    amount: payments
      .filter((payment) => payment.status === status)
      .reduce((sum, payment) => sum + Number(payment.amount), 0),
    fill:
      status === 'PAID'
        ? CHART_COLORS.paid
        : status === 'PENDING'
          ? CHART_COLORS.pending
          : status === 'PENDING_VERIFICATION'
            ? '#6366f1'
            : CHART_COLORS.overdue,
  }))
}

export function buildPaymentStatusFromCounts(stats: {
  paidCount: number
  pendingCount: number
  overdueCount: number
}) {
  return [
    { name: 'Paid', value: stats.paidCount, fill: CHART_COLORS.paid },
    { name: 'Pending', value: stats.pendingCount, fill: CHART_COLORS.pending },
    { name: 'Overdue', value: stats.overdueCount, fill: CHART_COLORS.overdue },
  ].filter((item) => item.value > 0)
}

export function buildRevenueOverviewData(analytics: {
  totalRevenue: number
  monthlyIncome: number
  unpaidPayments: number
  overduePayments: number
}) {
  return [
    { name: 'Total Revenue', value: analytics.totalRevenue, fill: CHART_COLORS.revenue },
    { name: 'This Month', value: analytics.monthlyIncome, fill: CHART_COLORS.monthly },
  ].filter((item) => item.value > 0)
}
