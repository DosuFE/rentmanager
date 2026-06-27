import Link from 'next/link'
import { ArrowRight, LogIn, UserPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function CtaSection() {
  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="rounded-3xl bg-primary px-6 py-16 text-center text-primary-foreground md:px-12">
          <h2 className="text-3xl font-bold md:text-4xl">
            Ready to simplify your rental management?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-primary-foreground/80">
            Join landlords who use Rent Manager to track properties, manage
            tenants, and never miss a rent payment again.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button
              size="lg"
              variant="secondary"
              asChild
              className="rounded-xl"
            >
              <Link href="/register">
                <UserPlus className="mr-2 h-4 w-4" />
                Create Free Account
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="rounded-xl border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10"
            >
              <Link href="/login">
                <LogIn className="mr-2 h-4 w-4" />
                Sign In
              </Link>
            </Button>
          </div>
          <p className="mt-6 text-sm text-primary-foreground/60">
            Already a tenant? Ask your landlord for login credentials.
          </p>
        </div>
      </div>
    </section>
  )
}
