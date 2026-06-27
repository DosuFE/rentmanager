import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from 'sonner'
import { QueryProvider } from '@/providers/query-provider'

export const metadata: Metadata = {
  title: 'Rent Manager — Property & Rent Management Platform',
  description:
    'Manage rental properties, tenants, rooms, and payments. Built for Nigerian landlords with a dedicated tenant portal.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>
          <Toaster richColors />
          {children}
        </QueryProvider>
      </body>
    </html>
  )
}
