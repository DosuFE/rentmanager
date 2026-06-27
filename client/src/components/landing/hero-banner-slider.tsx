'use client'

import { useEffect, useState } from 'react'
import { LandingImage } from '@/components/landing/landing-image'
import { heroSlides } from '@/lib/landing-data'
import { cn } from '@/lib/utils'

const INTERVAL_MS = 5000

export function HeroBannerSlider() {
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((current) => (current + 1) % heroSlides.length)
    }, INTERVAL_MS)

    return () => clearInterval(timer)
  }, [])

  return (
    <>
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="flex h-full transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${activeIndex * 100}%)` }}
        >
          {heroSlides.map((slide, index) => (
            <div key={slide.src} className="relative h-full min-w-full shrink-0">
              <LandingImage
                src={slide.src}
                alt={slide.alt}
                fill
                priority={index === 0}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="pointer-events-auto absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 gap-2">
        {heroSlides.map((slide, index) => (
          <button
            key={slide.src}
            type="button"
            aria-label={`Go to slide ${index + 1}`}
            onClick={() => setActiveIndex(index)}
            className={cn(
              'h-2 rounded-full transition-all duration-300',
              index === activeIndex
                ? 'w-8 bg-primary'
                : 'w-2 bg-primary/40 hover:bg-primary/60',
            )}
          />
        ))}
      </div>
    </>
  )
}
