'use client'

import { Menu, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import type { Role } from '@/types'

interface NavbarProps {
  role: Role
  fullName?: string
  onMenuClick: () => void
  onLogout: () => void
}

export function Navbar({ role, fullName, onMenuClick, onLogout }: NavbarProps) {
  const initials = fullName
    ? fullName
        .split(' ')
        .map((part) => part[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : role === 'LANDLORD'
      ? 'LL'
      : 'TN'

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:px-6">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden cursor-pointer"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-lg font-semibold md:text-xl">
            {role === 'LANDLORD' ? 'Landlord Dashboard' : 'Tenant Portal'}
          </h1>
          <p className="hidden text-sm text-muted-foreground sm:block">
            Manage your rental operations
          </p>
        </div>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-9 w-9 rounded-full cursor-pointer">
            <Avatar className="h-9 w-9">
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={onLogout} className="text-destructive cursor-pointer">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}
