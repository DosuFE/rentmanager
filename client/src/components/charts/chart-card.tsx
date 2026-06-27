import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface ChartCardProps {
  title: string
  description?: string
  children: React.ReactNode
  className?: string
}

export function ChartCard({
  title,
  description,
  children,
  className,
}: ChartCardProps) {
  return (
    <Card className={`rounded-2xl ${className ?? ''}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">{title}</CardTitle>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}
