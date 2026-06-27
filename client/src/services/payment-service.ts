import { api } from '@/lib/axios'
import type {
  BankDetails,
  BankTransferDetails,
  CreatePaymentInput,
  Payment,
  PaystackInitResponse,
} from '@/types'

export async function getPayments(): Promise<Payment[]> {
  const response = await api.get('/payments')
  return response.data
}

export async function getMyPayments(): Promise<Payment[]> {
  const response = await api.get('/payments/my-payments')
  return response.data
}

export async function getPayment(id: string): Promise<Payment> {
  const response = await api.get(`/payments/${id}`)
  return response.data
}

export async function createPayment(
  data: CreatePaymentInput,
): Promise<Payment> {
  const response = await api.post('/payments', data)
  return response.data
}

export async function markPaymentPaid(id: string): Promise<Payment> {
  const response = await api.patch(`/payments/${id}/pay`)
  return response.data
}

export async function deletePayment(
  id: string,
): Promise<{ message: string }> {
  const response = await api.delete(`/payments/${id}`)
  return response.data
}

export async function initializePaystackPayment(
  id: string,
): Promise<PaystackInitResponse> {
  const response = await api.post(`/payments/${id}/initialize`)
  return response.data
}

export async function verifyPaystackPayment(
  reference: string,
): Promise<Payment> {
  const response = await api.get(`/payments/verify/${reference}`)
  return response.data
}

export async function getBankTransferDetails(
  id: string,
): Promise<BankTransferDetails> {
  const response = await api.get(`/payments/${id}/bank-details`)
  return response.data
}

export async function confirmBankTransfer(id: string): Promise<Payment> {
  const response = await api.post(`/payments/${id}/confirm-transfer`)
  return response.data
}

export async function verifyBankTransfer(id: string): Promise<Payment> {
  const response = await api.patch(`/payments/${id}/verify-transfer`)
  return response.data
}

export async function rejectBankTransfer(id: string): Promise<Payment> {
  const response = await api.patch(`/payments/${id}/reject-transfer`)
  return response.data
}

export async function getBankDetails(): Promise<BankDetails> {
  const response = await api.get('/users/bank-details')
  return response.data
}

export async function updateBankDetails(
  data: BankDetails,
): Promise<BankDetails> {
  const response = await api.patch('/users/bank-details', data)
  return response.data
}
