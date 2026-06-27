'use client'

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { ChartEmptyState } from '@/components/charts/chart-empty-state'
import { formatCurrency } from '@/lib/format'

interface RevenueOverviewChartProps {
  data: { name: string; value: number; fill: string }[]
}

export function RevenueOverviewChart({ data }: RevenueOverviewChartProps) {
  if (!data.length) {
    return <ChartEmptyState message="Revenue data will appear after payments are recorded" />
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e5e5" />
        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
        <YAxis
          tick={{ fontSize: 12 }}
          tickFormatter={(value) =>
            new Intl.NumberFormat('en-NG', {
              notation: 'compact',
              compactDisplay: 'short',
            }).format(Number(value))
          }
        />
        <Tooltip
          formatter={(value) => [formatCurrency(Number(value)), 'Amount']}
          contentStyle={{
            borderRadius: '8px',
            border: '1px solid var(--border)',
          }}
        />
        <Bar dataKey="value" radius={[6, 6, 0, 0]}>
          {data.map((entry) => (
            <Cell key={entry.name} fill={entry.fill} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
