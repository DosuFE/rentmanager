import { z } from 'zod'

export const visitorSchema = z.object({
  visitorName: z.string().min(2, 'Visitor name is required'),
  visitorPhone: z.string().optional(),
  visitDate: z.string().min(1, 'Visit date is required'),
  expectedArrival: z.string().optional(),
  purpose: z.string().optional(),
  notes: z.string().optional(),
})

export type VisitorSchema = z.infer<typeof visitorSchema>
