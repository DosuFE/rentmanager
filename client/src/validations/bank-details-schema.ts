import { z } from 'zod'

export const bankDetailsSchema = z.object({
  bankName: z.string().min(2, 'Bank name is required'),
  accountNumber: z.string().min(10, 'Enter a valid account number'),
  accountName: z.string().min(2, 'Account name is required'),
})

export type BankDetailsSchema = z.infer<typeof bankDetailsSchema>
