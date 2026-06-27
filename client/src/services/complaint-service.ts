import { api } from '@/lib/axios'
import type {
  Complaint,
  ComplaintFeedbackInput,
  CreateComplaintInput,
} from '@/types'

export async function getMyComplaints(): Promise<Complaint[]> {
  const response = await api.get('/complaints/my')
  return response.data
}

export async function getComplaints(): Promise<Complaint[]> {
  const response = await api.get('/complaints')
  return response.data
}

export async function createComplaint(
  data: CreateComplaintInput,
): Promise<Complaint> {
  const response = await api.post('/complaints', data)
  return response.data
}

export async function addComplaintFeedback(
  id: string,
  data: ComplaintFeedbackInput,
): Promise<Complaint> {
  const response = await api.patch(`/complaints/${id}/feedback`, data)
  return response.data
}
