import { api } from '@/lib/axios'
import type { DashboardStats, PaymentAnalytics } from '@/types'

export async function getDashboardStats(): Promise<DashboardStats> {
  const response = await api.get('/analytics/dashboard')
  return response.data
}

export async function getPaymentAnalytics(): Promise<PaymentAnalytics> {
  const response = await api.get('/analytics/payments')
  return response.data
}
