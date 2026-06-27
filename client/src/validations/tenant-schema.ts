import { z } from 'zod'

export const tenantSchema = z.object({
  fullName: z.string().min(3, 'Name must be at least 3 characters'),
  phoneNumber: z
    .string()
    .trim()
    .min(10, 'Phone number must be at least 10 digits')
    .max(15, 'Phone number is too long'),
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

export type TenantSchema = z.infer<typeof tenantSchema>
