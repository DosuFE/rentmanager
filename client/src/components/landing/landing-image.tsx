import { cn } from '@/lib/utils'

interface LandingImageProps {
  src: string
  alt: string
  className?: string
  fill?: boolean
  priority?: boolean
}

export function LandingImage({
  src,
  alt,
  className,
  fill,
  priority,
}: LandingImageProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      className={cn(
        fill && 'absolute inset-0 h-full w-full object-cover',
        className,
      )}
    />
  )
}
