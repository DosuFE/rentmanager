import { z } from 'zod'

export const registerSchema = z.object({
  fullName: z.string().min(3),

  email: z.string().email(),

  password: z.string().min(8),
})

export const loginSchema = z.object({
  email: z.string().email(),

  password: z.string().min(8),
})

export type RegisterSchema = z.infer<
  typeof registerSchema
>

export type LoginSchema = z.infer<
  typeof loginSchema
>