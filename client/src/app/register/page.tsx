'use client'

import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { registerSchema, type RegisterSchema } from '@/validations/auth-schema'
import { useMutation } from '@tanstack/react-query'
import { registerUser } from '@/services/auth-service'
import { getApiErrorMessage } from '@/lib/api-error'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LoadingSpinner } from '@/components/shared/loading-spinner'

export default function RegisterPage() {
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
  })

  const mutation = useMutation({
    mutationFn: registerUser,
    onSuccess: () => {
      toast.success('Account created successfully')
      router.push('/login')
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Registration failed'))
    },
  })

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted p-4">
      <Card className="w-full max-w-md rounded-2xl">
        <CardHeader>
          <CardTitle className="text-3xl">Create Account</CardTitle>
          <p className="text-sm text-muted-foreground">
            Register as a landlord to manage properties
          </p>
        </CardHeader>

        <CardContent>
          <form
            onSubmit={handleSubmit((data) => mutation.mutate(data))}
            className="space-y-4"
          >
            <div>
              <Input placeholder="Full Name" {...register('fullName')} />
              {errors.fullName && (
                <p className="text-sm text-destructive">{errors.fullName.message}</p>
              )}
            </div>

            <div>
              <Input placeholder="Email" {...register('email')} />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>

            <div>
              <Input
                type="password"
                placeholder="Password"
                {...register('password')}
              />
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password.message}</p>
              )}
            </div>

            <Button className="w-full cursor-pointer" disabled={mutation.isPending}>
              {mutation.isPending ? <LoadingSpinner variant="button" label="Creating account..." /> : 'Register'}
            </Button>
          </form>

          <p className="mt-4 text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link href="/login" className="font-medium text-primary hover:underline">
              Login
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
