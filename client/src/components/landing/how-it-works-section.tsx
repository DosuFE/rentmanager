import { steps } from '@/lib/landing-data'
import { Badge } from '@/components/ui/badge'

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="bg-muted/40 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <Badge variant="outline" className="mb-4">
            Quick Start
          </Badge>
          <h2 className="text-3xl font-bold md:text-4xl">
            Up and running in 4 steps
          </h2>
          <p className="mt-4 text-muted-foreground">
            From sign-up to collecting your first rent payment — the entire
            workflow is built into the platform.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((item) => (
            <div key={item.step} className="relative space-y-3">
              <span className="text-5xl font-bold text-primary/20">
                {item.step}
              </span>
              <h3 className="text-lg font-semibold">{item.title}</h3>
              <p className="text-sm text-muted-foreground">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
