'use client'

import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { loginSchema, type LoginSchema } from '@/validations/auth-schema'
import { useMutation } from '@tanstack/react-query'
import { getMe, loginUser } from '@/services/auth-service'
import { getApiErrorMessage } from '@/lib/api-error'
import { setAuthTokens } from '@/lib/auth-session'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function LoginPage() {
  const router = useRouter()
  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  })

  const mutation = useMutation({
    mutationFn: loginUser,
    onSuccess: async (data) => {
      setAuthTokens(data.accessToken, data.refreshToken, queryClient)
      try {
        const me = await getMe()
        await queryClient.invalidateQueries({ queryKey: ['auth', 'me'] })
        toast.success('Login successful')
        router.push(
          me.role === 'LANDLORD' ? '/dashboard' : '/tenant/dashboard',
        )
      } catch {
        toast.error('Login failed')
      }
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Invalid credentials'))
    },
  })

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted p-4">
      <Card className="w-full max-w-md rounded-2xl">
        <CardHeader>
          <CardTitle className="text-3xl">Welcome Back</CardTitle>
          <p className="text-sm text-muted-foreground">
            Sign in as a landlord or tenant
          </p>
        </CardHeader>

        <CardContent>
          <form
            onSubmit={handleSubmit((data) => mutation.mutate(data))}
            className="space-y-4"
          >
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
              {mutation.isPending ? 'Loading...' : 'Login'}
            </Button>
          </form>

          <p className="mt-4 text-center text-sm text-muted-foreground">
            No account?{' '}
            <Link href="/register" className="font-medium text-primary hover:underline">
              Register as landlord
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
