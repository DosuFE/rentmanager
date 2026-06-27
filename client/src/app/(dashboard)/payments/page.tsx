'use client'

import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Plus, CheckCircle, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { PaymentForm } from '@/components/forms/payment-form'
import { ChartCard } from '@/components/charts/chart-card'
import { PaymentStatusPieChart } from '@/components/charts/payment-status-pie-chart'
import { PaymentAmountBarChart } from '@/components/charts/payment-amount-bar-chart'
import { LoadingSpinner } from '@/components/shared/loading-spinner'
import { useAuth } from '@/hooks/use-auth'
import {
  createPayment,
  deletePayment,
  getPayments,
  markPaymentPaid,
  rejectBankTransfer,
  verifyBankTransfer,
} from '@/services/payment-service'
import { getTenants } from '@/services/tenant-service'
import { buildPaymentAmountData, buildPaymentStatusData } from '@/lib/chart-utils'
import { formatCurrency, formatDate } from '@/lib/format'
import type { PaymentSchema } from '@/validations/payment-schema'
import type { PaymentStatus } from '@/types'

const statusVariant: Record<
  PaymentStatus,
  'default' | 'secondary' | 'destructive' | 'outline'
> = {
  PAID: 'default',
  PENDING: 'secondary',
  PENDING_VERIFICATION: 'outline',
  OVERDUE: 'destructive',
}

const statusLabel: Record<PaymentStatus, string> = {
  PAID: 'Paid',
  PENDING: 'Pending',
  PENDING_VERIFICATION: 'Awaiting verification',
  OVERDUE: 'Overdue',
}

export default function PaymentsPage() {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const [open, setOpen] = useState(false)

  const { data: payments, isLoading } = useQuery({
    queryKey: ['payments'],
    queryFn: getPayments,
    enabled: user?.role === 'LANDLORD',
  })

  const { data: tenants } = useQuery({
    queryKey: ['tenants'],
    queryFn: getTenants,
    enabled: user?.role === 'LANDLORD',
  })

  const createMutation = useMutation({
    mutationFn: createPayment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] })
      toast.success('Payment created')
      setOpen(false)
    },
    onError: () => toast.error('Failed to create payment'),
  })

  const verifyMutation = useMutation({
    mutationFn: verifyBankTransfer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] })
      toast.success('Transfer verified')
    },
    onError: () => toast.error('Failed to verify transfer'),
  })

  const rejectMutation = useMutation({
    mutationFn: rejectBankTransfer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] })
      toast.success('Transfer rejected')
    },
    onError: () => toast.error('Failed to reject transfer'),
  })

  const payMutation = useMutation({
    mutationFn: markPaymentPaid,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] })
      toast.success('Payment marked as paid')
    },
    onError: () => toast.error('Failed to update payment'),
  })

  const deleteMutation = useMutation({
    mutationFn: deletePayment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] })
      toast.success('Payment deleted')
    },
    onError: () => toast.error('Failed to delete payment'),
  })

  if (user?.role !== 'LANDLORD') {
    return <p className="text-muted-foreground">Only landlords can manage payments.</p>
  }

  if (isLoading) return <LoadingSpinner label="Loading payments..." />

  const paymentStatusChart = buildPaymentStatusData(payments ?? []).map(
    (item) => ({
      name: item.name,
      value: item.count,
      fill: item.fill,
    }),
  )
  const paymentAmountChart = buildPaymentAmountData(payments ?? [])

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold md:text-3xl">Payments</h2>
          <p className="text-muted-foreground">Track rent payments and dues</p>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" />
              Add Payment
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create Payment</DialogTitle>
            </DialogHeader>
            <PaymentForm
              tenants={tenants ?? []}
              onSubmit={(data: PaymentSchema) => createMutation.mutate(data)}
              isLoading={createMutation.isPending}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartCard
          title="Payments by Status"
          description="How many payments are paid, pending, or overdue"
        >
          <PaymentStatusPieChart data={paymentStatusChart} />
        </ChartCard>

        <ChartCard
          title="Amount by Status"
          description="Total rent amount grouped by payment status"
        >
          <PaymentAmountBarChart data={paymentAmountChart} />
        </ChartCard>
      </div>

      <div className="grid gap-4 md:hidden">
        {payments?.map((payment) => (
          <Card key={payment.id} className="rounded-2xl">
            <CardContent className="space-y-3 p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium">{payment.tenant?.name}</p>
                  <p className="text-lg font-bold">
                    {formatCurrency(payment.amount)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Due {formatDate(payment.dueDate)}
                  </p>
                </div>
                <Badge variant={statusVariant[payment.status]}>
                  {statusLabel[payment.status]}
                </Badge>
              </div>
              <div className="flex flex-wrap gap-2">
                {payment.status === 'PENDING_VERIFICATION' && (
                  <>
                    <Button
                      size="sm"
                      className="flex-1"
                      onClick={() => verifyMutation.mutate(payment.id)}
                      disabled={verifyMutation.isPending}
                    >
                      Confirm transfer
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => rejectMutation.mutate(payment.id)}
                      disabled={rejectMutation.isPending}
                    >
                      Reject
                    </Button>
                  </>
                )}
                {payment.status !== 'PAID' &&
                  payment.status !== 'PENDING_VERIFICATION' && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => payMutation.mutate(payment.id)}
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Mark Paid
                  </Button>
                )}
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => deleteMutation.mutate(payment.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="hidden rounded-2xl md:block">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tenant</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments?.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell className="font-medium">
                    {payment.tenant?.name}
                  </TableCell>
                  <TableCell>{formatCurrency(payment.amount)}</TableCell>
                  <TableCell>{formatDate(payment.dueDate)}</TableCell>
                  <TableCell>
                    <Badge variant={statusVariant[payment.status]}>
                      {statusLabel[payment.status]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {payment.status === 'PENDING_VERIFICATION' && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => verifyMutation.mutate(payment.id)}
                            disabled={verifyMutation.isPending}
                          >
                            Confirm
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => rejectMutation.mutate(payment.id)}
                            disabled={rejectMutation.isPending}
                          >
                            Reject
                          </Button>
                        </>
                      )}
                      {payment.status !== 'PAID' &&
                        payment.status !== 'PENDING_VERIFICATION' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => payMutation.mutate(payment.id)}
                        >
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Mark Paid
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive"
                        onClick={() => deleteMutation.mutate(payment.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {!payments?.length && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    No payments yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
