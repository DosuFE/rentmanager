import { z } from 'zod'

export const paymentSchema = z.object({
  amount: z.number().positive('Amount must be positive'),
  dueDate: z.string().min(1, 'Due date is required'),
  tenantId: z.number().int().positive('Select a tenant'),
})

export type PaymentSchema = z.infer<typeof paymentSchema>
