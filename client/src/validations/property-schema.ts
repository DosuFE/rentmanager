import { z } from 'zod'

export const propertySchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  address: z.string().min(5, 'Address must be at least 5 characters'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
})

export type PropertySchema = z.infer<typeof propertySchema>
