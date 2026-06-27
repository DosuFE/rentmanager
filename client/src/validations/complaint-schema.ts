import { z } from 'zod'

export const complaintSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Please describe the issue in more detail'),
  category: z.enum([
    'MAINTENANCE',
    'NOISE',
    'SECURITY',
    'UTILITIES',
    'OTHER',
  ]),
})

export const complaintFeedbackSchema = z.object({
  landlordFeedback: z
    .string()
    .min(5, 'Feedback must be at least 5 characters'),
  status: z.enum(['OPEN', 'IN_PROGRESS', 'RESOLVED']).optional(),
})

export type ComplaintSchema = z.infer<typeof complaintSchema>
export type ComplaintFeedbackSchema = z.infer<typeof complaintFeedbackSchema>
