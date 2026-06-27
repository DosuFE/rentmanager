import { LandingNavbar } from '@/components/landing/landing-navbar'
import { HeroSection } from '@/components/landing/hero-section'
import { AboutSection } from '@/components/landing/about-section'
import { PropertyTypesSection } from '@/components/landing/property-types-section'
import { FeaturesSection } from '@/components/landing/features-section'
import { HowItWorksSection } from '@/components/landing/how-it-works-section'
import { CtaSection } from '@/components/landing/cta-section'
import { LandingFooter } from '@/components/landing/landing-footer'

export function LandingPage() {
  return (
    <div className="min-h-screen">
      <LandingNavbar />
      <main>
        <HeroSection />
        <AboutSection />
        <PropertyTypesSection />
        <FeaturesSection />
        <HowItWorksSection />
        <CtaSection />
      </main>
      <LandingFooter />
    </div>
  )
}
