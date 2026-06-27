import { Loader2 } from 'lucide-react'

export function LoadingSpinner({ label = 'Loading...' }: { label?: string }) {
  return (
    <div className="flex min-h-[200px] flex-col items-center justify-center gap-3 text-muted-foreground">
      <Loader2 className="h-8 w-8 animate-spin" />
      <p className="text-xl">{label}</p>
    </div>
  )
}
