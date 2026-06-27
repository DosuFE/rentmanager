'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Building2, LogIn, Menu, UserPlus, LayoutDashboard } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'

const navLinks = [
  { href: '#about', label: 'About' },
  { href: '#property-types', label: 'Property Types' },
  { href: '#features', label: 'Features' },
  { href: '#how-it-works', label: 'How It Works' },
]

export function LandingNavbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem('token'))
  }, [])

  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Building2 className="h-5 w-5" />
          </div>
          <span className="text-lg font-bold tracking-tight">Rent Manager</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {isLoggedIn ? (
            <Button asChild>
              <Link href="/dashboard">
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Dashboard
              </Link>
            </Button>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link href="/login">
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign In
                </Link>
              </Button>
              <Button asChild>
                <Link href="/register">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Sign Up
                </Link>
              </Button>
            </>
          )}
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-72">
            <SheetHeader className="sr-only">
              <SheetTitle>Navigation Menu</SheetTitle>
              <SheetDescription>
                Browse site sections and sign in or register
              </SheetDescription>
            </SheetHeader>
            <nav className="mt-8 flex flex-col gap-2 px-2">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-4 py-3 text-base font-medium transition-colors hover:bg-muted"
                >
                  {link.label}
                </a>
              ))}
              <div className="mt-4 flex flex-col gap-2 border-t px-2 pt-4">
                {isLoggedIn ? (
                  <Button asChild onClick={() => setOpen(false)}>
                    <Link href="/dashboard">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      Dashboard
                    </Link>
                  </Button>
                ) : (
                  <>
                    <Button variant="outline" asChild onClick={() => setOpen(false)}>
                      <Link href="/login">
                        <LogIn className="mr-2 h-4 w-4" />
                        Sign In
                      </Link>
                    </Button>
                    <Button asChild onClick={() => setOpen(false)}>
                      <Link href="/register">
                        <UserPlus className="mr-2 h-4 w-4" />
                        Sign Up
                      </Link>
                    </Button>
                  </>
                )}
              </div>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
