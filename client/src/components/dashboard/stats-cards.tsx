import { LucideIcon } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface StatItem {
  title: string
  value: string | number
  icon: LucideIcon
}

export function StatsCards({ stats }: { stats: StatItem[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((item) => (
        <Card key={item.title} className="rounded-2xl shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {item.title}
            </CardTitle>
            <item.icon className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold md:text-3xl">{item.value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
