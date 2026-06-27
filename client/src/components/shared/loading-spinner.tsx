import { Skeleton } from '@/components/ui/skeleton'

type LoadingSpinnerProps = {
  label?: string
  fullScreen?: boolean
  variant?:
    | 'premium'
    | 'cards'
    | 'dashboard'
    | 'table'
    | 'list'
    | 'analytics'
    | 'form'
    | 'button'
    | 'progress'
    | 'overlay'
}

export function LoadingSpinner({
  label = 'Loading...',
  fullScreen = false,
  variant = 'premium',
}: LoadingSpinnerProps) {
  const isOverlay = fullScreen || variant === 'overlay'

  if (variant === 'progress') {
    return (
      <div className="w-full px-4 py-3" aria-live="polite" aria-label={label}>
        <div className="mx-auto flex max-w-2xl flex-col gap-2">
          <div className="flex items-center justify-between text-sm font-medium text-slate-700">
            <span>{label}</span>
            <span className="loader-shimmer text-slate-500">Working...</span>
          </div>
          <div className="relative h-1.5 overflow-hidden rounded-full bg-slate-200">
            <div className="loader-progress-bar absolute inset-y-0 left-0 w-1/3 rounded-full bg-black" />
          </div>
        </div>
      </div>
    )
  }

  if (variant === 'button') {
    return (
      <span className="inline-flex items-center gap-2 text-sm font-medium text-slate-700" aria-live="polite">
        <span className="loader-shimmer h-2.5 w-2.5 rounded-full bg-black" />
        {label}
      </span>
    )
  }

  const content = (
    <div className="w-full px-4 py-8 sm:px-6 lg:px-8" aria-live="polite" aria-label={label}>
      <div className="mx-auto flex max-w-5xl flex-col rounded-[2rem] border border-slate-300 bg-white p-6 shadow-sm sm:p-8 lg:p-10">
        <div className="flex flex-col items-center text-center">
          <div className="relative flex h-20 w-20 items-center justify-center rounded-[1.4rem] border border-slate-300 bg-slate-50 shadow-sm">
            <div className="house-float relative h-12 w-12">
              <svg viewBox="0 0 120 120" className="h-full w-full" aria-hidden="true">
                <path
                  d="M20 54L60 20l40 34v38a8 8 0 0 1-8 8H28a8 8 0 0 1-8-8V54z"
                  fill="#111111"
                  stroke="#111111"
                  strokeWidth="4"
                  strokeLinejoin="round"
                />
                <path d="M42 100V68h36v32" fill="none" stroke="#111111" strokeWidth="4" strokeLinecap="round" />
                <rect x="48" y="74" width="24" height="26" rx="3" fill="#ffffff" stroke="#111111" strokeWidth="3" />
                <path d="M60 20L30 48" fill="none" stroke="#111111" strokeWidth="4" strokeLinecap="round" />
                <path d="M60 20L90 48" fill="none" stroke="#111111" strokeWidth="4" strokeLinecap="round" />
              </svg>
            </div>
          </div>
          <p className="mt-5 text-lg font-semibold text-slate-900">{label}</p>
          <p className="mt-2 text-sm text-slate-600">Preparing your experience.</p>
        </div>

        {variant === 'dashboard' && (
          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="rounded-2xl border border-slate-200/70 bg-slate-50/70 p-4">
                <Skeleton className="h-32 w-full rounded-xl" />
                <Skeleton className="mt-3 h-3 w-24" />
                <Skeleton className="mt-2 h-3 w-32" />
              </div>
            ))}
          </div>
        )}

        {variant === 'cards' && (
          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="overflow-hidden rounded-[1.25rem] border border-slate-200/70 bg-slate-50/70 p-3">
                <Skeleton className="h-36 w-full rounded-xl" />
                <Skeleton className="mt-3 h-4 w-24" />
                <Skeleton className="mt-2 h-3 w-32" />
                <Skeleton className="mt-2 h-3 w-20" />
              </div>
            ))}
          </div>
        )}

        {variant === 'table' && (
          <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200/70 bg-slate-50/70 p-4">
            <div className="flex items-center gap-3">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-3 w-28" />
              <Skeleton className="h-3 w-16" />
            </div>
            <div className="mt-4 space-y-3">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <Skeleton className="h-3 flex-1" />
                  <Skeleton className="h-3 w-20" />
                </div>
              ))}
            </div>
          </div>
        )}

        {variant === 'list' && (
          <div className="mt-8 space-y-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="flex items-center gap-3 rounded-2xl border border-slate-200/70 bg-slate-50/70 p-3">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="flex-1">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="mt-2 h-3 w-32" />
                </div>
                <Skeleton className="h-8 w-20 rounded-full" />
              </div>
            ))}
          </div>
        )}

        {variant === 'analytics' && (
          <div className="mt-8 grid gap-4 lg:grid-cols-[2fr_1fr]">
            <div className="rounded-2xl border border-slate-200/70 bg-slate-50/70 p-4">
              <Skeleton className="h-40 w-full rounded-xl" />
            </div>
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="rounded-2xl border border-slate-200/70 bg-slate-50/70 p-4">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="mt-3 h-6 w-16" />
                </div>
              ))}
            </div>
          </div>
        )}

        {variant === 'form' && (
          <div className="mt-8 w-full space-y-4 rounded-2xl border border-slate-200/70 bg-slate-50/70 p-4">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-11 w-full rounded-xl" />
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-11 w-full rounded-xl" />
            <Skeleton className="h-11 w-full rounded-xl" />
          </div>
        )}

        {(variant === 'premium' || !['dashboard','cards','table','list','analytics','form'].includes(variant)) && (
          <div className="mt-8 grid w-full gap-4 md:grid-cols-2 xl:grid-cols-3">
            <div className="rounded-2xl border border-slate-200/70 bg-slate-50/70 p-4">
              <Skeleton className="h-36 w-full rounded-xl" />
              <Skeleton className="mt-3 h-3 w-24" />
              <Skeleton className="mt-2 h-3 w-32" />
            </div>
            <div className="rounded-2xl border border-slate-200/70 bg-slate-50/70 p-4">
              <Skeleton className="h-36 w-full rounded-xl" />
              <Skeleton className="mt-3 h-3 w-24" />
              <Skeleton className="mt-2 h-3 w-32" />
            </div>
            <div className="rounded-2xl border border-slate-200/70 bg-slate-50/70 p-4 md:col-span-2 xl:col-span-1">
              <Skeleton className="h-36 w-full rounded-xl" />
              <Skeleton className="mt-3 h-3 w-24" />
              <Skeleton className="mt-2 h-3 w-32" />
            </div>
          </div>
        )}

        <div className="mt-6 flex items-center justify-center gap-2 text-sm text-slate-500">
          <span className="loader-shimmer h-2.5 w-2.5 rounded-full bg-black" />
          <span className="loader-shimmer h-2.5 w-2.5 rounded-full bg-slate-700" />
          <span className="loader-shimmer h-2.5 w-2.5 rounded-full bg-slate-400" />
        </div>
      </div>
    </div>
  )

  if (isOverlay) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/20 px-4 backdrop-blur-[1px]">
        {content}
      </div>
    )
  }

  return content
}
