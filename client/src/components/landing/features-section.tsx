import {
  Building2,
  Wallet,
  Users,
  BarChart3,
  LucideIcon,
} from 'lucide-react'
import { features } from '@/lib/landing-data'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const iconMap: Record<string, LucideIcon> = {
  building: Building2,
  wallet: Wallet,
  users: Users,
  chart: BarChart3,
}

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <Badge variant="outline" className="mb-4">
            Platform Features
          </Badge>
          <h2 className="text-3xl font-bold md:text-4xl">
            Everything you need to manage rentals
          </h2>
          <p className="mt-4 text-muted-foreground">
            Powerful tools connected to live API endpoints — properties, rooms,
            tenants, payments, and analytics all work together.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => {
            const Icon = iconMap[feature.icon]
            return (
              <Card key={feature.title} className="rounded-2xl">
                <CardHeader>
                  <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
