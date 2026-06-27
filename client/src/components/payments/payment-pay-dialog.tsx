'use client'

import { useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Copy, CreditCard, Landmark } from 'lucide-react'
import { LoadingSpinner } from '@/components/shared/loading-spinner'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { getApiErrorMessage } from '@/lib/api-error'
import { formatCurrency } from '@/lib/format'
import {
  confirmBankTransfer,
  getBankTransferDetails,
  initializePaystackPayment,
} from '@/services/payment-service'
import type { Payment } from '@/types'

interface PaymentPayDialogProps {
  payment: Payment | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function PaymentPayDialog({
  payment,
  open,
  onOpenChange,
  onSuccess,
}: PaymentPayDialogProps) {
  const [step, setStep] = useState<'choose' | 'bank'>('choose')

  const bankDetailsQuery = useQuery({
    queryKey: ['bank-transfer-details', payment?.id],
    queryFn: () => getBankTransferDetails(payment!.id),
    enabled: open && step === 'bank' && !!payment?.id,
  })

  const paystackMutation = useMutation({
    mutationFn: initializePaystackPayment,
    onSuccess: (data) => {
      window.location.href = data.authorizationUrl
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Unable to start Paystack payment'))
    },
  })

  const confirmMutation = useMutation({
    mutationFn: confirmBankTransfer,
    onSuccess: () => {
      toast.success('Transfer submitted. Awaiting landlord confirmation.')
      onOpenChange(false)
      setStep('choose')
      onSuccess()
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Unable to confirm transfer'))
    },
  })

  const copyText = async (label: string, value: string) => {
    await navigator.clipboard.writeText(value)
    toast.success(`${label} copied`)
  }

  const handleClose = (nextOpen: boolean) => {
    onOpenChange(nextOpen)
    if (!nextOpen) setStep('choose')
  }

  if (!payment) return null

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle>Pay {formatCurrency(payment.amount)}</DialogTitle>
          <DialogDescription>
            Choose how you want to pay your rent. Online payments are verified
            automatically.
          </DialogDescription>
        </DialogHeader>

        {step === 'choose' ? (
          <div className="space-y-3">
            <Button
              className="h-auto w-full justify-start gap-3 py-4 cursor-pointer"
              onClick={() => paystackMutation.mutate(payment.id)}
              disabled={paystackMutation.isPending}
            >
              {paystackMutation.isPending ? (
                <span className="h-5 w-5" />
              ) : (
                <CreditCard className="h-5 w-5" />
              )}
              <div className="text-left">
                <p className="font-semibold">Pay with Paystack</p>
                <p className="text-xs font-normal text-primary-foreground/80">
                  Card, bank transfer, or USSD
                </p>
              </div>
              {paystackMutation.isPending ? <LoadingSpinner variant="button" label="Redirecting..." /> : null}
            </Button>

            <Button
              variant="outline"
              className="h-auto w-full justify-start gap-3 py-4"
              onClick={() => setStep('bank')}
            >
              <Landmark className="h-5 w-5" />
              <div className="text-left">
                <p className="font-semibold">Pay via bank transfer</p>
                <p className="text-xs font-normal text-muted-foreground">
                  Copy details and pay from your bank app
                </p>
              </div>
            </Button>
          </div>
        ) : bankDetailsQuery.isLoading ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner variant="progress" label="Loading payment details..." />
          </div>
        ) : bankDetailsQuery.isError ? (
          <p className="text-sm text-destructive">
            {getApiErrorMessage(
              bankDetailsQuery.error,
              'Unable to load bank details',
            )}
          </p>
        ) : bankDetailsQuery.data ? (
          <div className="space-y-4">
            <div className="rounded-xl border bg-muted/40 p-4 text-sm">
              <p className="mb-3 text-muted-foreground">
                Transfer exactly{' '}
                <strong>{formatCurrency(bankDetailsQuery.data.amount)}</strong>{' '}
                and use the reference below in the narration.
              </p>
              {[
                ['Bank', bankDetailsQuery.data.bankName],
                ['Account number', bankDetailsQuery.data.accountNumber],
                ['Account name', bankDetailsQuery.data.accountName],
                ['Reference', bankDetailsQuery.data.reference],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="flex items-center justify-between gap-2 py-1.5"
                >
                  <div>
                    <p className="text-xs text-muted-foreground">{label}</p>
                    <p className="font-medium">{value}</p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => copyText(label, value)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            <p className="text-xs text-muted-foreground">
              Open your bank app, paste these details, then confirm below once
              you have transferred.
            </p>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep('choose')}>
                Back
              </Button>
              <Button
                className="flex-1 cursor-pointer"
                onClick={() => confirmMutation.mutate(payment.id)}
                disabled={confirmMutation.isPending}
              >
                {confirmMutation.isPending ? <LoadingSpinner variant="button" label="Submitting..." /> : "I've transferred"}
              </Button>
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}
