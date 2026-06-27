import Link from 'next/link'
import { HeroBannerSlider } from '@/components/landing/hero-banner-slider'
import { LandingImage } from '@/components/landing/landing-image'
import { ArrowRight, Building2, Shield, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <HeroBannerSlider />
      <div className="absolute inset-0 z-[1] bg-gradient-to-r from-background/95 via-background/85 to-background/40" />

      <div className="relative z-10 mx-auto grid max-w-7xl gap-10 px-4 py-20 md:grid-cols-2 md:items-center md:px-6 md:py-28 lg:pb-36 lg:pt-32">
        <div className="space-y-6">
          <Badge variant="secondary" className="rounded-full px-4 py-1">
            Property Management Made Simple
          </Badge>

          <h1 className="text-4xl font-bold leading-tight tracking-tight  md:text-5xl lg:text-6xl">
            Manage rentals, tenants &amp; payments —{' '}
            <span className="text-primary">all in one place</span>
          </h1>

          <p className="max-w-lg text-lg text-muted-foreground">
            Rent Manager helps Nigerian landlords track properties, assign rooms,
            collect rent, and give tenants a self-service portal. Built for
            apartments, duplexes, bungalows, and more.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button size="lg" asChild className="rounded-xl">
              <Link href="/register">
                Get Started Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="rounded-xl">
              <Link href="/login">Sign In</Link>
            </Button>
          </div>

          <div className="flex flex-wrap gap-6 pt-2 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              Secure JWT auth
            </span>
            <span className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-primary" />
              Real-time analytics
            </span>
            <span className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-primary" />
              Multi-property support
            </span>
          </div>
        </div>

        <div className="relative hidden md:block">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-2xl ring-1 ring-border/50">
            <LandingImage
              src="https://images.unsplash.com/photo-1600585152915-d208bec867a1?w=800&q=75"
              alt="Luxury home interior"
              fill
            />
          </div>
          <div className="absolute -bottom-4 -left-4 rounded-xl border bg-background p-4 shadow-lg">
            <p className="text-2xl font-bold">₦700K+</p>
            <p className="text-sm text-muted-foreground">Monthly rent tracked</p>
          </div>
        </div>
      </div>
    </section>
  )
}
