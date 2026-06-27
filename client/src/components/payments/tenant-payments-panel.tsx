'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Wallet } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { PaymentPayDialog } from '@/components/payments/payment-pay-dialog'
import { formatCurrency, formatDate } from '@/lib/format'
import type { Payment, PaymentStatus } from '@/types'

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

function canPay(status: PaymentStatus) {
  return status === 'PENDING' || status === 'OVERDUE'
}

interface TenantPaymentsPanelProps {
  payments: Payment[]
  compact?: boolean
  onPaymentUpdated?: () => void
}

export function TenantPaymentsPanel({
  payments,
  compact = false,
  onPaymentUpdated,
}: TenantPaymentsPanelProps) {
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null)
  const [payOpen, setPayOpen] = useState(false)

  const outstanding = payments.filter((payment) => canPay(payment.status))

  const openPayDialog = (payment: Payment) => {
    setSelectedPayment(payment)
    setPayOpen(true)
  }

  if (!payments.length) {
    return (
      <div className="flex flex-col items-center py-10 text-center">
        <Wallet className="mb-4 h-12 w-12 text-muted-foreground" />
        <p className="font-medium">No rent payments yet</p>
        <p className="mt-1 max-w-md text-sm text-muted-foreground">
          Your landlord must create a rent due for you first. Once they add one,
          you will see a <strong>Pay</strong> button here to pay with Paystack
          or bank transfer.
        </p>
      </div>
    )
  }

  const list = compact ? payments.slice(0, 5) : payments

  return (
    <>
      {!compact && outstanding.length > 0 && (
        <Card className="rounded-2xl border-primary/30 bg-primary/5">
          <CardContent className="space-y-4 p-5">
            <div>
              <h3 className="text-lg font-semibold">Outstanding rent</h3>
              <p className="text-sm text-muted-foreground">
                Pay with Paystack (card, transfer, USSD) or copy bank details for
                a manual transfer.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {outstanding.map((payment) => (
                <div
                  key={payment.id}
                  className="flex items-center justify-between gap-3 rounded-xl border bg-background p-4"
                >
                  <div>
                    <p className="font-bold">{formatCurrency(payment.amount)}</p>
                    <p className="text-sm text-muted-foreground">
                      Due {formatDate(payment.dueDate)}
                    </p>
                  </div>
                  <Button onClick={() => openPayDialog(payment)} className='cursor-pointer'>Pay now</Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="rounded-2xl">
        <CardContent className={compact ? 'p-0' : 'p-0'}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Amount</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {list.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell className="font-medium">
                    {formatCurrency(payment.amount)}
                  </TableCell>
                  <TableCell>{formatDate(payment.dueDate)}</TableCell>
                  <TableCell>
                    <Badge variant={statusVariant[payment.status]}>
                      {statusLabel[payment.status]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {canPay(payment.status) ? (
                      <Button size="sm" onClick={() => openPayDialog(payment)}>
                        Pay
                      </Button>
                    ) : payment.status === 'PENDING_VERIFICATION' ? (
                      <span className="text-sm text-muted-foreground">
                        Awaiting landlord
                      </span>
                    ) : (
                      <span className="text-sm text-muted-foreground">—</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {compact && outstanding.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-2">
          <Button onClick={() => openPayDialog(outstanding[0])}>
            Pay {formatCurrency(outstanding[0].amount)}
          </Button>
          <Button variant="outline" asChild>
            <Link href="/tenant/my-payments">All payment options</Link>
          </Button>
        </div>
      )}

      <PaymentPayDialog
        payment={selectedPayment}
        open={payOpen}
        onOpenChange={setPayOpen}
        onSuccess={() => onPaymentUpdated?.()}
      />
    </>
  )
}
