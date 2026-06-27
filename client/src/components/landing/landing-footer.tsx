import Link from 'next/link'
import { Building2 } from 'lucide-react'

export function LandingFooter() {
  return (
    <footer className="border-t bg-muted/30 py-12">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 md:flex-row md:px-6">
        <div className="flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          <span className="font-semibold">Rent Manager</span>
        </div>

        <nav className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
          <a href="#about" className="hover:text-foreground">
            About
          </a>
          <a href="#property-types" className="hover:text-foreground">
            Properties
          </a>
          <a href="#features" className="hover:text-foreground">
            Features
          </a>
          <Link href="/login" className="hover:text-foreground">
            Sign In
          </Link>
          <Link href="/register" className="hover:text-foreground">
            Sign Up
          </Link>
        </nav>

        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Rent Manager
        </p>
      </div>
    </footer>
  )
}
