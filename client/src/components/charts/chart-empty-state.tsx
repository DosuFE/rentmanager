import { BarChart3 } from 'lucide-react'

export function ChartEmptyState({ message = 'No data yet' }: { message?: string }) {
  return (
    <div className="flex h-[220px] flex-col items-center justify-center text-muted-foreground">
      <BarChart3 className="mb-2 h-8 w-8 opacity-40" />
      <p className="text-sm">{message}</p>
    </div>
  )
}
