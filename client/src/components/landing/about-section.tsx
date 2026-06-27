import { CheckCircle2 } from 'lucide-react'
import { LandingImage } from '@/components/landing/landing-image'
import { Badge } from '@/components/ui/badge'

const highlights = [
  'Built for Nigerian landlords and tenants',
  'Track rent in Naira (₦) with overdue alerts',
  'Role-based portals — landlord dashboard & tenant self-service',
  'Connect properties → rooms → tenants → payments',
  'Email rent reminders via automated notifications',
]

export function AboutSection() {
  return (
    <section id="about" className="py-20 md:py-28">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 md:grid-cols-2 md:px-6">
        <div className="relative aspect-square overflow-hidden rounded-2xl md:aspect-[4/5]">
          <LandingImage
            src="https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=800&q=75"
            alt="Property manager reviewing documents"
            fill
          />
        </div>

        <div className="space-y-6">
          <Badge variant="outline">About Rent Manager</Badge>
          <h2 className="text-3xl font-bold md:text-4xl">
            The smarter way to run your rental business
          </h2>
          <p className="text-lg text-muted-foreground">
            Rent Manager is a full-stack property management platform. Landlords
            register, add properties and rooms, onboard tenants, and track every
            payment. Tenants get their own login to view their room and pay rent
            online.
          </p>
          <ul className="space-y-3">
            {highlights.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <span className="text-muted-foreground">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
