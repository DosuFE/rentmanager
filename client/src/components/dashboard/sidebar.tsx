'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Building2,
  LayoutDashboard,
  BedDouble,
  Users,
  Wallet,
  Home,
  CreditCard,
  UserCheck,
  MessageSquareWarning,
  Settings,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Role } from '@/types'

const landlordLinks = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/properties', label: 'Properties', icon: Building2 },
  { href: '/rooms', label: 'Rooms', icon: BedDouble },
  { href: '/tenants', label: 'Tenants', icon: Users },
  { href: '/payments', label: 'Payments', icon: Wallet },
  { href: '/visitors', label: 'Visitors', icon: UserCheck },
  { href: '/complaints', label: 'Complaints', icon: MessageSquareWarning },
  { href: '/settings', label: 'Payment Settings', icon: Settings },
]

const tenantLinks = [
  { href: '/tenant/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/tenant/my-room', label: 'My Room', icon: Home },
  { href: '/tenant/my-payments', label: 'My Payments', icon: CreditCard },
  { href: '/tenant/visitors', label: 'Visitors', icon: UserCheck },
  { href: '/tenant/complaints', label: 'Complaints', icon: MessageSquareWarning },
]

export function Sidebar({ role, onNavigate }: { role: Role; onNavigate?: () => void }) {
  const pathname = usePathname()
  const links = role === 'LANDLORD' ? landlordLinks : tenantLinks

  return (
    <aside className="flex h-full w-64 flex-col border-r bg-sidebar">
      <div className="flex h-16 items-center border-b px-6">
        <Building2 className="mr-2 h-6 w-6 text-primary" />
        <span className="text-lg font-bold">Rent Manager</span>
      </div>

      <nav className="flex-1 space-y-1 px-5 py-4">
        {links.map((link) => {
          const isActive =
            pathname === link.href ||
            (link.href !== '/dashboard' &&
              link.href !== '/tenant/dashboard' &&
              pathname.startsWith(link.href))

          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={onNavigate}
              className={cn(
                'flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent/60',
              )}
            >
              <link.icon className="h-4 w-4 shrink-0" />
              <span className="px-0.5">{link.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="border-t px-5 py-5">
        <p className="px-1 text-xs text-muted-foreground capitalize">
          {role.toLowerCase()} portal
        </p>
      </div>
    </aside>
  )
}
