'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { LandingImage } from '@/components/landing/landing-image'
import { useQuery } from '@tanstack/react-query'
import { ArrowRight, MapPin } from 'lucide-react'
import { propertyTypes } from '@/lib/landing-data'
import { getProperties } from '@/services/property-service'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export function PropertyTypesSection() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem('token'))
  }, [])

  const { data: properties, isLoading } = useQuery({
    queryKey: ['landing-properties'],
    queryFn: getProperties,
    enabled: isLoggedIn,
    retry: false,
  })

  const hasLiveProperties = properties && properties.length > 0

  return (
    <section id="property-types" className="bg-muted/40 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <Badge variant="outline" className="mb-4">
            Housing Types
          </Badge>
          <h2 className="text-3xl font-bold md:text-4xl">
            {hasLiveProperties
              ? 'Your Properties'
              : 'Every Property Type, Covered'}
          </h2>
          <p className="mt-4 text-muted-foreground">
            {hasLiveProperties
              ? 'Live data from your portfolio — click any property to view details.'
              : 'From studio flats to commercial units — register and start managing any housing type.'}
          </p>
        </div>

        {isLoggedIn && isLoading && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-72 rounded-2xl" />
            ))}
          </div>
        )}

        {hasLiveProperties ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {properties.map((property) => (
              <Link key={property.id} href={`/properties/${property.id}`}>
                <Card className="group overflow-hidden rounded-2xl transition-shadow hover:shadow-lg">
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <LandingImage
                      src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&q=75"
                      alt={property.name}
                      fill
                      className="transition-transform duration-300 group-hover:scale-105"
                    />
                    <Badge className="absolute left-3 top-3">Live</Badge>
                  </div>
                  <CardContent className="space-y-2 p-5">
                    <h3 className="text-lg font-semibold">{property.name}</h3>
                    <p className="flex items-start gap-1.5 text-sm text-muted-foreground">
                      <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                      {property.address}, {property.city}
                    </p>
                    <span className="inline-flex items-center text-sm font-medium text-primary">
                      View details
                      <ArrowRight className="ml-1 h-3.5 w-3.5" />
                    </span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {propertyTypes.map((type) => (
              <Card
                key={type.id}
                className="group overflow-hidden rounded-2xl transition-shadow hover:shadow-lg"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <LandingImage
                    src={type.image}
                    alt={type.name}
                    fill
                    className="transition-transform duration-300 group-hover:scale-105"
                  />
                  <Badge
                    variant="secondary"
                    className="absolute left-3 top-3 bg-background/90"
                  >
                    {type.tag}
                  </Badge>
                </div>
                <CardContent className="space-y-3 p-5">
                  <h3 className="text-lg font-semibold">{type.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {type.description}
                  </p>
                  <Button variant="ghost" size="sm" asChild className="px-0">
                    <Link href={type.href}>
                      Start managing
                      <ArrowRight className="ml-1 h-3.5 w-3.5" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="mt-10 text-center">
          <Button size="lg" variant="outline" asChild className="rounded-xl">
            <Link href={hasLiveProperties ? '/properties' : '/register'}>
              {hasLiveProperties ? 'View All Properties' : 'Register to Add Properties'}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
