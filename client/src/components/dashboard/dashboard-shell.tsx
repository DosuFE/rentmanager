'use client'

import { useState } from 'react'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Sidebar } from '@/components/dashboard/sidebar'
import { Navbar } from '@/components/dashboard/navbar'
import { LoadingSpinner } from '@/components/shared/loading-spinner'
import { useAuth } from '@/hooks/use-auth'

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const { user, isLoading, logout } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)

  if (isLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner label="Verifying session..." />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-muted/30">
      <div className="hidden md:block">
        <Sidebar role={user.role} />
      </div>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-64 p-0">
          <SheetHeader className="sr-only">
            <SheetTitle>Dashboard Navigation</SheetTitle>
            <SheetDescription>
              Main menu for landlord and tenant portal
            </SheetDescription>
          </SheetHeader>
          <Sidebar role={user.role} onNavigate={() => setMobileOpen(false)} />
        </SheetContent>
      </Sheet>

      <div className="flex flex-1 flex-col overflow-hidden">
        <Navbar
          role={user.role}
          fullName={user.fullName}
          onMenuClick={() => setMobileOpen(true)}
          onLogout={logout}
        />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}
